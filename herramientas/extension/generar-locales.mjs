#!/usr/bin/env node
// Genera extension/_locales/{es,en}/messages.json desde UNA sola fuente.
//
// Existe porque dos messages.json escritos a mano se desincronizan en silencio:
// una clave que falta en ingles no da error, Chrome cae al idioma por defecto y
// el usuario ve una frase en espa~nol en medio de la interfaz en ingles. Aqui
// cada texto lleva sus dos idiomas juntos, y el script se niega a escribir si
// alguno falta.
//
// Sustituciones: {1}, {2}… en el texto. Se convierten a los placeholders con
// nombre que documenta Chrome ($P1$ con content "$1"), que es la forma que no
// depende de comportamientos sin documentar.
//
// Uso:  node herramientas/extension/generar-locales.mjs
//
// REGLA DE ESTOS TEXTOS (decidida el 7-oct-2026): venden, pero no afirman nada
// que no este medido. Nada de "bloquea mas/mejor que" — eso sigue prohibido
// hasta ejecutar el protocolo de medicion contra uBlock. Lo que se vende es lo
// que si es verdad y la competencia no trae: atrapar lo que se cuela, cero
// telemetria, ninguna lista blanca pagada, y los reportes ya aceptados.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DESTINO = path.join(HERE, '..', '..', 'extension', '_locales');

