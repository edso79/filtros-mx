// Popup de Filtros MX.
//
// Orden de la pantalla (1.0.0): primero lo que la extension hizo por la
// persona, luego el modo, luego lo que se colo y como quitarlo. Hasta la 0.3.3
// el centro era el "hueco" y el reporte a GitHub — vocabulario de quien cura
// listas, no de quien quiere leer el periodico sin anuncios.
//
// El reporte de lo colado se prepara aqui, pero NO se envia desde aqui. Se
// abre GitHub con el texto ya escrito y es la persona quien pulsa enviar,
// habiendo leido lo que dice. Dos razones, y ninguna es opcional:
//
//   - Principio 3: cero datos de navegacion fuera del dispositivo. Un envio
//     automatico de URLs seria telemetria con otro nombre.
//   - El proyecto ya tiene escrito que un reporte sin verificar cuesta el
//     tiempo de un voluntario y quema credibilidad para el siguiente. Un
//     aluvion de reportes automaticos quemaria en una semana la relacion con
//     EasyList que se estreno el 3-ago-2026.
//
// t(), numero() e IDIOMA vienen de ../src/i18n.js.

const $ = (id) => document.getElementById(id);

const REPO = 'https://github.com/easylist/easylistspanish/issues/new';
const RESENAS = 'https://chromewebstore.google.com/detail/ocpbbfpkealhfipeffcmajokbdoledgj/reviews';
const CONTACTO = 'contacto@filtrosmx.com';
// La rese~na se pide UNA vez y solo a quien ya vio la extension trabajar: pedirla
// en la instalacion es pedir opinion sobre algo que aun no se uso.
const UMBRAL_RESENA = 500;

let estado = null;
let pagina = null;
let meta = null;

const NOTAS = {
  apagado: 'notaApagado',
  basico: 'notaBasico',
  completo: 'notaCompleto',
};

function pintarEstado() {
  $('sitio').textContent = estado.host || '';
  const sinSitio = !estado.host;
  // Excluido de fabrica: el usuario no puede encenderlo aqui. Si los botones se
  // dejaran vivos, pulsarlos no haria nada — que es exactamente el fallo del
  // 6-ago-2026, un control que finge funcionar.
  const excluido = !!estado.excluido;
  document.querySelectorAll('.modo').forEach((b) => {
    b.setAttribute('aria-pressed', String(!sinSitio && !excluido && b.dataset.modo === estado.modo));
    // En chrome://, la tienda o paginas de extension no hay dominio al cual
    // fijarle un modo. Un boton que parece funcionar y no guarda nada es la
    // confusion del 6-ago-2026; mejor deshabilitado y dicho.
    b.disabled = sinSitio || excluido;
  });
  $('estadoNota').textContent = sinSitio
    ? t('notaSinSitio')
    : excluido ? t('notaExcluido') : t(NOTAS[estado.modo] || 'notaCompleto');

  // Elegir un elemento en Apagado guardaria una regla que no se aplica.
  $('elegir').disabled = sinSitio || excluido || estado.modo === 'apagado';
}

// Cambiar de modo NO surte efecto hasta que la pagina se recarga: el CSS
// cosmetico se inyecta al navegar. Sin decirlo, el usuario pulsa un modo, no
// ve cambio alguno y concluye que esta roto — paso literalmente en las pruebas
// del 6-ago-2026. Se ofrece la recarga en vez de hacerla sola: recargar por
// sorpresa puede tirar un formulario a medio llenar.
function ofrecerRecarga() {
  $('recargar').hidden = false;
}

