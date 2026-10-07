#!/usr/bin/env node
// Prueba de punta a punta del boton "Ocultar aqui", SIN manos humanas.
//
// Existe porque el 12-ago-2026 la verificacion manual se volvio un laberinto:
// el popup y el icono viven en la barra del navegador, donde ninguna
// automatizacion de pagina llega, y depurar a traves de capturas de pantalla
// de una persona confunde a la persona. Este arnes usa Chrome for Testing
// (firmado por Google — la politica de la maquina bloquea binarios sin firma,
// como el Chromium de Playwright) y habla CDP a pelo con el WebSocket nativo
// de Node 21+.
//
// Que verifica, en orden:
//   1. La extension carga y su version es la esperada.
//   2. agregarReglaLocal via mensaje (el mismo camino del boton) guarda en
//      chrome.storage.local.
//   3. Al recargar la pagina, fondo.js INYECTA la regla local: la caja queda
//      display:none y el contenido editorial sobrevive.
//   4. quitarReglaLocal la deshace: la caja vuelve.
//
// Uso:  node herramientas/extension/probar-ocultar-aqui.mjs <ruta-chrome.exe>

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const EXTENSION = path.join(HERE, '..', '..', 'extension');
const PAGINA = path.join(HERE, 'pagina-prueba', 'index.html');
const PUERTO_WEB = 8124;
const PUERTO_CDP = 9333;

const chromeExe = process.argv[2];
if (!chromeExe || !fs.existsSync(chromeExe)) {
  console.error('Uso: node probar-ocultar-aqui.mjs <ruta a chrome.exe (Chrome for Testing)>');
  process.exit(2);
}

// --- Servidor de la pagina de prueba ---------------------------------------
const servidor = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(fs.readFileSync(PAGINA));
}).listen(PUERTO_WEB);

// --- Chrome for Testing con la extension cargada ---------------------------
const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'filtros-mx-cft-'));
const chrome = spawn(chromeExe, [
  `--load-extension=${EXTENSION}`,
  `--user-data-dir=${perfil}`,
  `--remote-debugging-port=${PUERTO_CDP}`,
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-sync',
  '--window-size=1280,900',
  `http://localhost:${PUERTO_WEB}/`,
], { stdio: 'ignore' });

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

async function json(ruta, metodo = 'GET') {
  const r = await fetch(`http://localhost:${PUERTO_CDP}${ruta}`, { method: metodo });
  return r.json();
}

// Espera a que el puerto CDP responda.
async function esperarCdp() {
  for (let i = 0; i < 60; i++) {
    try { return await json('/json/version'); } catch { await dormir(500); }
  }
  throw new Error('CDP nunca respondio');
}

// --- Cliente CDP minimo sobre el WebSocket nativo --------------------------
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

const MEDIR = `(() => {
  const caja = document.querySelector('.caja-patrocinada');
  const gpt = document.querySelector('#div-gpt-ad-prueba');
  return {
    caja: caja ? getComputedStyle(caja).display : 'NO EXISTE',
    gpt: gpt ? getComputedStyle(gpt).display : 'NO EXISTE',
    titulares: document.querySelectorAll('h2').length,
    enlace: !!document.querySelector('article a'),
  };
})()`;

let salida = 0;
try {
  await esperarCdp();
  await dormir(2500); // que la extension termine de indexar reglas

  // -- Localizar el service worker de la extension para conocer su ID --
  const objetivos = await json('/json/list');
  const sw = objetivos.find((t) => t.url.includes('/src/fondo.js'));
  if (!sw) throw new Error('No aparece el service worker de la extension. ¿Cargo? Objetivos: ' + objetivos.map((t) => t.url).join(' | '));
  const idExt = new URL(sw.url).host;
  console.log('extension cargada, id:', idExt);

  // -- Abrir el popup COMO PESTANA: contexto de extension con chrome.* --
  // /json/new puede dejar la pestana en about:blank si el destino es
  // chrome-extension:// — se navega despues, via CDP, que si puede.
  const popup = await json(`/json/new?url=about:blank`, 'PUT');
  const cPopup = await conectar(popup.webSocketDebuggerUrl);
  await cPopup.llamar('Page.enable');
  await cPopup.llamar('Page.navigate', { url: `chrome-extension://${idExt}/popup/popup.html` });

  // Esperar a que el contexto sea de verdad el de la extension.
  let version = null;
  for (let i = 0; i < 20; i++) {
    await dormir(400);
    try {
      version = await evaluar(cPopup, 'chrome?.runtime?.getManifest?.().version ?? null');
      if (version) break;
    } catch {}
  }
  if (!version) throw new Error('la pestana del popup nunca obtuvo contexto de extension');
  console.log('version del manifiesto:', version);

  // -- Paso 2: el guardado, por el MISMO mensaje que manda el boton --
  const respuesta = await evaluar(cPopup,
    `chrome.runtime.sendMessage({ tipo: 'agregarReglaLocal', host: 'localhost', selector: '.caja-patrocinada' })`);
  console.log('respuesta de agregarReglaLocal:', JSON.stringify(respuesta));

  const almacen = await evaluar(cPopup, `chrome.storage.local.get('locales')`);
  console.log('almacen tras guardar:', JSON.stringify(almacen));
  const guardada = !!(almacen.locales && almacen.locales.localhost &&
    almacen.locales.localhost.includes('.caja-patrocinada'));
  console.log(guardada ? 'GUARDADO: OK' : 'GUARDADO: FALLO');

  // -- Paso 3: recargar la pagina y medir la inyeccion --
  const pag = (await json('/json/list')).find((t) => t.url.startsWith(`http://localhost:${PUERTO_WEB}`));
  if (!pag) throw new Error('No encuentro la pestana de la pagina de prueba');
  const cPag = await conectar(pag.webSocketDebuggerUrl);
  await cPag.llamar('Page.enable');
  await cPag.llamar('Page.reload', { ignoreCache: true });
  await dormir(2000);

  const conRegla = await evaluar(cPag, MEDIR);
  console.log('con la regla local:', JSON.stringify(conRegla));
  const oculta = conRegla.caja === 'none' && conRegla.titulares === 2 && conRegla.enlace;
  console.log(oculta ? 'INYECCION: OK (caja oculta, editorial intacto)' : 'INYECCION: FALLO');

  // -- Paso 4: deshacer y comprobar que vuelve --
  await evaluar(cPopup,
    `chrome.runtime.sendMessage({ tipo: 'quitarReglaLocal', host: 'localhost', selector: '.caja-patrocinada' })`);
  await cPag.llamar('Page.reload', { ignoreCache: true });
  await dormir(2000);
  const sinRegla = await evaluar(cPag, MEDIR);
  console.log('tras deshacer:', JSON.stringify(sinRegla));
  const vuelve = sinRegla.caja === 'block';
  console.log(vuelve ? 'DESHACER: OK (la caja vuelve)' : 'DESHACER: FALLO');

  console.log('\n=== VEREDICTO ===');
  if (guardada && oculta && vuelve) {
    console.log('El ciclo completo de "Ocultar aqui" FUNCIONA de punta a punta.');
  } else {
    console.log('HAY DEFECTO: guardado=' + guardada + ' inyeccion=' + oculta + ' deshacer=' + vuelve);
    salida = 1;
  }
  cPopup.cerrar();
  cPag.cerrar();
} catch (e) {
  console.error('ARNES FALLO:', e.message);
  salida = 1;
} finally {
  try { chrome.kill(); } catch {}
  servidor.close();
  await dormir(500);
  try { fs.rmSync(perfil, { recursive: true, force: true }); } catch {}
}
process.exit(salida);
