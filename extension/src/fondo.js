// Service worker de Filtros MX.
//
// Hace tres cosas, y conviene tener claro por que cada una vive aqui:
//
//   1. FILTRADO COSMETICO. Manifest V3 NO lo trae: declarativeNetRequest solo
//      bloquea peticiones. Como las listas regionales son 73-77% cosmeticas
//      (medido el 29-jul-2026), sin esto se tiraria tres cuartas partes de lo
//      que hacen las listas. Se inyecta CSS por dominio.
//   2. APAGADO POR SITIO. Sin el, el primer sitio que se rompa termina en
//      desinstalacion. Es funcion de supervivencia, no comodidad.
//   3. CONTADORES por pestana.
//
// Lo que este archivo NO hace, y no debe hacer nunca: mandar nada a ningun
// servidor. El principio 3 del proyecto es cero datos de navegacion fuera del
// dispositivo. No hay un solo fetch a red externa en toda la extension.

const REGLAS_APAGADO_DESDE = 1_000_000; // los estaticos ocupan 1..~13,404

// genericas: ENCENDIDAS desde la 1.0.0 (7-oct-2026). Hasta entonces venian
// apagadas por ser la causa principal de romper sitios, y el precio se medio:
// en zocalo.com.mx, 18 elementos ocultos en el modo de fabrica contra 83 con
// genericas. uBlock Origin las trae activadas, asi que quien llegaba de ahi
// veia mas anuncios con esta extension y la desinstalaba. La salida para el
// sitio que se rompa es el modo Basico, a un clic en el popup.
const ajustesPorDefecto = {
  cosmeticas: true,
  genericas: true,
  detector: true,
};

// --- Carga diferida del mapa cosmetico -------------------------------------
// Son ~900 KB. Cargarlos en cada arranque del worker seria caro, y el worker se
// mata y revive constantemente en MV3. Se cachea en memoria y se vuelve a leer
// solo si el worker murio.
const mapasCargados = new Map(); // ruta -> promesa del mapa
function cargarMapa(ruta) {
  if (!mapasCargados.has(ruta)) {
    mapasCargados.set(ruta, fetch(chrome.runtime.getURL(ruta))
      .then((r) => r.json())
      .catch((e) => {
        console.error('Filtros MX: no se pudo cargar el mapa cosmetico', ruta, e);
        return { porDominio: {}, excepciones: {}, genericas: [] };
      }));
  }
  return mapasCargados.get(ruta);
}

let metaPromesa = null;
function cargarMeta() {
  if (!metaPromesa) {
    metaPromesa = fetch(chrome.runtime.getURL('reglas/meta.json'))
      .then((r) => r.json())
      .catch(() => ({ grupos: [] }));
  }
  return metaPromesa;
}

// --- Grupos de listas (1.2.0) -----------------------------------------------
//
// Ademas de la principal hay listas que no le sirven a todo el mundo:
//
//   regional  la de un idioma. Se enciende SOLA si el navegador esta en ese
//             idioma: medido el 23-oct-2026, buena parte de las instalaciones
//             vienen de navegadores en portugues, y la principal no trae ni una
//             regla de sus medios. Es lo mismo que hace uBlock Origin.
//   opcional  apagada de fabrica; la enciende la persona en opciones.
//
// La eleccion explicita de la persona (ajustes.grupos[id] = true/false) gana
// siempre sobre lo automatico.
// En orden de preferencia: primero el idioma de Chrome, luego los preferidos.
// El orden decide que regional entra primero si no caben todas.
function idiomasEnOrden() {
  const todos = [chrome.i18n.getUILanguage(), ...(self.navigator?.languages || [])];
  return [...new Set(todos.filter(Boolean).map((l) => l.toLowerCase().split(/[-_]/)[0]))];
}

function idiomasDelNavegador() {
  return new Set(idiomasEnOrden());
}

function grupoActivo(g, ajustes, idiomas) {
  const elegido = (ajustes.grupos || {})[g.id];
  if (typeof elegido === 'boolean') return elegido;
  if (g.tipo === 'regional') return (g.idiomas || []).some((i) => idiomas.has(i));
  return false;
}

