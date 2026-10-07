#!/usr/bin/env node
// Compilador de listas de filtros -> extension MV3.
//
// Convierte el formato EasyList en las dos cosas que la extension necesita, que
// son distintas y viajan por caminos distintos:
//
//   1. REGLAS DE RED   -> JSON de declarativeNetRequest, que aplica el navegador
//   2. REGLAS COSMETICAS -> mapa dominio->selectores, que aplica el content script
//
// La separacion no es un detalle de implementacion: MV3 NO tiene filtrado
// cosmetico. declarativeNetRequest solo bloquea peticiones. Y como las listas
// regionales son 73-77% cosmeticas (medido el 29-jul-2026), si solo se
// compilaran las reglas de red se estaria tirando tres cuartas partes del
// trabajo de las listas.
//
// PRESUPUESTO, verificado el 29-jul-2026 (documentos/verificacion-tecnica):
//   30,000 reglas estaticas garantizadas | 30,000 dinamicas | 1,000 con regex
//
// Este guion NUNCA trunca en silencio. Si algo no cabe o no se puede convertir,
// sale en el informe con su motivo y su cuenta. Una extension que dice cubrir
// una lista completa cuando descarto la mitad hace exactamente el dano que el
// proyecto quiere evitar: que el usuario se crea protegido y no lo este.
//
// Uso:  node herramientas/extension/construir.mjs [--sin-red]
//       --sin-red  usa lo que ya este en cache, no descarga nada

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.join(HERE, '..', '..');
const CACHE = path.join(HERE, 'cache');
const DESTINO = path.join(RAIZ, 'extension', 'reglas');
const SIN_RED = process.argv.includes('--sin-red');

// El presupuesto real de Chrome. Se deja por debajo del maximo a proposito: el
// tope garantizado es 30,000 y apurarlo hasta el ultimo hueco deja sin margen
// para las reglas de mexico.txt cuando la lista vuelva a llenarse.
const TOPE_ESTATICAS = 29_000;

const FUENTES = [
  {
    id: 'easylist',
    nombre: 'EasyList',
    url: 'https://easylist.to/easylist/easylist.txt',
    // Orden de prioridad cuando hay que recortar: lo que mas cubre, primero.
    peso: 1,
  },
  {
    id: 'easyprivacy',
    nombre: 'EasyPrivacy',
    url: 'https://easylist.to/easylist/easyprivacy.txt',
    peso: 2,
  },
  {
    id: 'easylistspanish',
    nombre: 'EasyList Spanish',
    url: 'https://easylist-downloads.adblockplus.org/easylistspanish.txt',
    peso: 3,
  },
  {
    id: 'mexico',
    nombre: 'Filtros MX',
    archivo: path.join(RAIZ, 'filtros', 'mexico.txt'),
    // La propia va al final a proposito: si algun dia hay que recortar, se
    // recorta lo nuestro antes que lo que cubre a mas gente.
    peso: 9,
  },
];

// --- Tipos de recurso: nombre en EasyList -> nombre en declarativeNetRequest ---
const TIPOS = {
  script: 'script',
  image: 'image',
  stylesheet: 'stylesheet',
  object: 'object',
  xmlhttprequest: 'xmlhttprequest',
  subdocument: 'sub_frame',
  document: 'main_frame',
  media: 'media',
  font: 'font',
  websocket: 'websocket',
  ping: 'ping',
  other: 'other',
  'object-subrequest': 'object',
  beacon: 'ping',
  csp_report: 'csp_report',
};

// Opciones que NO se pueden expresar en declarativeNetRequest, o que exigen
// recursos que esta version no trae. Cada una se cuenta por separado para que
// el informe diga QUE se perdio, no solo cuanto.
const NO_SOPORTADAS = new Set([
  'csp', 'redirect', 'redirect-rule', 'removeparam', 'replace', 'inline-script',
  'inline-font', 'empty', 'mp4', 'popunder', 'genericblock', 'generichide',
  'elemhide', 'specifichide', 'stealth', 'cookie', 'network', 'app', 'method',
  'to', 'ipaddress', 'header', 'permissions', 'urltransform', 'uritransform',
]);

