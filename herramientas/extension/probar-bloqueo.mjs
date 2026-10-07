#!/usr/bin/env node
// Prueba de extremo a extremo: ¿la extension BLOQUEA de verdad?
//
// El modo de fallo que esta prueba existe para atrapar: Chrome valida el
// conjunto de reglas al cargar y, si algo no le cuadra, lo rechaza ENTERO y
// falla EN SILENCIO. La extension queda instalada, con su icono y su popup, sin
// bloquear una sola peticion. Nadie se entera.
//
// METODO. La verdad de campo es un servidor local que registra que peticiones
// LLEGAN. Si declarativeNetRequest bloqueo la peticion, el servidor nunca la ve.
// No depende de ninguna API de Chrome, asi que no puede mentir a favor.
//
// El truco que lo hace posible sin salir a internet: --host-resolver-rules
// mapea TODOS los dominios a nuestro servidor. El navegador pide
// http://doubleclick.net/ads.js de verdad —y las reglas se evaluan sobre esa
// URL de verdad— pero quien contesta es el servidor local. Determinista y sin
// depender de que un tercero este arriba.
//
// Uso:  node herramientas/extension/probar-bloqueo.mjs

import { spawn, spawnSync } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const EXT = path.join(HERE, '..', '..', 'extension');
const REGLAS = path.join(EXT, 'reglas', 'red.json');
const PUERTO = 39621;
const PUERTO_DEPURACION = 39622;

// ¿El navegador cargo de verdad la extension? Se le pregunta por el protocolo
// de depuracion: si la cargo, aparece un objetivo con URL chrome-extension://.
//
// Hace falta porque Chrome de marca 137+ acepta --load-extension SIN error y
// carga cero extensiones (hallazgo 1 del proyecto, verificado en Chrome 150).
// Sin esta comprobacion la prueba diria "no bloqueo nada" y se leeria como un
// defecto del conjunto de reglas, cuando el conjunto ni siquiera se cargo.
// Abre una pestana por el protocolo de depuracion, sin dependencias: el
// endpoint /json/new acepta PUT en Chrome moderno y GET en versiones viejas.
async function abrirPestana(url) {
  for (const metodo of ['PUT', 'GET']) {
    try {
      const r = await fetch(
        `http://127.0.0.1:${PUERTO_DEPURACION}/json/new?${encodeURIComponent(url)}`,
        { method: metodo }
      );
      if (r.ok) return true;
    } catch {}
  }
  return false;
}

// OJO: no vale con buscar cualquier objetivo chrome-extension://. Chrome trae
// extensiones de componente propias —sintesis de voz, tienda— que aparecen
// siempre. Comprobado el 3-ago-2026: buscar el prefijo daba "cargada: si" con
// la nuestra ausente, y eso convertia una limitacion del entorno en un falso
// defecto del conjunto de reglas.
//
// Se identifica por SU service worker, que es src/fondo.js.
async function extensionCargada() {
  try {
    const r = await fetch(`http://127.0.0.1:${PUERTO_DEPURACION}/json/list`);
    const objetivos = await r.json();
    return objetivos.some((o) => String(o.url || '').endsWith('/src/fondo.js'));
  } catch {
    return null; // no se pudo preguntar
  }
}

