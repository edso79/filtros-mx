#!/usr/bin/env node
// Prueba de los grupos de listas (1.2.0): el mismo sitio con un grupo APAGADO y
// ENCENDIDO, en el mismo navegador y uno detras de otro.
//
// Mide lo que decide si un grupo se puede publicar:
//   - que conjuntos DNR encendio la extension sola segun el idioma (--lang)
//   - peticiones frenadas POR CONJUNTO, descontando las excepciones
//   - elementos ocultos (lo cuenta el content script de la extension)
//   - contenido vivo: titulares, enlaces, imagenes y texto. Si encender el
//     grupo baja estas cifras, el grupo se esta llevando el sitio por delante
//   - avisos de cookies visibles y SI LA PAGINA SE DESPLAZA. Es el modo de fallo
//     conocido de ocultar avisos: el aviso desaparece y el sitio deja puesto el
//     overflow:hidden con el que lo bloqueaba, y la pagina queda congelada
//
// Uso:
//   node probar-listas.mjs --extension <dir> [--lang pt-BR] --comparar <grupo> <url> [url...]
//   node probar-listas.mjs --extension <dir> [--lang es-MX]            (solo dice que conjuntos enciende)
//
// <dir> es el ZIP descomprimido: se prueba lo que se sube, no lo que se edita.

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';

const argv = process.argv.slice(2);
let EXT = null, LANG = 'es-MX', GRUPO = null, PUERTO = 9361;
const urls = [];
const auditar = [];
let capturaOpciones = null;
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--extension') EXT = path.resolve(argv[++i]);
  else if (argv[i] === '--lang') LANG = argv[++i];
  else if (argv[i] === '--comparar') GRUPO = argv[++i];
  else if (argv[i] === '--puerto') PUERTO = Number(argv[++i]);
  // --auditar <css>: que hay DENTRO de lo que casa (titulares, enlaces y su destino).
  else if (argv[i] === '--auditar') auditar.push(argv[++i]);
  // --captura-opciones <png>: la pagina de opciones tal como la ve la persona.
  else if (argv[i] === '--captura-opciones') capturaOpciones = path.resolve(argv[++i]);
  else urls.push(argv[i]);
}
if (!EXT || !fs.existsSync(path.join(EXT, 'manifest.json'))) {
  console.error('Falta --extension <dir con manifest.json>');
  process.exit(2);
}

function buscarChrome() {
  if (process.env.CHROME_PRUEBAS && fs.existsSync(process.env.CHROME_PRUEBAS)) return process.env.CHROME_PRUEBAS;
  const base = path.join(os.homedir(), '.cache', 'puppeteer', 'chrome');
  for (const v of fs.existsSync(base) ? fs.readdirSync(base).sort().reverse() : []) {
    const exe = path.join(base, v, 'chrome-win64', 'chrome.exe');
    if (fs.existsSync(exe)) return exe;
  }
  return null;
}

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));
const json = async (ruta, metodo = 'GET') => (await fetch(`http://localhost:${PUERTO}${ruta}`, { method: metodo })).json();

function conectar(wsUrl) {
  return new Promise((resolver, rechazar) => {
    const ws = new WebSocket(wsUrl);
    let n = 1;
    const pend = new Map();
    ws.onopen = () => resolver({
      llamar: (method, params = {}) => new Promise((res, rej) => {
        const id = n++; pend.set(id, { res, rej });
        ws.send(JSON.stringify({ id, method, params }));
      }),
      cerrar: () => { try { ws.close(); } catch {} },
    });
    ws.onerror = () => rechazar(new Error('WebSocket'));
    ws.onmessage = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id && pend.has(m.id)) {
        const { res, rej } = pend.get(m.id); pend.delete(m.id);
        m.error ? rej(new Error(m.error.message)) : res(m.result);
      }
    };
  });
}

