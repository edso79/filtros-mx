#!/usr/bin/env node
// Mide un sitio real CON EL BLOQUEO DE RED PUESTO, preguntandole al detector
// de la extension — no a un medidor aparte.
//
// Por que existe (13-ago-2026): todas las mediciones del corpus hasta ahora se
// hicieron con el panel del navegador, SIN bloqueador. Ese instrumento ve un
// mundo que el usuario de EasyList Spanish no ve: envoltorios que solo existen
// porque el anuncio SI cargo. La regla de metodo que se pago el 11-ago —"lo que
// solo aparece sin bloqueador no es hueco reportable"— no se podia comprobar
// hasta que Chrome for Testing resulto ejecutable en esta maquina.
//
// Este arnes cierra ese hueco. Hace dos cosas:
//   1. Le pregunta al MISMO detector que la extension lleva embarcado que quedo
//      visible encima, con las reglas DNR activas.
//   2. AUDITA selectores candidatos: cuanta area y altura VISIBLE aportarian de
//      verdad. Es la pregunta que decide si una regla se reporta aguas arriba,
//      y hasta hoy se respondia sin bloqueo, que es responderla mal.
//
// Correr las dos veces —con y sin --sin-extension— da el contraste que explica
// por que una candidata medida en el panel se desinfla con el bloqueo puesto.
//
// Uso:
//   node medir-sitio.mjs <chrome.exe> <url> [url...] [--selector "<css>"]... [--sin-extension]

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
let EXTENSION_USADA = path.join(HERE, '..', '..', 'extension');
// Parametrizable para poder medir dos sitios a la vez: un solo puerto obliga a
// encadenar corridas que tardan minutos.
let PUERTO_CDP = 9334;

// El ancho CAMBIA el resultado (medido el 3-ago en quadratin: 0 huecos a 296 px,
// 4 a 1280). Se fija aqui y viaja en el informe, para que sea reproducible.
const ANCHO = 1280;
const ALTO = 900;

// --- Argumentos -------------------------------------------------------------
// Chrome for Testing, sin tener que acordarse de la ruta. Se busca donde lo
// deja @puppeteer/browsers, que es la ubicacion estable; el primer binario vivio
// en un temporal de sesion y eso convierte el instrumento central del proyecto
// en algo que desaparece solo.
function buscarChrome() {
  if (process.env.CHROME_PRUEBAS && fs.existsSync(process.env.CHROME_PRUEBAS)) {
    return process.env.CHROME_PRUEBAS;
  }
  const base = path.join(os.homedir(), '.cache', 'puppeteer', 'chrome');
  if (!fs.existsSync(base)) return null;
  for (const version of fs.readdirSync(base).sort().reverse()) {
    for (const carpeta of ['chrome-win64', 'chrome-win32', 'chrome-linux64', 'chrome-mac-x64']) {
      const exe = path.join(base, version, carpeta, process.platform === 'win32' ? 'chrome.exe' : 'chrome');
      if (fs.existsSync(exe)) return exe;
    }
  }
  return null;
}

const argv = process.argv.slice(2);
// La ruta al binario es opcional: si el primer argumento parece una URL, se
// entiende que no se paso y se busca solo.
let chromeExe = argv[0] && !/^https?:|^--/.test(argv[0]) ? argv.shift() : buscarChrome();
const selectores = [];
const urls = [];
let conExtension = true;
let reforzado = false;
let probarReporte = false;
let auditarEtiquetas = false;
let explorar = false;
let probarPerdidaSel = false;
let queFrena = false;
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--sin-extension') conExtension = false;
  else if (argv[i] === '--reforzado') reforzado = true;
  else if (argv[i] === '--probar-reporte') probarReporte = true;
  else if (argv[i] === '--auditar-etiquetas') auditarEtiquetas = true;
  else if (argv[i] === '--explorar') explorar = true;
  else if (argv[i] === '--probar-perdida') probarPerdidaSel = true;
  else if (argv[i] === '--que-frena') queFrena = true;
  // Para probar el ZIP descomprimido en vez del repo: lo que se sube no es lo
  // mismo que lo que se edita, y el paquete se arma con una lista blanca.
  else if (argv[i] === '--extension') EXTENSION_USADA = argv[++i];
  else if (argv[i] === '--puerto') PUERTO_CDP = Number(argv[++i]);
  else if (argv[i] === '--selector') selectores.push(argv[++i]);
  else if (argv[i].startsWith('--selector=')) selectores.push(argv[i].slice(11));
  else urls.push(argv[i]);
}
if (!chromeExe || !fs.existsSync(chromeExe) || urls.length === 0) {
  console.error('Uso: node medir-sitio.mjs <chrome.exe> <url> [url...] [--selector "<css>"]... [--sin-extension]');
  process.exit(2);
}

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

