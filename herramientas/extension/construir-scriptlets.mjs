#!/usr/bin/env node
// Compila los scriptlets de YouTube para la extension (1.1.0, 7-oct-2026).
//
// Por que existe: YouTube sirve el anuncio dentro de la MISMA respuesta que
// describe el video (adPlacements, playerAds, adSlots) y desde los mismos
// servidores. Bloquear peticiones no lo separa — medido el 7-oct-2026 con la
// 1.0.0: el anuncio de video pasaba entero (documentos/medicion-youtube-*).
// Lo que lo quita es reescribir esa respuesta antes de que la lea el
// reproductor, con codigo inyectado en la pagina: los "scriptlets".
//
// NO se reescriben: se usan los de uBlock Origin, que estan bajo GPLv3 como
// este proyecto. El motor (herramientas/extension/ubo/, fijado a uBO 1.75.0) y
// las reglas (listas "uBlock filters", con sus inclusiones, "quick fixes" y
// "unbreak") son de Raymond Hill y colaboradores. Reescribirlos seria peor,
// mas lento, y nos dejaria fuera de los arreglos que ellos publican.
//
// Alcance a proposito: SOLO la familia de dominios de YouTube. Los scriptlets
// son codigo que corre dentro de la pagina; abrir la puerta a todos los sitios
// de golpe es un cambio de otra escala y se mide aparte.
//
// Manifest V3 prohibe el codigo remoto: el resultado se escribe en
// extension/reglas/ y viaja DENTRO del paquete, como hace uBO Lite.
//
// Uso:  node herramientas/extension/construir-scriptlets.mjs   (lo llama construir.mjs)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CACHE = path.join(HERE, 'cache');
const DESTINO = path.join(HERE, '..', '..', 'extension', 'reglas');
const UBO = path.join(HERE, 'ubo');
const VERSION_UBO = '1.75.0';

const BASE = 'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/';
const LISTAS = ['filters.txt', 'quick-fixes.txt', 'unbreak.txt'];

// Los dominios de YouTube. Se queda una regla si nombra AL MENOS uno, y de su
// lista de dominios se conservan solo estos.
const FAMILIA = ['youtube.com', 'youtubekids.com', 'youtube-nocookie.com'];
const esDeYouTube = (hn) => FAMILIA.some((d) => hn === d || hn.endsWith('.' + d));

// El entorno con el que se evaluan los "!#if" de las listas: el mismo de uBO
// Lite en Chrome (platform/mv3/make-rulesets.js). cap_html_filtering NO esta,
// y eso importa: las reglas de YouTube para MV3 viven justo bajo
// "!#if !cap_html_filtering".
const ENTORNO = new Set(['chromium', 'native_css_has', 'mv3', 'ublock', 'ubol']);

async function bajar(nombre) {
  const destino = path.join(CACHE, 'ubo-' + nombre);
  try {
    const r = await fetch(BASE + nombre);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const txt = await r.text();
    fs.mkdirSync(CACHE, { recursive: true });
    fs.writeFileSync(destino, txt);
    return txt;
  } catch (e) {
    // Sin red se compila con la copia anterior, pero se DICE: unas reglas de
    // YouTube viejas son exactamente las que YouTube ya aprendio a esquivar.
    if (fs.existsSync(destino)) {
      console.log(`   AVISO: ${nombre} sin red (${e.message}); uso la copia en cache`);
      return fs.readFileSync(destino, 'utf8');
    }
    throw new Error(`no se pudo bajar ${nombre}: ${e.message}`);
  }
}

// "!#include x.txt" se expande con la lista del mismo directorio, como hace uBO.
async function conInclusiones(nombre, vistos = new Set()) {
  if (vistos.has(nombre)) return [];
  vistos.add(nombre);
  const salida = [];
  for (const linea of (await bajar(nombre)).split(/\r?\n/)) {
    const m = /^!#include\s+(\S+)/.exec(linea);
    if (m && !m[1].includes('/')) salida.push(...await conInclusiones(m[1], vistos));
    else salida.push(linea);
  }
  return salida;
}

// "!#if" con !, &&, || y parentesis. Los tokens llevan prefijo env_/cap_/ext_.
function evaluarCondicion(expr) {
  const js = expr.replace(/[a-z_]+/gi, (tok) =>
    ENTORNO.has(tok.replace(/^(env|cap|ext)_/, '')) ? 'true' : 'false');
  if (!/^[\s()!&|truefals]*$/.test(js)) return false;
  try { return Function(`"use strict";return (${js});`)() === true; } catch { return false; }
}