async function estadoGrupos() {
  const meta = await cargarMeta();
  const ajustes = await leerAjustes();
  const idiomas = idiomasDelNavegador();
  const { sinCupo } = await chrome.storage.local.get('sinCupo');
  return (meta.grupos || []).map((g) => ({
    id: g.id,
    tipo: g.tipo,
    idiomas: g.idiomas || [],
    fuentes: (g.fuentes || []).map((f) => f.nombre),
    cosmeticas: g.cosmeticas,
    activo: grupoActivo(g, ajustes, idiomas),
    automatico: typeof (ajustes.grupos || {})[g.id] !== 'boolean',
    sinCupo: (sinCupo || []).includes(g.id),
  }));
}

// Enciende y apaga los conjuntos DNR de cada grupo. Chrome guarda el estado,
// pero lo devuelve al del manifest en cada actualizacion de la extension: por
// eso se llama al instalar, al actualizar y al arrancar.
//
// Se encienden UNO A UNO y en orden: primero lo que la persona eligio a mano,
// despues las regionales por preferencia de idioma. Chrome garantiza 30,000
// reglas para la extension entera; quien tenga varios idiomas regionales
// podria pasarse, y encenderlas todas de un golpe haria fallar la llamada
// entera en silencio. Asi entra lo que cabe, y lo que no se anota en
// "sinCupo" para que opciones lo diga. Las cosmeticas del grupo se aplican
// igual: no gastan presupuesto de Chrome.
async function sincronizarGrupos() {
  const grupos = await estadoGrupos();
  if (!grupos.length) return;
  const idiomas = idiomasEnOrden();
  const rango = (g) => {
    if (!g.automatico) return -1;
    const pos = g.idiomas.map((i) => idiomas.indexOf(i)).filter((k) => k >= 0);
    return pos.length ? Math.min(...pos) : 99;
  };
  await chrome.declarativeNetRequest.updateEnabledRulesets({
    disableRulesetIds: grupos.filter((g) => !g.activo).map((g) => g.id),
  });
  const sinCupo = [];
  for (const g of grupos.filter((x) => x.activo).sort((a, b) => rango(a) - rango(b))) {
    try {
      await chrome.declarativeNetRequest.updateEnabledRulesets({ enableRulesetIds: [g.id] });
    } catch (e) {
      sinCupo.push(g.id);
      console.warn('Filtros MX: sin cupo para el conjunto', g.id, e);
    }
  }
  await chrome.storage.local.set({ sinCupo });
}

// Los mapas cosmeticos que tocan: la principal y los grupos encendidos.
async function mapasActivos() {
  const grupos = (await estadoGrupos()).filter((g) => g.activo && g.cosmeticas);
  return Promise.all([
    cargarMapa('reglas/cosmeticas.json'),
    ...grupos.map((g) => cargarMapa(g.cosmeticas)),
  ]);
}

// Un selector para "www.a.b.com" puede estar registrado como "a.b.com" o
// "b.com". Hay que probar el dominio y todos sus padres.
function dominiosPadre(hostname) {
  const limpio = hostname.replace(/^www\./, '');
  const partes = limpio.split('.');
  const salida = [limpio];
  for (let i = 1; i < partes.length - 1; i++) salida.push(partes.slice(i).join('.'));
  return salida;
}

// conGenericas separa DOS preguntas distintas que es fatal confundir:
//
//   - "¿que oculto?"  respeta el modo del sitio: en Basico no van las
//     genericas, porque son la causa principal de romper sitios.
//   - "¿esto es un hueco que valga reportar?"  tiene que mirar TODAS las
//     reglas, genericas incluidas. Si no, se reporta aguas arriba algo que una
//     regla generica ya cubria.
//
// Medido el 3-ago-2026 en quadratin.com.mx: 2 de 4 candidatos los cubre la
// generica [id^="div-gpt-ad"] de EasyList. Reportarlos habria sido exactamente
// el error que el proyecto tiene escrito — comprobar SIEMPRE si ya existe regla
// antes de escribir una— y ante el mantenedor que acaba de aceptarnos cinco.
async function extendidasPara(hostname, conGenericas) {
  const mapas = await mapasActivos();
  const sinGen = mapas.some((m) => listaPideSinGenericas(hostname, m));
  const salida = [];
  for (const mapa of mapas) {
    const ext = mapa.extendidas || { porDominio: {}, genericas: [] };
    for (const d of dominiosPadre(hostname)) {
      for (const r of ext.porDominio[d] || []) salida.push(r);
    }
    if (conGenericas && !sinGen) {
      for (const r of ext.genericas) salida.push(r);
    }
  }
  return salida;
}