// Chrome de marca 137+ NO carga extensiones por linea de comandos: verificado en
// Chrome 150 el 29-jul-2026, el flag llega y se cargan cero extensiones. Solo
// sirven compilaciones sin marca. Ver herramientas/poc-arnes/README.md.
//
// Se puede forzar otro binario con --navegador=RUTA.
function buscarChromium() {
  const forzado = process.argv.find((a) => a.startsWith('--navegador='));
  if (forzado) return forzado.slice('--navegador='.length);

  const base = path.join(process.env.LOCALAPPDATA || '', 'ms-playwright');
  if (fs.existsSync(base)) {
    for (const dir of fs.readdirSync(base)) {
      if (!dir.startsWith('chromium-')) continue;
      for (const sub of ['chrome-win64', 'chrome-win']) {
        const exe = path.join(base, dir, sub, 'chrome.exe');
        if (fs.existsSync(exe) && sePuedeEjecutar(exe)) return exe;
      }
    }
  }
  // Ultimo recurso: el Chrome de marca. Puede no cargar la extension —es el
  // hallazgo 1 del proyecto— pero al menos la prueba dice por que fallo en vez
  // de reventar con "spawn UNKNOWN".
  for (const p of [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ]) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

// En equipos gestionados la politica puede prohibir ejecutar un binario intacto
// (hallazgo 3 del proyecto: el Chromium de ms-playwright da "Permission denied"
// mientras el Chrome firmado de Program Files si corre).
//
// Se comprueba ARRANCANDOLO, no con fs.access: en Windows el permiso de
// ejecucion de POSIX no significa nada y accessSync(X_OK) devuelve true para
// cualquier archivo que exista. Comprobado el 3-ago-2026 — daba por bueno un
// binario que la politica rechazaba.
function sePuedeEjecutar(exe) {
  const r = spawnSync(exe, ['--version'], { timeout: 15000 });
  return !r.error;
}

// --- Que dominios de anuncio cubre REALMENTE nuestro conjunto ---
// Se comprueba antes de probar, para no afirmar un bloqueo que la lista nunca
// prometio. Si el candidato no esta en las reglas, no entra en la prueba.
const CANDIDATOS_ANUNCIO = [
  'doubleclick.net', 'googlesyndication.com', 'adnxs.com', 'criteo.com',
  'taboola.com', 'outbrain.com', 'amazon-adsystem.com', 'pubmatic.com',
  'rubiconproject.com', 'openx.net', 'scorecardresearch.com', 'moatads.com',
];

// No deben bloquearse jamas: si caen, la extension esta rompiendo sitios.
const CONTENIDO = ['noticias-de-prueba.mx', 'cdn-estatico-prueba.mx'];

const reglas = JSON.parse(fs.readFileSync(REGLAS, 'utf8'));
const dominiosCubiertos = new Set();
for (const r of reglas) {
  if (r.action.type !== 'block') continue;
  for (const d of r.condition.requestDomains || []) dominiosCubiertos.add(d);
}
const ANUNCIOS = CANDIDATOS_ANUNCIO.filter((d) => dominiosCubiertos.has(d));

if (!ANUNCIOS.length) {
  console.error('Ninguno de los dominios candidatos esta en el conjunto de reglas.');
  console.error('O el compilador fallo, o los candidatos ya no aparecen en EasyList.');
  process.exit(2);
}

// --- Servidor: la verdad de campo ---
let llegadas = [];
const servidor = http.createServer((req, res) => {
  const host = (req.headers.host || '').split(':')[0];
  llegadas.push(host + req.url);

  if (req.url === '/') {
    const etiquetas = [
      ...ANUNCIOS.map((d) => `<script src="http://${d}/tags/ads.js"></script>`),
      ...CONTENIDO.map((d) => `<script src="http://${d}/articulo/app.js"></script>`),
    ].join('\n');
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(`<!doctype html><meta charset="utf-8"><title>prueba</title>\n${etiquetas}\n<p>listo</p>`);
  } else {
    res.writeHead(200, { 'content-type': 'application/javascript' });
    res.end('/* ok */');
  }
});
await new Promise((r) => servidor.listen(PUERTO, '127.0.0.1', r));

// --- Una corrida ---
async function correr(nombre, conExtension) {
  llegadas = [];
  const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'filtrosmx-'));

  const args = [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-background-networking',
    `--user-data-dir=${perfil}`,
    // Todo dominio cae en nuestro servidor. Las reglas siguen viendo la URL real.
    `--host-resolver-rules=MAP * 127.0.0.1:${PUERTO}`,
    // Para poder PREGUNTARLE al navegador si cargo la extension. Sin esto no se
    // puede distinguir "cargo y no bloquea" de "nunca cargo", y son diagnosticos
    // opuestos: uno es un defecto nuestro y el otro una limitacion del entorno.
    `--remote-debugging-port=${PUERTO_DEPURACION}`,
  ];
  if (conExtension) {
    args.push(`--disable-extensions-except=${EXT}`, `--load-extension=${EXT}`);
  }
  // Se arranca EN BLANCO a proposito. Si se le pasa la URL de prueba aqui, el
  // navegador la carga mientras todavia esta instalando la extension e
  // indexando sus reglas: las peticiones salen antes de que haya nada que las
  // bloquee, y la prueba concluye "no bloquea" sobre una carrera, no sobre un
  // defecto. Se navega despues, cuando la extension ya se asento.
  args.push('about:blank');

  let proc;
  try {
    proc = spawn(CHROMIUM, args, { stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) {
    return { nombre, noArranco: `${e.code || e.message}` };
  }
  let salidaError = '';
  let falloAlArrancar = null;
  proc.stderr.on('data', (d) => { salidaError += d.toString(); });
  proc.on('error', (e) => { falloAlArrancar = `${e.code || e.message}`; });

  // 1) Que arranque e instale la extension.
  await new Promise((r) => setTimeout(r, conExtension ? 9000 : 4000));
  if (falloAlArrancar) {
    proc.kill('SIGKILL');
    return { nombre, noArranco: falloAlArrancar };
  }
  const cargada = conExtension ? await extensionCargada() : null;

  // 2) Recien ahora se navega, y solo se cuenta lo que llegue a partir de aqui.
  llegadas = [];
  const navego = await abrirPestana('http://sitio-de-prueba.mx/');
  await new Promise((r) => setTimeout(r, 5000));

  proc.kill('SIGKILL');
  await new Promise((r) => proc.once('exit', r));
  try { fs.rmSync(perfil, { recursive: true, force: true }); } catch {}

  if (!navego) return { nombre, noArranco: 'no se pudo abrir la pestana por CDP' };

  const pedidas = new Set(llegadas.map((u) => u.split('/')[0]));
  return {
    nombre,
    cargada,
    anunciosQueLlegaron: ANUNCIOS.filter((d) => pedidas.has(d)),
    contenidoQueLlego: CONTENIDO.filter((d) => pedidas.has(d)),
    paginaCargo: llegadas.some((u) => u.endsWith('/')),
    error: salidaError.slice(0, 300),
  };
}

const CHROMIUM = buscarChromium();
if (!CHROMIUM) {
  console.error('No se encontro un Chromium sin marca.');
  console.error('Instalar con:  npx playwright install chromium');
  servidor.close();
  process.exit(2);
}

console.log('Prueba de bloqueo de extremo a extremo\n');
console.log(`   navegador: ${CHROMIUM}`);
console.log(`   extension: ${path.relative(process.cwd(), EXT)}`);
console.log(`   reglas:    ${reglas.length.toLocaleString()}`);
console.log(`   dominios de anuncio comprobados: ${ANUNCIOS.length} de ${CANDIDATOS_ANUNCIO.length} candidatos`);
console.log(`      ${ANUNCIOS.join(', ')}\n`);

const sin = await correr('sin extension', false);
const con = await correr('con extension', true);
servidor.close();

if (sin.noArranco || con.noArranco) {
  console.log('================ NO SE PUDO MEDIR ================\n');
  console.log(`   El navegador no arranco: ${sin.noArranco || con.noArranco}\n`);
  console.log('   Causa conocida en este equipo (hallazgo 3 del proyecto): la politica');
  console.log('   de seguridad prohibe ejecutar el Chromium sin firma de ms-playwright.');
  console.log('   Comprobado el 3-ago-2026: "Permission denied" tambien al copiarlo');
  console.log('   fuera de AppData, asi que la restriccion es por firma, no por ruta.\n');
  console.log('   Y el Chrome de marca 137+ no carga extensiones por linea de comandos.\n');
  console.log('   Para medir de verdad hace falta una de estas dos:');
  console.log('     - Chrome for Testing en una maquina sin esa politica');
  console.log('     - carga manual en chrome://extensions (Modo desarrollador ->');
  console.log('       "Cargar descomprimida" -> carpeta extension/)\n');
  console.log('   NO se puede afirmar que la extension bloquea hasta correr esto.');
  process.exit(2);
}

console.log('=== SIN EXTENSION (linea base) ===\n');
console.log(`   pagina cargo:            ${sin.paginaCargo ? 'si' : 'NO'}`);
console.log(`   anuncios que llegaron:   ${sin.anunciosQueLlegaron.length} de ${ANUNCIOS.length}`);
console.log(`   contenido que llego:     ${sin.contenidoQueLlego.length} de ${CONTENIDO.length}\n`);

// Antes de interpretar un solo numero: si la extension no se cargo, la corrida
// "con extension" es identica a la linea base y no mide nada.
if (con.cargada === false) {
  console.log('================ NO SE PUDO MEDIR ================\n');
  console.log('   El navegador acepto --load-extension y NO cargo la extension.');
  console.log('   Confirmado por el protocolo de depuracion: su service worker');
  console.log('   (src/fondo.js) no aparece entre los objetivos.\n');
  console.log(`   Navegador usado: ${CHROMIUM}\n`);
  console.log('   Es el hallazgo 1 del proyecto: Chrome de marca 137+ no carga');
  console.log('   extensiones por linea de comandos, y no avisa.\n');
  console.log('   Esto NO dice nada sobre si el conjunto de reglas sirve. Para saberlo:');
  console.log('     - Chromium o Chrome for Testing en un equipo sin la politica que');
  console.log('       aqui prohibe ejecutar binarios sin firma de Google, o');
  console.log('     - carga manual: chrome://extensions -> Modo desarrollador ->');
  console.log('       "Cargar descomprimida" -> carpeta extension/');
  process.exit(2);
}

console.log('=== CON EXTENSION ===\n');
console.log(`   extension cargada:       ${con.cargada === null ? 'no se pudo comprobar' : 'si'}`);
console.log(`   pagina cargo:            ${con.paginaCargo ? 'si' : 'NO'}`);
console.log(`   anuncios que llegaron:   ${con.anunciosQueLlegaron.length} de ${ANUNCIOS.length}`);
if (con.anunciosQueLlegaron.length) console.log(`      pasaron: ${con.anunciosQueLlegaron.join(', ')}`);
console.log(`   contenido que llego:     ${con.contenidoQueLlego.length} de ${CONTENIDO.length}\n`);

console.log('================ VEREDICTO ================\n');

const problemas = [];

if (!sin.paginaCargo) {
  problemas.push('La linea base no cargo: la prueba no midio nada. Revisar el navegador.');
} else if (sin.anunciosQueLlegaron.length !== ANUNCIOS.length) {
  problemas.push(`Sin extension solo llegaron ${sin.anunciosQueLlegaron.length}/${ANUNCIOS.length} anuncios. ` +
    'La linea base deberia dejarlos pasar todos; sin eso no se puede atribuir el bloqueo a la extension.');
}

if (!con.paginaCargo) {
  problemas.push('Con extension la pagina NO cargo: la extension esta rompiendo la navegacion.');
}

const bloqueados = sin.anunciosQueLlegaron.length - con.anunciosQueLlegaron.length;

if (con.contenidoQueLlego.length !== CONTENIDO.length) {
  problemas.push('SOBREBLOQUEO: la extension detuvo contenido que no es publicidad. ' +
    'Es el peor defecto posible en un bloqueador — rompe sitios y el usuario culpa al sitio.');
}

if (sin.paginaCargo && bloqueados === 0) {
  problemas.push('La extension no bloqueo NADA. Es el fallo silencioso que esta prueba busca: ' +
    'Chrome probablemente rechazo el conjunto de reglas entero.');
}

console.log(`La extension detuvo ${bloqueados} de ${sin.anunciosQueLlegaron.length} peticiones de anuncio.`);
console.log(`Dejo pasar ${con.contenidoQueLlego.length} de ${CONTENIDO.length} peticiones de contenido.\n`);

if (problemas.length) {
  for (const p of problemas) console.log(`   X  ${p}`);
  console.log('');
  process.exit(1);
}

console.log('El conjunto de reglas se cargo y se esta aplicando.\n');
console.log('LIMITE DE ESTA PRUEBA: mide el eje de RED sobre dominios conocidos.');
console.log('No mide el filtrado cosmetico, que es el 73-77% de lo que hacen las');
console.log('listas regionales. Eso se mide sobre sitios reales con el detector.');