const T = {
  // --- Manifest y tienda -----------------------------------------------------
  // El titulo es lo que mas pesa en la busqueda de la tienda: lleva la frase
  // que la gente escribe ("bloqueador de anuncios") y el diferenciador.
  extName: {
    es: 'Filtros MX — Bloqueador de anuncios que atrapa los que se cuelan',
    en: 'Filtros MX — Ad blocker that catches the ads that slip through',
  },
  extShortName: { es: 'Filtros MX', en: 'Filtros MX' },
  // Codigo BCP 47 del idioma servido: va al atributo lang y a las fechas. No
  // se usa @@ui_locale porque devuelve el idioma de Chrome aunque no haya
  // traduccion (pt_BR), y fechar en portugues una interfaz en espa~nol mezcla.
  idioma: { es: 'es-MX', en: 'en-US' },
  extDescription: {
    es: 'Bloquea anuncios y rastreadores. Si alguno se cuela, te lo señala y lo quitas con un clic. Gratis, abierto y sin telemetría.',
    en: 'Blocks ads and trackers. If one slips through, it points it out and you remove it in one click. Free, open source, no telemetry.',
  },

  // --- Popup: modos ----------------------------------------------------------
  modoGrupo: { es: 'Modo en este sitio', en: 'Mode on this site' },
  modoApagado: { es: 'Apagado', en: 'Off' },
  modoBasico: { es: 'Básico', en: 'Basic' },
  modoCompleto: { es: 'Completo', en: 'Full' },
  notaApagado: { es: 'No filtra nada en este sitio.', en: 'Nothing is filtered on this site.' },
  notaBasico: {
    es: 'Solo las reglas de este sitio. Limpia menos, pero casi nunca rompe nada.',
    en: "Only this site's own rules. Cleans less, but almost never breaks anything.",
  },
  notaCompleto: {
    es: 'Máxima limpieza. Si algo se ve roto, prueba Básico.',
    en: 'Maximum cleanup. If something looks broken, try Basic.',
  },
  notaSinSitio: {
    es: 'Esta página no es un sitio web: aquí no hay nada que filtrar.',
    en: "This isn't a website, so there's nothing to filter here.",
  },
  notaExcluido: {
    es: 'Filtros MX no actúa aquí a propósito: es un sitio de trámites y no había nada que bloquear.',
    en: 'Filtros MX stays off here on purpose: it is a government services site with nothing to block.',
  },
  recargar: { es: 'Recargar para aplicar el cambio', en: 'Reload to apply the change' },

  // --- Popup: cifras ---------------------------------------------------------
  cifraOcultos: { es: 'elementos de publicidad ocultos', en: 'ad elements hidden' },
  cifraRed: { es: 'anuncios y rastreadores frenados', en: 'ad and tracker requests stopped' },
  cifraRedAyuda: {
    es: 'Peticiones de anuncios y rastreo frenadas en esta pestaña en los últimos 5 minutos: Chrome no guarda más.',
    en: 'Ad and tracker requests stopped in this tab over the last 5 minutes. Chrome keeps no more than that.',
  },
  totalDesde: {
    es: 'Desde que la instalaste: <b>{1}</b> elementos de publicidad ocultos',
    en: 'Since you installed it: <b>{1}</b> ad elements hidden',
  },

  // --- Popup: lo que se colo (antes "huecos") --------------------------------
  coladosTitulo: { es: 'Anuncios que se colaron', en: 'Ads that slipped through' },
  coladosExplica: {
    es: 'Ninguna lista los cubre todavía. Quítalos con un clic: solo afecta a tu navegador.',
    en: 'No filter list covers them yet. Remove them in one click — it only affects your browser.',
  },
  coladoServido: { es: 'Anuncio de {1} × {2}', en: 'Ad, {1} × {2}' },
  coladoVacio: { es: 'Espacio de anuncio vacío, {1} × {2}', en: 'Empty ad space, {1} × {2}' },
  coladoAlcance: {
    es: 'Quitarlo oculta {1} elementos de esta página',
    en: 'Removing it hides {1} elements on this page',
  },
  coladoFragil: {
    es: 'Puede dejar de funcionar si el sitio cambia',
    en: 'May stop working if the site changes',
  },
  quitar: { es: 'Quitar', en: 'Remove' },
  quitado: { es: 'Quitado ✓', en: 'Removed ✓' },
  quitarEnApagado: {
    es: 'Este sitio está en Apagado: cambia a Básico o Completo para que surta efecto.',
    en: 'This site is set to Off: switch to Basic or Full for this to take effect.',
  },
  reportar: {
    es: 'Avisar a EasyList para que lo corrija para todos',
    en: 'Tell EasyList so it gets fixed for everyone',
  },
  reportarNota: {
    es: 'Abre GitHub con el texto ya escrito. Tú decides si lo envías.',
    en: 'Opens GitHub with the text already written. You decide whether to send it.',
  },
  sinColados: {
    es: 'No detectamos anuncios que se colaran en esta página.',
    en: 'No ads slipping through were detected on this page.',
  },
  ceguera: {
    es: 'Esta página carga publicidad que no pudimos ubicar. Si ves un anuncio, usa «Quitar un elemento».',
    en: 'This page loads ads we could not pinpoint. If you see one, use “Remove an element”.',
  },
  sinReglaUno: {
    es: 'Hay 1 anuncio que no se puede quitar con una regla segura. Si te estorba, usa «Quitar un elemento».',
    en: 'There is 1 ad that cannot be removed with a safe rule. If it bothers you, use “Remove an element”.',
  },
  sinRegla: {
    es: 'Hay {1} anuncios que no se pueden quitar con una regla segura. Si te estorban, usa «Quitar un elemento».',
    en: 'There are {1} ads that cannot be removed with a safe rule. If they bother you, use “Remove an element”.',
  },

  // --- Popup: reglas del usuario y acciones ---------------------------------
  tuyasTitulo: { es: 'Quitados por ti en este sitio', en: 'Removed by you on this site' },
  tuyasExplica: {
    es: 'Viven solo en este navegador. Puedes deshacerlos cuando quieras.',
    en: 'They live only in this browser. You can undo them any time.',
  },
  mostrar: { es: 'Mostrar', en: 'Show' },
  elegir: { es: 'Quitar un elemento', en: 'Remove an element' },
  elegirAyuda: {
    es: 'Elige con el ratón cualquier cosa de la página y desaparece, también en tus próximas visitas.',
    en: 'Pick anything on the page with your mouse and it disappears — on future visits too.',
  },
  problema: { es: '¿Algo se ve mal?', en: 'Something looks wrong?' },
  problemaAsunto: { es: 'Filtros MX: problema en {1}', en: 'Filtros MX: problem on {1}' },
  reanalizar: { es: 'Volver a analizar', en: 'Analyze again' },
  analizando: { es: 'Analizando…', en: 'Analyzing…' },
  analizado: { es: 'Analizado ✓', en: 'Analyzed ✓' },
  noAnalizable: { es: 'Aquí no se puede analizar', en: 'Cannot analyze here' },
  opciones: { es: 'Opciones', en: 'Options' },
  listasDel: { es: 'listas del {1}', en: 'lists from {1}' },
  resenaPide: {
    es: '¿Te está sirviendo? Una reseña en la tienda ayuda a que más gente encuentre Filtros MX.',
    en: 'Finding it useful? A review in the store helps more people find Filtros MX.',
  },
  resenaSi: { es: 'Dejar reseña', en: 'Leave a review' },
  resenaNo: { es: 'Ahora no', en: 'Not now' },

  insigniaColados: {
    es: 'Filtros MX: se colaron anuncios en esta página. Haz clic para quitarlos.',
    en: 'Filtros MX: some ads slipped through on this page. Click to remove them.',
  },

  // --- Selector de elementos (se pinta dentro de la pagina) -----------------
  selPista: {
    es: 'Haz clic en lo que quieras quitar · Esc para salir',
    en: 'Click what you want to remove · Esc to exit',
  },
  selUno: { es: 'Se ocultará 1 elemento', en: '1 element will be hidden' },
  selVarios: { es: 'Se ocultarán {1} elementos', en: '{1} elements will be hidden' },
  selMasGrande: { es: 'Más grande', en: 'Bigger' },
  selMasChico: { es: 'Más chico', en: 'Smaller' },
  selQuitar: { es: 'Quitar', en: 'Remove' },
  selCancelar: { es: 'Cancelar', en: 'Cancel' },
  selListo: {
    es: 'Listo: también quedará oculto en tus próximas visitas.',
    en: 'Done — it stays hidden on future visits too.',
  },
  selDeshacer: { es: 'Deshacer', en: 'Undo' },

  // --- Bienvenida -----------------------------------------------------------
  bTitulo: { es: 'Listo. Filtros MX ya está bloqueando.', en: 'Done. Filtros MX is already blocking.' },
  bLema: {
    es: 'Gratis, de código abierto y sin telemetría. Hecho en México.',
    en: 'Free, open source and no telemetry. Made in Mexico.',
  },
  bFijarTitulo: { es: 'Un paso: fíjalo en la barra', en: 'One step: pin it to the toolbar' },
  bFijar: {
    es: 'Haz clic en la pieza de rompecabezas <b>🧩</b> arriba a la derecha de Chrome y luego en la <b>chincheta</b> junto a Filtros MX. Así ves en cada página cuánta publicidad quitó, y lo tienes a mano si algo se cuela.',
    en: 'Click the puzzle piece <b>🧩</b> at the top right of Chrome, then the <b>pin</b> next to Filtros MX. That way you see how much it removed on every page, and it is at hand if something slips through.',
  },
  bHaceTitulo: { es: 'Lo que hace por ti', en: 'What it does for you' },
  bHace1: {
    es: '<b>Bloquea anuncios y rastreadores</b> desde ya, con EasyList, EasyPrivacy y EasyList Spanish: las listas abiertas que usan millones de personas. No hay nada que configurar.',
    en: '<b>Blocks ads and trackers</b> right away, using EasyList, EasyPrivacy and EasyList Spanish — the open lists used by millions of people. Nothing to configure.',
  },
  bHace2: {
    es: '<b>Atrapa los que se cuelan.</b> Cuando un anuncio se escapa de todas las listas, Filtros MX te lo señala en el icono y lo quitas con un clic.',
    en: '<b>Catches the ones that slip through.</b> When an ad escapes every list, Filtros MX points it out in its icon and you remove it in one click.',
  },
  bHace3: {
    es: '<b>Quita lo que te estorbe.</b> Con «Quitar un elemento» eliges cualquier cosa de la página y desaparece, también en tus próximas visitas.',
    en: '<b>Removes whatever gets in your way.</b> With “Remove an element” you pick anything on the page and it disappears — on future visits too.',
  },
  // YouTube, desde la 1.1.0: medido el 7-oct-2026 con 12 videos, 0 con anuncio
  // y 12 reproduciendose. Se dice "los anuncios de los videos", no "todos los
  // anuncios de YouTube para siempre": YouTube cambia y hay que seguirlo.
  bHaceYoutube: {
    es: '<b>YouTube sin anuncios de video.</b> Quita los anuncios antes y durante los videos con las reglas de uBlock Origin.',
    en: '<b>YouTube without video ads.</b> Removes the ads before and during videos using the rules of uBlock Origin.',
  },
  bHace4: {
    es: '<b>Tú mandas en cada sitio.</b> Completo para la máxima limpieza, Básico si un sitio se porta raro, Apagado si lo quieres apoyar.',
    en: '<b>You decide on every site.</b> Full for maximum cleanup, Basic if a site acts up, Off if you want to support it.',
  },
  bPrivTitulo: { es: 'Tu privacidad, sin letra chiquita', en: 'Your privacy, no fine print' },
  bPriv1: {
    es: '<b>Cero telemetría.</b> Todo ocurre en tu equipo: ni lo que ves ni lo que bloqueas sale de tu navegador.',
    en: '<b>Zero telemetry.</b> Everything happens on your device: neither what you browse nor what gets blocked leaves your browser.',
  },
  bPriv2: {
    es: '<b>Sin «anuncios aceptables» pagados.</b> Ningún anunciante puede pagar para pasar el filtro. Nunca.',
    en: '<b>No paid “acceptable ads”.</b> No advertiser can pay to get past the filter. Ever.',
  },
  bPriv3: {
    es: '<b>Gratis de verdad.</b> Sin versión de paga, sin cuentas y con el código abierto para quien quiera revisarlo.',
    en: '<b>Truly free.</b> No paid tier, no accounts, and the code is open for anyone to review.',
  },
  bTodosTitulo: { es: 'Ya mejoró internet para todos', en: 'It has already improved the web for everyone' },
  bTodos: {
    es: 'Los anuncios que Filtros MX encontró en periódicos mexicanos se reportaron a EasyList Spanish: <b>12 reportes, 11 ya corregidos del todo</b>. Hoy los bloquea cualquiera que use esas listas, use el bloqueador que use. Si encuentras uno, la extensión te prepara el reporte.',
    en: 'The ads Filtros MX found on Mexican news sites were reported to EasyList Spanish: <b>12 reports, 11 already fully fixed</b>. Today anyone using those lists blocks them, whatever blocker they use. If you find one, the extension drafts the report for you.',
  },
  bAbrirOpciones: { es: 'Abrir opciones', en: 'Open options' },
  bVerCodigo: { es: 'Ver el código', en: 'See the code' },

  // --- Opciones -------------------------------------------------------------
  oTitulo: { es: 'Filtros MX — Opciones', en: 'Filtros MX — Options' },
  oFiltrado: { es: 'Filtrado', en: 'Filtering' },
  oCosmeticas: { es: 'Ocultar los espacios de publicidad', en: 'Hide ad spaces' },
  oCosmeticasAyuda: {
    es: 'Cierra el espacio que deja el anuncio. Es la mayor parte del trabajo de las listas: apagarlo deja casi todo sin efecto.',
    en: 'Closes the space the ad leaves behind. It is most of what the lists do: turning it off leaves almost everything without effect.',
  },
  oGenericas: {
    es: 'Limpieza completa en todos los sitios <span class="suave">· recomendado</span>',
    en: 'Full cleanup on every site <span class="suave">· recommended</span>',
  },
  oGenericasAyuda: {
    es: 'Aplica también las reglas generales, que no nombran ningún sitio. Es lo que más limpia. Si un sitio se ve roto, ponlo en <em>Básico</em> desde el icono. Apagado, todos los sitios arrancan en Básico.',
    en: 'Also applies the general rules, which do not name any site. This is what cleans the most. If a site looks broken, set it to <em>Basic</em> from the icon. When off, every site starts in Basic.',
  },
  oDetector: { es: 'Avisarme de los anuncios que se cuelan', en: 'Tell me about ads that slip through' },
  oDetectorAyuda: {
    es: 'Busca en cada página la publicidad que ninguna lista cubre. El análisis es local: no sale nada de tu equipo.',
    en: 'Looks on every page for ads no list covers. The analysis is local: nothing leaves your device.',
  },
  oSitios: { es: 'Sitios con modo propio', en: 'Sites with their own mode' },
  oSitiosAyuda: {
    es: 'Lo que fijas con los botones del icono, administrado desde aquí.',
    en: 'What you set with the buttons in the icon, managed from here.',
  },
  oSitiosVacio: {
    es: 'Ninguno: todos los sitios usan el modo predeterminado.',
    en: 'None: every site uses the default mode.',
  },
  oVolver: { es: 'Volver al predeterminado', en: 'Back to default' },
  oTuyas: { es: 'Quitados por ti', en: 'Removed by you' },
  oTuyasAyuda: {
    es: 'Lo que quitaste con «Quitar» o «Quitar un elemento». Son reglas tuyas: viven en este equipo y no se mandan a ningún lado.',
    en: 'What you removed with “Remove” or “Remove an element”. They are your own rules: they live on this device and are never sent anywhere.',
  },
  oTuyasVacio: {
    es: 'Ninguno todavía. «Quitar un elemento», en el icono, crea el primero.',
    en: 'None yet. “Remove an element”, in the icon, creates the first one.',
  },
  oMostrarDeNuevo: { es: 'Mostrar de nuevo', en: 'Show again' },
  oAplicando: { es: 'Qué se está aplicando', en: 'What is being applied' },
  oFilaRed: { es: 'Reglas de red activas', en: 'Active network rules' },
  oFilaLineas: { es: 'Líneas de filtro compiladas', en: 'Filter lines compiled' },
  oFilaDominios: { es: 'Sitios con reglas propias', en: 'Sites with their own rules' },
  oFilaSelectores: { es: 'Reglas para ocultar publicidad', en: 'Rules to hide ads' },
  oFilaExtendidas: { es: 'Reglas avanzadas aplicadas por el motor propio', en: 'Advanced rules applied by our own engine' },
  oFilaNoExt: { es: 'No aplicables: reglas avanzadas fuera del motor', en: 'Not applicable: advanced rules outside the engine' },
  oFilaNoScript: { es: 'No aplicables: scriptlets de uBlock Origin', en: 'Not applicable: uBlock Origin scriptlets' },
  oFilaNoRegex: { es: 'No aplicables: expresiones regulares', en: 'Not applicable: regular expressions' },
  oFilaNoPopup: { es: 'No aplicables: bloqueo de ventanas emergentes', en: 'Not applicable: pop-up blocking' },
  oFilaYoutube: { es: 'Reglas para YouTube (uBlock Origin {1})', en: 'Rules for YouTube (uBlock Origin {1})' },
  oFilaRecortadas: { es: 'Recortadas por el límite de Chrome', en: 'Cut by the Chrome limit' },
  oFilaFecha: { es: 'Listas compiladas el', en: 'Lists compiled on' },
  oComo: { es: 'Cómo funciona', en: 'How it works' },
  oComo1: {
    es: 'Filtros MX bloquea con las <strong>mismas listas públicas</strong> que usan los bloqueadores más extendidos —EasyList, EasyPrivacy y EasyList Spanish—, mantenidas por cientos de personas. <strong>Tu copia es la del día que marca la tabla de arriba</strong> y se renueva con cada versión de la extensión.',
    en: 'Filtros MX blocks with the <strong>same public lists</strong> the most widely used blockers rely on — EasyList, EasyPrivacy and EasyList Spanish — maintained by hundreds of people. <strong>Your copy is from the date shown in the table above</strong> and is renewed with every version of the extension.',
  },
  oComo2: {
    es: 'Encima de eso, <strong>atrapa la publicidad que ninguna lista cubre</strong> en la página que estás viendo, te deja quitarla con un clic y, si quieres, prepara el reporte para que se corrija para todos.',
    en: 'On top of that, it <strong>catches the ads no list covers</strong> on the page you are viewing, lets you remove them in one click and, if you want, drafts the report so they get fixed for everyone.',
  },
  oComo3: {
    es: 'La tabla de arriba enseña también <strong>lo que no se pudo aplicar</strong>. Un bloqueador que solo presume lo que sí entró te hace creer que estás más protegido de lo que estás.',
    en: 'The table above also shows <strong>what could not be applied</strong>. A blocker that only shows off what made it in makes you believe you are better protected than you are.',
  },
  oCredito: {
    es: 'Las listas base son de The EasyList authors, bajo GPLv3 y CC BY-SA 3.0. Las reglas y el motor de YouTube son de uBlock Origin (Raymond Hill y colaboradores), bajo GPLv3.',
    en: 'The base lists are by The EasyList authors, under GPLv3 and CC BY-SA 3.0. The YouTube rules and engine are by uBlock Origin (Raymond Hill and contributors), under GPLv3.',
  },
  oVerBienvenida: { es: 'Volver a ver la página de bienvenida', en: 'See the welcome page again' },
};