// ¿La propia lista dice que aqui las genericas rompen? ($generichide, que
// construir.mjs junta en mapa.sinGenericas). Ejemplos reales: mail.google.com,
// facebook.com, amazon.com.mx, y 192.168.* — el panel del router de casa.
// Con varios grupos encendidos basta con que UNA lo pida: $generichide en ABP
// apaga todas las genericas del sitio, no solo las de la lista que lo dice.
function listaPideSinGenericas(hostname, mapa) {
  const sg = mapa.sinGenericas;
  if (!sg) return false;
  const h = (hostname || '').toLowerCase();
  if (sg.dominios.some((d) => h === d || h.endsWith('.' + d))) return true;
  if (sg.prefijos.some((p) => h.startsWith(p))) return true;
  // "www.google" con cualquier TLD: www.google.com.mx, www.google.es…
  return sg.tldComodin.some((c) => h.startsWith(c + '.') || h.includes('.' + c + '.'));
}

// paraCobertura: la pregunta del detector ("¿esto ya lo cubre alguna lista?")
// no respeta la exencion. Si la respetara, en mail.google.com reportaria como
// colado lo que una generica nombra y la lista decidio no aplicar a proposito.
async function selectoresPara(hostname, ajustes, conGenericas = null, paraCobertura = false) {
  const mapas = await mapasActivos();
  const candidatos = dominiosPadre(hostname);
  const conGen = conGenericas === null ? ajustes.genericas : conGenericas;
  const sinGen = mapas.some((m) => listaPideSinGenericas(hostname, m));

  const sel = new Set();
  for (const mapa of mapas) {
    for (const d of candidatos) {
      for (const s of mapa.porDominio[d] || []) sel.add(s);
    }
    if (conGen && (paraCobertura || !sinGen)) {
      for (const s of mapa.genericas) sel.add(s);
    }
  }
  // Las excepciones (#@#) quitan lo que una regla mas amplia habia puesto.
  // Aplicarlas DESPUES no es un detalle: es lo que evita romper un sitio que
  // el propio mantenedor de la lista ya marco como falso positivo. Las de
  // cualquier grupo valen contra las reglas de todos.
  for (const mapa of mapas) {
    for (const d of candidatos) {
      for (const s of mapa.excepciones[d] || []) sel.delete(s);
    }
  }
  return [...sel];
}

async function leerAjustes() {
  const { ajustes } = await chrome.storage.local.get('ajustes');
  return { ...ajustesPorDefecto, ...(ajustes || {}) };
}

async function sitiosApagados() {
  const { apagados } = await chrome.storage.local.get('apagados');
  return new Set(apagados || []);
}

// Modos por sitio desde la 1.0.0: apagado | basico | completo.
//
//   - completo: reglas del sitio + genericas. Es el de fabrica.
//   - basico:   solo las reglas que nombran el sitio. La salida cuando las
//               genericas rompen algo, sin tener que apagarlo todo.
//
// Se guardan solo las EXCEPCIONES al predeterminado, en dos conjuntos. Los
// nombres de almacenamiento se conservan a proposito: "reforzados" son los
// sitios forzados a completo (lo que hasta la 0.3.3 se llamaba Reforzado), asi
// que los usuarios que ya los tenian no pierden nada al actualizar.
async function sitiosReforzados() {
  const { reforzados } = await chrome.storage.local.get('reforzados');
  return new Set(reforzados || []);
}

async function sitiosBasicos() {
  const { basicos } = await chrome.storage.local.get('basicos');
  return new Set(basicos || []);
}

