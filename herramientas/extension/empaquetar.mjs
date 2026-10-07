#!/usr/bin/env node
// Empaqueta la extension para la Chrome Web Store.
//
// Existe porque subir la carpeta tal cual es un error silencioso: contiene
// archivos que NO deben viajar y que Chrome no avisa que sobran.
//
//   _metadata/  lo GENERA Chrome al cargar la extension descomprimida. Es su
//               indice interno de reglas. Subirlo puede hacer que la tienda
//               rechace el paquete, y en el mejor caso viaja basura.
//   TIENDA.md   son notas internas del proyecto: la ficha, lo que falta antes
//               de publicar, el razonamiento de la declaracion de comerciante.
//               No tiene por que llegarle a un usuario.
//   .gitignore  no pinta nada en un paquete.
//
// Y al reves: reglas/ NO esta en git —se genera— pero SI tiene que ir en el
// ZIP. Empaquetar a mano desde una copia limpia del repositorio produciria una
// extension sin reglas: instalada, con icono, sin bloquear nada.
//
// Uso:  node herramientas/extension/empaquetar.mjs

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.join(HERE, '..', '..');
const EXT = path.join(RAIZ, 'extension');
const SALIDA = path.join(RAIZ, 'paquetes');

// Lo que SI viaja. Lista blanca, no lista negra: si ma~ana alguien deja un
// archivo suelto en extension/, no se cuela en el paquete por descuido.
const INCLUIR = [
  'manifest.json',
  'iconos',
  'src',
  'popup',
  'opciones',
  'reglas',
  // Anadida el 13-ago-2026, al empaquetar para publicar por primera vez: la
  // lista blanca se escribio ANTES de que existiera la bienvenida (10-ago) y
  // nadie la actualizo. fondo.js la abre en onInstalled, asi que el paquete
  // habria estrenado a cada usuario nuevo con una pestana de error.
  'bienvenida',
  // 1.0.0: textos en espa~nol e ingles. Sin esta carpeta Chrome ni siquiera
  // carga la extension — el manifest pide __MSG_extName__ y default_locale.
  '_locales',
];

function copiar(origen, destino) {
  const st = fs.statSync(origen);
  if (st.isDirectory()) {
    fs.mkdirSync(destino, { recursive: true });
    for (const hijo of fs.readdirSync(origen)) {
      copiar(path.join(origen, hijo), path.join(destino, hijo));
    }
  } else {
    fs.copyFileSync(origen, destino);
  }
}

function tamano(dir) {
  let total = 0;
  for (const hijo of fs.readdirSync(dir)) {
    const p = path.join(dir, hijo);
    const st = fs.statSync(p);
    total += st.isDirectory() ? tamano(p) : st.size;
  }
  return total;
}

console.log('Empaquetador para la Chrome Web Store\n');

// --- 1. Comprobaciones que evitan subir algo roto ---
const manifiesto = JSON.parse(fs.readFileSync(path.join(EXT, 'manifest.json'), 'utf8'));
const version = manifiesto.version;
console.log(`   ${manifiesto.name}  v${version}`);

const problemas = [];

const reglas = path.join(EXT, 'reglas', 'red.json');
if (!fs.existsSync(reglas)) {
  problemas.push('No existe extension/reglas/red.json. Correr construir.mjs ANTES de empaquetar.');
} else {
  // Reglas rancias = publicar cobertura vieja sin darse cuenta.
  const dias = (Date.now() - fs.statSync(reglas).mtimeMs) / 86400000;
  if (dias > 2) {
    problemas.push(
      `Las reglas tienen ${dias.toFixed(1)} dias. Las listas base cambian a diario: ` +
      'recompilar con construir.mjs antes de subir.'
    );
  }
}

// Sin scriptlets la extension se instala y YouTube sigue mostrando anuncios de
// video, sin que nada lo avise. Mismo criterio que con red.json.
const scriptlets = path.join(EXT, 'reglas', 'scriptlets.json');
if (!fs.existsSync(scriptlets)) {
  problemas.push('No existe extension/reglas/scriptlets.json. Correr construir.mjs ANTES de empaquetar.');
} else {
  const s = JSON.parse(fs.readFileSync(scriptlets, 'utf8'));
  const dias = (Date.now() - new Date(s.compilado).getTime()) / 86400000;
  if (dias > 2) problemas.push(`Los scriptlets de YouTube tienen ${dias.toFixed(1)} dias: YouTube los esquiva rapido. Recompilar.`);
  if (!s.reglasCompiladas) problemas.push('scriptlets.json no tiene ninguna regla compilada.');
  for (const m of Object.values(s.mundos || {})) {
    if (!fs.existsSync(path.join(EXT, m.archivo))) problemas.push(`Falta ${m.archivo}.`);
  }
}

