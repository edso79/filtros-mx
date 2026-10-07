#!/usr/bin/env node
// Capturas para la ficha de la Chrome Web Store, generadas por codigo.
//
// Misma razon que los iconos: una imagen que nadie sabe reproducir es una
// dependencia opaca. Si manana cambia el popup, se vuelve a correr esto y las
// capturas quedan al dia — en vez de envejecer ensenando una interfaz que ya no
// existe, que es como una ficha empieza a mentir sin que nadie lo decida.
//
// Y son capturas HONESTAS: el popup se pinta con los huecos REALES que el
// detector encuentra en un sitio real, con el bloqueo puesto. No hay maqueta.
//
// La tienda exige 1280x800 (o 640x400). El popup mide ~380px, asi que se compone
// un lienzo: fondo de la paleta del proyecto, un titular, y la captura del popup
// encima. La composicion se hace en HTML y se captura otra vez — sin librerias
// de imagen.
//
// Uso:  node herramientas/extension/capturar-tienda.mjs [ruta-chrome.exe]

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const EXTENSION = path.join(HERE, '..', '..', 'extension');
const SALIDA_BASE = path.join(HERE, '..', '..', 'extension', 'tienda-capturas');
const PUERTO_CDP = 9360;

// Las escenas, en el orden de la ficha (reescritas el 7-oct-2026 para la
// 1.0.0). La ficha VENDE: primero lo que el usuario gana, luego lo que nadie
// mas trae. Las capturas de opciones y de "lo que no puede resolver" se
// retiraron de la ficha: eran honestas, pero ese lugar es para convencer, y la
// honestidad tecnica sigue a un clic en la propia pagina de opciones.
//
// Cada texto en los dos idiomas: con --lang en se generan las capturas para la
// ficha en ingles, con Chrome en ingles y por tanto el popup en ingles.
const ESCENAS = [
  {
    archivo: '1-bloqueo.png',
    tipo: 'popup',
    urls: ['https://www.zocalo.com.mx/'],
    es: {
      titulo: 'Bloquea anuncios y rastreadores <em>desde el primer minuto</em>',
      pie: 'Con las listas abiertas que usan millones de personas. Sin configurar nada, y en cada página te dice lo que quitó.',
    },
    en: {
      titulo: 'Blocks ads and trackers <em>from the very first minute</em>',
      pie: 'With the open filter lists millions of people rely on. Nothing to configure, and on every page it shows you what it removed.',
    },
  },
  {
    // 1.1.0. YouTube es lo primero que prueba quien instala un bloqueador.
    // La afirmacion del pie esta medida (medir-youtube.mjs, 7-oct-2026) y se
    // vuelve a medir antes de cada version.
    archivo: '2-youtube.png',
    tipo: 'video',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    es: {
      titulo: 'YouTube <em>sin anuncios de video</em>',
      pie: 'Con las reglas de uBlock Origin. Medido en 12 videos muy vistos: ninguno con anuncio, los 12 reproduciéndose.',
    },
    en: {
      titulo: 'YouTube <em>without video ads</em>',
      pie: 'Using the rules of uBlock Origin. Measured on 12 popular videos: none with an ad, all 12 playing.',
    },
  },
  {
    archivo: '3-colados.png',
    tipo: 'popup',
    // La primera que tenga algo colado HOY. Son sitios del corpus donde el
    // detector ha encontrado huecos que ninguna lista cubre; si en todos se
    // arreglo aguas arriba, la escena avisa en vez de inventar.
    urls: [
      'https://www.netnoticias.mx/',
      'https://www.proyectopuente.com.mx/noticias/',
      'https://www.elheraldodesaltillo.mx/',
      'https://www.quadratin.com.mx/',
      'https://criteriohidalgo.com/',
      'https://hidrocalidodigital.com/',
    ],
    exigeColados: true,
    es: {
      titulo: 'Si un anuncio <em>se cuela</em>, te lo señala',
      pie: 'Detecta la publicidad que ninguna lista cubre todavía. La quitas con un clic, y si quieres, avisas a EasyList para que la corrija para todos.',
    },
    en: {
      titulo: 'If an ad <em>slips through</em>, it points it out',
      pie: 'It finds the ads no filter list covers yet. Remove them in one click — and if you want, tell EasyList so they get fixed for everyone.',
    },
  },
  {
    archivo: '4-quitar.png',
    tipo: 'selector',
    url: 'https://es.wikipedia.org/wiki/Monterrey',
    urlEn: 'https://en.wikipedia.org/wiki/Monterrey',
    // Lo primero que exista: el banner de aviso de Wikipedia es exactamente
    // "algo que estorba"; si ese dia no hay, la imagen de la ficha.
    objetivos: ['#siteNotice #centralNotice', '#siteNotice', '.infobox img', '#firstHeading'],
    es: {
      titulo: 'Quita <em>lo que te estorbe</em>',
      pie: 'Eliges cualquier cosa de la página con el ratón y desaparece, también en tus próximas visitas. Se deshace cuando quieras.',
    },
    en: {
      titulo: 'Remove <em>whatever gets in your way</em>',
      pie: 'Pick anything on the page with your mouse and it disappears — on future visits too. Undo it any time.',
    },
  },
  {
    archivo: '5-privacidad.png',
    tipo: 'pagina',
    ruta: 'bienvenida/bienvenida.html',
    es: {
      titulo: 'Cero telemetría. <em>Cero anuncios pagados.</em>',
      pie: 'Nada de lo que ves sale de tu navegador, ningún anunciante puede pagar para pasar el filtro, y el código es abierto.',
    },
    en: {
      titulo: 'Zero telemetry. <em>Zero paid ads.</em>',
      pie: 'Nothing you browse leaves your browser, no advertiser can pay to get past the filter, and the code is open.',
    },
  },
];

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

