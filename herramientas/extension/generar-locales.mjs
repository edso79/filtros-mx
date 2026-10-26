#!/usr/bin/env node
// Genera extension/_locales/*/messages.json desde UNA sola fuente.
//
// Existe porque varios messages.json escritos a mano se desincronizan en
// silencio: una clave que falta en ingles no da error, Chrome cae al idioma por
// defecto y el usuario ve una frase en espa~nol en medio de la interfaz en
// ingles. Aqui cada texto lleva todos sus idiomas juntos, y el script se niega
// a escribir si alguno falta.
//
// Idiomas: espa~nol, ingles (el de reserva desde la 1.2.0: un Chrome en un
// idioma que no tenemos ve la extension en ingles, no en espa~nol), portugues,
// y aleman, frances, italiano, neerlandes, polaco, ruso y chino.
// El portugues entra porque medido el 23-oct-2026 buena parte de las
// instalaciones vienen de navegadores en portugues de Brasil, que hasta hoy
// veian la extension en espa~nol. Se escribe en pt_BR y pt_PT con el mismo
// texto: Chrome no tiene un "pt" a secas, y sin pt_PT un navegador de Portugal
// caeria al espa~nol.
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
    pt: 'Filtros MX — Bloqueador de anúncios que pega os que escapam',
  },
  extShortName: { es: 'Filtros MX', en: 'Filtros MX', pt: 'Filtros MX' },
  // Codigo BCP 47 del idioma servido: va al atributo lang y a las fechas. No
  // se usa @@ui_locale porque devuelve el idioma de Chrome aunque no haya
  // traduccion, y fechar en otro idioma que la interfaz mezcla.
  idioma: { es: 'es-MX', en: 'en-US', pt: 'pt-BR' },
  extDescription: {
    es: 'Bloquea anuncios y rastreadores. Si alguno se cuela, te lo señala y lo quitas con un clic. Gratis, abierto y sin telemetría.',
    en: 'Blocks ads and trackers. If one slips through, it points it out and you remove it in one click. Free, open source, no telemetry.',
    pt: 'Bloqueia anúncios e rastreadores. Se algum escapar, ele mostra e você remove com um clique. Grátis, aberto e sem telemetria.',
  },

  // --- Popup: modos ----------------------------------------------------------
  modoGrupo: { es: 'Modo en este sitio', en: 'Mode on this site', pt: 'Modo neste site' },
  modoApagado: { es: 'Apagado', en: 'Off', pt: 'Desligado' },
  modoBasico: { es: 'Básico', en: 'Basic', pt: 'Básico' },
  modoCompleto: { es: 'Completo', en: 'Full', pt: 'Completo' },
  notaApagado: { es: 'No filtra nada en este sitio.', en: 'Nothing is filtered on this site.', pt: 'Nada é filtrado neste site.' },
  notaBasico: {
    es: 'Solo las reglas de este sitio. Limpia menos, pero casi nunca rompe nada.',
    en: "Only this site's own rules. Cleans less, but almost never breaks anything.",
    pt: 'Só as regras deste site. Limpa menos, mas quase nunca quebra nada.',
  },
  notaCompleto: {
    es: 'Máxima limpieza. Si algo se ve roto, prueba Básico.',
    en: 'Maximum cleanup. If something looks broken, try Basic.',
    pt: 'Limpeza máxima. Se algo parecer quebrado, experimente o Básico.',
  },
  notaSinSitio: {
    es: 'Esta página no es un sitio web: aquí no hay nada que filtrar.',
    en: "This isn't a website, so there's nothing to filter here.",
    pt: 'Esta página não é um site: aqui não há nada para filtrar.',
  },
  notaExcluido: {
    es: 'Filtros MX no actúa aquí a propósito: es un sitio de trámites y no había nada que bloquear.',
    en: 'Filtros MX stays off here on purpose: it is a government services site with nothing to block.',
    pt: 'O Filtros MX fica desligado aqui de propósito: é um site de serviços do governo, sem nada para bloquear.',
  },
  recargar: { es: 'Recargar para aplicar el cambio', en: 'Reload to apply the change', pt: 'Recarregar para aplicar a mudança' },

  // --- Popup: cifras ---------------------------------------------------------
  cifraOcultos: { es: 'elementos de publicidad ocultos', en: 'ad elements hidden', pt: 'elementos de publicidade ocultos' },
  cifraRed: { es: 'anuncios y rastreadores frenados', en: 'ad and tracker requests stopped', pt: 'anúncios e rastreadores barrados' },
  cifraRedAyuda: {
    es: 'Peticiones de anuncios y rastreo frenadas en esta pestaña en los últimos 5 minutos: Chrome no guarda más.',
    en: 'Ad and tracker requests stopped in this tab over the last 5 minutes. Chrome keeps no more than that.',
    pt: 'Requisições de anúncios e rastreamento barradas nesta aba nos últimos 5 minutos: o Chrome não guarda mais que isso.',
  },
  totalDesde: {
    es: 'Desde que la instalaste: <b>{1}</b> elementos de publicidad ocultos',
    en: 'Since you installed it: <b>{1}</b> ad elements hidden',
    pt: 'Desde que você instalou: <b>{1}</b> elementos de publicidade ocultos',
  },

  // --- Popup: lo que se colo (antes "huecos") --------------------------------
  coladosTitulo: { es: 'Anuncios que se colaron', en: 'Ads that slipped through', pt: 'Anúncios que escaparam' },
  coladosExplica: {
    es: 'Ninguna lista los cubre todavía. Quítalos con un clic: solo afecta a tu navegador.',
    en: 'No filter list covers them yet. Remove them in one click — it only affects your browser.',
    pt: 'Nenhuma lista os cobre ainda. Remova com um clique: só afeta o seu navegador.',
  },
  coladoServido: { es: 'Anuncio de {1} × {2}', en: 'Ad, {1} × {2}', pt: 'Anúncio de {1} × {2}' },
  coladoVacio: { es: 'Espacio de anuncio vacío, {1} × {2}', en: 'Empty ad space, {1} × {2}', pt: 'Espaço de anúncio vazio, {1} × {2}' },
  coladoAlcance: {
    es: 'Quitarlo oculta {1} elementos de esta página',
    en: 'Removing it hides {1} elements on this page',
    pt: 'Removê-lo oculta {1} elementos desta página',
  },
  coladoFragil: {
    es: 'Puede dejar de funcionar si el sitio cambia',
    en: 'May stop working if the site changes',
    pt: 'Pode parar de funcionar se o site mudar',
  },
  quitar: { es: 'Quitar', en: 'Remove', pt: 'Remover' },
  quitado: { es: 'Quitado ✓', en: 'Removed ✓', pt: 'Removido ✓' },
  quitarEnApagado: {
    es: 'Este sitio está en Apagado: cambia a Básico o Completo para que surta efecto.',
    en: 'This site is set to Off: switch to Basic or Full for this to take effect.',
    pt: 'Este site está em Desligado: mude para Básico ou Completo para que tenha efeito.',
  },
  reportar: {
    es: 'Avisar a EasyList para que lo corrija para todos',
    en: 'Tell EasyList so it gets fixed for everyone',
    pt: 'Avisar a EasyList para que corrija para todos',
  },
  reportarNota: {
    es: 'Abre GitHub con el texto ya escrito. Tú decides si lo envías.',
    en: 'Opens GitHub with the text already written. You decide whether to send it.',
    pt: 'Abre o GitHub com o texto já escrito. Você decide se envia.',
  },
  sinColados: {
    es: 'No detectamos anuncios que se colaran en esta página.',
    en: 'No ads slipping through were detected on this page.',
    pt: 'Não detectamos anúncios que tenham escapado nesta página.',
  },
  ceguera: {
    es: 'Esta página carga publicidad que no pudimos ubicar. Si ves un anuncio, usa «Quitar un elemento».',
    en: 'This page loads ads we could not pinpoint. If you see one, use “Remove an element”.',
    pt: 'Esta página carrega publicidade que não conseguimos localizar. Se vir um anúncio, use “Remover um elemento”.',
  },
  sinReglaUno: {
    es: 'Hay 1 anuncio que no se puede quitar con una regla segura. Si te estorba, usa «Quitar un elemento».',
    en: 'There is 1 ad that cannot be removed with a safe rule. If it bothers you, use “Remove an element”.',
    pt: 'Há 1 anúncio que não dá para remover com uma regra segura. Se incomodar, use “Remover um elemento”.',
  },
  sinRegla: {
    es: 'Hay {1} anuncios que no se pueden quitar con una regla segura. Si te estorban, usa «Quitar un elemento».',
    en: 'There are {1} ads that cannot be removed with a safe rule. If they bother you, use “Remove an element”.',
    pt: 'Há {1} anúncios que não dá para remover com uma regra segura. Se incomodarem, use “Remover um elemento”.',
  },

  // --- Popup: reglas del usuario y acciones ---------------------------------
  tuyasTitulo: { es: 'Quitados por ti en este sitio', en: 'Removed by you on this site', pt: 'Removidos por você neste site' },
  tuyasExplica: {
    es: 'Viven solo en este navegador. Puedes deshacerlos cuando quieras.',
    en: 'They live only in this browser. You can undo them any time.',
    pt: 'Ficam só neste navegador. Você pode desfazer quando quiser.',
  },
  mostrar: { es: 'Mostrar', en: 'Show', pt: 'Mostrar' },
  elegir: { es: 'Quitar un elemento', en: 'Remove an element', pt: 'Remover um elemento' },
  elegirAyuda: {
    es: 'Elige con el ratón cualquier cosa de la página y desaparece, también en tus próximas visitas.',
    en: 'Pick anything on the page with your mouse and it disappears — on future visits too.',
    pt: 'Escolha com o mouse qualquer coisa da página e ela some, também nas próximas visitas.',
  },
  problema: { es: '¿Algo se ve mal?', en: 'Something looks wrong?', pt: 'Algo parece errado?' },
  problemaAsunto: { es: 'Filtros MX: problema en {1}', en: 'Filtros MX: problem on {1}', pt: 'Filtros MX: problema em {1}' },
  reanalizar: { es: 'Volver a analizar', en: 'Analyze again', pt: 'Analisar de novo' },
  analizando: { es: 'Analizando…', en: 'Analyzing…', pt: 'Analisando…' },
  analizado: { es: 'Analizado ✓', en: 'Analyzed ✓', pt: 'Analisado ✓' },
  noAnalizable: { es: 'Aquí no se puede analizar', en: 'Cannot analyze here', pt: 'Não dá para analisar aqui' },
  opciones: { es: 'Opciones', en: 'Options', pt: 'Opções' },
  listasDel: { es: 'listas del {1}', en: 'lists from {1}', pt: 'listas de {1}' },
  resenaPide: {
    es: '¿Te está sirviendo? Una reseña en la tienda ayuda a que más gente encuentre Filtros MX.',
    en: 'Finding it useful? A review in the store helps more people find Filtros MX.',
    pt: 'Está sendo útil? Uma avaliação na loja ajuda mais gente a encontrar o Filtros MX.',
  },
  resenaSi: { es: 'Dejar reseña', en: 'Leave a review', pt: 'Avaliar' },
  resenaNo: { es: 'Ahora no', en: 'Not now', pt: 'Agora não' },

  insigniaColados: {
    es: 'Filtros MX: se colaron anuncios en esta página. Haz clic para quitarlos.',
    en: 'Filtros MX: some ads slipped through on this page. Click to remove them.',
    pt: 'Filtros MX: alguns anúncios escaparam nesta página. Clique para removê-los.',
  },

  // --- Selector de elementos (se pinta dentro de la pagina) -----------------
  selPista: {
    es: 'Haz clic en lo que quieras quitar · Esc para salir',
    en: 'Click what you want to remove · Esc to exit',
    pt: 'Clique no que quer remover · Esc para sair',
  },
  selUno: { es: 'Se ocultará 1 elemento', en: '1 element will be hidden', pt: '1 elemento será ocultado' },
  selVarios: { es: 'Se ocultarán {1} elementos', en: '{1} elements will be hidden', pt: '{1} elementos serão ocultados' },
  selMasGrande: { es: 'Más grande', en: 'Bigger', pt: 'Maior' },
  selMasChico: { es: 'Más chico', en: 'Smaller', pt: 'Menor' },
  selQuitar: { es: 'Quitar', en: 'Remove', pt: 'Remover' },
  selCancelar: { es: 'Cancelar', en: 'Cancel', pt: 'Cancelar' },
  selListo: {
    es: 'Listo: también quedará oculto en tus próximas visitas.',
    en: 'Done — it stays hidden on future visits too.',
    pt: 'Pronto: também vai ficar oculto nas próximas visitas.',
  },
  selDeshacer: { es: 'Deshacer', en: 'Undo', pt: 'Desfazer' },

  // --- Bienvenida -----------------------------------------------------------
  bTitulo: { es: 'Listo. Filtros MX ya está bloqueando.', en: 'Done. Filtros MX is already blocking.', pt: 'Pronto. O Filtros MX já está bloqueando.' },
  bLema: {
    es: 'Gratis, de código abierto y sin telemetría. Hecho en México.',
    en: 'Free, open source and no telemetry. Made in Mexico.',
    pt: 'Grátis, de código aberto e sem telemetria. Feito no México.',
  },
  bFijarTitulo: { es: 'Un paso: fíjalo en la barra', en: 'One step: pin it to the toolbar', pt: 'Um passo: fixe na barra' },
  bFijar: {
    es: 'Haz clic en la pieza de rompecabezas <b>🧩</b> arriba a la derecha de Chrome y luego en la <b>chincheta</b> junto a Filtros MX. Así ves en cada página cuánta publicidad quitó, y lo tienes a mano si algo se cuela.',
    en: 'Click the puzzle piece <b>🧩</b> at the top right of Chrome, then the <b>pin</b> next to Filtros MX. That way you see how much it removed on every page, and it is at hand if something slips through.',
    pt: 'Clique na peça de quebra-cabeça <b>🧩</b> no canto superior direito do Chrome e depois no <b>alfinete</b> ao lado do Filtros MX. Assim você vê em cada página quanta publicidade ele removeu, e fica à mão se algo escapar.',
  },
  bHaceTitulo: { es: 'Lo que hace por ti', en: 'What it does for you', pt: 'O que ele faz por você' },
  // Cada idioma nombra las listas que de verdad le tocan: en portugues se
  // enciende sola EasyList Portuguese, y eso es lo que le importa a quien lee.
  bHace1: {
    es: '<b>Bloquea anuncios y rastreadores</b> desde ya, con EasyList, EasyPrivacy y EasyList Spanish: las listas abiertas que usan millones de personas. No hay nada que configurar.',
    en: '<b>Blocks ads and trackers</b> right away, using EasyList, EasyPrivacy and EasyList Spanish — the open lists used by millions of people. Nothing to configure.',
    pt: '<b>Bloqueia anúncios e rastreadores</b> desde já, com EasyList, EasyPrivacy e EasyList Portuguese: as listas abertas que milhões de pessoas usam. Não há nada para configurar.',
  },
  bHace2: {
    es: '<b>Atrapa los que se cuelan.</b> Cuando un anuncio se escapa de todas las listas, Filtros MX te lo señala en el icono y lo quitas con un clic.',
    en: '<b>Catches the ones that slip through.</b> When an ad escapes every list, Filtros MX points it out in its icon and you remove it in one click.',
    pt: '<b>Pega os que escapam.</b> Quando um anúncio passa por todas as listas, o Filtros MX mostra no ícone e você remove com um clique.',
  },
  bHace3: {
    es: '<b>Quita lo que te estorbe.</b> Con «Quitar un elemento» eliges cualquier cosa de la página y desaparece, también en tus próximas visitas.',
    en: '<b>Removes whatever gets in your way.</b> With “Remove an element” you pick anything on the page and it disappears — on future visits too.',
    pt: '<b>Remove o que atrapalha.</b> Com “Remover um elemento” você escolhe qualquer coisa da página e ela some, também nas próximas visitas.',
  },
  // YouTube, desde la 1.1.0: medido el 7-oct-2026 con 12 videos, 0 con anuncio
  // y 12 reproduciendose. Se dice "los anuncios de los videos", no "todos los
  // anuncios de YouTube para siempre": YouTube cambia y hay que seguirlo.
  bHaceYoutube: {
    es: '<b>YouTube sin anuncios de video.</b> Quita los anuncios antes y durante los videos con las reglas de uBlock Origin.',
    en: '<b>YouTube without video ads.</b> Removes the ads before and during videos using the rules of uBlock Origin.',
    pt: '<b>YouTube sem anúncios em vídeo.</b> Remove os anúncios antes e durante os vídeos com as regras do uBlock Origin.',
  },
  bHace4: {
    es: '<b>Tú mandas en cada sitio.</b> Completo para la máxima limpieza, Básico si un sitio se porta raro, Apagado si lo quieres apoyar.',
    en: '<b>You decide on every site.</b> Full for maximum cleanup, Basic if a site acts up, Off if you want to support it.',
    pt: '<b>Você manda em cada site.</b> Completo para a limpeza máxima, Básico se um site se comportar mal, Desligado se quiser apoiá-lo.',
  },
  bPrivTitulo: { es: 'Tu privacidad, sin letra chiquita', en: 'Your privacy, no fine print', pt: 'Sua privacidade, sem letras miúdas' },
  bPriv1: {
    es: '<b>Cero telemetría.</b> Todo ocurre en tu equipo: ni lo que ves ni lo que bloqueas sale de tu navegador.',
    en: '<b>Zero telemetry.</b> Everything happens on your device: neither what you browse nor what gets blocked leaves your browser.',
    pt: '<b>Zero telemetria.</b> Tudo acontece no seu computador: nem o que você vê nem o que é bloqueado sai do seu navegador.',
  },
  bPriv2: {
    es: '<b>Sin «anuncios aceptables» pagados.</b> Ningún anunciante puede pagar para pasar el filtro. Nunca.',
    en: '<b>No paid “acceptable ads”.</b> No advertiser can pay to get past the filter. Ever.',
    pt: '<b>Sem “anúncios aceitáveis” pagos.</b> Nenhum anunciante pode pagar para passar pelo filtro. Nunca.',
  },
  bPriv3: {
    es: '<b>Gratis de verdad.</b> Sin versión de paga, sin cuentas y con el código abierto para quien quiera revisarlo.',
    en: '<b>Truly free.</b> No paid tier, no accounts, and the code is open for anyone to review.',
    pt: '<b>Grátis de verdade.</b> Sem versão paga, sem contas e com o código aberto para quem quiser revisar.',
  },
  bTodosTitulo: { es: 'Ya mejoró internet para todos', en: 'It has already improved the web for everyone', pt: 'Já melhorou a internet para todos' },
  bTodos: {
    es: 'Los anuncios que Filtros MX encontró en periódicos mexicanos se reportaron a EasyList Spanish: <b>12 reportes, 11 ya corregidos del todo</b>. Hoy los bloquea cualquiera que use esas listas, use el bloqueador que use. Si encuentras uno, la extensión te prepara el reporte.',
    en: 'The ads Filtros MX found on Mexican news sites were reported to EasyList Spanish: <b>12 reports, 11 already fully fixed</b>. Today anyone using those lists blocks them, whatever blocker they use. If you find one, the extension drafts the report for you.',
    pt: 'Os anúncios que o Filtros MX encontrou em jornais mexicanos foram reportados à EasyList Spanish: <b>12 relatórios, 11 já corrigidos por completo</b>. Hoje qualquer pessoa que use essas listas os bloqueia, seja qual for o bloqueador. Se você encontrar um, a extensão prepara o relatório.',
  },
  bAbrirOpciones: { es: 'Abrir opciones', en: 'Open options', pt: 'Abrir opções' },
  bVerCodigo: { es: 'Ver el código', en: 'See the code', pt: 'Ver o código' },

  // --- Opciones -------------------------------------------------------------
  oTitulo: { es: 'Filtros MX — Opciones', en: 'Filtros MX — Options', pt: 'Filtros MX — Opções' },
  oFiltrado: { es: 'Filtrado', en: 'Filtering', pt: 'Filtragem' },
  oCosmeticas: { es: 'Ocultar los espacios de publicidad', en: 'Hide ad spaces', pt: 'Ocultar os espaços de publicidade' },
  oCosmeticasAyuda: {
    es: 'Cierra el espacio que deja el anuncio. Es la mayor parte del trabajo de las listas: apagarlo deja casi todo sin efecto.',
    en: 'Closes the space the ad leaves behind. It is most of what the lists do: turning it off leaves almost everything without effect.',
    pt: 'Fecha o espaço que o anúncio deixa. É a maior parte do trabalho das listas: desligar deixa quase tudo sem efeito.',
  },
  oGenericas: {
    es: 'Limpieza completa en todos los sitios <span class="suave">· recomendado</span>',
    en: 'Full cleanup on every site <span class="suave">· recommended</span>',
    pt: 'Limpeza completa em todos os sites <span class="suave">· recomendado</span>',
  },
  oGenericasAyuda: {
    es: 'Aplica también las reglas generales, que no nombran ningún sitio. Es lo que más limpia. Si un sitio se ve roto, ponlo en <em>Básico</em> desde el icono. Apagado, todos los sitios arrancan en Básico.',
    en: 'Also applies the general rules, which do not name any site. This is what cleans the most. If a site looks broken, set it to <em>Basic</em> from the icon. When off, every site starts in Basic.',
    pt: 'Aplica também as regras gerais, que não citam nenhum site. É o que mais limpa. Se um site parecer quebrado, coloque-o em <em>Básico</em> pelo ícone. Desligado, todos os sites começam em Básico.',
  },
  oDetector: { es: 'Avisarme de los anuncios que se cuelan', en: 'Tell me about ads that slip through', pt: 'Avisar sobre anúncios que escapam' },
  oDetectorAyuda: {
    es: 'Busca en cada página la publicidad que ninguna lista cubre. El análisis es local: no sale nada de tu equipo.',
    en: 'Looks on every page for ads no list covers. The analysis is local: nothing leaves your device.',
    pt: 'Procura em cada página a publicidade que nenhuma lista cobre. A análise é local: nada sai do seu computador.',
  },

  // --- Opciones: listas (1.2.0) ----------------------------------------------
  // Una clave por grupo: oGrupo_<id> y oGrupo_<id>Ayuda. opciones.js las busca
  // por el id que trae meta.json, asi que un grupo nuevo sin texto aqui sale
  // con su id pelado — y el empaquetador lo caza antes.
  oListas: { es: 'Listas', en: 'Lists', pt: 'Listas' },
  oListasAyuda: {
    es: 'EasyList, EasyPrivacy y EasyList Spanish van siempre. Estas se suman encima.',
    en: 'EasyList, EasyPrivacy and EasyList Spanish are always on. These are added on top.',
    pt: 'EasyList, EasyPrivacy e EasyList Spanish estão sempre ligadas. Estas se somam a elas.',
  },
  oGrupo_pt: {
    es: 'Sitios en portugués <span class="suave">· EasyList Portuguese</span>',
    en: 'Portuguese-language sites <span class="suave">· EasyList Portuguese</span>',
    pt: 'Sites em português <span class="suave">· EasyList Portuguese</span>',
  },
  oGrupo_de: {
    es: 'Sitios en alemán <span class="suave">· EasyList Germany</span>',
    en: 'German-language sites <span class="suave">· EasyList Germany</span>',
    pt: 'Sites em alemão <span class="suave">· EasyList Germany</span>',
  },
  oGrupo_fr: {
    es: 'Sitios en francés <span class="suave">· Liste FR</span>',
    en: 'French-language sites <span class="suave">· Liste FR</span>',
    pt: 'Sites em francês <span class="suave">· Liste FR</span>',
  },
  oGrupo_it: {
    es: 'Sitios en italiano <span class="suave">· EasyList Italy</span>',
    en: 'Italian-language sites <span class="suave">· EasyList Italy</span>',
    pt: 'Sites em italiano <span class="suave">· EasyList Italy</span>',
  },
  oGrupo_nl: {
    es: 'Sitios en neerlandés <span class="suave">· EasyList Dutch</span>',
    en: 'Dutch-language sites <span class="suave">· EasyList Dutch</span>',
    pt: 'Sites em holandês <span class="suave">· EasyList Dutch</span>',
  },
  oGrupo_pl: {
    es: 'Sitios en polaco <span class="suave">· EasyList Polish</span>',
    en: 'Polish-language sites <span class="suave">· EasyList Polish</span>',
    pt: 'Sites em polonês <span class="suave">· EasyList Polish</span>',
  },
  oGrupo_ru: {
    es: 'Sitios en ruso y ucraniano <span class="suave">· RU AdList</span>',
    en: 'Russian and Ukrainian sites <span class="suave">· RU AdList</span>',
    pt: 'Sites em russo e ucraniano <span class="suave">· RU AdList</span>',
  },
  oGrupo_zh: {
    es: 'Sitios en chino <span class="suave">· EasyList China</span>',
    en: 'Chinese-language sites <span class="suave">· EasyList China</span>',
    pt: 'Sites em chinês <span class="suave">· EasyList China</span>',
  },
  oRegionalAyuda: {
    es: 'Se enciende sola si tu navegador está en ese idioma.',
    en: 'Turns on by itself if your browser is in that language.',
    pt: 'Liga sozinha se o seu navegador estiver nesse idioma.',
  },
  oSinCupo: {
    es: 'No cupo en el límite de reglas de Chrome junto con tus otras listas: solo se aplica la parte de ocultar.',
    en: 'It did not fit in Chrome’s rule limit together with your other lists: only the hiding part is applied.',
    pt: 'Não coube no limite de regras do Chrome junto com suas outras listas: só a parte de ocultar é aplicada.',
  },
  oGrupo_cookies: {
    es: 'Quitar los avisos de cookies <span class="suave">· EasyList Cookie List</span>',
    en: 'Remove cookie notices <span class="suave">· EasyList Cookie List</span>',
    pt: 'Remover os avisos de cookies <span class="suave">· EasyList Cookie List</span>',
  },
  oGrupo_cookiesAyuda: {
    es: 'Oculta los avisos de cookies sin contestarlos: no aceptas nada, el sitio se queda como si no hubieras respondido. Recarga la página para verlo.',
    en: 'Hides cookie notices without answering them: you accept nothing, and the site behaves as if you had not replied. Reload the page to see it.',
    pt: 'Oculta os avisos de cookies sem respondê-los: você não aceita nada, e o site fica como se você não tivesse respondido. Recarregue a página para ver.',
  },
  oAuto: { es: 'automático', en: 'automatic', pt: 'automático' },
  oVolverAuto: { es: 'Volver a automático', en: 'Back to automatic', pt: 'Voltar ao automático' },

  oSitios: { es: 'Sitios con modo propio', en: 'Sites with their own mode', pt: 'Sites com modo próprio' },
  oSitiosAyuda: {
    es: 'Lo que fijas con los botones del icono, administrado desde aquí.',
    en: 'What you set with the buttons in the icon, managed from here.',
    pt: 'O que você define com os botões do ícone, administrado daqui.',
  },
  oSitiosVacio: {
    es: 'Ninguno: todos los sitios usan el modo predeterminado.',
    en: 'None: every site uses the default mode.',
    pt: 'Nenhum: todos os sites usam o modo padrão.',
  },
  oVolver: { es: 'Volver al predeterminado', en: 'Back to default', pt: 'Voltar ao padrão' },
  oTuyas: { es: 'Quitados por ti', en: 'Removed by you', pt: 'Removidos por você' },
  oTuyasAyuda: {
    es: 'Lo que quitaste con «Quitar» o «Quitar un elemento». Son reglas tuyas: viven en este equipo y no se mandan a ningún lado.',
    en: 'What you removed with “Remove” or “Remove an element”. They are your own rules: they live on this device and are never sent anywhere.',
    pt: 'O que você removeu com “Remover” ou “Remover um elemento”. São regras suas: ficam neste computador e não são enviadas a lugar nenhum.',
  },
  oTuyasVacio: {
    es: 'Ninguno todavía. «Quitar un elemento», en el icono, crea el primero.',
    en: 'None yet. “Remove an element”, in the icon, creates the first one.',
    pt: 'Nenhum ainda. “Remover um elemento”, no ícone, cria o primeiro.',
  },
  oMostrarDeNuevo: { es: 'Mostrar de nuevo', en: 'Show again', pt: 'Mostrar de novo' },
  oAplicando: { es: 'Qué se está aplicando', en: 'What is being applied', pt: 'O que está sendo aplicado' },
  oFilaRed: { es: 'Reglas de red activas', en: 'Active network rules', pt: 'Regras de rede ativas' },
  oFilaLineas: { es: 'Líneas de filtro compiladas', en: 'Filter lines compiled', pt: 'Linhas de filtro compiladas' },
  oFilaDominios: { es: 'Sitios con reglas propias', en: 'Sites with their own rules', pt: 'Sites com regras próprias' },
  oFilaSelectores: { es: 'Reglas para ocultar publicidad', en: 'Rules to hide ads', pt: 'Regras para ocultar publicidade' },
  oFilaExtendidas: { es: 'Reglas avanzadas aplicadas por el motor propio', en: 'Advanced rules applied by our own engine', pt: 'Regras avançadas aplicadas pelo motor próprio' },
  oFilaGrupo: { es: '{1}: reglas de red y para ocultar', en: '{1}: network and hiding rules', pt: '{1}: regras de rede e para ocultar' },
  oFilaNoExt: { es: 'No aplicables: reglas avanzadas fuera del motor', en: 'Not applicable: advanced rules outside the engine', pt: 'Não aplicáveis: regras avançadas fora do motor' },
  oFilaNoScript: { es: 'No aplicables: scriptlets de uBlock Origin', en: 'Not applicable: uBlock Origin scriptlets', pt: 'Não aplicáveis: scriptlets do uBlock Origin' },
  oFilaNoRegex: { es: 'No aplicables: expresiones regulares', en: 'Not applicable: regular expressions', pt: 'Não aplicáveis: expressões regulares' },
  oFilaNoPopup: { es: 'No aplicables: bloqueo de ventanas emergentes', en: 'Not applicable: pop-up blocking', pt: 'Não aplicáveis: bloqueio de janelas pop-up' },
  oFilaYoutube: { es: 'Reglas para YouTube (uBlock Origin {1})', en: 'Rules for YouTube (uBlock Origin {1})', pt: 'Regras para o YouTube (uBlock Origin {1})' },
  oFilaRecortadas: { es: 'Recortadas por el límite de Chrome', en: 'Cut by the Chrome limit', pt: 'Cortadas pelo limite do Chrome' },
  oFilaFecha: { es: 'Listas compiladas el', en: 'Lists compiled on', pt: 'Listas compiladas em' },
  oComo: { es: 'Cómo funciona', en: 'How it works', pt: 'Como funciona' },
  oComo1: {
    es: 'Filtros MX bloquea con las <strong>mismas listas públicas</strong> que usan los bloqueadores más extendidos —EasyList, EasyPrivacy, EasyList Spanish y la de tu idioma si la hay—, mantenidas por cientos de personas. <strong>Tu copia es la del día que marca la tabla de arriba</strong> y se renueva con cada versión de la extensión.',
    en: 'Filtros MX blocks with the <strong>same public lists</strong> the most widely used blockers rely on — EasyList, EasyPrivacy, EasyList Spanish and the one for your language if there is one — maintained by hundreds of people. <strong>Your copy is from the date shown in the table above</strong> and is renewed with every version of the extension.',
    pt: 'O Filtros MX bloqueia com as <strong>mesmas listas públicas</strong> que os bloqueadores mais usados — EasyList, EasyPrivacy, EasyList Spanish e a do seu idioma, se houver —, mantidas por centenas de pessoas. <strong>Sua cópia é a da data indicada na tabela acima</strong> e é renovada a cada versão da extensão.',
  },
  oComo2: {
    es: 'Encima de eso, <strong>atrapa la publicidad que ninguna lista cubre</strong> en la página que estás viendo, te deja quitarla con un clic y, si quieres, prepara el reporte para que se corrija para todos.',
    en: 'On top of that, it <strong>catches the ads no list covers</strong> on the page you are viewing, lets you remove them in one click and, if you want, drafts the report so they get fixed for everyone.',
    pt: 'Além disso, <strong>pega a publicidade que nenhuma lista cobre</strong> na página que você está vendo, deixa você removê-la com um clique e, se quiser, prepara o relatório para que seja corrigida para todos.',
  },
  oComo3: {
    es: 'La tabla de arriba enseña también <strong>lo que no se pudo aplicar</strong>. Un bloqueador que solo presume lo que sí entró te hace creer que estás más protegido de lo que estás.',
    en: 'The table above also shows <strong>what could not be applied</strong>. A blocker that only shows off what made it in makes you believe you are better protected than you are.',
    pt: 'A tabela acima mostra também <strong>o que não pôde ser aplicado</strong>. Um bloqueador que só exibe o que entrou faz você acreditar que está mais protegido do que está.',
  },
  // Licencias verificadas el 23-oct-2026 en la cabecera de cada lista; detalle
  // en filtros/ATRIBUCION.md.
  oCredito: {
    es: 'Las listas base y las regionales de EasyList (portugués, alemán, italiano, neerlandés, polaco y chino) son de The EasyList authors, bajo GPLv3 y CC BY-SA 3.0; Liste FR, bajo CC BY-SA 3.0; RU AdList y EasyList Cookie List, bajo CC BY 3.0. Las reglas y el motor de YouTube son de uBlock Origin (Raymond Hill y colaboradores), bajo GPLv3.',
    en: 'The base lists and the EasyList regional lists (Portuguese, German, Italian, Dutch, Polish and Chinese) are by The EasyList authors, under GPLv3 and CC BY-SA 3.0; Liste FR, under CC BY-SA 3.0; RU AdList and EasyList Cookie List, under CC BY 3.0. The YouTube rules and engine are by uBlock Origin (Raymond Hill and contributors), under GPLv3.',
    pt: 'As listas base e as regionais da EasyList (português, alemão, italiano, holandês, polonês e chinês) são de The EasyList authors, sob GPLv3 e CC BY-SA 3.0; a Liste FR, sob CC BY-SA 3.0; a RU AdList e a EasyList Cookie List, sob CC BY 3.0. As regras e o motor do YouTube são do uBlock Origin (Raymond Hill e colaboradores), sob GPLv3.',
  },
  oVerBienvenida: { es: 'Volver a ver la página de bienvenida', en: 'See the welcome page again', pt: 'Ver de novo a página de boas-vindas' },
};