async function json(ruta, metodo = 'GET') {
  const r = await fetch(`http://localhost:${PUERTO_CDP}${ruta}`, { method: metodo });
  return r.json();
}

async function esperarCdp() {
  for (let i = 0; i < 60; i++) {
    try { return await json('/json/version'); } catch { await dormir(500); }
  }
  throw new Error('CDP nunca respondio');
}

// --- Cliente CDP minimo sobre el WebSocket nativo de Node -------------------
function conectar(wsUrl) {
  return new Promise((resolver, rechazar) => {
    const ws = new WebSocket(wsUrl);
    let siguiente = 1;
    const pendientes = new Map();
    ws.onopen = () => resolver({
      llamar(metodo, params = {}) {
        return new Promise((res, rej) => {
          const id = siguiente++;
          pendientes.set(id, { res, rej });
          ws.send(JSON.stringify({ id, method: metodo, params }));
        });
      },
      cerrar() { try { ws.close(); } catch {} },
    });
    ws.onerror = (e) => rechazar(new Error('WebSocket: ' + (e.message || 'error')));
    ws.onmessage = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id && pendientes.has(m.id)) {
        const { res, rej } = pendientes.get(m.id);
        pendientes.delete(m.id);
        if (m.error) rej(new Error(m.error.message));
        else res(m.result);
      }
    };
  });
}