async function evaluar(c, expression) {
  const r = await c.llamar('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
}

const RECORRER = `(async () => {
  for (let y = 0; y < Math.min(document.body.scrollHeight, 8000); y += 700) {
    window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 500));
  }
  window.scrollTo(0, 0); await new Promise((r) => setTimeout(r, 600));
})()`;

// Selectores de las plataformas de consentimiento mas comunes, mas formas
// genericas. Solo sirven para CONTAR avisos visibles; no son las reglas.
const MEDIR = `(async () => {
  const visible = (e) => {
    const cs = getComputedStyle(e); const r = e.getBoundingClientRect();
    return cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0' && r.width > 0 && r.height > 0;
  };
  const CMP = '#onetrust-banner-sdk,#CybotCookiebotDialog,.fc-consent-root,#didomi-popup,#didomi-notice,[id^="sp_message_container"],#usercentrics-root,#qc-cmp2-container,.cc-window,#cookie-banner,#cookie-notice,#cookie-law-info-bar,#cmplz-cookiebanner-container,.cky-consent-container,#moove_gdpr_cookie_info_bar,[class*="cookie-banner"],[id*="cookie-banner"],[class*="cookie-consent"],[id*="cookie-consent"],[class*="consent-banner"],[class*="cookieBanner"],[class*="CookieBanner"],[id*="cookiebanner"]';
  const avisos = [...document.querySelectorAll(CMP)].filter(visible)
    .filter((e) => !e.parentElement || !e.parentElement.closest(CMP))
    .map((e) => (e.id ? '#' + e.id : '.' + String(e.className).trim().split(/\\s+/)[0]).slice(0, 50));
  const ov = (e) => { const cs = getComputedStyle(e); return cs.overflowY === 'hidden' || cs.overflow === 'hidden'; };
  const y0 = window.scrollY;
  window.scrollTo(0, 1500);
  await new Promise((r) => setTimeout(r, 300));
  const alcanzado = window.scrollY;
  window.scrollTo(0, y0);
  const largo = document.documentElement.scrollHeight > window.innerHeight + 200;
  return {
    titulares: [...document.querySelectorAll('h1,h2,h3,h4')].filter(visible).length,
    enlaces: [...document.querySelectorAll('a[href]')].filter(visible).length,
    imagenes: [...document.querySelectorAll('img')].filter(visible).length,
    texto: (document.body.innerText || '').replace(/\\s+/g, ' ').trim().length,
    avisos,
    // Se desplaza = la pagina es mas larga que la ventana Y scrollTo la movio.
    desplaza: !largo ? 'corta' : (alcanzado > 100 ? 'si' : 'NO'),
    overflowOculto: ov(document.documentElement) || ov(document.body),
  };
})()`;

const AUDITAR = (sels) => `(() => ${JSON.stringify(sels)}.map((sel) => {
  const els = [...document.querySelectorAll(sel)];
  return { sel, casan: els.length, muestra: els.slice(0, 3).map((e) => ({
    h: [...e.querySelectorAll('h1,h2,h3,h4')].length,
    a: [...new Set([...e.querySelectorAll('a[href]')].map((a) => { try { return new URL(a.href).hostname; } catch { return '?'; } }))].slice(0, 4),
    texto: (e.innerText || '').replace(/\\s+/g, ' ').trim().slice(0, 90),
  })) };
}))()`;

const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'fmx-listas-'));
const chrome = spawn(buscarChrome(), [
  `--user-data-dir=${perfil}`, `--remote-debugging-port=${PUERTO}`, `--lang=${LANG}`,
  `--load-extension=${EXT}`, '--enable-logging=stderr', '--no-first-run', '--no-default-browser-check', '--disable-sync',
  '--window-size=1280,900', 'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'], env: { ...process.env, LANG: LANG.replace('-', '_') + '.UTF-8' } });

// Si Chrome rechaza la extension, el unico rastro es su registro: sin esto el
// arnes solo decia "fetch failed" (23-oct-2026, red-zh.json con una regla
// invalida que tumbaba la carga entera).
const erroresCarga = [];
chrome.stderr.on('data', (d) => {
  for (const l of String(d).split(/\r?\n/)) if (/Extension error/.test(l)) erroresCarga.push(l.replace(/^.*Extension error: /, ''));
});