function buscarChrome() {
  if (process.env.CHROME_PRUEBAS && fs.existsSync(process.env.CHROME_PRUEBAS)) return process.env.CHROME_PRUEBAS;
  const base = path.join(os.homedir(), '.cache', 'puppeteer', 'chrome');
  if (!fs.existsSync(base)) return null;
  for (const v of fs.readdirSync(base).sort().reverse()) {
    for (const c of ['chrome-win64', 'chrome-win32', 'chrome-linux64', 'chrome-mac-x64']) {
      const exe = path.join(base, v, c, process.platform === 'win32' ? 'chrome.exe' : 'chrome');
      if (fs.existsSync(exe)) return exe;
    }
  }
  return null;
}

const soloPromo = process.argv.includes('--solo-promo');
// --lang en: Chrome en ingles (popup y bienvenida en ingles por _locales), textos
// del lienzo en ingles, y salida en tienda-capturas/en/ — es lo que se sube a la
// ficha en ingles. Sin la bandera, todo en espa~nol, como siempre.
const IDIOMA = process.argv.includes('--lang') ? process.argv[process.argv.indexOf('--lang') + 1] : 'es';
if (!['es', 'en'].includes(IDIOMA)) { console.error('--lang es|en'); process.exit(2); }
const chromeExe = process.argv[2] && fs.existsSync(process.argv[2]) ? process.argv[2] : buscarChrome();
const SALIDA = IDIOMA === 'en' ? path.join(SALIDA_BASE, 'en') : SALIDA_BASE;
if (!chromeExe) {
  console.error('No encuentro Chrome for Testing. Instalalo con:');
  console.error('  npx @puppeteer/browsers install chrome@stable');
  process.exit(2);
}

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
        if (m.error) rej(new Error(m.error.message)); else res(m.result);
      }
    };
  });
}

async function evaluar(cliente, expresion) {
  const r = await cliente.llamar('Runtime.evaluate', {
    expression: expresion, awaitPromise: true, returnByValue: true,
  });
  if (r.exceptionDetails) {
    throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  }
  return r.result.value;
}

