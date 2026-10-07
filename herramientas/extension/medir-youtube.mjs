#!/usr/bin/env node
// Mide la publicidad de YouTube con la extension puesta (o sin ella).
//
// Por que existe (7-oct-2026): YouTube cambia su reproductor para esquivar los
// scriptlets de uBlock Origin, y la extension los lleva compilados dentro del
// paquete. Ninguna otra medicion del proyecto caduca tan rapido. Se corre
// ANTES DE EMPAQUETAR cada version: si sale con anuncios o con videos que no
// se reproducen, no se publica.
//
// Lo que mide en cada video, durante 20 s con el bloqueo puesto:
//   - si el reproductor entra en modo anuncio (#movie_player.ad-showing)
//   - si la respuesta del video trae anuncios programados (adPlacements…)
//   - si el video SE REPRODUCE: el tiempo avanza sin anuncio. Meter codigo en
//     el reproductor puede romperlo, y un video que no arranca es peor que un
//     anuncio. Es la mitad de la medicion que no se puede saltar.
//   - el aviso anti-bloqueador de YouTube
//
// El servido de anuncios es aleatorio por carga: con pocos videos no se puede
// comparar frecuencias. Por eso son 12.
//
// Uso:  node herramientas/extension/medir-youtube.mjs [carpeta-extension | --sin-extension] [--puerto N]
//       (sin carpeta, mide extension/ tal como esta en el repositorio)

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const SIN = argv.includes('--sin-extension');
const PUERTO = argv.includes('--puerto') ? Number(argv[argv.indexOf('--puerto') + 1]) : 9381;
const EXT = path.resolve(argv.find((a) => !a.startsWith('--') && !/^\d+$/.test(a)) || path.join(HERE, '..', '..', 'extension'));
const SALIDA = path.join(HERE, 'cache', 'youtube');
fs.mkdirSync(SALIDA, { recursive: true });
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

function buscarChrome() {
  if (process.env.CHROME_PRUEBAS && fs.existsSync(process.env.CHROME_PRUEBAS)) return process.env.CHROME_PRUEBAS;
  const base = path.join(os.homedir(), '.cache', 'puppeteer', 'chrome');
  if (!fs.existsSync(base)) return null;
  for (const v of fs.readdirSync(base).sort().reverse()) {
    for (const c of ['chrome-win64', 'chrome-linux64', 'chrome-mac-x64']) {
      const exe = path.join(base, v, c, process.platform === 'win32' ? 'chrome.exe' : 'chrome');
      if (fs.existsSync(exe)) return exe;
    }
  }
  return null;
}
const CHROME = buscarChrome();
if (!CHROME) { console.error('No encuentro Chrome for Testing: npx @puppeteer/browsers install chrome@stable'); process.exit(2); }

async function json(ruta, m = 'GET') { return (await fetch(`http://localhost:${PUERTO}${ruta}`, { method: m })).json(); }
function conectar(u) {
  return new Promise((ok, mal) => {
    const ws = new WebSocket(u); let n = 1; const p = new Map();
    ws.onopen = () => ok({ llamar(m, a = {}) { return new Promise((r, j) => { const id = n++; p.set(id, { r, j }); ws.send(JSON.stringify({ id, method: m, params: a })); }); }, cerrar() { try { ws.close(); } catch {} } });
    ws.onerror = () => mal(new Error('ws'));
    ws.onmessage = (e) => { const d = JSON.parse(e.data); if (d.id && p.has(d.id)) { const { r, j } = p.get(d.id); p.delete(d.id); d.error ? j(new Error(d.error.message)) : r(d.result); } };
  });
}
async function ev(c, x) { const r = await c.llamar('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.text); return r.result.value; }

// Videos musicales muy vistos: son los que con mas seguridad llevan anuncio.
const VIDEOS = ['kJQP7kiw5Fk', 'JGwWNGJdvx8', 'dQw4w9WgXcQ', '9bZkp7q19f0', 'OPf0YbXqDm0', 'RgKAFK5djSk',
  'fJ9rUzIMcZQ', 'hT_nvWreIhg', '60ItHLz5WEA', 'CevxZvSJLk8', 'pRpeEdMmmQ0', '2Vv-BfVoq4g']
  .map((v) => 'https://www.youtube.com/watch?v=' + v);
const BUSQUEDA = 'https://www.youtube.com/results?search_query=celulares+baratos';
const ETIQUETA = SIN ? 'sin-extension' : 'con-extension';

const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'fmx-yt-'));
const args = [`--user-data-dir=${perfil}`, `--remote-debugging-port=${PUERTO}`, '--no-first-run', '--no-default-browser-check',
  '--autoplay-policy=no-user-gesture-required', '--mute-audio', '--window-size=1280,900', '--lang=es-419', 'about:blank'];