async function modoPredeterminado() {
  return (await leerAjustes()).genericas ? 'completo' : 'basico';
}

// Nombres viejos que aun llegan: el arnes de medicion fija 'reforzado' (todas
// las reglas encima), y 'normal' era el modo sin genericas.
const ALIAS_MODO = { reforzado: 'completo', normal: 'basico' };

// Sitios donde la extension NO actua, por decision de producto (25-ago-2026).
//
// NO es una allowlist de anunciantes —el principio 2 la prohibe— sino lo
// contrario: sitios de tramite donde el coste de un falso positivo es no poder
// declarar o facturar, y el beneficio esta medido en CERO. En sat.gob.mx la
// extension da 0 peticiones frenadas y 0 elementos ocultos, y el dominio no
// aparece ni una vez en las tres listas.
//
// Va POR SUFIJO porque el SAT reparte el tramite entre loginda.siat, cfdiau,
// portalcfdi.facturaelectronica y mas. El apagado por sitio guarda por host
// exacto, asi que apagar "sat.gob.mx" no cubriria ninguno de esos.
//
// La contrapartida, dicha de frente: el usuario no puede activarla aqui aunque
// quiera. Es deliberado — un sitio de tramite roto no se descubre navegando,
// se descubre el dia de la declaracion.
const DOMINIOS_EXCLUIDOS = ['sat.gob.mx'];

function estaExcluido(host) {
  const h = (host || '').toLowerCase();
  return DOMINIOS_EXCLUIDOS.some((d) => h === d || h.endsWith('.' + d));
}

async function modoDe(host) {
  // Antes que el ajuste del usuario: la exclusion no es negociable por sitio.
  if (estaExcluido(host)) return 'apagado';
  const clave = normalizar(host);
  if ((await sitiosApagados()).has(clave)) return 'apagado';
  if ((await sitiosReforzados()).has(clave)) return 'completo';
  if ((await sitiosBasicos()).has(clave)) return 'basico';
  return modoPredeterminado();
}

async function fijarModo(host, modoPedido) {
  const clave = normalizar(host);
  const modo = ALIAS_MODO[modoPedido] || modoPedido;
  // Sin dominio no hay a que fijarle un modo. Pasa cuando el popup se abre en
  // chrome://, la tienda o una pagina de extension: Chrome no expone la URL y
  // host llega vacio. Guardar "" y luego resetearlo fue exactamente la
  // confusion del 6-ago-2026 — el modo parecia no guardarse nunca.
  if (!clave) return modoPredeterminado();
  // Un boton que parece funcionar y no guarda nada fue la confusion del 6-ago;
  // aqui se devuelve el estado real en vez de simularlo.
  if (estaExcluido(host)) return 'apagado';
  const apagados = await sitiosApagados();
  const reforzados = await sitiosReforzados();
  const basicos = await sitiosBasicos();
  apagados.delete(clave);
  reforzados.delete(clave);
  basicos.delete(clave);
  const predeterminado = await modoPredeterminado();
  if (modo === 'apagado') apagados.add(clave);
  else if (modo === 'completo' && predeterminado !== 'completo') reforzados.add(clave);
  else if (modo === 'basico' && predeterminado !== 'basico') basicos.add(clave);
  await chrome.storage.local.set({
    apagados: [...apagados], reforzados: [...reforzados], basicos: [...basicos],
  });
  await sincronizarReglasApagado();
  // El Apagado tambien tiene que apagar los scriptlets de ese sitio.
  await registrarScriptlets().catch((e) => console.warn('Filtros MX: scriptlets', e));
  return modoDe(host);
}

function normalizar(hostname) {
  return (hostname || '').replace(/^www\./, '').toLowerCase();
}

// --- Reglas locales: lo que el usuario oculto con "Ocultar aqui" ------------
//
// Son ordenes directas de la persona sobre SU navegador: viven en su equipo,
// no son cobertura de lista y no viajan a ningun lado. Por eso se aplican
// aunque el ajuste global de cosmeticas este apagado — apagar "las listas" no
// es apagar lo que uno decidio ocultar. El unico modo que las apaga es el
// Apagado por sitio, que apaga todo.
async function reglasLocales() {
  const { locales } = await chrome.storage.local.get('locales');
  return locales || {};
}