const RECORRER = `(async () => {
  const paso = () => new Promise((r) => setTimeout(r, 600));
  for (let y = 0; y < document.body.scrollHeight; y += 600) {
    window.scrollTo(0, y); await paso(); if (y > 9000) break;
  }
  window.scrollTo(0, 0); await paso(); return true;
})()`;

// El lienzo de la tienda. Tipografia del sistema y la paleta de la extension:
// la ficha tiene que parecerse a lo que el usuario va a ver.
function lienzo(titulo, pie, pngBase64, ancho = 420) {
  return `<!DOCTYPE html><html lang="${IDIOMA}"><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; margin: 0; }
  body {
    width: 1280px; height: 800px; overflow: hidden;
    display: flex; align-items: center; gap: 64px; padding: 0 80px;
    background: linear-gradient(135deg, #eaf5f3 0%, #f7faf9 55%, #ffffff 100%);
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    color: #16211f;
  }
  .texto { flex: 1; min-width: 0; }
  .rotulo {
    font: 600 15px/1.4 ui-monospace, "Cascadia Code", Consolas, monospace;
    color: #0f7b6c; margin-bottom: 22px; letter-spacing: 0.02em;
  }
  h1 { font-size: 46px; line-height: 1.1; letter-spacing: -0.03em; font-weight: 780; margin-bottom: 24px; }
  h1 em { font-style: normal; color: #0f7b6c; }
  p { font-size: 19px; line-height: 1.6; color: #64756f; max-width: 22em; }
  .marco {
    flex: none; border-radius: 16px; overflow: hidden;
    box-shadow: 0 24px 60px rgba(16,33,31,0.22), 0 3px 10px rgba(16,33,31,0.10);
    border: 1px solid #dbe6e3; background: #fff;
  }
  /* El popup crece con el numero de huecos: en criteriohidalgo, con dos huecos
     y sus avisos, se salia del lienzo y salia cortado por arriba y por abajo.
     Se limita por ALTURA y se deja que el ancho baje solo — una captura
     recortada es peor que una un poco mas pequena. */
  .marco img { display: block; max-width: ${ancho}px; max-height: 700px; width: auto; height: auto; }
  </style></head><body>
  <div class="texto">
    <p class="rotulo">Filtros MX</p>
    <h1>${titulo}</h1>
    <p>${pie}</p>
  </div>
  <div class="marco"><img src="data:image/png;base64,${pngBase64}"></div>
  </body></html>`;
}