if (!SIN) args.unshift(`--load-extension=${EXT}`, `--disable-extensions-except=${EXT}`);
const ch = spawn(CHROME, args, { stdio: 'ignore' });

const SONDA = `(() => {
  const mp = document.querySelector('#movie_player');
  const r = window.ytInitialPlayerResponse || {};
  return {
    anuncio: !!(mp && mp.classList.contains('ad-showing')),
    adPlacements: (r.adPlacements || []).length,
    playerAds: (r.playerAds || []).length,
    muro: !!document.querySelector('ytd-enforcement-message-view-model'),
    enPagina: [...document.querySelectorAll('ytd-ad-slot-renderer, ytd-in-feed-ad-layout-renderer, ytd-promoted-sparkles-web-renderer, ytd-display-ad-renderer, #player-ads > *, ytd-companion-slot-renderer, ytd-action-companion-ad-renderer')].filter(e => e.getBoundingClientRect().height > 0).length,
    titulo: document.title.slice(0, 40),
    t: (document.querySelector('#movie_player video') || {}).currentTime || 0,
    error: !!document.querySelector('.ytp-error, ytd-player-error-message-renderer'),
  };
})()`;

let codigo = 0;
const resumen = [];
try {
  for (let i = 0; i < 60; i++) { try { await json('/json/version'); break; } catch { await dormir(500); } }
  await dormir(3000);
  console.log(SIN ? '== SIN EXTENSION' : `== CON FILTROS MX (${path.relative(process.cwd(), EXT) || EXT})`);
  let anunciosBusqueda = 0;
  for (const url of [...VIDEOS, BUSQUEDA]) {
    const t = await json('/json/new?about:blank', 'PUT');
    const c = await conectar(t.webSocketDebuggerUrl);
    await c.llamar('Page.enable');
    // Al frente: en una pestana de fondo Chrome no reproduce video.
    await c.llamar('Page.bringToFront');
    await c.llamar('Page.navigate', { url });
    await dormir(6000);
    const muestras = [];
    for (let s = 0; s < (url === BUSQUEDA ? 4 : 20); s++) {
      try { muestras.push(await ev(c, SONDA)); } catch {}
      await dormir(1000);
    }
    const max = (k) => Math.max(0, ...muestras.map((m) => m[k]));
    if (url === BUSQUEDA) {
      anunciosBusqueda = max('enPagina');
    } else {
      let avanza = 0;
      for (let i = 1; i < muestras.length; i++) {
        if (!muestras[i].anuncio && !muestras[i - 1].anuncio && muestras[i].t > muestras[i - 1].t) avanza++;
      }
      const r = {
        video: url.slice(-11),
        titulo: muestras.at(-1)?.titulo,
        anuncio: muestras.some((m) => m.anuncio),
        anunciosProgramados: max('adPlacements') + max('playerAds'),
        reproduce: avanza >= 3,
        error: muestras.some((m) => m.error),
        muro: muestras.some((m) => m.muro),
        anunciosEnPagina: max('enPagina'),
      };
      resumen.push(r);
      console.log(`  ${r.video}  ${r.anuncio ? 'CON ANUNCIO' : 'sin anuncio'}  ${r.reproduce ? 'se reproduce' : 'NO SE REPRODUCE'}` +
        `${r.error ? '  ERROR' : ''}${r.muro ? '  MURO' : ''}  programados=${r.anunciosProgramados}  «${r.titulo}»`);
      const img = await c.llamar('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(SALIDA, `${ETIQUETA}-${r.video}.png`), Buffer.from(img.data, 'base64'));
    }
    c.cerrar(); await json(`/json/close/${t.id}`).catch(() => {});
  }
  const cuenta = (k) => resumen.filter((r) => r[k]).length;
  console.log(`\nRESUMEN ${ETIQUETA}: ${resumen.length} videos | con anuncio ${cuenta('anuncio')} | se reproducen ${cuenta('reproduce')}` +
    ` | error ${cuenta('error')} | muro ${cuenta('muro')} | anuncios en la busqueda ${anunciosBusqueda}`);
  fs.writeFileSync(path.join(SALIDA, `${ETIQUETA}.json`), JSON.stringify({ fecha: new Date().toISOString(), anunciosBusqueda, videos: resumen }, null, 1));
  // Criterio para publicar, fijado ANTES de medir: con la extension, ningun
  // video con anuncio y todos reproduciendose.
  if (!SIN && (cuenta('anuncio') > 0 || cuenta('reproduce') < resumen.length || cuenta('muro') > 0)) {
    console.log('\nNO PUBLICAR: YouTube esquiva o rompe las reglas actuales. Recompilar con listas nuevas y volver a medir.');
    codigo = 3;
  }
} catch (e) { console.error('FALLO', e.message); codigo = 1; }
finally { try { ch.kill(); } catch {} await dormir(600); try { fs.rmSync(perfil, { recursive: true, force: true }); } catch {} }
process.exit(codigo);
