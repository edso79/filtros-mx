#!/usr/bin/env node
// Validador del conjunto de reglas declarativeNetRequest.
//
// Por que existe: Chrome valida el conjunto ENTERO al cargar la extension. Una
// sola regla malformada y rechaza el archivo completo — la extension queda
// instalada, con su icono, sin bloquear absolutamente nada. Y falla en silencio.
//
// Es el peor modo de fallo posible para este proyecto: el usuario se cree
// protegido y no lo esta. Exactamente lo que el principio 5 quiere evitar.
//
// Uso:  node herramientas/extension/validar-reglas.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REGLAS = path.join(HERE, '..', '..', 'extension', 'reglas', 'red.json');

// Limites reales de la plataforma, verificados el 29-jul-2026.
const TOPE_ESTATICAS = 30_000;
const TOPE_REGEX = 1_000;

const TIPOS_VALIDOS = new Set([
  'main_frame', 'sub_frame', 'stylesheet', 'script', 'image', 'font', 'object',
  'xmlhttprequest', 'ping', 'csp_report', 'media', 'websocket', 'webtransport',
  'webbundle', 'other',
]);

const ACCIONES_VALIDAS = new Set([
  'block', 'redirect', 'allow', 'upgradeScheme', 'modifyHeaders', 'allowAllRequests',
]);

const reglas = JSON.parse(fs.readFileSync(REGLAS, 'utf8'));
const problemas = [];
const cuenta = (m) => problemas.push(m);

const ids = new Set();
let conRegex = 0;

reglas.forEach((r, i) => {
  const donde = `regla #${i} (id ${r.id})`;

  // --- id ---
  if (!Number.isInteger(r.id) || r.id < 1) cuenta(`${donde}: id invalido`);
  if (ids.has(r.id)) cuenta(`${donde}: id duplicado`);
  ids.add(r.id);

  // --- priority ---
  if (r.priority !== undefined && (!Number.isInteger(r.priority) || r.priority < 1)) {
    cuenta(`${donde}: priority debe ser entero >= 1`);
  }

  // --- action ---
  if (!r.action || !ACCIONES_VALIDAS.has(r.action.type)) {
    cuenta(`${donde}: action.type invalido (${r.action?.type})`);
  }
  // allowAllRequests solo vale sobre documentos, y sin priority no sirve.
  if (r.action?.type === 'allowAllRequests') {
    const t = r.condition?.resourceTypes || [];
    if (!t.length || t.some((x) => x !== 'main_frame' && x !== 'sub_frame')) {
      cuenta(`${donde}: allowAllRequests exige resourceTypes main_frame/sub_frame`);
    }
  }

  const c = r.condition;
  if (!c) { cuenta(`${donde}: sin condition`); return; }

  // --- LA TRAMPA PRINCIPAL ---
  // resourceTypes y excludedResourceTypes son MUTUAMENTE EXCLUYENTES. Un filtro
  // como "$script,~image" produce las dos y Chrome rechaza el conjunto entero.
  if (c.resourceTypes && c.excludedResourceTypes) {
    cuenta(`${donde}: resourceTypes y excludedResourceTypes juntos (prohibido)`);
  }

  for (const campo of ['resourceTypes', 'excludedResourceTypes']) {
    for (const t of c[campo] || []) {
      if (!TIPOS_VALIDOS.has(t)) cuenta(`${donde}: tipo de recurso invalido "${t}" en ${campo}`);
    }
    if (c[campo] && c[campo].length === 0) cuenta(`${donde}: ${campo} vacio`);
  }

  // --- urlFilter ---
  if (c.urlFilter !== undefined) {
    if (typeof c.urlFilter !== 'string' || !c.urlFilter) {
      cuenta(`${donde}: urlFilter vacio`);
    } else {
      // Chrome exige ASCII en urlFilter. Un dominio con e~ne o acento revienta.
      if (/[^\x00-\x7F]/.test(c.urlFilter)) {
        cuenta(`${donde}: urlFilter con caracteres no ASCII: ${c.urlFilter.slice(0, 40)}`);
      }
      // "||" solo vale al principio.
      if (c.urlFilter.lastIndexOf('||') > 0) {
        cuenta(`${donde}: "||" fuera del inicio: ${c.urlFilter.slice(0, 40)}`);
      }
    }
  }
  if (c.urlFilter && c.regexFilter) cuenta(`${donde}: urlFilter y regexFilter juntos`);
  if (c.regexFilter) conRegex++;

  // --- dominios ---
  for (const campo of ['requestDomains', 'excludedRequestDomains', 'initiatorDomains', 'excludedInitiatorDomains']) {
    const lista = c[campo];
    if (!lista) continue;
    if (!Array.isArray(lista) || lista.length === 0) {
      cuenta(`${donde}: ${campo} vacio`);
      continue;
    }
    for (const d of lista) {
      if (typeof d !== 'string' || !d) { cuenta(`${donde}: dominio vacio en ${campo}`); continue; }
      // Chrome exige minusculas y rechaza el conjunto si encuentra mayusculas.
      if (d !== d.toLowerCase()) cuenta(`${donde}: dominio con mayusculas "${d}" en ${campo}`);
      if (/[^\x00-\x7F]/.test(d)) cuenta(`${donde}: dominio no ASCII "${d}" en ${campo}`);
      if (d.startsWith('.') || d.endsWith('.')) cuenta(`${donde}: dominio con punto al borde "${d}"`);
      if (d.includes('*') || d.includes('/') || d.includes(' ')) {
        cuenta(`${donde}: dominio con caracter invalido "${d}" en ${campo}`);
      }
    }
  }

  if (c.domainType && c.domainType !== 'firstParty' && c.domainType !== 'thirdParty') {
    cuenta(`${donde}: domainType invalido "${c.domainType}"`);
  }

  // Una condicion sin nada que casar casa con TODO. Bloquearia la web entera.
  const tieneAlgo = c.urlFilter || c.regexFilter || c.requestDomains || c.initiatorDomains;
  if (!tieneAlgo) cuenta(`${donde}: condition sin urlFilter ni dominios — casaria con TODO`);
});