// Promocionales. Son OPCIONALES en la ficha, pero sin ellas la extension no
// puede aparecer destacada nunca — y anadirlas despues obliga a volver a tocar
// la ficha publicada. Mismo criterio que el icono y las capturas: por codigo.
//
// Ojo al requisito que la tienda repite en cada campo: 24 bits SIN alfa. Sale
// solo si el lienzo tiene fondo OPACO; con fondo transparente Chrome escribe
// RGBA y la tienda lo rechaza.
function promocional(ancho, alto, iconoB64) {
  // Escalar por ALTURA, no por ancho. Los dos formatos NO son proporcionales
  // (440x280 es 1.57:1 y 1400x560 es 2.5:1): escalando por ancho, la marquesina
  // salia con el icono cortado arriba y el pie cortado abajo. La altura es la
  // dimension que aprieta; el ancho que sobra se reparte en margen.
  const k = alto / 280;
  return `<!DOCTYPE html><html lang="${IDIOMA}"><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; margin: 0; }
  body {
    width: ${ancho}px; height: ${alto}px; overflow: hidden;
    background: linear-gradient(135deg, #0f7b6c 0%, #10695d 55%, #0c5348 100%);
    color: #fff; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    display: flex; flex-direction: column; justify-content: center;
    padding: 0 ${Math.max(34 * k, (ancho - 620 * k) / 2)}px;
  }
  .fila { display: flex; align-items: center; gap: ${16 * k}px; margin-bottom: ${18 * k}px; }
  .fila img { width: ${58 * k}px; height: ${58 * k}px; display: block; border-radius: ${13 * k}px; }
  .fila b { font-size: ${30 * k}px; font-weight: 780; letter-spacing: -0.02em; }
  h1 { font-size: ${23 * k}px; line-height: 1.28; font-weight: 640; letter-spacing: -0.01em; }
  h1 em { font-style: normal; color: #9fe8d8; }
  p { margin-top: ${14 * k}px; font-size: ${13.5 * k}px; color: #bfe6de;
      font-family: ui-monospace, "Cascadia Code", Consolas, monospace; }
  </style></head><body>
    <div class="fila"><img src="data:image/png;base64,${iconoB64}"><b>Filtros MX</b></div>
    ${IDIOMA === 'en'
      ? '<h1>Blocks ads and trackers.<br>And <em>catches the ones that slip through.</em></h1><p>free · open source · no telemetry · made in Mexico</p>'
      : '<h1>Bloquea anuncios y rastreadores.<br>Y <em>atrapa los que se cuelan.</em></h1><p>gratis · código abierto · sin telemetría · hecho en México</p>'}
  </body></html>`;
}

const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'filtros-mx-cap-'));
const chrome = spawn(chromeExe, [
  `--load-extension=${EXTENSION}`,
  `--user-data-dir=${perfil}`,
  `--remote-debugging-port=${PUERTO_CDP}`,
  '--no-first-run', '--no-default-browser-check', '--disable-sync',
  '--hide-scrollbars',
  '--window-size=1280,800',
  `--lang=${IDIOMA}`,
  'about:blank',
], { stdio: 'ignore' });