if (/^0\./.test(version)) {
  console.log(`\n   AVISO: la version empieza en 0.x, que le dice al usuario "esto es un`);
  console.log(`   experimento". Si la extension ya esta verificada, 1.0.0 es mas honesto.`);
}

if (problemas.length) {
  console.log('\n================ NO SE EMPAQUETA ================\n');
  for (const p of problemas) console.log(`   X  ${p}`);
  console.log('');
  process.exit(1);
}

// --- 2. Preparar una copia limpia ---
const nombre = `filtros-mx-${version}`;
const escenario = path.join(SALIDA, nombre);
fs.rmSync(escenario, { recursive: true, force: true });
fs.mkdirSync(escenario, { recursive: true });

console.log('\n=== LO QUE VIAJA ===\n');
for (const item of INCLUIR) {
  const origen = path.join(EXT, item);
  if (!fs.existsSync(origen)) {
    console.log(`   !  falta ${item}`);
    continue;
  }
  copiar(origen, path.join(escenario, item));
  const st = fs.statSync(origen);
  const kb = (st.isDirectory() ? tamano(origen) : st.size) / 1024;
  console.log(`   ok ${item.padEnd(14)} ${kb.toFixed(0).padStart(6)} KB`);
}

// --- 2-bis. Lo que el codigo pide y el paquete no lleva ---
//
// La lista blanca protege de meter basura, pero FALLA EN SILENCIO en la
// direccion contraria: se anade una carpeta al proyecto, nadie actualiza
// INCLUIR, y el paquete sale sin ella. Paso con bienvenida/ y no lo habria
// visto nadie hasta que un usuario instalara y se encontrara una pestana de
// error. Asi que se comprueba al reves: se lee lo que el codigo pide por
// getURL() y se exige que este en el ZIP.
const pedidos = new Set();
(function escanear(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { escanear(p); continue; }
    if (!/\.(js|html)$/.test(e.name)) continue;
    for (const m of fs.readFileSync(p, 'utf8').matchAll(/getURL\(\s*['"]([^'"]+)['"]/g)) {
      pedidos.add(m[1].replace(/^\//, ''));
    }
  }
})(escenario);

const rotos = [...pedidos].filter((r) => !fs.existsSync(path.join(escenario, r.split(/[?#]/)[0])));
if (rotos.length) {
  console.log('\n=== ROTO: el codigo pide archivos que el paquete NO lleva ===\n');
  for (const r of rotos) console.log(`   !  ${r}`);
  console.log('\nAnade lo que falte a INCLUIR. Publicar esto instala una extension que falla.');
  process.exit(1);
}
if (pedidos.size) {
  console.log(`\n   (${pedidos.size} rutas pedidas por el codigo, todas presentes)`);
}

// --- 2-ter. Textos que el codigo pide y algun idioma no tiene ---
//
// Una clave que falta no da error: Chrome devuelve "" (i18n.js cae al nombre
// de la clave) y el usuario ve "coladosTitulo" en medio del popup. Se exige
// que cada clave pedida exista en TODOS los idiomas del paquete.
{
  const idiomas = fs.readdirSync(path.join(escenario, '_locales'));
  const claves = new Set();
  (function escanear(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) { if (e.name !== 'reglas' && e.name !== '_locales') escanear(p); continue; }
      if (!/\.(js|html|json)$/.test(e.name)) continue;
      const txt = fs.readFileSync(p, 'utf8');
      for (const m of txt.matchAll(/__MSG_(\w+)__/g)) claves.add(m[1]);
      for (const m of txt.matchAll(/data-i18n(?:-html|-title|-aria)?="(\w+)"/g)) claves.add(m[1]);
      for (const m of txt.matchAll(/\b(?:t|getMessage)\(\s*'(\w+)'/g)) claves.add(m[1]);
    }
  })(escenario);
  const faltan = [];
  for (const id of idiomas) {
    const msgs = JSON.parse(fs.readFileSync(path.join(escenario, '_locales', id, 'messages.json'), 'utf8'));
    for (const c of claves) if (!msgs[c]) faltan.push(`${id}: ${c}`);
  }
  if (faltan.length) {
    console.log('\n=== ROTO: textos pedidos por el codigo que no existen ===\n');
    for (const f of faltan) console.log(`   !  ${f}`);
    console.log('\nAnadelos en generar-locales.mjs y vuelve a generar.');
    process.exit(1);
  }
  console.log(`   (${claves.size} textos pedidos por el codigo, presentes en: ${idiomas.join(', ')})`);
}

// --- 3. Lo que se queda fuera, dicho en voz alta ---
const fuera = fs.readdirSync(EXT).filter((f) => !INCLUIR.includes(f));
if (fuera.length) {
  console.log('\n=== LO QUE SE QUEDA FUERA, A PROPOSITO ===\n');
  for (const f of fuera) {
    const por = f === '_metadata' ? 'lo genera Chrome al cargar descomprimida'
      : f === 'TIENDA.md' ? 'notas internas del proyecto'
      : f === '.gitignore' ? 'no pinta nada en un paquete'
      : f === 'README.md' ? 'documentacion para quien lea el repositorio'
      : f === 'tienda-capturas' ? 'imagenes de la ficha: se suben aparte, no dentro del ZIP'
      : /^tienda-descripcion/.test(f) ? 'texto de la ficha: se pega en el panel, no viaja'
      : 'no esta en la lista blanca';
    console.log(`   -  ${f.padEnd(14)} ${por}`);
  }
}

// --- 4. Comprimir ---
//
// NO con Compress-Archive de PowerShell. Comprobado el 13-ago-2026 al empaquetar
// para publicar por primera vez: escribe los nombres con "\" DENTRO del ZIP
// ("bienvenida\bienvenida.html"), y la especificacion del formato exige "/".
// Segun quien lo abra, eso produce un archivo llamado "src\fondo.js" en vez de
// una carpeta src — una extension que instala rota, con el fallo apareciendo en
// el equipo de otro. bsdtar viene de serie en Windows 10+ y escribe bien.
const zip = path.join(SALIDA, `${nombre}.zip`);
fs.rmSync(zip, { force: true });

const bsdtar = process.platform === 'win32'
  ? path.join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'tar.exe')
  : 'tar';
execFileSync(bsdtar, [
  '-a', '-c', '-f', zip,
  ...INCLUIR.filter((i) => fs.existsSync(path.join(escenario, i))),
], { cwd: escenario, stdio: 'inherit' });

// Y se comprueba, en vez de confiar: se leen los nombres del propio ZIP.
const crudo = fs.readFileSync(zip);
const malos = [];
for (let i = 0; i + 30 < crudo.length; i++) {
  if (crudo.readUInt32LE(i) !== 0x04034b50) continue;
  const largo = crudo.readUInt16LE(i + 26);
  const nom = crudo.toString('utf8', i + 30, i + 30 + largo);
  if (nom.includes('\\')) malos.push(nom);
}
if (malos.length) {
  console.log('\n=== ROTO: el ZIP lleva rutas con "\\" ===\n');
  for (const m of malos.slice(0, 5)) console.log('   ! ' + m);
  console.log('\nEse ZIP no se sube: instala una extension con carpetas falsas.');
  process.exit(1);
}

const mb = fs.statSync(zip).size / 1048576;
fs.rmSync(escenario, { recursive: true, force: true });

console.log('\n================ LISTO ================\n');
console.log(`   ${path.relative(process.cwd(), zip)}`);
console.log(`   ${mb.toFixed(1)} MB\n`);
console.log('Se sube en https://chrome.google.com/webstore/devconsole con la');
// La cuenta de desarrollador NO se nombra aqui: este archivo es publico desde
// el 7-oct-2026, y publicar la cuenta con la que se entra al panel de la tienda
// solo le da a alguien un blanco para phishing.
console.log('cuenta de desarrollador del proyecto.\n');
console.log('LO QUE ESTE PAQUETE NO RESUELVE, y la tienda va a pedir:');
console.log('  - Formulario de privacidad (trivial: no se recolecta nada)');
console.log('  - Al menos una captura de 1280x800');
console.log('  - Los textos de la ficha, que estan en extension/TIENDA.md');