const IDIOMAS = ['es', 'en'];

const faltan = [];
for (const [clave, textos] of Object.entries(T)) {
  for (const id of IDIOMAS) if (!textos[id]) faltan.push(`${clave}.${id}`);
}
if (faltan.length) {
  console.error('FALTAN TEXTOS, no se escribe nada:\n  ' + faltan.join('\n  '));
  process.exit(1);
}

for (const id of IDIOMAS) {
  const salida = {};
  for (const [clave, textos] of Object.entries(T)) {
    const placeholders = {};
    const message = textos[id].replace(/\$/g, '$$$$').replace(/\{(\d)\}/g, (_, n) => {
      placeholders['p' + n] = { content: '$' + n };
      return `$P${n}$`;
    });
    salida[clave] = Object.keys(placeholders).length ? { message, placeholders } : { message };
  }
  const dir = path.join(DESTINO, id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'messages.json'), JSON.stringify(salida, null, 2) + '\n');
}

// Limites de la tienda: el nombre del manifest admite 75 caracteres y la
// descripcion 132. Pasarse no da error al cargar: lo rechaza la tienda al subir.
for (const id of IDIOMAS) {
  const n = [...T.extName[id]].length;
  const d = [...T.extDescription[id]].length;
  if (n > 75 || d > 132) {
    console.error(`[${id}] fuera de limite: nombre ${n}/75, descripcion ${d}/132`);
    process.exit(1);
  }
  console.log(`[${id}] nombre ${n}/75 · descripcion ${d}/132`);
}
console.log(`${Object.keys(T).length} textos escritos en ${IDIOMAS.join(', ')}.`);