async function localesPara(hostname) {
  const todas = await reglasLocales();
  const salida = new Set();
  for (const d of dominiosPadre(hostname)) {
    for (const s of todas[d] || []) salida.add(s);
  }
  return [...salida];
}

async function agregarReglaLocal(host, selector) {
  const clave = normalizar(host);
  if (!clave || !selector) return;
  const todas = await reglasLocales();
  const lista = new Set(todas[clave] || []);
  lista.add(selector);
  todas[clave] = [...lista];
  await chrome.storage.local.set({ locales: todas });
}

async function quitarReglaLocal(host, selector) {
  const clave = normalizar(host);
  const todas = await reglasLocales();
  const lista = (todas[clave] || []).filter((s) => s !== selector);
  if (lista.length) todas[clave] = lista;
  else delete todas[clave];
  await chrome.storage.local.set({ locales: todas });
}

// --- Inyeccion del CSS ------------------------------------------------------
//
// Se hace desde onCommitted y no desde el content script a proposito: el
// content script corre en document_idle, o sea DESPUES de que la pagina pinto.
// Ocultar el anuncio despues de que ya se vio no sirve de nada. Desde aqui el
// CSS entra antes.
async function aplicarCosmeticas(tabId, frameId, url) {
  let host;
  try { host = new URL(url).hostname; } catch { return; }
  if (!host) return;

  const ajustes = await leerAjustes();
  const modo = await modoDe(host);
  if (modo === 'apagado') return;

  const sel = new Set();
  if (ajustes.cosmeticas) {
    for (const s of await selectoresPara(host, ajustes, modo === 'completo')) sel.add(s);
  }
  for (const s of await localesPara(host)) sel.add(s);
  if (!sel.size) return;

  const lista = [...sel];
  // En trozos: una hoja con 15,000 selectores en una sola regla es lenta de
  // parsear y si UNO esta malformado se cae la regla entera.
  const TROZO = 2000;
  for (let i = 0; i < lista.length; i += TROZO) {
    const css = lista.slice(i, i + TROZO).join(',\n') + '{display:none !important}';
    try {
      await chrome.scripting.insertCSS({
        target: { tabId, frameIds: [frameId] },
        css,
        origin: 'USER',
      });
    } catch (e) {
      // Pasa en pestanas que se cerraron a medio navegar, y en paginas donde
      // no se permite inyectar. No es un error que el usuario deba ver.
    }
  }
}

chrome.webNavigation.onCommitted.addListener((det) => {
  if (!/^https?:/.test(det.url)) return;
  aplicarCosmeticas(det.tabId, det.frameId, det.url);
});

// --- Apagado por sitio ------------------------------------------------------
//
// Dos mitades, y hacen falta las dos: quitar el CSS cosmetico no basta si las
// peticiones se siguen bloqueando y el sitio depende de ellas para funcionar.
async function sincronizarReglasApagado() {
  const apagados = [...(await sitiosApagados())];

  const viejas = await chrome.declarativeNetRequest.getDynamicRules();
  const idsViejos = viejas.filter((r) => r.id >= REGLAS_APAGADO_DESDE).map((r) => r.id);

  const nuevas = apagados.map((host, i) => ({
    id: REGLAS_APAGADO_DESDE + i,
    // Por encima de cualquier regla de bloqueo estatica, que van en 1 y 2.
    priority: 100,
    action: { type: 'allowAllRequests' },
    condition: {
      requestDomains: [host],
      resourceTypes: ['main_frame', 'sub_frame'],
    },
  }));

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: idsViejos,
    addRules: nuevas,
  });
}


// --- Scriptlets de YouTube (1.1.0) -------------------------------------------
//
// YouTube mete el anuncio en la misma respuesta que el video, y bloquear
// peticiones no lo separa (medido el 7-oct-2026: con la 1.0.0 el anuncio de
// video pasaba entero). Lo quitan los scriptlets de uBlock Origin, compilados
// por construir-scriptlets.mjs dentro del paquete — nunca codigo remoto.
//
// Se registran con chrome.scripting y no en el manifest por UNA razon: el
// Apagado por sitio tiene que poder quitarlos. Un content script del manifest
// no se puede excluir de un sitio en tiempo de ejecucion.
const IDS_SCRIPTLETS = { MAIN: 'fmx-scriptlets-main', ISOLATED: 'fmx-scriptlets-isolated' };