// Chrome rechaza el conjunto ENTERO de reglas si encuentra un solo dominio mal
// formado, y falla en silencio: la extension queda instalada sin bloquear nada.
// Por eso esto no es cosmetica, es lo que decide si la extension sirve.
//
// Devuelve el dominio normalizado, o null si no se puede expresar en DNR.
function normalizarDominio(d) {
  const t = d.trim().toLowerCase().replace(/^\.+|\.+$/g, '');
  if (!t) return null;

  // "wayfair.*" en EasyList significa "cualquier TLD". DNR no lo sabe decir, y
  // enumerar los TLD a mano seria inventar cobertura que no se verifico.
  if (t.includes('*')) return null;
  if (t.includes('/') || t.includes(' ')) return null;

  // Un dominio con acentos o e~ne se convierte a punycode, que es lo que viaja
  // de verdad por la red. Descartarlo seria perder cobertura sin necesidad.
  if (/[^\x00-\x7F]/.test(t)) {
    try {
      const h = new URL('http://' + t).hostname;
      return /[^\x00-\x7F]/.test(h) ? null : h;
    } catch { return null; }
  }
  return t;
}

function descargar(fuente) {
  const destino = path.join(CACHE, fuente.id + '.txt');

  if (fuente.archivo) {
    return fs.readFileSync(fuente.archivo, 'utf8');
  }
  if (SIN_RED) {
    if (!fs.existsSync(destino)) {
      throw new Error(`--sin-red pero no hay cache de ${fuente.id}. Correr una vez con red.`);
    }
    return fs.readFileSync(destino, 'utf8');
  }

  // curl y no fetch, por la misma razon documentada en revisar.mjs: varios
  // servidores huellan el handshake TLS de undici.
  const txt = execFileSync('curl', ['-sSL', '--max-time', '120', '--compressed', fuente.url], {
    encoding: 'utf8',
    maxBuffer: 1e8,
  });
  if (!txt || txt.length < 5000) throw new Error(`descarga sospechosamente corta de ${fuente.id}`);
  fs.mkdirSync(CACHE, { recursive: true });
  fs.writeFileSync(destino, txt);
  return txt;
}

// --- Sitios donde las listas piden NO aplicar genericas ($generichide) ---
//
// Tres formas en las listas, medidas el 7-oct-2026 sobre 171 lineas:
//   @@||amazon.com.mx^$generichide           -> el dominio y sus subdominios
//   @@||www.google.*/search?$generichide     -> "google." con cualquier TLD
//   @@://192.168.$generichide                -> hosts que EMPIEZAN asi (routers)
//   @@$generichide,domain=a.com|b.com        -> la lista de domain=
// Las que llevan ruta (/search?) se aplican al host entero: es mas amplio que
// la regla original, y el error va hacia el lado inocuo — ocultar de menos en
// la pagina de resultados, no romperla.
const sinGenericas = { dominios: new Set(), tldComodin: new Set(), prefijos: new Set() };

function anotarSinGenericas(linea) {
  const corte = linea.lastIndexOf('$');
  const patron = linea.slice(2, corte);
  const opciones = linea.slice(corte + 1).split(',');
  const dom = opciones.find((o) => o.startsWith('domain='));
  if (dom) {
    for (const d of dom.slice(7).split('|')) {
      if (d && !d.startsWith('~')) sinGenericas.dominios.add(d.toLowerCase());
    }
  }
  if (!patron) return;
  let m;
  if ((m = /^\|\|([a-z0-9.*-]+)/i.exec(patron))) {
    // "music.amazon." y "google.*": el punto final o el * son "cualquier TLD".
    let host = m[1].toLowerCase();
    if (/\.\*$|\.$/.test(host)) {
      host = host.replace(/\.\*$|\.$/, '');
      if (!host.includes('*')) sinGenericas.tldComodin.add(host);
    } else if (!host.includes('*')) {
      sinGenericas.dominios.add(host);
    }
  } else if ((m = /^:\/\/([a-z0-9.-]+)/i.exec(patron))) {
    sinGenericas.prefijos.add(m[1].toLowerCase());
  }
}