let salida = 0;
try {
  await esperarCdp();
  await dormir(3000);

  const objetivos = await json('/json/list');
  const sw = objetivos.find((t) => t.url.includes('/src/fondo.js'));
  if (!sw) throw new Error('la extension no cargo');
  const idExt = new URL(sw.url).host;

  const pestExt = await json('/json/new?url=about:blank', 'PUT');
  const cExt = await conectar(pestExt.webSocketDebuggerUrl);
  await cExt.llamar('Page.enable');
  await cExt.llamar('Page.navigate', { url: `chrome-extension://${idExt}/popup/popup.html` });
  let version = null;
  for (let i = 0; i < 20; i++) {
    await dormir(400);
    try { version = await evaluar(cExt, 'chrome?.runtime?.getManifest?.().version ?? null'); if (version) break; } catch {}
  }
  if (!version) throw new Error('el popup no obtuvo contexto de extension');
  console.log('Filtros MX v' + version);

  fs.mkdirSync(SALIDA, { recursive: true });

  // Las escenas exigen navegar a sitios reales y esperar su carga: tres minutos
  // que no hacen falta cuando solo se esta ajustando una promocional.
  async function cargar(url) {
    const pest = await json('/json/new?url=about:blank', 'PUT');
    const cPag = await conectar(pest.webSocketDebuggerUrl);
    await cPag.llamar('Page.enable');
    await cPag.llamar('Page.navigate', { url });
    for (let i = 0; i < 60; i++) {
      await dormir(1000);
      try { const e = await evaluar(cPag, 'document.readyState'); if (e === 'complete' || e === 'interactive') break; } catch {}
    }
    await dormir(2500);
    return { pest, cPag };
  }

  async function componer(esc, pngBase64, ancho) {
    // La imagen SIN lienzo tambien se guarda: el sitio la usa dentro de su
    // propia composicion (7-oct-2026), y meter ahi la de la tienda duplicaria
    // titular sobre titular.
    fs.mkdirSync(path.join(SALIDA, 'crudo'), { recursive: true });
    fs.writeFileSync(path.join(SALIDA, 'crudo', esc.archivo), Buffer.from(pngBase64, 'base64'));
    const txt = esc[IDIOMA];
    const htmlTmp = path.join(perfil, 'lienzo.html');
    fs.writeFileSync(htmlTmp, lienzo(txt.titulo, txt.pie, pngBase64, ancho));
    const pestL = await json('/json/new?url=about:blank', 'PUT');
    const cL = await conectar(pestL.webSocketDebuggerUrl);
    await cL.llamar('Page.enable');
    await cL.llamar('Page.navigate', { url: 'file:///' + htmlTmp.replace(/\\/g, '/') });
    await dormir(2500);
    const final = await cL.llamar('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: 1280, height: 800, scale: 1 },
      captureBeyondViewport: true,
    });
    const destino = path.join(SALIDA, esc.archivo);
    fs.writeFileSync(destino, Buffer.from(final.data, 'base64'));
    console.log('   escrita:', destino);
    cL.cerrar();
    await json(`/json/close/${pestL.id}`).catch(() => {});
  }

  for (const esc of (soloPromo ? [] : ESCENAS)) {
    console.log('\n== escena:', esc.archivo);

    if (esc.tipo === 'popup') {
      // Popup pintado con los datos REALES del detector sobre un sitio real,
      // en el modo de fabrica (Completo).
      let hecho = false;
      for (const url of esc.urls) {
        const host = new URL(url).hostname;
        await evaluar(cExt, `chrome.runtime.sendMessage({ tipo: 'fijarModo', host: ${JSON.stringify(host)}, modo: 'completo' })`);
        const { pest, cPag } = await cargar(url);
        await evaluar(cPag, RECORRER).catch(() => {});
        await dormir(2000);
        const hostCorto = host.replace(/^www\./, '');
        const tabId = await evaluar(cExt,
          `chrome.tabs.query({}).then(ts => (ts.find(t => (t.url||'').includes(${JSON.stringify(hostCorto)})) || {}).id ?? null)`);
        await evaluar(cExt, `chrome.tabs.sendMessage(${tabId}, { tipo: 'reanalizar' })`).catch(() => {});
        await dormir(1500);
        let reporte = null;
        try { reporte = await evaluar(cExt, `chrome.tabs.sendMessage(${tabId}, { tipo: 'huecosDeLaPagina' })`); } catch {}
        console.log(`   ${host}: colados ${reporte?.huecos?.length ?? '?'} | ocultos ${reporte?.ocultos ?? '?'}`);
        if (!reporte || (esc.exigeColados && !reporte.huecos.length)) {
          cPag.cerrar(); await json(`/json/close/${pest.id}`).catch(() => {});
          continue;
        }
        // Al frente y sin transiciones: en una pestana de fondo Chrome congela
        // las transiciones CSS, y la captura salia con el boton del modo a
        // medio colorear — parecia deshabilitado (visto el 7-oct-2026).
        await cExt.llamar('Page.bringToFront');
        await evaluar(cExt, `document.head.insertAdjacentHTML('beforeend', '<style>*{transition:none!important}</style>')`);
        await evaluar(cExt, `(() => {
          pagina = ${JSON.stringify(reporte)};
          estado = { host: ${JSON.stringify(hostCorto)}, modo: 'completo', tabId: ${tabId} };
          pintarEstado(); pintarPagina();
          document.getElementById('recargar').hidden = true;
          return true;
        })()`);
        // El contador de peticiones frenadas se pinta aparte y consulta a
        // Chrome. Sin esto la captura ensena una raya donde hay una cifra real.
        await evaluar(cExt, `pintarRed()`).catch((e) => console.log('   (pintarRed:', e.message + ')'));
        await dormir(900);
        const caja = await evaluar(cExt, `(() => {
          const r = document.body.getBoundingClientRect();
          return { w: Math.ceil(r.width), h: Math.ceil(document.body.scrollHeight) };
        })()`);
        const disparo = await cExt.llamar('Page.captureScreenshot', {
          format: 'png',
          clip: { x: 0, y: 0, width: caja.w, height: caja.h, scale: 2 },
          captureBeyondViewport: true,
        });
        await componer(esc, disparo.data);
        cPag.cerrar(); await json(`/json/close/${pest.id}`).catch(() => {});
        hecho = true;
        break;
      }
      if (!hecho) console.log('   AVISO: ningun sitio de la lista tiene hoy algo colado; escena NO generada. No se inventa.');
      continue;
    }

    if (esc.tipo === 'selector') {
      // "Quitar un elemento" en accion: el selector real, inyectado como lo
      // inyecta el popup, con el objetivo elegido por el mismo clic que haria
      // una persona.
      const url = IDIOMA === 'en' && esc.urlEn ? esc.urlEn : esc.url;
      const { pest, cPag } = await cargar(url);
      // Al frente: una pestana de fondo se capturaba EN BLANCO.
      await cPag.llamar('Page.bringToFront');
      await dormir(1200);
      const hostCorto = new URL(url).hostname;
      const tabId = await evaluar(cExt,
        `chrome.tabs.query({}).then(ts => (ts.find(t => (t.url||'').includes(${JSON.stringify(hostCorto)})) || {}).id ?? null)`);
      await evaluar(cExt, `chrome.scripting.executeScript({ target: { tabId: ${tabId} }, files: ['src/selector.js'] }).then(() => true)`);
      await dormir(600);
      // Sin desplazar si se puede: un objetivo mas alto que la ventana dejaba
      // el clic fuera de el (visto el 7-oct-2026 con la ficha de Wikipedia).
      const p = await evaluar(cPag, `(() => {
        window.scrollTo(0, 0);
        for (const s of ${JSON.stringify(esc.objetivos)}) {
          const e = document.querySelector(s);
          if (!e) continue;
          let r = e.getBoundingClientRect();
          if (r.height < 30 || r.width < 60) continue;
          if (r.top > innerHeight - 120) { e.scrollIntoView({ block: 'start', behavior: 'instant' }); window.scrollBy(0, -140); r = e.getBoundingClientRect(); }
          return { s, x: r.x + r.width / 2, y: r.top + Math.min(r.height / 2, 120) };
        }
        return null;
      })()`);
      console.log('   objetivo:', p && p.s);
      await dormir(600);
      await cPag.llamar('Input.dispatchMouseEvent', { type: 'mouseMoved', x: p.x, y: p.y });
      await cPag.llamar('Input.dispatchMouseEvent', { type: 'mousePressed', x: p.x, y: p.y, button: 'left', clickCount: 1 });
      await cPag.llamar('Input.dispatchMouseEvent', { type: 'mouseReleased', x: p.x, y: p.y, button: 'left', clickCount: 1 });
      await dormir(700);
      // Sin clip: con recorte, esta version de Chrome devolvia la captura EN
      // BLANCO aunque la pagina estuviera pintada (comprobado el 7-oct-2026).
      const disparo = await cPag.llamar('Page.captureScreenshot', { format: 'png' });
      await componer(esc, disparo.data, 700);
      cPag.cerrar(); await json(`/json/close/${pest.id}`).catch(() => {});
      continue;
    }

    if (esc.tipo === 'video') {
      const { pest, cPag } = await cargar(esc.url);
      await cPag.llamar('Page.bringToFront');
      await dormir(9000);
      const anuncio = await evaluar(cPag, `!!document.querySelector('#movie_player.ad-showing')`);
      if (anuncio) {
        // Si sale con anuncio, la captura contradiria su propio pie: no se genera.
        console.log('   AVISO: el video arranco CON anuncio; escena NO generada. Medir con medir-youtube.mjs');
      } else {
        const disparo = await cPag.llamar('Page.captureScreenshot', { format: 'png' });
        await componer(esc, disparo.data, 700);
      }
      cPag.cerrar(); await json(`/json/close/${pest.id}`).catch(() => {});
      continue;
    }

    if (esc.tipo === 'pagina') {
      const { pest, cPag } = await cargar(`chrome-extension://${idExt}/${esc.ruta}`);
      await cPag.llamar('Page.bringToFront');
      await cPag.llamar('Emulation.setDeviceMetricsOverride', { width: 760, height: 1180, deviceScaleFactor: 1, mobile: false });
      await dormir(900);
      const disparo = await cPag.llamar('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 760, height: 1180, scale: 1 } });
      await componer(esc, disparo.data, 470);
      cPag.cerrar(); await json(`/json/close/${pest.id}`).catch(() => {});
    }
  }


  // --- Promocionales ---
  const iconoB64 = fs.readFileSync(path.join(EXTENSION, 'iconos', 'icono-128.png')).toString('base64');
  // promo-og-1200x627 se anadio el 26-ago-2026 MIDIENDO, no suponiendo: el Post
  // Inspector de LinkedIn ensena que la de 1400x560 (2.5:1) se recorta a ~1.91:1
  // y se come la primera palabra de CADA linea — "Bloquea" queda en "quea",
  // "Y te ensena" en "ensena" y el logotipo se parte. 1200x627 ES 1.91:1, que es
  // ademas el tamano canonico de og:image para LinkedIn, Facebook y WhatsApp.
  // La de 1400x560 NO se borra: es el formato de marquesina de la Chrome Web
  // Store, que si lo pide asi.
  // El nombre lleva "og" y no solo la medida por una razon pagada el 26-ago:
  // LinkedIn cachea la imagen POR URL y se habia quedado con una miniatura de
  // 160x83 de la version anterior, con la que dibuja tarjeta compacta en vez de
  // grande. Reingerir exige una URL que no haya visto nunca. Si vuelve a pasar,
  // la salida es renombrar otra vez, no re-inspeccionar.
  for (const [arch, w, h] of [['promo-440x280.png', 440, 280], ['promo-1400x560.png', 1400, 560], ['promo-og-1200x627.png', 1200, 627]]) {
    const tmp = path.join(perfil, arch + '.html');
    fs.writeFileSync(tmp, promocional(w, h, iconoB64));
    const pestP = await json('/json/new?url=about:blank', 'PUT');
    const cP = await conectar(pestP.webSocketDebuggerUrl);
    await cP.llamar('Page.enable');
    // El viewport tiene que medir EXACTAMENTE lo que se va a capturar. La
    // ventana es de 1280 y la marquesina de 1400: capturando "mas alla del
    // viewport", el degradado del fondo se calcula sobre 1280 y aparece un
    // corte vertical a esa altura. Con las metricas forzadas, no.
    await cP.llamar('Emulation.setDeviceMetricsOverride', {
      width: w, height: h, deviceScaleFactor: 1, mobile: false,
    });
    await cP.llamar('Page.navigate', { url: 'file:///' + tmp.replace(/\\/g, '/') });
    await dormir(1800);
    const img = await cP.llamar('Page.captureScreenshot', {
      format: 'png', clip: { x: 0, y: 0, width: w, height: h, scale: 1 }, captureBeyondViewport: true,
    });
    fs.writeFileSync(path.join(SALIDA, arch), Buffer.from(img.data, 'base64'));
    console.log(`   escrita: ${path.join(SALIDA, arch)}`);
    cP.cerrar();
    await json(`/json/close/${pestP.id}`).catch(() => {});
  }

  console.log('\nCapturas en', SALIDA);
  cExt.cerrar();
} catch (e) {
  console.error('FALLO:', e.message);
  salida = 1;
} finally {
  try { chrome.kill(); } catch {}
  await dormir(500);
  try { fs.rmSync(perfil, { recursive: true, force: true }); } catch {}
}
process.exit(salida);