function pintarPagina() {
  $('nOcultos').textContent = numero(pagina ? pagina.ocultos : 0);
  const huecos = (pagina && pagina.huecos) || [];
  const n = huecos.length;
  $('nColados').textContent = n;
  $('colados').hidden = n === 0;
  // Decir "nada se colo" cuando hay publicidad que simplemente no se puede
  // nombrar seria mentir por omision. Al usuario se le da la salida practica:
  // quitarla a mano.
  const d = (pagina && pagina.descartes) || {};
  const aviso = $('aviso');
  const sinRegla = (d.sinNombre || 0) + (d.sobrecobertura || 0);

  // "No detectamos nada" solo se dice si se busco —con el detector apagado
  // seria afirmar algo que no se comprobo— y si de verdad no hay nada: junto
  // al aviso de anuncios sin regla segura, se leia como contradiccion.
  $('sinColados').hidden = n > 0 || !pagina || pagina.detector === false || !!pagina.ceguera || sinRegla > 0;
  if (pagina && pagina.ceguera) {
    aviso.textContent = t('ceguera');
    aviso.hidden = false;
  } else if (sinRegla) {
    aviso.textContent = sinRegla === 1 ? t('sinReglaUno') : t('sinRegla', sinRegla);
    aviso.hidden = false;
  } else {
    aviso.hidden = true;
  }

  if (!n) return;

  const ul = $('listaColados');
  ul.textContent = '';
  for (const h of huecos) {
    const li = document.createElement('li');
    if (h.servido) li.className = 'servido';

    // Primero QUE es, en palabras; el selector va en el title, para quien lo
    // necesite. Es para quien reporta aguas arriba, no para quien navega.
    const info = document.createElement('div');
    info.className = 'hueco-info';
    info.title = h.selector;
    const dato = document.createElement('span');
    dato.className = 'dato';
    dato.textContent = t(h.servido ? 'coladoServido' : 'coladoVacio', h.ancho, h.alto);
    info.append(dato);
    if (h.alcance > 1) {
      const nota = document.createElement('span');
      nota.className = 'nota';
      nota.textContent = t('coladoAlcance', h.alcance);
      info.append(nota);
    }
    // El selector existe pero no aguanta: clases de maquetación (Tailwind) o un
    // id que el CMS regenera. Quitarlo sigue disponible —es local y
    // reversible— pero avisado, y aguas arriba no debe ir.
    if (h.nombreFragil) {
      const aviso = document.createElement('span');
      aviso.className = 'nota fragil';
      aviso.textContent = t('coladoFragil');
      info.append(aviso);
    }

    // La acción inmediata: regla LOCAL, en este equipo, reversible. No toca
    // ninguna lista ni manda nada a ningún lado.
    const btn = document.createElement('button');
    btn.className = 'mini';
    btn.textContent = t('quitar');
    // En Apagado la regla se guardaría pero no se aplicaría — un botón que
    // "funciona" sin efecto visible confunde (pasó el 12-ago-2026).
    if (estado && estado.modo === 'apagado') {
      btn.disabled = true;
      btn.title = t('quitarEnApagado');
    }
    btn.addEventListener('click', async () => {
      btn.disabled = true;
      await chrome.runtime.sendMessage({
        tipo: 'agregarReglaLocal',
        host: pagina.host,
        selector: h.selector,
      });
      btn.textContent = t('quitado');
      ofrecerRecarga();
      pintarTuyas();
    });

    li.append(info, btn);
    ul.append(li);
  }
}

// Las reglas locales del sitio, con su deshacer. Sin esta lista, "Quitar"
// sería una puerta sin manija por dentro: algo que se puede hacer pero no ver
// ni revertir desde el mismo lugar.
async function pintarTuyas() {
  const host = (pagina && pagina.host) || estado.host;
  const sec = $('tuyas');
  if (!host) { sec.hidden = true; return; }
  const r = await chrome.runtime.sendMessage({ tipo: 'reglasLocalesDe', host });
  const lista = (r && r.locales) || [];
  sec.hidden = lista.length === 0;
  if (!lista.length) return;

  const ul = $('listaTuyas');
  ul.textContent = '';
  for (const sel of lista) {
    const li = document.createElement('li');
    const info = document.createElement('div');
    info.className = 'hueco-info';
    const code = document.createElement('code');
    code.textContent = sel;
    info.append(code);
    const btn = document.createElement('button');
    btn.className = 'mini';
    btn.textContent = t('mostrar');
    btn.addEventListener('click', async () => {
      btn.disabled = true;
      await chrome.runtime.sendMessage({ tipo: 'quitarReglaLocal', host, selector: sel });
      ofrecerRecarga();
      pintarTuyas();
    });
    li.append(info, btn);
    ul.append(li);
  }
}

// Peticiones que las reglas de red frenaron en esta pestaña. Dos límites que
// no se maquillan: Chrome solo conserva el dato 5 minutos, y getMatchedRules
// no distingue bloqueo de excepción — por eso construir.mjs guarda cuántas
// excepciones hay (van primero, ids 1..reglasPermiso) y aquí se filtran.
// Contar una excepción como bloqueo sería presumir un bloqueo que no ocurrió.
async function pintarRed() {
  const el = $('nRed');
  if (!estado.host || estado.tabId == null) { el.textContent = '–'; return; }
  if (!meta || typeof meta.reglasPermiso !== 'number') { el.textContent = '–'; return; }
  try {
    const { rulesMatchedInfo } = await chrome.declarativeNetRequest.getMatchedRules({ tabId: estado.tabId });
    const n = rulesMatchedInfo.filter((m) =>
      m.rule.rulesetId === 'principal' && m.rule.ruleId > meta.reglasPermiso).length;
    el.textContent = numero(n);
  } catch {
    // Cuota de consultas agotada: Chrome limita cuántas veces por intervalo se
    // puede preguntar. Mejor una raya honesta que un número inventado.
    el.textContent = '–';
  }
}