let codigo = 0;
try {
  for (let i = 0; i < 60; i++) { try { await json('/json/version'); break; } catch { await dormir(500); } }
  await dormir(3500);
  const sw = (await json('/json/list')).find((t) => t.url.includes('/src/fondo.js'));
  if (!sw) throw new Error('no aparece el service worker de la extension' + (erroresCarga.length ? ': ' + erroresCarga.join(' | ') : ''));
  const idExt = new URL(sw.url).host;
  const pe = await json('/json/new?url=about:blank', 'PUT');
  const cExt = await conectar(pe.webSocketDebuggerUrl);
  await cExt.llamar('Page.enable');
  await cExt.llamar('Page.navigate', { url: `chrome-extension://${idExt}/opciones/opciones.html` });
  let version = null;
  for (let i = 0; i < 20 && !version; i++) {
    await dormir(400);
    version = await evaluar(cExt, 'chrome?.runtime?.getManifest?.().version ?? null').catch(() => null);
  }
  const ui = await evaluar(cExt, 'chrome.i18n.getUILanguage()');
  const conjuntos = await evaluar(cExt, 'chrome.declarativeNetRequest.getEnabledRulesets()');
  const titulo = await evaluar(cExt, `chrome.i18n.getMessage('oListas') + ' / ' + chrome.i18n.getMessage('modoCompleto')`);
  console.log(`Filtros MX v${version} · idioma de Chrome ${ui} · conjuntos encendidos: ${JSON.stringify(conjuntos)} · textos: ${titulo}`);

  if (capturaOpciones) {
    await cExt.llamar('Page.bringToFront');
    await cExt.llamar('Emulation.setDeviceMetricsOverride', { width: 760, height: 1500, deviceScaleFactor: 1, mobile: false });
    await cExt.llamar('Page.reload');
    await dormir(1500);
    const { data } = await cExt.llamar('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(capturaOpciones, Buffer.from(data, 'base64'));
    console.log('captura de opciones: ' + capturaOpciones);
  }
  const meta = JSON.parse(fs.readFileSync(path.join(EXT, 'reglas', 'meta.json'), 'utf8'));
  const permisos = { principal: meta.reglasPermiso };
  for (const g of meta.grupos || []) permisos[g.id] = g.reglasPermiso;

  const filas = [];
  for (const url of urls) {
    for (const valor of GRUPO ? [false, true] : [null]) {
      if (GRUPO) {
        await evaluar(cExt, `chrome.runtime.sendMessage({ tipo: 'fijarGrupo', id: ${JSON.stringify(GRUPO)}, valor: ${valor} })`);
        await dormir(800);
      }
      const fila = { url, [GRUPO || 'base']: valor };
      try {
        const p = await json('/json/new?url=about:blank', 'PUT');
        const c = await conectar(p.webSocketDebuggerUrl);
        await c.llamar('Page.enable');
        await c.llamar('Page.navigate', { url });
        for (let i = 0; i < 40; i++) {
          await dormir(1000);
          const rs = await evaluar(c, 'document.readyState').catch(() => '');
          if (rs === 'complete') break;
        }
        await dormir(3000);
        await evaluar(c, RECORRER).catch(() => {});
        await dormir(2000);
        Object.assign(fila, await evaluar(c, MEDIR));
        if (auditar.length) fila.auditoria = await evaluar(c, AUDITAR(auditar));
        const host = new URL(url).hostname.replace(/^www\./, '');
        const tabId = await evaluar(cExt,
          `chrome.tabs.query({}).then(ts => (ts.find(t => (t.url || '').includes(${JSON.stringify(host)})) || {}).id ?? null)`);
        if (tabId != null) {
          fila.frenadas = await evaluar(cExt, `chrome.declarativeNetRequest.getMatchedRules({ tabId: ${tabId} }).then(r => {
            const p = ${JSON.stringify(permisos)}; const o = {};
            for (const m of r.rulesMatchedInfo) {
              const id = m.rule.rulesetId;
              if (p[id] !== undefined && m.rule.ruleId > p[id]) o[id] = (o[id] || 0) + 1;
            }
            return o;
          })`);
          const rep = await evaluar(cExt, `chrome.tabs.sendMessage(${tabId}, { tipo: 'huecosDeLaPagina' }).catch(() => null)`);
          fila.ocultos = rep?.ocultos ?? null;
        }
        await json(`/json/close/${p.id}`).catch(() => {});
        c.cerrar();
      } catch (e) {
        fila.error = e.message;
        codigo = 1;
      }
      filas.push(fila);
      for (const a of fila.auditoria || []) if (a.casan) console.log('      ' + a.sel + ' casa ' + a.casan + ' ' + JSON.stringify(a.muestra));
      const fr = fila.frenadas ? Object.entries(fila.frenadas).map(([k, v]) => `${k}:${v}`).join(' ') : '-';
      console.log(`${(GRUPO ? (valor ? 'ON ' : 'off') : '   ')} ${url.padEnd(38)} frenadas[${fr}] ocultos ${fila.ocultos ?? '-'} · h${fila.titulares} a${fila.enlaces} i${fila.imagenes} t${fila.texto} · avisos ${fila.avisos?.length ?? '-'}${fila.avisos?.length ? ' ' + fila.avisos.join(' ') : ''} · desplaza ${fila.desplaza}${fila.overflowOculto ? ' (overflow oculto)' : ''}${fila.error ? ' · ERROR ' + fila.error : ''}`);
    }
  }
  const salida = path.join(os.tmpdir(), `fmx-listas-${GRUPO || 'base'}-${LANG}.json`);
  fs.writeFileSync(salida, JSON.stringify({ version, ui, conjuntos, filas }, null, 2));
  console.log('\nJSON: ' + salida);
} catch (e) {
  console.error('FALLO:', e.message);
  for (const l of erroresCarga) console.error('   Chrome: ' + l);
  codigo = 1;
} finally {
  chrome.kill();
  await dormir(800);
  try { fs.rmSync(perfil, { recursive: true, force: true }); } catch {}
}
process.exit(codigo);