// --- Conversion de UNA regla de red al formato declarativeNetRequest ---
//
// Buena noticia que ahorra medio compilador: el campo urlFilter de DNR entiende
// nativamente la sintaxis ||dominio^ y el comodin *. No hay que traducirla.
function reglaDeRed(linea, descartes) {
  let cuerpo = linea;
  let excepcion = false;

  if (cuerpo.startsWith('@@')) {
    excepcion = true;
    cuerpo = cuerpo.slice(2);
  }

  // Las reglas con expresion regular literal (/.../) van a un cupo aparte de
  // solo 1,000 y son caras de evaluar. No entran en v1.
  if (/^\/.*\/(\$|$)/.test(cuerpo)) {
    descartes.regex++;
    return null;
  }

  let opciones = '';
  const corte = cuerpo.lastIndexOf('$');
  if (corte > 0) {
    opciones = cuerpo.slice(corte + 1);
    cuerpo = cuerpo.slice(0, corte);
  }

  if (!cuerpo) {
    descartes.vacia++;
    return null;
  }

  const condicion = { urlFilter: cuerpo };
  const tipos = [];
  const tiposExcluidos = [];
  let importante = false;

  if (opciones) {
    for (const cruda of opciones.split(',')) {
      if (!cruda) continue;
      const negada = cruda.startsWith('~');
      const op = negada ? cruda.slice(1) : cruda;
      const [clave, valor] = op.includes('=') ? [op.slice(0, op.indexOf('=')), op.slice(op.indexOf('=') + 1)] : [op, null];

      if (TIPOS[clave]) {
        (negada ? tiposExcluidos : tipos).push(TIPOS[clave]);
      } else if (clave === 'third-party' || clave === '3p') {
        condicion.domainType = negada ? 'firstParty' : 'thirdParty';
      } else if (clave === 'first-party' || clave === '1p') {
        condicion.domainType = negada ? 'thirdParty' : 'firstParty';
      } else if (clave === 'domain' || clave === 'from') {
        const incluidos = [];
        const excluidos = [];
        let invalido = false;
        for (const d of valor.split('|')) {
          if (!d) continue;
          const crudo = d.startsWith('~') ? d.slice(1) : d;
          const limpio = normalizarDominio(crudo);
          if (limpio === null) { invalido = true; break; }
          (d.startsWith('~') ? excluidos : incluidos).push(limpio);
        }
        if (invalido) {
          descartes.dominioComodin++;
          return null;
        }
        if (incluidos.length) condicion.initiatorDomains = incluidos;
        if (excluidos.length) condicion.excludedInitiatorDomains = excluidos;
      } else if (clave === 'match-case') {
        condicion.isUrlFilterCaseSensitive = true;
      } else if (clave === 'important') {
        importante = true;
      } else if (clave === 'popup') {
        descartes.popup++;
        return null;
      } else if (NO_SOPORTADAS.has(clave)) {
        descartes.opcion++;
        descartes.detalleOpciones[clave] = (descartes.detalleOpciones[clave] || 0) + 1;
        return null;
      } else {
        descartes.desconocida++;
        descartes.detalleOpciones[clave] = (descartes.detalleOpciones[clave] || 0) + 1;
        return null;
      }
    }
  }

  // El patron viaja en urlFilter, que Chrome exige en ASCII puro.
  if (/[^\x00-\x7F]/.test(cuerpo)) {
    descartes.patronNoAscii++;
    return null;
  }

  // resourceTypes y excludedResourceTypes son MUTUAMENTE EXCLUYENTES en DNR.
  // Un filtro como "$script,~image" produce los dos y tumbaria el conjunto
  // entero. Cuando hay ambos gana la lista positiva, que es la mas especifica.
  if (tipos.length && tiposExcluidos.length) {
    descartes.tiposEnConflicto++;
    condicion.resourceTypes = tipos;
  } else if (tipos.length) {
    condicion.resourceTypes = tipos;
  } else if (tiposExcluidos.length) {
    condicion.excludedResourceTypes = tiposExcluidos;
  }

  // FUSIONABLE: el patron "||dominio^" a secas equivale exactamente a la
  // condicion requestDomains de DNR, que acepta una LISTA de dominios. Miles de
  // reglas que solo se diferencian en el dominio colapsan en una sola.
  //
  // Sin esto no alcanza ni de lejos: medido el 3-ago-2026, una regla por linea
  // da 114,159 reglas contra un presupuesto de 29,000 — se caeria el 75% de
  // EasyList. Con la fusion cabe entero. Es la diferencia entre una extension
  // que bloquea y una que dice bloquear.
  const soloDominio = /^\|\|([a-z0-9][a-z0-9.-]*\.[a-z]{2,})\^?$/i.exec(cuerpo);

  // Jerarquia calcada de la semantica ABP, donde $important existe para UNA
  // cosa: ganarle a las excepciones @@. Sin esto, las 10 reglas $important de
  // las listas quedaban DEBAJO de las excepciones — al reves que en uBO.
  //   1 bloqueo | 2 excepcion | 3 bloqueo $important | 4 excepcion $important
  const base = {
    priority: importante ? (excepcion ? 4 : 3) : (excepcion ? 2 : 1),
    action: { type: excepcion ? 'allow' : 'block' },
    condition: condicion,
  };

  if (soloDominio) {
    const { urlFilter, ...resto } = condicion;
    return { fusionable: true, dominio: soloDominio[1].toLowerCase(), resto, ...base };
  }
  return { fusionable: false, ...base };
}