async function evaluar(cliente, expresion) {
  const r = await cliente.llamar('Runtime.evaluate', {
    expression: expresion,
    awaitPromise: true,
    returnByValue: true,
  });
  if (r.exceptionDetails) {
    throw new Error('En la pagina: ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text));
  }
  return r.result.value;
}

// Recorre la pagina de arriba a abajo. Sin esto, la mitad de las unidades
// publicitarias no se piden nunca: los sitios de noticias cargan en diferido.
const RECORRER = `(async () => {
  const paso = () => new Promise((r) => setTimeout(r, 700));
  for (let y = 0; y < document.body.scrollHeight; y += 600) {
    window.scrollTo(0, y);
    await paso();
    if (y > 12000) break;
  }
  window.scrollTo(0, 0);
  await paso();
  return document.body.scrollHeight;
})()`;

// Cuanto aportaria de VERDAD una regla candidata: area y altura de lo que sigue
// visible. Un elemento a 1265x0 existe en el DOM y no le quita nada a nadie.
const auditar = (sels) => `(() => {
  const sels = ${JSON.stringify(sels)};
  return sels.map((sel) => {
    let els = [];
    try { els = [...document.querySelectorAll(sel)]; } catch (e) { return { selector: sel, error: String(e.message) }; }
    const detalle = els.map((e) => {
      const r = e.getBoundingClientRect();
      const cs = getComputedStyle(e);
      const visible = cs.display !== 'none' && cs.visibility !== 'hidden' &&
                      cs.opacity !== '0' && r.width > 0 && r.height > 0;
      return {
        w: Math.round(r.width), h: Math.round(r.height), visible,
        area: visible ? Math.round(r.width * r.height) : 0,
        // Que hay DENTRO: si no queda ni iframe ni imagen, el envoltorio esta hueco.
        iframes: e.querySelectorAll('iframe').length,
        imgs: e.querySelectorAll('img').length,
        texto: (e.innerText || '').trim().slice(0, 40),
      };
    });
    return {
      selector: sel,
      casan: els.length,
      visibles: detalle.filter((d) => d.visible).length,
      areaTotal: detalle.reduce((a, d) => a + d.area, 0),
      alturaTotal: detalle.reduce((a, d) => a + (d.visible ? d.h : 0), 0),
      conContenido: detalle.filter((d) => d.visible && (d.iframes || d.imgs)).length,
      detalle,
    };
  });
})()`;

// La prueba que firma el reporte: ¿esta regla ROMPE la pagina? Todas las
// entradas de AGUAS-ARRIBA.md declaran "recarga limpia: cero perdida de
// titulares, enlaces, imagenes, menus y formularios", y hasta el 14-ago-2026
// eso se comprobaba a mano, sitio por sitio. Aqui se mide: cuenta el contenido
// vivo, oculta lo que casaria la regla, vuelve a contar y RESTAURA.
//
// El detector tiene su propio esSeguro(), pero solo mira los candidatos que el
// mismo propone. Un selector escrito a mano —que es como salieron los mejores
// hallazgos del proyecto— no pasaba por ningun filtro automatico.
const probarPerdida = (sels) => `(() => {
  const visible = (e) => {
    const cs = getComputedStyle(e); const r = e.getBoundingClientRect();
    return cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0;
  };
  const censo = () => ({
    titulares: [...document.querySelectorAll('h1,h2,h3,h4')].filter(visible).length,
    enlaces: [...document.querySelectorAll('a[href]')].filter(visible).length,
    imagenes: [...document.querySelectorAll('img')].filter(visible).length,
    campos: [...document.querySelectorAll('input,textarea,select,button')].filter(visible).length,
    // El texto se mide en caracteres: perder un parrafo no cambia el conteo de
    // titulares pero si el de texto.
    texto: (document.body.innerText || '').replace(/\\s+/g, ' ').trim().length,
  });
  return ${JSON.stringify(sels)}.map((sel) => {
    let els;
    try { els = [...document.querySelectorAll(sel)]; } catch (e) { return { selector: sel, error: String(e.message) }; }
    const antes = censo();
    const previo = els.map((e) => e.style.display);
    els.forEach((e) => { e.style.display = 'none'; });
    void document.body.offsetHeight;
    const despues = censo();
    els.forEach((e, i) => { e.style.display = previo[i]; });
    void document.body.offsetHeight;
    // Lo que se pierde AL OCULTAR es lo que la regla se llevaria por delante.
    const perdida = {};
    for (const k of Object.keys(antes)) perdida[k] = antes[k] - despues[k];
    return { selector: sel, casan: els.length, antes, perdida };
  });
})()`;

// Para los casos de CEGUERA: el detector avisa de que hay publicidad y no
// encuentra donde, y hasta hoy la unica salida era abrir el sitio a mano. Esto
// no adivina un selector — ensena el DOM por donde entra la publicidad: cada
// iframe de terceros con su origen, su tamano y la CADENA DE ANCESTROS con sus
// id y clases, que es de donde sale el gancho. Nace el 14-ago-2026 con
// cuartopoder.mx, tabascohoy.com y elorbe.com, donde no hay ni un div-gpt-ad ni
// un adsbygoogle y aun asi el bloqueo frena 11, 19 y 4 peticiones.
const EXPLORAR = `(() => {
  const host = location.hostname.replace(/^www\\./, '');
  const cadena = (e) => {
    const salto = [];
    for (let n = e.parentElement, i = 0; n && i < 5; n = n.parentElement, i++) {
      const r = n.getBoundingClientRect();
      salto.push({
        etiqueta: n.tagName.toLowerCase(),
        id: n.id || null,
        clase: (n.className && typeof n.className === 'string') ? n.className.trim().slice(0, 90) : null,
        w: Math.round(r.width), h: Math.round(r.height),
        hijos: n.children.length,
      });
    }
    return salto;
  };
  // Iframes de terceros: por donde entra casi toda la publicidad servida.
  const iframes = [...document.querySelectorAll('iframe')].map((f) => {
    const r = f.getBoundingClientRect();
    let ajeno = true;
    try { ajeno = !!f.src && !new URL(f.src, location.href).hostname.endsWith(host); } catch {}
    return {
      src: (f.src || f.getAttribute('data-src') || '(sin src)').slice(0, 110),
      ajeno, id: f.id || null,
      clase: (typeof f.className === 'string' ? f.className : '').trim().slice(0, 60) || null,
      w: Math.round(r.width), h: Math.round(r.height),
      ancestros: cadena(f),
    };
  }).filter((f) => f.ajeno);
  // Atributos que delatan un montaje publicitario aunque la clase no diga nada.
  const PISTAS = '[data-ad-slot],[data-advadstrackid],[data-ad-client],[data-google-query-id],[data-freestar-ad],[data-r89],[id*="ad-"],[id*="_ad"],[class*="ad-"],[class*="banner"],[class*="publi"],[class*="anunc"],[data-zone],[data-slot]';
  const marcados = [...document.querySelectorAll(PISTAS)].map((e) => {
    const r = e.getBoundingClientRect();
    const cs = getComputedStyle(e);
    return {
      etiqueta: e.tagName.toLowerCase(), id: e.id || null,
      clase: (typeof e.className === 'string' ? e.className : '').trim().slice(0, 90) || null,
      w: Math.round(r.width), h: Math.round(r.height),
      visible: cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0,
      iframes: e.querySelectorAll('iframe').length,
      imgs: e.querySelectorAll('img').length,
      texto: (e.innerText || '').trim().slice(0, 40),
      // La pregunta que decide si se puede proponer la regla: lo de dentro,
      // ¿es publicidad o es el propio periodico promocionandose? Un enlace a
      // dominio ajeno delata lo primero; uno a casa, lo segundo. Sin esto, en
      // tabascohoy.com las cajas ".banner" con "EDICION IMPRESA" se leen igual
      // que un anuncio de terceros, y no lo son.
      salientes: [...new Set([...e.querySelectorAll('a[href]')].map((a) => {
        try { const h = new URL(a.href, location.href).hostname; return h.endsWith(host) ? null : h; } catch { return null; }
      }).filter(Boolean))].slice(0, 4),
      imagenes: [...e.querySelectorAll('img')].slice(0, 3).map((i) => {
        try { const u = new URL(i.currentSrc || i.src, location.href); return (u.hostname.endsWith(host) ? 'casa:' : u.hostname + ':') + u.pathname.split('/').pop().slice(0, 34); } catch { return '(?)'; }
      }),
    };
  }).filter((e) => e.w * e.h > 5000 || e.iframes);
  // Los scripts dicen QUE proveedor sirve, que es lo que decide donde mirar.
  const proveedores = [...new Set([...document.querySelectorAll('script[src]')]
    .map((s) => { try { return new URL(s.src, location.href).hostname; } catch { return null; } })
    .filter((h) => h && !h.endsWith(host)))];
  return { iframes, marcados, proveedores };
})()`;

// El 13-ago-2026 se excluyo la navegacion de esEtiqueta() porque el detector
// proponia ocultar un item de menu que decia "Publicidad". La exclusion se hizo
// con UNA observacion, y una exclusion mal puesta no se nota: deja de encontrar
// cosas, en silencio — el mismo modo de fallo que acababa de costar el hallazgo
// de elmanana. Esto lo mide en vez de vigilarlo: lista TODAS las etiquetas del
// sitio, dice cuales caen en la exclusion, y si esa etiqueta tiene un anuncio
// cerca (lo que la haria un rotulo legitimo perdido).
const AUDITAR_ETIQUETAS = `(() => {
  const ETIQUETA = /^(publicidad|anuncio|advertisement|patrocinado)$/i;
  const EXCLUSION = 'nav, [role="navigation"], [class*="menu-item"], [class*="nav-item"], [class*="navbar"]';
  const SEMILLAS = 'ins.adsbygoogle,[id^="div-gpt-ad"],[id*="gpt-ad"],[data-advadstrackid],[data-ad-slot],[id^="taboola"],[id*="outbrain"]';
  const todos = [...document.querySelectorAll('p,span,div,small,a,li,button,strong,em')];
  return todos
    .filter((e) => e.children.length === 0 && ETIQUETA.test((e.textContent || '').trim()))
    .map((e) => {
      // ¿Hay publicidad de verdad al lado? Se mira hacia arriba unos niveles:
      // un rotulo legitimo vive pegado a su anuncio.
      let cerca = false;
      let n = e.parentElement;
      for (let i = 0; i < 4 && n; i++, n = n.parentElement) {
        if (n.querySelector(SEMILLAS) || n.querySelector('iframe')) { cerca = true; break; }
      }
      return {
        texto: (e.textContent || '').trim().slice(0, 30),
        etiqueta: e.tagName,
        clase: (typeof e.className === 'string' ? e.className : '').slice(0, 70),
        excluida: !!e.closest(EXCLUSION),
        anuncioCerca: cerca,
      };
    });
})()`;

const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'filtros-mx-medir-'));
const banderas = [
  `--user-data-dir=${perfil}`,
  `--remote-debugging-port=${PUERTO_CDP}`,
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-sync',
  `--window-size=${ANCHO},${ALTO}`,
  'about:blank',
];
if (conExtension) banderas.unshift(`--load-extension=${EXTENSION_USADA}`);
const chrome = spawn(chromeExe, banderas, { stdio: 'ignore' });