async function registrarScriptlets() {
  let meta;
  try {
    meta = await (await fetch(chrome.runtime.getURL('reglas/scriptlets.json'))).json();
  } catch {
    return; // paquete sin scriptlets: nada que registrar
  }
  const apagados = [...(await sitiosApagados())];
  const excluir = apagados.flatMap((h) => [`*://${h}/*`, `*://*.${h}/*`]);

  // Se quitan los que haya y se vuelven a poner: es la unica forma de cambiar
  // excludeMatches. unregister falla si le pides un id que no existe, asi que
  // se pregunta primero cuales hay.
  const vivos = await chrome.scripting.getRegisteredContentScripts();
  const nuestros = vivos.map((s) => s.id).filter((id) => Object.values(IDS_SCRIPTLETS).includes(id));
  if (nuestros.length) await chrome.scripting.unregisterContentScripts({ ids: nuestros });

  const scripts = [];
  for (const [mundo, d] of Object.entries(meta.mundos || {})) {
    if (!IDS_SCRIPTLETS[mundo] || !d.hosts?.length) continue;
    scripts.push({
      id: IDS_SCRIPTLETS[mundo],
      js: [d.archivo],
      matches: d.hosts.flatMap((h) => [`*://${h}/*`, `*://*.${h}/*`]),
      ...(excluir.length ? { excludeMatches: excluir } : {}),
      // Antes que el codigo de la pagina: el scriptlet tiene que estar puesto
      // cuando el reproductor lea la respuesta, no despues.
      runAt: 'document_start',
      world: mundo,
      allFrames: true,
      persistAcrossSessions: true,
    });
  }
  if (scripts.length) await chrome.scripting.registerContentScripts(scripts);
}

// --- Contadores por pestana -------------------------------------------------
// Viven en memoria: un contador por sitio que sobrevive al reinicio del
// navegador seria un registro de navegacion, y eso el proyecto no lo guarda ni
// localmente.
const contadores = new Map(); // tabId -> {ocultos, huecos}

// El TOTAL desde la instalacion si se guarda (1.0.0), y no contradice lo de
// arriba: es UN numero, sin dominio, sin fecha y sin pagina — no hay forma de
// reconstruir por donde se navego a partir de el. Vive en storage.local y no
// sale del equipo. Es lo que le ense~na al usuario lo que la extension hizo por
// el; sin ese dato, un bloqueador que funciona bien parece no hacer nada.
// En cola: dos pestañas informando a la vez harian leer-sumar-escribir en
// paralelo y una de las dos sumas se perderia.
let colaTotal = Promise.resolve();
function sumarAlTotal(delta) {
  if (delta <= 0) return colaTotal;
  colaTotal = colaTotal.then(async () => {
    const { totales } = await chrome.storage.local.get('totales');
    const t = totales || { ocultos: 0 };
    t.ocultos = (t.ocultos | 0) + delta;
    await chrome.storage.local.set({ totales: t });
  }).catch(() => {});
  return colaTotal;
}

// La insignia cuenta lo oculto, y se vuelve AMBAR cuando se colo algo: es el
// unico aviso del detector que el usuario ve sin abrir el popup. Hasta la
// 1.0.0 el hallazgo que hace distinta a la extension solo existia para quien
// abria el popup por su cuenta.
function pintarInsignia(tabId) {
  const c = contadores.get(tabId);
  const n = c ? c.ocultos : 0;
  const colados = c ? c.huecos : 0;
  const texto = n > 9999 ? '9k+' : (n ? String(n) : (colados ? '!' : ''));
  chrome.action.setBadgeText({ tabId, text: texto }).catch(() => {});
  chrome.action.setBadgeBackgroundColor({ tabId, color: colados ? '#b45309' : '#0f7b6c' }).catch(() => {});
  chrome.action.setTitle({
    tabId,
    title: colados ? chrome.i18n.getMessage('insigniaColados') : chrome.i18n.getMessage('extShortName'),
  }).catch(() => {});
}