// Firma de una regla fusionable: todo lo que NO es el dominio. Dos reglas con
// la misma firma pueden compartir una sola entrada de requestDomains.
function firma(r) {
  return JSON.stringify([r.priority, r.action.type, r.resto]);
}

// Cuantos dominios caben en una regla. El limite real de Chrome es mayor, pero
// trozos de 1,000 dejan margen y no cuestan nada: 100,000 dominios siguen
// cabiendo en 100 reglas.
const DOMINIOS_POR_REGLA = 1000;

// --- Selectores extendidos (#?#): parseo en tiempo de compilacion ---
//
// La premisa "MV3 no permite selectores extendidos" resulto tener un agujero
// medido el 6-ago-2026: de 305 reglas extendidas en las tres listas, 303 son
// del tipo :has-text() y 1 es :has() puro. :has() es CSS NATIVO desde Chrome
// 105, y el texto lo puede comprobar un motor de una pantalla en el content
// script. Lo unico realmente fuera de alcance hoy: :-abp-properties() y
// familia (1 regla).
//
// Se parsea AQUI y no en el cliente: el content script corre en cada pagina
// que visita el usuario, y hacerle parsear sintaxis ABP en cada carga seria
// pagar en millones de navegaciones lo que se puede pagar una vez aqui.
//
// Formas que se rescatan (cubren 303 de 305):
//   A)  BASE:has-text(TEXTO)            -> {o:BASE, t:TEXTO}
//   B)  OUTER:has(INNER:has-text(TEXTO)) -> {o:OUTER, i:INNER, t:TEXTO}
//   C)  selector con :has() sin texto    -> {css:SELECTOR} (CSS nativo)
function parsearExtendida(selector) {
  const s = selector
    .replace(/:-abp-has\(/g, ':has(')
    .replace(/:-abp-contains\(/g, ':has-text(');

  // Lo que el motor NO evalua todavia. Se cuenta, no se finge.
  if (/:-abp-properties\(|:matches-css|:xpath\(|:matches-path|:min-text-length|:upward|:watch-attr|:remove|:style\(/.test(s)) {
    return null;
  }

  const i = s.indexOf(':has-text(');
  if (i < 0) {
    // Sin texto: es CSS puro con :has(), el navegador lo evalua solo.
    return { css: s };
  }

  // Extraer el argumento con parentesis balanceados.
  let depth = 1, j = i + 10;
  for (; j < s.length && depth > 0; j++) {
    if (s[j] === '(') depth++;
    else if (s[j] === ')') depth--;
  }
  if (depth !== 0) return null;
  if (s.indexOf(':has-text(', j) !== -1) return null; // dos :has-text, fuera

  const crudo = s.slice(i + 10, j - 1);
  const pre = s.slice(0, i);
  const post = s.slice(j);

  // Texto literal o /regex/flags.
  const rx = /^\/(.+)\/([a-z]*)$/.exec(crudo);
  const texto = rx ? { rx: rx[1], fl: rx[2] } : { tx: crudo };

  if (post === '') {
    if (!pre) return null;
    return { o: pre, t: texto };                    // forma A
  }
  if (post === ')') {
    const k = pre.lastIndexOf(':has(');
    if (k < 1) return null;
    return { o: pre.slice(0, k), i: pre.slice(k + 5), t: texto };  // forma B
  }
  return null; // forma que no reconocemos: se cuenta como no aplicable
}

// --- Reglas cosmeticas: dominio##selector ---
//
// No van a DNR. Van a un mapa que consume el content script.
function reglaCosmetica(linea) {
  // ## oculta | #@# es excepcion | #?# y #$# son extendidas (MV3 no las aplica)
  const m = /^([^#]*)(#@?\??\$?#)(.+)$/.exec(linea);
  if (!m) return null;
  const [, dominios, marca, selector] = m;

  if (marca === '#?#') {
    const compilada = parsearExtendida(selector.trim());
    if (!compilada) return { tipo: 'extendidaNoAplicable' };
    const lista = dominios ? dominios.split(',').map((d) => d.trim()).filter(Boolean) : [];
    return { tipo: 'extendidaAplicable', dominios: lista, compilada };
  }
  if (marca === '#$#' || marca === '#$?#') {
    // Inyeccion de CSS/estilos de ABP, no ocultamiento. Fuera, y contada.
    return { tipo: 'extendidaNoAplicable' };
  }

  // Sintaxis de uBlock Origin que viaja bajo la marca ## pero NO es un selector
  // de ocultamiento: +js() inyecta un scriptlet y :style() reescribe estilos.
  // Medido el 3-ago-2026: EasyPrivacy trae 27 y 4 respectivamente. Dejarlas
  // pasar las convierte en selectores CSS invalidos dentro de cosmeticas.json,
  // que cada pasada del detector reintenta uno a uno tras tumbar su grupo.
  if (selector.trim().startsWith('+js(')) return { tipo: 'scriptlet' };
  if (selector.includes(':style(')) return { tipo: 'scriptlet' };

  const lista = dominios ? dominios.split(',').map((d) => d.trim()).filter(Boolean) : [];
  return {
    tipo: marca === '#@#' ? 'excepcion' : 'ocultar',
    dominios: lista,
    selector: selector.trim(),
  };
}

// ---------------------------------------------------------------- construir --

console.log('Compilador de listas -> extension MV3\n');

const descartes = {
  regex: 0, popup: 0, opcion: 0, desconocida: 0, vacia: 0,
  dominioComodin: 0, tiposEnConflicto: 0, patronNoAscii: 0,
  cosmeticaExtendida: 0, scriptlet: 0, detalleOpciones: {},
};

const reglasRed = [];
const cosmeticasPorDominio = new Map();   // dominio -> Set(selector)
const cosmeticasGenericas = new Set();
const excepcionesCosmeticas = new Map();  // dominio -> Set(selector)
const extendidasPorDominio = new Map();   // dominio -> [regla compilada]
const extendidasGenericas = [];           // sin dominio: solo con genericas activas
let extendidasAplicables = 0;
const resumenFuentes = [];

for (const fuente of FUENTES) {
  let texto;
  try {
    texto = descargar(fuente);
  } catch (e) {
    console.log(`   !  ${fuente.nombre}: ${e.message}`);
    resumenFuentes.push({ nombre: fuente.nombre, error: e.message });
    continue;
  }

  let red = 0, cosm = 0, comentarios = 0;

  for (const cruda of texto.split('\n')) {
    const linea = cruda.trim();
    if (!linea) continue;
    if (linea.startsWith('!') || linea.startsWith('[')) { comentarios++; continue; }

    if (/#@?\??\$?#/.test(linea)) {
      const c = reglaCosmetica(linea);
      if (!c) continue;
      if (c.tipo === 'extendidaNoAplicable') { descartes.cosmeticaExtendida++; continue; }
      if (c.tipo === 'extendidaAplicable') {
        extendidasAplicables++;
        if (c.dominios.length === 0) {
          extendidasGenericas.push(c.compilada);
        } else {
          for (const d of c.dominios) {
            if (d.startsWith('~')) continue;
            // "dominio.*" (cualquier TLD) nunca casaria con la busqueda por
            // dominio del cliente: guardarlo seria fingir una cobertura muerta.
            if (d.includes('*')) { descartes.dominioComodin++; continue; }
            if (!extendidasPorDominio.has(d)) extendidasPorDominio.set(d, []);
            extendidasPorDominio.get(d).push(c.compilada);
          }
        }
        cosm++;
        continue;
      }
      if (c.tipo === 'scriptlet') { descartes.scriptlet++; continue; }

      const destino = c.tipo === 'excepcion' ? excepcionesCosmeticas : null;
      if (destino) {
        for (const d of c.dominios) {
          if (!destino.has(d)) destino.set(d, new Set());
          destino.get(d).add(c.selector);
        }
      } else if (c.dominios.length === 0) {
        cosmeticasGenericas.add(c.selector);
      } else {
        for (const d of c.dominios) {
          if (d.startsWith('~')) continue;
          if (!cosmeticasPorDominio.has(d)) cosmeticasPorDominio.set(d, new Set());
          cosmeticasPorDominio.get(d).add(c.selector);
        }
      }
      cosm++;
      continue;
    }

    // $generichide: "en este sitio NO apliques las cosmeticas genericas".
    // DNR no lo entiende —sigue contandose como descarte de red—, pero la
    // extension SI tiene que respetarlo, porque es la lista diciendo "aqui las
    // genericas rompen". Hasta la 1.0.0 no importaba: las genericas solo iban
    // en Reforzado. Al encenderlas de fabrica (7-oct-2026), ignorarlo habria
    // roto Amazon Mexico, la cuenta de Google y el panel del router de casa.
    if (/^@@.*[$,]generichide(,|$)/.test(linea)) anotarSinGenericas(linea);

    const r = reglaDeRed(linea, descartes);
    if (r) { reglasRed.push({ ...r, _peso: fuente.peso }); red++; }
  }

  resumenFuentes.push({ nombre: fuente.nombre, red, cosm, comentarios });
  console.log(`   ok ${fuente.nombre.padEnd(18)} ${String(red).padStart(6)} de red   ${String(cosm).padStart(6)} cosmeticas`);
}

// --- Fusion de reglas por dominio ---
//
// Aqui es donde EasyList entera pasa de no caber a caber con holgura.
const porFirma = new Map();
const sueltas = [];

for (const r of reglasRed) {
  if (r.fusionable) {
    const f = firma(r);
    if (!porFirma.has(f)) porFirma.set(f, { modelo: r, dominios: new Set(), peso: r._peso });
    const g = porFirma.get(f);
    g.dominios.add(r.dominio);
    g.peso = Math.min(g.peso, r._peso);
  } else {
    sueltas.push(r);
  }
}

const lineasFusionables = [...porFirma.values()].reduce((a, g) => a + g.dominios.size, 0);
const fusionadas = [];
for (const g of porFirma.values()) {
  const todos = [...g.dominios];
  for (let i = 0; i < todos.length; i += DOMINIOS_POR_REGLA) {
    fusionadas.push({
      priority: g.modelo.priority,
      action: g.modelo.action,
      condition: { ...g.modelo.resto, requestDomains: todos.slice(i, i + DOMINIOS_POR_REGLA) },
      _peso: g.peso,
    });
  }
}

// --- Sitios donde la extension NO actua, por decision de producto ------------
//
// No es una allowlist de anunciantes: eso lo prohibe el principio 2. Es lo
// contrario — sitios de tramite donde el coste de un falso positivo es
// desproporcionado y el beneficio, medido, es CERO.
//
// sat.gob.mx entra el 25-ago-2026 con la medicion delante: portada, login CIEC
// y login CFDI dan 0 peticiones frenadas y 0 elementos ocultos en modo normal y
// en Reforzado, y el dominio no aparece ni una vez en las tres listas. Excluirlo
// no pierde nada que estuviera ganandose; no excluirlo deja viva la posibilidad
// de que alguien no pueda declarar.
//
// Se aplica POR SUFIJO a proposito: requestDomains casa el dominio y todos sus
// subdominios, y el SAT reparte el tramite entre loginda.siat, cfdiau,
// portalcfdi.facturaelectronica y mas. El apagado por sitio del popup guarda por
// host exacto, asi que no cubre este caso — por eso hace falta aqui.
const SITIOS_EXCLUIDOS = ['sat.gob.mx'];

// allowAllRequests con main_frame y sub_frame: permite TODA peticion hecha desde
// una pagina de esos dominios. Prioridad 5, por encima del 4 de las importantes.
const exclusiones = SITIOS_EXCLUIDOS.map((dominio) => ({
  priority: 5,
  action: { type: 'allowAllRequests' },
  condition: { requestDomains: [dominio], resourceTypes: ['main_frame', 'sub_frame'] },
  _peso: -1, // van delante de todo, incluidas las excepciones @@
}));

const candidatas = [...fusionadas, ...sueltas.map(({ fusionable, dominio, resto, ...r }) => r)];
candidatas.unshift(...exclusiones);

// --- Presupuesto ---
//
// Se ordena por peso de fuente antes de recortar, para que lo que se pierda sea
// lo que menos usuarios cubre. Las excepciones (@@) NUNCA se recortan: perder
// una excepcion no deja de bloquear, deja ROTO un sitio que funcionaba.
const esPermiso = (r) => r.action.type === 'allow' || r.action.type === 'allowAllRequests';
candidatas.sort((a, b) => {
  if (esPermiso(a) !== esPermiso(b)) return esPermiso(a) ? -1 : 1;
  return a._peso - b._peso;
});

const lineasTotales = reglasRed.length;
const totalAntes = candidatas.length;
const recortadas = Math.max(0, totalAntes - TOPE_ESTATICAS);
const finales = candidatas.slice(0, TOPE_ESTATICAS).map((r, i) => {
  const { _peso, ...limpia } = r;
  return { id: i + 1, ...limpia };
});

// Como las excepciones van ordenadas PRIMERO, ocupan los ids 1..reglasPermiso.
// El popup necesita ese numero para el contador de red: getMatchedRules no dice
// si la regla que caso era de bloqueo o de permiso, y contar un permiso como
// bloqueo seria presumir un bloqueo que no ocurrio.
const reglasPermiso = finales.filter(esPermiso).length;

// --- Escribir ---
fs.mkdirSync(DESTINO, { recursive: true });

fs.writeFileSync(path.join(DESTINO, 'red.json'), JSON.stringify(finales));

const cosmeticas = {
  porDominio: Object.fromEntries([...cosmeticasPorDominio].map(([d, s]) => [d, [...s]])),
  excepciones: Object.fromEntries([...excepcionesCosmeticas].map(([d, s]) => [d, [...s]])),
  // Las genericas van en el modo Completo, que es el de fabrica desde la 1.0.0,
  // salvo en los sitios donde la propia lista dice que rompen.
  genericas: [...cosmeticasGenericas],
  sinGenericas: {
    dominios: [...sinGenericas.dominios],
    tldComodin: [...sinGenericas.tldComodin],
    prefijos: [...sinGenericas.prefijos],
  },
  // Extendidas ya compiladas: {css} para :has() puro (CSS nativo), {o,i,t}
  // para las de texto, que evalua el motor del content script.
  extendidas: {
    porDominio: Object.fromEntries([...extendidasPorDominio]),
    genericas: extendidasGenericas,
  },
};
fs.writeFileSync(path.join(DESTINO, 'cosmeticas.json'), JSON.stringify(cosmeticas));

const meta = {
  compilado: new Date().toISOString(),
  fuentes: resumenFuentes,
  lineasDeRedCompiladas: lineasTotales,
  reglasRed: finales.length,
  reglasPermiso,
  reglasRedAntesDelTope: totalAntes,
  lineasFusionadasEnRequestDomains: lineasFusionables,
  reglasNoFusionables: sueltas.length,
  recortadasPorPresupuesto: recortadas,
  dominiosConCosmeticas: cosmeticasPorDominio.size,
  selectoresCosmeticos: [...cosmeticasPorDominio.values()].reduce((a, s) => a + s.size, 0),
  cosmeticasGenericas: cosmeticasGenericas.size,
  extendidasAplicables,
  extendidasNoAplicables: descartes.cosmeticaExtendida,
  descartes,
};
fs.writeFileSync(path.join(DESTINO, 'meta.json'), JSON.stringify(meta, null, 2));

// --- Informe ---
console.log('\n=== LO QUE ENTRO ===\n');
console.log(`   lineas de red compiladas: ${lineasTotales.toLocaleString()}`);
console.log(`      de las cuales fusionadas por dominio: ${lineasFusionables.toLocaleString()}`);
console.log(`      que no se pueden fusionar (patron):   ${sueltas.length.toLocaleString()}`);
console.log(`   -> reglas DNR resultantes: ${finales.length.toLocaleString()}  (tope ${TOPE_ESTATICAS.toLocaleString()})`);
console.log(`   dominios con cosmeticas:  ${cosmeticasPorDominio.size.toLocaleString()}`);
console.log(`   selectores cosmeticos:    ${meta.selectoresCosmeticos.toLocaleString()}`);
console.log(`   genericas (no activas):   ${cosmeticasGenericas.size.toLocaleString()}`);

console.log('\n=== LO QUE SE DESCARTO, Y POR QUE ===\n');
console.log('   Esto no es letra chica: es lo que la extension NO va a bloquear.\n');
if (recortadas > 0) {
  console.log(`   ${recortadas.toLocaleString()} reglas no caben en el presupuesto de ${TOPE_ESTATICAS.toLocaleString()}.`);
  console.log(`      Se recorto por orden de fuente: primero lo propio, al final EasyList.`);
  console.log(`      Ninguna regla de excepcion (@@) se recorto.\n`);
}
console.log(`   ${descartes.regex.toLocaleString()} con expresion regular  (cupo aparte de 1,000, fuera de v1)`);
console.log(`   ${descartes.popup.toLocaleString()} de tipo popup           (DNR no bloquea ventanas emergentes asi)`);
console.log(`   ${descartes.opcion.toLocaleString()} con opciones que DNR no expresa`);
console.log(`   ${descartes.desconocida.toLocaleString()} con opciones no reconocidas por este compilador`);
console.log(`   ${descartes.dominioComodin.toLocaleString()} con dominio comodin  (dominio.* = "cualquier TLD", DNR no lo expresa)`);
console.log(`   ${descartes.patronNoAscii.toLocaleString()} con patron no ASCII    (urlFilter solo acepta ASCII)`);
console.log(`   ${descartes.tiposEnConflicto.toLocaleString()} con tipos en conflicto (se conservo la lista positiva, no se perdio la regla)`);
console.log(`   ${descartes.cosmeticaExtendida.toLocaleString()} cosmeticas extendidas NO aplicables (:-abp-properties, #$#, formas raras)`);
console.log(`   ${descartes.scriptlet.toLocaleString()} scriptlets/estilos de uBO (+js(), :style()) — no son ocultamiento\n`);
console.log(`   Y lo RESCATADO el 6-ago-2026: ${extendidasAplicables.toLocaleString()} extendidas SI se aplican ahora`);
console.log('      (:has() es CSS nativo desde Chrome 105; el texto lo evalua el motor');
console.log(`      del content script). ${extendidasPorDominio.size.toLocaleString()} dominios con extendidas propias, ${extendidasGenericas.length.toLocaleString()} genericas.\n`);

const top = Object.entries(descartes.detalleOpciones).sort((a, b) => b[1] - a[1]).slice(0, 8);
if (top.length) {
  console.log('   Opciones que mas reglas costaron:');
  for (const [op, n] of top) console.log(`      $${op.padEnd(16)} ${n.toLocaleString()}`);
}

console.log(`\nEscrito en ${path.relative(process.cwd(), DESTINO)}/`);
console.log('   red.json         reglas de declarativeNetRequest');
console.log('   cosmeticas.json  mapa dominio -> selectores');
console.log('   meta.json        de donde salio cada cosa y que se descarto');

// Scriptlets de YouTube (1.1.0): van en el mismo paso para que nunca se empaquete
// una version con listas de hoy y reglas de YouTube de otro dia. YouTube
// cambia mas rapido que cualquier otra cosa que se compila aqui.
const { construirScriptlets } = await import('./construir-scriptlets.mjs');
const scriptlets = await construirScriptlets();
console.log('   scriptlets-*.js  scriptlets de YouTube (uBlock Origin ' + scriptlets.uBlockOrigin + ')');