const informes = [];
let salida = 0;
let version = null;

try {
  await esperarCdp();
  await dormir(conExtension ? 3000 : 800); // que la extension indexe las reglas DNR

  let cExt = null;
  if (conExtension) {
    // Localizar el service worker: es la unica prueba fiable de que cargo.
    // Buscar cualquier objetivo chrome-extension:// da falso positivo (Chrome
    // trae extensiones de componente propias).
    const objetivos = await json('/json/list');
    const sw = objetivos.find((t) => t.url.includes('/src/fondo.js'));
    if (!sw) throw new Error('No aparece el service worker de la extension. Objetivos: ' + objetivos.map((t) => t.url).join(' | '));
    const idExt = new URL(sw.url).host;

    // Contexto de extension (chrome.tabs, chrome.declarativeNetRequest). Se abre
    // como pestana: /json/new hacia chrome-extension:// se queda en blanco, hay
    // que navegar despues via CDP.
    const pestExt = await json('/json/new?url=about:blank', 'PUT');
    cExt = await conectar(pestExt.webSocketDebuggerUrl);
    await cExt.llamar('Page.enable');
    await cExt.llamar('Page.navigate', { url: `chrome-extension://${idExt}/popup/popup.html` });
    for (let i = 0; i < 20; i++) {
      await dormir(400);
      try {
        version = await evaluar(cExt, 'chrome?.runtime?.getManifest?.().version ?? null');
        if (version) break;
      } catch {}
    }
    if (!version) throw new Error('la pestana de extension nunca obtuvo contexto');
    const reglas = await evaluar(cExt, `chrome.declarativeNetRequest.getEnabledRulesets()`);
    console.log(`Filtros MX v${version} cargada — conjuntos activos: ${JSON.stringify(reglas)}`);

    // Reforzado = genericas aplicadas SOLO en ese sitio. Es la unica forma de
    // medir "con TODA la cobertura encima" sin trucar el DOM a mano: si el
    // envoltorio sigue ocupando con las genericas puestas, reserva altura
    // propia y el hueco es real. Se fija ANTES de navegar, porque el content
    // script pide sus selectores al arrancar.
    if (reforzado) {
      for (const u of urls) {
        const h = new URL(u).hostname;
        const r = await evaluar(cExt,
          `chrome.runtime.sendMessage({ tipo: 'fijarModo', host: ${JSON.stringify(h)}, modo: 'reforzado' })`);
        console.log(`  modo de ${h}: ${JSON.stringify(r)}`);
      }
    }
  } else {
    console.log('SIN EXTENSION: navegador limpio, sin bloqueo de ningun tipo.');
  }

  console.log(`Ventana ${ANCHO}x${ALTO}. Midiendo ${urls.length} url(s).\n`);

  for (const url of urls) {
    console.log('='.repeat(70));
    console.log('URL:', url, conExtension ? '[con bloqueo]' : '[sin bloqueo]');

    // Un sitio que falla NO debe llevarse por delante a los que van detras.
    // Medido el 13-ago-2026 en un barrido de 8: elsiglocoahuila.mx tumbo el
    // proceso con "Receiving end does not exist" (su content script nunca
    // arranco) y poresto.net con "no encuentro el tabId" (redirige fuera del
    // host pedido). Resultado: 4 sitios sin medir, y dos de ellos ni se
    // intentaron. En un barrido eso es justo el trabajo que se pierde en
    // silencio — el fallo se anota y se sigue.
    try {

    const pest = await json('/json/new?url=about:blank', 'PUT');
    const cPag = await conectar(pest.webSocketDebuggerUrl);
    await cPag.llamar('Page.enable');
    await cPag.llamar('Page.navigate', { url });

    // Polling de readyState: un sitio de noticias puede no disparar nunca el
    // evento de carga completa, y esperarlo cuelga el arnes.
    let listo = false;
    for (let i = 0; i < 60; i++) {
      await dormir(1000);
      try {
        const estado = await evaluar(cPag, 'document.readyState');
        if (estado === 'complete' || estado === 'interactive') { listo = true; break; }
      } catch {}
    }
    if (!listo) console.log('  AVISO: la pagina nunca llego a readyState util');

    await dormir(2500);
    const alto = await evaluar(cPag, RECORRER).catch(() => null);
    await dormir(2500);

    const info = { url, conExtension, altoPagina: alto };

    if (conExtension) {
      // Match por HOST, no por URL exacta: casi todo sitio de noticias redirige
      // (elmanana.com -> www.elmanana.com) y un match exacto no encuentra nada.
      const host = new URL(url).hostname.replace(/^www\./, '');
      const tabId = await evaluar(cExt,
        `chrome.tabs.query({}).then(ts => (ts.find(t => (t.url || '').includes(${JSON.stringify(host)})) || {}).id ?? null)`);
      if (tabId == null) {
        // "No lo encuentro" no es un diagnostico. El 14-ago-2026 poresto.net
        // fallo asi dos barridos seguidos y el mensaje no decia a donde habia
        // ido: listar las pestanas destapo que salta a poresto.com, OTRO
        // dominio. Y la trampa que costo el rodeo: curl -L devuelve 200 en
        // poresto.net porque el salto es de CLIENTE, no HTTP — comprobar
        // redirecciones con curl no descarta nada. Decir QUE pestanas se
        // vieron convierte el fallo en informacion sobre el sitio.
        const vistas = await evaluar(cExt, `chrome.tabs.query({}).then(ts => ts.map(t => t.url || '(sin url)'))`).catch(() => []);
        throw new Error(`no encuentro el tabId de ${url} — pestanas vistas: ${JSON.stringify(vistas)}`);
      }

      // Reanalizar tras el recorrido: los huecos de mas abajo solo existen una
      // vez que el DOM los tiene.
      await evaluar(cExt, `chrome.tabs.sendMessage(${tabId}, { tipo: 'reanalizar' })`).catch(() => {});
      await dormir(1500);

      const reporte = await evaluar(cExt, `chrome.tabs.sendMessage(${tabId}, { tipo: 'huecosDeLaPagina' })`);
      // La prueba de que el bloqueo estaba puesto: peticiones frenadas por
      // nuestras reglas en ESTA pestana.
      // getMatchedRules devuelve TODA regla que caso, permisos incluidos. Contarlas
      // todas como "frenadas" infla la cifra que valida cada medicion del corpus:
      // un sitio podria darse por medido con bloqueo puesto cuando lo unico que
      // caso fue una excepcion. El popup ya descontaba los permisos desde el
      // 10-ago —los ids 1..reglasPermiso— y este arnes no; se vio el 25-ago, al
      // excluir sat.gob.mx con una regla que casa en cada peticion: 81 "frenadas"
      // en un sitio donde no se frena ninguna.
      let permisos = 0;
      try {
        permisos = JSON.parse(fs.readFileSync(
          path.join(EXTENSION_USADA, 'reglas', 'meta.json'), 'utf8')).reglasPermiso ?? 0;
      } catch { /* sin meta.json se cuenta todo, como antes */ }
      const frenadas = await evaluar(cExt,
        `chrome.declarativeNetRequest.getMatchedRules({ tabId: ${tabId} })
           .then(r => r.rulesMatchedInfo.filter(m => m.rule.ruleId > ${permisos}).length)
           .catch(() => -1)`);

      // --que-frena: QUE regla paro QUE peticion. El conteo basta para probar que
      // el bloqueo estaba puesto; no basta cuando la queja es "la extension rompe
      // este sitio", que es una pregunta sobre reglas concretas.
      let detalleFrenadas = null;
      if (queFrena) {
        detalleFrenadas = await evaluar(cExt,
          `chrome.declarativeNetRequest.getMatchedRules({ tabId: ${tabId} })
             .then(r => r.rulesMatchedInfo.map(m => ({
               id: m.rule.ruleId, conjunto: m.rule.rulesetId,
               url: m.request && m.request.url, tipo: m.request && m.request.type,
             }))).catch(() => [])`);
      }

      Object.assign(info, {
        host: reporte?.host ?? null,
        ancho: reporte?.ancho ?? null,
        peticionesFrenadas: frenadas,
        ocultos: reporte?.ocultos ?? null,
        selectoresAplicados: reporte?.selectoresAplicados ?? null,
        huecos: reporte?.huecos ?? [],
        descartes: reporte?.descartes ?? null,
        ceguera: reporte?.ceguera ?? null,
        detalleFrenadas,
      });

      console.log(`  peticiones frenadas por Filtros MX: ${info.peticionesFrenadas}`);
      if (queFrena) {
        const det = info.detalleFrenadas || [];
        console.log('  --- QUE REGLA FRENO QUE PETICION ---');
        if (!det.length) console.log('    (ninguna: la extension no paro nada en esta pestana)');
        // El id de la regla no dice nada por si solo. Lo que hace falta para
        // decidir si una regla sobra es el PATRON que la genero.
        let reglas = null;
        try {
          reglas = new Map(JSON.parse(fs.readFileSync(
            path.join(EXTENSION_USADA, 'reglas', 'red.json'), 'utf8')).map((r) => [r.id, r]));
        } catch { /* si no estan compiladas, se imprime sin patron */ }
        for (const d of det) {
          const r = reglas?.get(d.id);
          const c = r?.condition ?? {};
          const patron = c.urlFilter ?? c.regexFilter ?? (c.requestDomains ? 'dominios: ' + c.requestDomains.join(',') : '(sin patron)');
          console.log(`    [${d.id}] ${d.tipo ?? '?'}  ${d.url ?? '(sin url)'}`);
          console.log(`         accion: ${r?.action?.type ?? '?'} | patron: ${patron}`);
          if (c.initiatorDomains) console.log(`         solo en: ${c.initiatorDomains.join(',')}`);
          if (c.excludedInitiatorDomains) console.log(`         excepto en: ${c.excludedInitiatorDomains.join(',')}`);
        }
      }
      console.log(`  selectores aplicados al dominio:    ${info.selectoresAplicados}`);
      console.log(`  elementos ocultos por cosmeticas:   ${info.ocultos}`);
      console.log(`  descartes: ${JSON.stringify(info.descartes)}`);
      console.log(`  senal de ceguera: ${info.ceguera}`);
      console.log(`  HUECOS REPORTABLES: ${info.huecos.length}`);
      for (const h of info.huecos) {
        console.log(`    - ${h.selector ?? JSON.stringify(h)} ${h.area ? `(${h.area} px2)` : ''}`);
      }

      // El texto que se le pega al mantenedor, generado por el popup DE VERDAD
      // y con los huecos DE VERDAD. El popup toma sus datos de la pestana
      // activa, y abierto como pestana la activa es el mismo: por eso se le
      // inyecta el reporte del detector y se llama a su generador. Verifica la
      // funcion en su contexto real, no una copia del formato.
      if (probarReporte) {
        const texto = await evaluar(cExt,
          `(() => { pagina = ${JSON.stringify(reporte)}; return textoDelReporte(); })()`);
        console.log('\n  --- TEXTO DEL REPORTE, TAL CUAL LO GENERA EL POPUP ---');
        console.log(texto.split('\n').map((l) => '  | ' + l).join('\n'));
        info.textoReporte = texto;
      }
    }

    if (auditarEtiquetas) {
      const et = await evaluar(cPag, AUDITAR_ETIQUETAS).catch(() => []);
      info.etiquetas = et;
      const perdidas = et.filter((e) => e.excluida && e.anuncioCerca);
      console.log(`  --- ETIQUETAS "Publicidad": ${et.length} en total, ${et.filter((e) => e.excluida).length} excluidas por navegacion ---`);
      for (const e of et) {
        console.log(`    ${e.excluida ? 'EXCLUIDA' : '  vale  '} <${e.etiqueta}> "${e.texto}"` +
          `${e.anuncioCerca ? ' [ANUNCIO CERCA]' : ''} ${e.clase ? '· ' + e.clase : ''}`);
      }
      // La unica combinacion que delata una exclusion mal puesta.
      console.log(`  ROTULOS LEGITIMOS PERDIDOS POR LA EXCLUSION: ${perdidas.length}`);
    }

    if (explorar) {
      const ex = await evaluar(cPag, EXPLORAR).catch((e) => ({ error: e.message }));
      info.exploracion = ex;
      console.log('  --- EXPLORACION DEL DOM (para casos de ceguera) ---');
      console.log(`  proveedores de terceros: ${(ex.proveedores ?? []).join(', ') || '(ninguno)'}`);
      console.log(`  iframes de terceros: ${(ex.iframes ?? []).length}`);
      for (const f of ex.iframes ?? []) {
        console.log(`    ${f.w}x${f.h}  ${f.src}`);
        console.log(`      ancestros: ${f.ancestros.map((a) => `${a.etiqueta}${a.id ? '#' + a.id : ''}${a.clase ? '.' + a.clase.split(/\s+/).join('.') : ''} [${a.w}x${a.h}]`).join('  <  ')}`);
      }
      console.log(`  elementos con pista publicitaria: ${(ex.marcados ?? []).length}`);
      for (const m of ex.marcados ?? []) {
        console.log(`    ${m.visible ? 'visible' : 'oculto '} ${m.w}x${m.h}  <${m.etiqueta}>${m.id ? '#' + m.id : ''}${m.clase ? ' .' + m.clase : ''}` +
          `${m.iframes ? ` (${m.iframes} iframe)` : ''}${m.texto ? ` "${m.texto}"` : ''}`);
        if (m.salientes?.length) console.log(`        enlaza a: ${m.salientes.join(', ')}`);
        if (m.imagenes?.length) console.log(`        imagenes: ${m.imagenes.join(' | ')}`);
      }
    }

    if (probarPerdidaSel && selectores.length) {
      const pr = await evaluar(cPag, probarPerdida(selectores));
      info.perdida = pr;
      console.log('  --- PRUEBA DE PERDIDA: que se lleva la regla por delante ---');
      for (const p of pr) {
        if (p.error) { console.log(`    ${p.selector}: SELECTOR INVALIDO (${p.error})`); continue; }
        const roto = Object.entries(p.perdida).filter(([k, v]) => v > 0 && k !== 'imagenes');
        const detalle = Object.entries(p.perdida).map(([k, v]) => `${k} ${v > 0 ? '-' + v : '0'}`).join(', ');
        // Las imagenes SI pueden caer: son las creatividades. Titulares, texto,
        // enlaces y campos, no — ahi empieza romper la pagina.
        console.log(`    ${p.selector} (casan ${p.casan}): ${detalle}`);
        console.log(`      ${roto.length ? 'ROMPE CONTENIDO: ' + roto.map(([k, v]) => `${v} ${k}`).join(', ') : 'LIMPIA — no se pierde titular, texto, enlace ni campo'}`);
      }
    }

    if (selectores.length) {
      const auditoria = await evaluar(cPag, auditar(selectores));
      info.auditoria = auditoria;
      console.log('  --- APORTE REAL DE LAS REGLAS CANDIDATAS ---');
      for (const a of auditoria) {
        if (a.error) { console.log(`    ${a.selector}: SELECTOR INVALIDO (${a.error})`); continue; }
        console.log(`    ${a.selector}`);
        console.log(`      casan ${a.casan} | visibles ${a.visibles} | con contenido dentro ${a.conContenido}`);
        console.log(`      area visible ${a.areaTotal} px2 | altura visible ${a.alturaTotal} px`);
        const tam = a.detalle.map((d) => `${d.w}x${d.h}${d.visible ? '' : '(oculto)'}`).join(' ');
        if (tam) console.log(`      tamanos: ${tam}`);
      }
    }

    informes.push(info);
    cPag.cerrar();
    await json(`/json/close/${pest.id}`).catch(() => {});
    } catch (e) {
      // "Receiving end does not exist" = el content script no arranco ahi.
      // "no encuentro el tabId" = el sitio redirigio fuera del host pedido.
      // Las dos cosas son informacion sobre el sitio, no una excusa para
      // abortar: se anotan como fallo y el barrido continua.
      console.log(`  NO SE PUDO MEDIR: ${e.message}`);
      informes.push({ url, error: e.message });
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log(`RESUMEN (${conExtension ? 'CON' : 'SIN'} bloqueo de red)`);
  for (const i of informes) {
    console.log(`  ${i.url}`);
    // El 14-ago-2026 el mismo defecto de ayer reaparecio AQUI: el bucle de
    // medicion ya sobrevivia al sitio que falla, pero el resumen leia
    // i.huecos.length de un informe sin huecos y tumbaba el proceso DESPUES de
    // medir — con lo que tampoco se escribia el JSON y se perdian las 3
    // mediciones buenas. Blindar el bucle y dejar la impresion sin blindar es
    // no haber arreglado nada.
    if (i.error) { console.log(`    NO SE PUDO MEDIR: ${i.error}`); continue; }
    if (conExtension) {
      console.log(`    frenadas=${i.peticionesFrenadas} ocultos=${i.ocultos} huecos=${i.huecos.length} ceguera=${i.ceguera}`);
    }
    for (const a of i.auditoria ?? []) {
      if (!a.error) console.log(`    ${a.selector}: ${a.visibles}/${a.casan} visibles, ${a.areaTotal} px2, ${a.alturaTotal} px de alto`);
    }
  }

  const etiqueta = conExtension ? 'con-bloqueo' : 'sin-bloqueo';
  const destino = path.join(HERE, 'cache', `medicion-${etiqueta}-${Date.now()}.json`);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  // El MODO viaja en el informe desde el 25-ago-2026. Sin el, dos mediciones del
  // mismo sitio no son comparables sin fiarse de la memoria de quien las corrio:
  // ese dia, comparar hidrocalidodigital contra el 21-ago obligo a repetir la
  // corrida entera solo para saber en que modo se habia medido la primera.
  // La fecha legible va por lo mismo — el nombre del archivo solo lleva ms.
  fs.writeFileSync(destino, JSON.stringify({
    version, ancho: ANCHO, conExtension,
    modo: conExtension ? (reforzado ? 'reforzado' : 'normal') : 'sin-extension',
    cuando: new Date().toISOString(),
    informes,
  }, null, 2));
  console.log('\nInforme completo:', destino);

  cExt?.cerrar();
} catch (e) {
  console.error('ARNES FALLO:', e.message);
  salida = 1;
} finally {
  try { chrome.kill(); } catch {}
  await dormir(500);
  try { fs.rmSync(perfil, { recursive: true, force: true }); } catch {}
}
process.exit(salida);