// El total desde la instalacion y, una sola vez, la peticion de rese~na. Los
// dos viven en storage.local: un numero suelto y una marca, nada de por donde
// se navego.
async function pintarTotal() {
  const { totales, resena } = await chrome.storage.local.get(['totales', 'resena']);
  const n = (totales && totales.ocultos) || 0;
  if (n > 0) {
    $('total').innerHTML = t('totalDesde', numero(n));
    $('total').hidden = false;
  }
  $('resena').hidden = !(n >= UMBRAL_RESENA && !resena);
}

// El texto del reporte sigue el mismo formato que los 5 que EasyList Spanish
// acepto el 3-ago-2026: sitio, que se observo, regla propuesta, y la salvedad
// declarada por adelantado. Ese formato entro 5 de 5 sin negociar. Va en
// ingles a proposito, sea cual sea el idioma del popup: lo lee un mantenedor.
function textoDelReporte() {
  const lineas = [];
  lineas.push(`Not covered by any rule in EasyList, EasyPrivacy or EasyList Spanish.`);
  lineas.push('');
  lineas.push(`Site: ${pagina.host}`);
  // Sin el ancho el reporte no es reproducible: el mismo sitio da resultados
  // distintos en movil y en escritorio porque sirve maquetas distintas.
  lineas.push(`Viewport width: ${pagina.ancho}px`);
  lineas.push('');
  lineas.push(`Ad containers detected by content (ad slots, network iframes or a`);
  lineas.push(`"Publicidad" label), not by class name:`);
  lineas.push('');
  for (const h of pagina.huecos) {
    lineas.push(`  ${h.selector}  — ${h.ancho}x${h.alto}px` +
      (h.servido ? ' (ad served)' : ' (empty reserved box)') +
      (h.alcance > 1 ? `, matches ${h.alcance} elements on the page` : ''));
  }
  // El argumento que decide si un mantenedor acepta: que la regla NO sea
  // redundante con lo que ya tiene. Cuando el envoltorio sobrevive aunque las
  // listas cubran la publicidad de dentro, eso es exactamente lo que hay que
  // decirle — y hasta el 13-ago-2026 se argumentaba a mano en cada reporte.
  const reservados = pagina.huecos.filter((h) => h.soloEspacioReservado);
  if (reservados.length) {
    // Decir "los de dentro YA estan cubiertos" justo despues de "no lo cubre
    // ninguna regla" se lee como contradiccion si no se aclara que son cosas
    // distintas: el slot de dentro si, el envoltorio no. Visto al comprobar el
    // texto renderizado el 13-ago-2026 — node --check no lo habria dado nunca.
    const cuales = reservados.length === pagina.huecos.length
      ? 'these containers'
      : `${reservados.length} of the containers above`;
    lineas.push('');
    lineas.push(`Not redundant with your current coverage: the ad slots INSIDE ${cuales}`);
    lineas.push(`are already hidden by existing rules — it is the wrapper that is not, and`);
    lineas.push(`it keeps its reserved height on screen instead of collapsing when emptied.`);
  }
  lineas.push('');
  lineas.push(`Proposed rule(s):`);
  lineas.push('');
  for (const h of pagina.huecos) {
    lineas.push(`  ${pagina.host}##${h.selector}`);
  }

  // Un selector de utilidades CSS o con id regenerado no aguanta en una lista
  // que mantiene otra persona: o casa de mas manana, o deja de casar. Decirlo
  // en el propio reporte es mas honesto que dejar que lo descubra el mantenedor
  // — y quien lo lea aqui probablemente no lo envie, que es el objetivo.
  const fragiles = pagina.huecos.filter((h) => h.nombreFragil);
  if (fragiles.length) {
    lineas.push('');
    lineas.push(`WARNING — ${fragiles.length} of the selectors above rely on utility CSS classes`);
    lineas.push(`or on ids the CMS regenerates between page loads. They are NOT stable enough`);
    lineas.push(`for a filter list: do not submit those. This site may simply not be`);
    lineas.push(`addressable with cosmetic rules.`);
  }
  lineas.push('');
  lineas.push(`IMPORTANT — this report is NOT verified yet. Before submitting it, the`);
  lineas.push(`rule must be applied and the page reloaded to confirm nothing else`);
  lineas.push(`breaks (no loss of headlines, links, images or text). Do not submit`);
  lineas.push(`without that check.`);
  lineas.push('');
  lineas.push(`Found with Filtros MX (https://github.com/edso79/filtros-mx).`);
  return lineas.join('\n');
}