function preprocesar(lineas) {
  const pila = [];
  const activo = () => pila.every((x) => x);
  const salida = [];
  for (const l of lineas) {
    const m = /^!#if\s+(.*)$/.exec(l);
    if (m) { pila.push(evaluarCondicion(m[1].trim())); continue; }
    if (/^!#else\b/.test(l)) { if (pila.length) pila.push(!pila.pop()); continue; }
    if (/^!#endif\b/.test(l)) { pila.pop(); continue; }
    if (activo()) salida.push(l);
  }
  return salida;
}

export async function construirScriptlets() {
  const { ArglistParser } = await import(pathToFileURL(path.join(UBO, 'js', 'arglist-parser.js')).href);
  const ms = await import(pathToFileURL(path.join(UBO, 'js', 'offscreen', 'make-scriptlets.js')).href);
  ms.reset();

  // Los argumentos se separan con el MISMO intérprete de uBO (comas escapadas,
  // comillas, expresiones regulares). Es el bucle de
  // static-filtering-parser.js#parseExtPatternScriptletArgs.
  const separar = (s) => {
    const p = new ArglistParser(',');
    const leer = (i) => {
      const d = p.nextArg(s, i);
      let a = s.slice(d.argBeg, d.argEnd);
      if (d.transform) a = p.normalizeArg(a);
      return { a, fin: d.separatorEnd };
    };
    let { a: token, fin } = leer(0);
    if (token.endsWith('.js')) token = token.slice(0, -3);
    const args = [token];
    while (fin < s.length) {
      const r = leer(fin);
      args.push(r.a);
      fin = r.fin;
    }
    return args;
  };

  const reglas = new Map();      // clave de args -> { args, matches:Set, excludeMatches:Set }
  const exclusionesTotales = new Set();
  let leidas = 0;
  for (const lista of LISTAS) {
    for (const linea of preprocesar(await conInclusiones(lista))) {
      // "!" es comentario. Las listas tienen reglas de YouTube RETIRADAS asi,
      // comentadas en su sitio; compilarlas seria resucitar lo que uBO quito.
      if (linea.startsWith('!')) continue;
      const m =/^([^#\s][^#]*?)(#@?#)\+js\((.*)\)\s*$/.exec(linea);
      if (!m) continue;
      const dominios = m[1].split(',').map((d) => d.trim().toLowerCase()).filter(Boolean);
      const excepcion = m[2] === '#@#';
      // Dominios por expresion regular o con "~": fuera de alcance; las de
      // YouTube no los usan (comprobado el 7-oct-2026).
      const nuestros = dominios.filter((d) => !d.startsWith('~') && !d.startsWith('/') && esDeYouTube(d));
      if (!nuestros.length) continue;
      leidas++;
      if (excepcion && m[3].trim() === '') { for (const d of nuestros) exclusionesTotales.add(d); continue; }
      const args = separar(m[3]);
      const clave = JSON.stringify(args);
      const r = reglas.get(clave) ?? { args, matches: new Set(), excludeMatches: new Set() };
      reglas.set(clave, r);
      for (const d of nuestros) (excepcion ? r.excludeMatches : r.matches).add(d);
    }
  }

  let compiladas = 0;
  for (const r of reglas.values()) {
    if (!r.matches.size) continue;   // solo excepciones: nada que inyectar
    ms.compile('youtube', {
      args: r.args.slice(),
      matches: [...r.matches],
      excludeMatches: [...r.excludeMatches],
      // Las listas de uBO son "de confianza" para uBO, y por eso pueden usar
      // los scriptlets trusted-*. Aqui se toman SOLO de esas listas.
      trustedSource: true,
    });
    compiladas++;
  }
  if (exclusionesTotales.size) ms.compile('youtube', { args: [], excludeMatches: [...exclusionesTotales] });

  const plantilla = fs.readFileSync(path.join(UBO, 'js', 'offscreen', 'scriptlet.template.js'), 'utf8');
  const res = ms.commit('youtube', plantilla);
  fs.mkdirSync(DESTINO, { recursive: true });
  const meta = { uBlockOrigin: VERSION_UBO, compilado: new Date().toISOString(), reglasLeidas: leidas, reglasCompiladas: compiladas, mundos: {} };
  for (const mundo of ['MAIN', 'ISOLATED']) {
    const archivo = path.join(DESTINO, `scriptlets-${mundo.toLowerCase()}.js`);
    if (res[mundo]) {
      fs.writeFileSync(archivo, res[mundo].code);
      meta.mundos[mundo] = { archivo: `reglas/scriptlets-${mundo.toLowerCase()}.js`, hosts: res[mundo].hostnames };
    } else {
      fs.rmSync(archivo, { force: true });
    }
  }
  fs.writeFileSync(path.join(DESTINO, 'scriptlets.json'), JSON.stringify(meta, null, 2));
  console.log(`   scriptlets de YouTube: ${compiladas} reglas (de ${leidas} leidas), uBO ${VERSION_UBO}, ` +
    `mundos ${Object.keys(meta.mundos).join('+') || 'ninguno'}`);
  return meta;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  construirScriptlets().catch((e) => { console.error('FALLO', e.message); process.exit(1); });
}