// --- Presupuesto ---
if (reglas.length > TOPE_ESTATICAS) {
  cuenta(`${reglas.length} reglas superan el tope garantizado de ${TOPE_ESTATICAS}`);
}
if (conRegex > TOPE_REGEX) {
  cuenta(`${conRegex} reglas con regex superan el tope de ${TOPE_REGEX}`);
}

// --- Informe ---
console.log('Validador de reglas declarativeNetRequest\n');
console.log(`   archivo:  ${path.relative(process.cwd(), REGLAS)}`);
console.log(`   reglas:   ${reglas.length.toLocaleString()}  (tope ${TOPE_ESTATICAS.toLocaleString()})`);
console.log(`   con regex: ${conRegex.toLocaleString()}  (tope ${TOPE_REGEX.toLocaleString()})`);
console.log(`   bloqueo:   ${reglas.filter((r) => r.action.type === 'block').length.toLocaleString()}`);
console.log(`   excepcion: ${reglas.filter((r) => r.action.type === 'allow').length.toLocaleString()}\n`);

console.log('================ VEREDICTO ================\n');

if (problemas.length) {
  console.log(`${problemas.length} problema(s). Chrome RECHAZARIA el conjunto entero.\n`);
  const muestra = problemas.slice(0, 25);
  for (const p of muestra) console.log(`   ${p}`);
  if (problemas.length > muestra.length) {
    console.log(`   ... y ${problemas.length - muestra.length} mas`);
  }
  console.log('');
  process.exit(1);
}

console.log('Conjunto valido. Chrome deberia aceptarlo entero.\n');
console.log('OJO: valido no es lo mismo que correcto. Que el esquema cuadre no');
console.log('dice que las reglas bloqueen lo que deben. Eso lo mide');
console.log('herramientas/poc-arnes/probar-carga-extension.mjs, que comprueba');
console.log('con un servidor real que peticiones llegan de verdad.');