// Los demas idiomas viven en locales/<id>.mjs, un archivo por idioma con las
// mismas claves: meterlos aqui volveria ilegible la fuente. Se exigen TODAS
// las claves, igual que para los de arriba.
const EXTRA = ['de', 'fr', 'it', 'nl', 'pl', 'ru', 'zh'];
for (const id of EXTRA) {
  const { default: textos } = await import(`./locales/${id}.mjs`);
  for (const [clave, texto] of Object.entries(textos)) {
    if (!T[clave]) { console.error(`locales/${id}.mjs: clave que no existe en la fuente: ${clave}`); process.exit(1); }
    T[clave][id] = texto;
  }
}

const IDIOMAS = ['es', 'en', 'pt', ...EXTRA];
// Carpetas de Chrome por idioma. "pt" a secas no existe en Chrome. El chino
// va en zh_CN (simplificado); zh_TW no se escribe: darle simplificado a quien
// lee tradicional seria peor que el idioma de reserva.
const CARPETAS = {
  es: ['es'], en: ['en'], pt: ['pt_BR', 'pt_PT'],
  de: ['de'], fr: ['fr'], it: ['it'], nl: ['nl'], pl: ['pl'], ru: ['ru'], zh: ['zh_CN'],
};

const faltan = [];
for (const [clave, textos] of Object.entries(T)) {
  for (const id of IDIOMAS) if (!textos[id]) faltan.push(`${clave}.${id}`);
}
if (faltan.length) {
  console.error('FALTAN TEXTOS, no se escribe nada:\n  ' + faltan.join('\n  '));
  process.exit(1);
}

// Las sustituciones tienen que ser las mismas en todos los idiomas: un {2} que
// falta en una traduccion deja la cifra fuera sin ningun error.
for (const [clave, textos] of Object.entries(T)) {
  const marcas = (s) => [...s.matchAll(/\{(\d)\}/g)].map((m) => m[1]).sort().join(',');
  const base = marcas(textos.es);
  for (const id of IDIOMAS) {
    if (marcas(textos[id]) !== base) {
      console.error(`${clave}.${id}: sustituciones distintas de las del espanol`);
      process.exit(1);
    }
  }
}

// Carpetas viejas de idiomas que ya no se generan: Chrome las seguiria leyendo.
const validas = new Set(Object.values(CARPETAS).flat());
if (fs.existsSync(DESTINO)) {
  for (const d of fs.readdirSync(DESTINO)) {
    if (!validas.has(d)) fs.rmSync(path.join(DESTINO, d), { recursive: true, force: true });
  }
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
  for (const carpeta of CARPETAS[id]) {
    const dir = path.join(DESTINO, carpeta);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'messages.json'), JSON.stringify(salida, null, 2) + '\n');
  }
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
console.log(`${Object.keys(T).length} textos escritos en ${Object.values(CARPETAS).flat().join(', ')}.`);