// El icono gris dice "en este sitio estoy apagado" sin abrir el popup. Se pinta
// por pestana: la misma extension puede estar apagada en una y activa en otra.
// Rutas con "/" inicial (absolutas desde la raiz de la extension) a proposito:
// la resolucion de rutas relativas en setIcon desde un service worker es
// terreno pantanoso y este es el unico lugar donde se pagaria en silencio.
const RUTA_ICONO = {
  normal: { 16: '/iconos/icono-16.png', 32: '/iconos/icono-32.png', 48: '/iconos/icono-48.png', 128: '/iconos/icono-128.png' },
  apagado: { 16: '/iconos/icono-gris-16.png', 32: '/iconos/icono-gris-32.png', 48: '/iconos/icono-gris-48.png', 128: '/iconos/icono-gris-128.png' },
};

async function pintarIcono(tabId, host) {
  const modo = host ? await modoDe(host) : 'normal';
  chrome.action.setIcon({
    tabId,
    path: RUTA_ICONO[modo === 'apagado' ? 'apagado' : 'normal'],
  }).catch((e) => {
    // Visible en la consola del service worker. Un fallo aqui no debe romper
    // nada mas, pero tragarselo sin rastro ya costo una tarde de diagnostico.
    console.warn('Filtros MX: no se pudo pintar el icono', e);
  });
}

chrome.tabs.onRemoved.addListener((tabId) => contadores.delete(tabId));
chrome.webNavigation.onCommitted.addListener((det) => {
  if (det.frameId === 0) {
    contadores.delete(det.tabId);
    pintarInsignia(det.tabId);
    let host = '';
    try { host = new URL(det.url).hostname; } catch {}
    pintarIcono(det.tabId, host);
  }
});

// --- Mensajes ---------------------------------------------------------------
chrome.runtime.onMessage.addListener((msg, sender, responder) => {
  (async () => {
    switch (msg?.tipo) {
      case 'contar': {
        const tabId = sender.tab?.id;
        if (tabId != null) {
          contadores.set(tabId, { ocultos: msg.ocultos | 0, huecos: msg.huecos | 0 });
          pintarInsignia(tabId);
          // "nuevos" lo calcula el content script: el re-cuenta la pagina
          // entera en cada analisis, y solo el sabe cuanto crecio.
          await sumarAlTotal(msg.nuevos | 0);
        }
        return responder({ ok: true });
      }

      case 'selectoresDelSitio': {
        const ajustes = await leerAjustes();
        const modo = await modoDe(msg.host);
        const conGen = modo === 'completo';
        return responder({
          // Hasta la 1.0.0 este ajuste existia en opciones y el content script
          // nunca lo leia: un interruptor que no apagaba nada.
          detector: ajustes.detector !== false,
          // Lo que se oculta: respeta el ajuste global Y el modo del sitio.
          selectores: modo === 'apagado' ? [] : await selectoresPara(msg.host, ajustes, conGen),
          extendidas: modo === 'apagado' ? [] : await extendidasPara(msg.host, conGen),
          // Las reglas del usuario cuentan en "elementos ocultos": las oculta
          // esta extension de verdad. NO cuentan como cobertura de lista.
          locales: modo === 'apagado' ? [] : await localesPara(msg.host),
          // Lo que cuenta como ya cubierto para NO reportarlo: todas las reglas.
          cobertura: await selectoresPara(msg.host, ajustes, true, true),
        });
      }

      case 'estado': {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        let host = '';
        try { host = new URL(tab.url).hostname; } catch {}
        return responder({
          host,
          tabId: tab?.id,
          modo: await modoDe(host),
          excluido: estaExcluido(host),
          ajustes: await leerAjustes(),
          contador: contadores.get(tab?.id) || { ocultos: 0, huecos: 0 },
        });
      }

      case 'fijarModo': {
        const modo = await fijarModo(msg.host, msg.modo);
        // El icono debe reflejar el cambio de inmediato, no hasta la recarga.
        if (msg.tabId != null) pintarIcono(msg.tabId, msg.host);
        return responder({ modo });
      }

      case 'listaSitios':
        return responder({
          apagados: [...(await sitiosApagados())],
          reforzados: [...(await sitiosReforzados())],
          basicos: [...(await sitiosBasicos())],
        });

      case 'reglasLocalesDe':
        return responder({ locales: (await reglasLocales())[normalizar(msg.host)] || [] });

      case 'agregarReglaLocal':
        await agregarReglaLocal(msg.host, msg.selector);
        return responder({ ok: true });

      case 'quitarReglaLocal':
        await quitarReglaLocal(msg.host, msg.selector);
        return responder({ ok: true });

      case 'listaLocales':
        return responder({ locales: await reglasLocales() });

      case 'guardarAjustes': {
        // Se mezcla con lo guardado: la pagina de opciones manda solo las
        // casillas que conoce, y no debe borrar la eleccion de listas.
        const { ajustes } = await chrome.storage.local.get('ajustes');
        await chrome.storage.local.set({ ajustes: { ...(ajustes || {}), ...msg.ajustes } });
        return responder({ ok: true });
      }

      case 'grupos':
        return responder({ grupos: await estadoGrupos() });

      // valor: true | false | 'auto' (vuelve a decidir por el idioma).
      case 'fijarGrupo': {
        const { ajustes } = await chrome.storage.local.get('ajustes');
        const a = { ...(ajustes || {}) };
        const grupos = { ...(a.grupos || {}) };
        if (msg.valor === 'auto') delete grupos[msg.id];
        else grupos[msg.id] = !!msg.valor;
        a.grupos = grupos;
        await chrome.storage.local.set({ ajustes: a });
        await sincronizarGrupos();
        return responder({ grupos: await estadoGrupos() });
      }

      case 'meta':
        return responder(await cargarMeta());

      default:
        return responder({ error: 'mensaje desconocido' });
    }
  })();
  return true; // respuesta asincrona
});