document.querySelectorAll('.modo').forEach((b) => {
  b.addEventListener('click', async () => {
    const previo = estado.modo;
    // tabId viaja para que el fondo repinte el icono de ESTA pestaña al momento.
    const r = await chrome.runtime.sendMessage({
      tipo: 'fijarModo', host: estado.host, modo: b.dataset.modo, tabId: estado.tabId,
    });
    estado.modo = r.modo;
    pintarEstado();
    pintarPagina();
    if (estado.modo !== previo) ofrecerRecarga();
  });
});

$('recargar').addEventListener('click', async () => {
  try { await chrome.tabs.reload(estado.tabId); } catch {}
  window.close();
});

// "Quitar un elemento": se inyecta el selector en la pagina y el popup se
// cierra, porque la eleccion ocurre alla, con el raton sobre la pagina.
$('elegir').addEventListener('click', async () => {
  try {
    await chrome.scripting.executeScript({ target: { tabId: estado.tabId }, files: ['src/selector.js'] });
    window.close();
  } catch {
    $('elegir').disabled = true;
  }
});

// Un boton que hace su trabajo sin decirlo esta roto en la practica: si el
// resultado no cambia, el usuario no puede distinguir "analizo y no encontro
// nada" de "el boton no funciona". Reportado por Edgar el 10-ago-2026.
$('reanalizar').addEventListener('click', async () => {
  const boton = $('reanalizar');
  boton.disabled = true;
  boton.textContent = t('analizando');

  // En chrome://, la tienda o un PDF no hay content script y sendMessage lanza.
  let ok = true;
  try {
    await chrome.tabs.sendMessage(estado.tabId, { tipo: 'reanalizar' });
    pagina = await chrome.tabs.sendMessage(estado.tabId, { tipo: 'huecosDeLaPagina' });
  } catch {
    pagina = null;
    ok = false;
  }
  pintarPagina();

  boton.textContent = t(ok ? 'analizado' : 'noAnalizable');
  setTimeout(() => {
    boton.textContent = t('reanalizar');
    boton.disabled = false;
  }, 1400);
});

$('opciones').addEventListener('click', () => chrome.runtime.openOptionsPage());

// "¿Algo se ve mal?" abre el correo de la persona con el sitio en el asunto.
// Lo envia ella, viendo lo que dice: mismo trato que el reporte a EasyList.
// Sin esta salida, el usuario con un sitio roto no tiene a quien decirselo y
// lo que hace es desinstalar.
$('problema').addEventListener('click', () => {
  const asunto = t('problemaAsunto', estado.host || '—');
  chrome.tabs.create({ url: `mailto:${CONTACTO}?subject=${encodeURIComponent(asunto)}` });
});

$('reportar').addEventListener('click', () => {
  const titulo = `${pagina.host}: uncovered ad containers`;
  const url = `${REPO}?title=${encodeURIComponent(titulo)}&body=${encodeURIComponent(textoDelReporte())}`;
  chrome.tabs.create({ url });
});

$('resenaSi').addEventListener('click', async () => {
  await chrome.storage.local.set({ resena: 'pedida' });
  chrome.tabs.create({ url: RESENAS });
});
$('resenaNo').addEventListener('click', async () => {
  await chrome.storage.local.set({ resena: 'descartada' });
  $('resena').hidden = true;
});

(async () => {
  estado = await chrome.runtime.sendMessage({ tipo: 'estado' });
  pintarEstado();
  pintarTotal();

  try { meta = await chrome.runtime.sendMessage({ tipo: 'meta' }); } catch { meta = null; }
  if (meta && meta.compilado) {
    $('fechaListas').textContent = t('listasDel', new Date(meta.compilado).toLocaleDateString(IDIOMA));
  }
  pintarRed();

  try {
    pagina = await chrome.tabs.sendMessage(estado.tabId, { tipo: 'huecosDeLaPagina' });
  } catch {
    // Pasa en about:blank, la tienda de Chrome y demas paginas donde no se
    // puede inyectar. No es un fallo que valga la pena mostrar.
    pagina = null;
  }
  pintarPagina();
  pintarTuyas();
})();