// Migracion a la 1.0.0. La pagina de opciones guarda los tres ajustes juntos en
// cuanto se toca cualquiera, asi que quien abrio opciones alguna vez tiene
// "genericas: false" escrito — el valor de fabrica de entonces, no una
// eleccion. Sin esta migracion, justo los usuarios mas curiosos se quedarian
// sin la limpieza completa. Quien quiera el comportamiento anterior lo tiene a
// un clic, en el mismo ajuste.
function esAnterior(version, a) {
  const x = (version || '0').split('.').map(Number);
  const y = a.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) < (y[i] || 0);
  }
  return false;
}

async function migrarA100() {
  const { ajustes } = await chrome.storage.local.get('ajustes');
  if (ajustes && ajustes.genericas === false) {
    await chrome.storage.local.set({ ajustes: { ...ajustes, genericas: true } });
  }
  // Los sitios que alguien puso en Reforzado ya reciben eso por defecto: se
  // quedarian listados en opciones como excepcion sin serlo.
  await chrome.storage.local.set({ reforzados: [] });
}

chrome.runtime.onInstalled.addListener(async (det) => {
  if (det.reason === 'update' && esAnterior(det.previousVersion, '1.0.0')) {
    await migrarA100();
  }
  sincronizarReglasApagado();
  sincronizarGrupos().catch((e) => console.warn('Filtros MX: grupos', e));
  registrarScriptlets().catch((e) => console.warn('Filtros MX: scriptlets', e));
  // Solo en la primera instalacion. Abrirla en cada actualizacion seria
  // interrumpir a quien ya sabe usar la extension.
  if (det.reason === 'install') {
    chrome.tabs.create({ url: chrome.runtime.getURL('bienvenida/bienvenida.html') }).catch(() => {});
  }
});
chrome.runtime.onStartup.addListener(() => {
  sincronizarReglasApagado();
  sincronizarGrupos().catch((e) => console.warn('Filtros MX: grupos', e));
  registrarScriptlets().catch((e) => console.warn('Filtros MX: scriptlets', e));
});
