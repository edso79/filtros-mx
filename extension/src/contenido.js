// Content script de Filtros MX.
//
// Dos trabajos: contar lo que se oculto, y —lo que hace distinta a esta
// extension— DETECTAR la publicidad que ninguna lista esta cubriendo.
//
// El detector es una adaptacion de herramientas/eje-visual/medidor.js v3, que
// localiza unidades publicitarias POR SU CONTENIDO y no por el nombre de sus
// clases. Esa decision no es estetica: clasificar por nombre de clase fallo de
// tres formas medidas el 30-jul-2026 —ciego con Tailwind, falso positivo con
// tagDiv y con Elementor— y las tres venian de lo mismo.
//
// DIFERENCIA IMPORTANTE CON EL MEDIDOR: el medidor recorre la pagina entera a
// la fuerza para disparar la carga diferida. Aqui NO se hace. Mover la pagina
// de quien esta leyendo es inaceptable. En su lugar se observa el DOM y se
// analiza lo que va apareciendo conforme la persona navega sola.
//
// NADA de lo que se encuentra aqui sale del dispositivo por su cuenta. Se
// guarda en memoria de la pestana y solo viaja si el usuario pulsa reportar,
// viendo antes el texto completo. Principio 3 del proyecto.

(() => {
  if (window.__filtrosMxCargado) return;
  window.__filtrosMxCargado = true;

  const host = location.hostname.replace(/^www\./, '');

  let cubiertos = new Set();   // elementos que YA cubre alguna regla, generica incluida
  let selectores = [];         // lo que esta extension oculta (respeta ajustes)
  let locales = [];            // lo que el usuario oculto con "Ocultar aqui"
  let extendidas = [];         // reglas extendidas YA compiladas: {css} | {o,i?,t}
  let ocultosExtendidos = new Set();  // elementos que el motor extendido oculto
  let cobertura = [];          // TODO lo que alguna lista cubre (para no reportar de mas)
  let huecos = [];             // unidades publicitarias sin cubrir Y nombrables
  let descartes = { sinNombre: 0, sobrecobertura: 0 };
  let ceguera = false;         // hay anuncios y el detector no ve donde
  let ocultos = 0;
  let detectorActivo = true;   // el ajuste de opciones; hasta la 1.0.0 no se leia

  const REDES = /(doubleclick|googlesyndication|googletagservices|adnxs|rubicon|pubmatic|openx|criteo|taboola|outbrain|amazon-adsystem|3lift|smartadserver|casalemedia|indexww|media\.net|yieldmo|gumgum|sharethrough|seedtag|adsrvr|lijit|teads|freestar|fsrv|pub\.network|adform|mgid|revcontent)/i;

  // Hosts que CASAN con REDES pero no sirven anuncios: son medicion.
  // stats.g.doubleclick.net lo pide Google Analytics, no un hueco publicitario.
  // Sin esta excepcion, en lajornadamaya.mx (3-ago-2026) la se~nal de ceguera
  // salta en una portada que no tiene un solo anuncio, y manda a la persona a
  // inspeccionar a mano una pagina limpia.
  const ANALITICA = /^(stats\.g\.doubleclick\.net|www\.googletagmanager\.com|analytics\.google\.com)$/i;

  const SEMILLAS = [
    'ins.adsbygoogle',
    '[id^="div-gpt-ad"]',
    '[id*="gpt-ad"]',
    '[data-advadstrackid]',
    '[data-ad-slot]',
    '[id^="taboola"]',
    '[id*="outbrain"]',
  ].join(',');

  const IFRAME_AD = /google_ads|gpt|ads-frame|aswift|ad_iframe/i;
  const ETIQUETA = /^(publicidad|anuncio|advertisement|patrocinado)$/i;

  function esEtiqueta(e) {
    if (e.children.length !== 0) return false;
    if (!ETIQUETA.test((e.textContent || '').trim())) return false;
    // Un enlace de menu que dice "Publicidad" es la seccion de tarifas para
    // anunciantes, no el rotulo de un hueco. Casi todo periodico tiene uno.
    // Medido en proyectopuente.com.mx el 13-ago-2026: el detector proponia
    // ocultar un item del menu principal (tdb-menu-item-button, menu-item-91)
    // — la clase de regla que rompe sitios, prohibida en este proyecto desde
    // que .banner--sidebar de quadratin resulto envolver el bloque editorial.
    // Ante la duda se pierde el hallazgo, no la navegacion del usuario.
    if (e.closest('nav, [role="navigation"], [class*="menu-item"], [class*="nav-item"], [class*="navbar"]')) {
      return false;
    }
    return true;
  }

  function esIframeDeAnuncio(f) {
    let h = '';
    try { h = new URL(f.src, location.href).hostname; } catch {}
    return REDES.test(h) || IFRAME_AD.test(f.id || '');
  }

  // ¿Este elemento ES o CONTIENE publicidad reconocible?
  //
  // Tiene que reconocer LAS MISMAS tres se~nales que reunirSemillas: selectores
  // de slot, iframes de red publicitaria y la etiqueta "Publicidad". Antes solo
  // consultaba la primera, y eso hacia que esSeguro() descartara como
  // "sobrecobertura" huecos cuya unica se~nal era el iframe del anuncio o la
  // etiqueta — exactamente los casos de tribuna.com.mx y del .lapub de
  // elsiglodetorreon. El detector probado en navegador el 3-ago-2026 usaba la
  // marca completa; el codigo embarcado no. Un filtro de seguridad que no ve
  // las mismas se~nales que el detector convierte hallazgos reales en descartes.
  function tieneMarca(el) {
    if (el.matches(SEMILLAS)) return true;
    if (el.querySelector(SEMILLAS)) return true;
    for (const f of el.querySelectorAll('iframe')) {
      if (esIframeDeAnuncio(f)) return true;
    }
    if (esEtiqueta(el)) return true;
    for (const e of el.querySelectorAll('p,span,div,small')) {
      if (esEtiqueta(e)) return true;
    }
    return false;
  }

  // --- Que esta cubierto por nuestras reglas ---
  // Se marca con COBERTURA, no con lo que ocultamos: un contenedor que una
  // regla generica ya cubre no es un hueco reportable aunque esta extension no
  // lo oculte por ajustes del usuario.
  function marcarCubiertos() {
    cubiertos = new Set();
    ocultos = 0;
    const juntar = (lista, destino) => {
      for (let i = 0; i < lista.length; i += 120) {
        const grupo = lista.slice(i, i + 120);
        try {
          document.querySelectorAll(grupo.join(',')).forEach((e) => destino.add(e));
        } catch {
          // Un selector malformado tumba el grupo entero; se reintenta uno a uno
          // para no perder los 119 que si eran validos.
          for (const s of grupo) {
            try { document.querySelectorAll(s).forEach((e) => destino.add(e)); } catch {}
          }
        }
      }
    };

    juntar(cobertura.length ? cobertura : selectores, cubiertos);

    // La insignia cuenta lo que ESTA extension oculta de verdad, que no es lo
    // mismo que lo que alguna lista cubriria. Contar la cobertura ahi seria
    // presumir un bloqueo que no se hizo. Las extendidas SI cuentan: las
    // oculta este codigo, no una promesa. Y las reglas locales del usuario
    // tambien: las inyecta fondo.js igual que las de lista.
    const ocultadosDeVerdad = new Set();
    juntar([...selectores, ...locales], ocultadosDeVerdad);
    ocultos = ocultadosDeVerdad.size + ocultosExtendidos.size;
  }

  // --- Motor de reglas extendidas -------------------------------------------
  //
  // Aplica lo que el 3-ago se daba por imposible en MV3: de las ~305 reglas
  // extendidas de las listas, 303 son ":has-text()" y 1 es ":has()" puro
  // (medido el 6-ago-2026). :has() es CSS nativo desde Chrome 105 — el
  // navegador lo evalua en querySelectorAll— y el texto se comprueba aqui.
  // Las reglas llegan YA compiladas por construir.mjs: este codigo no parsea
  // sintaxis ABP, solo evalua {o, i?, t} o {css}.
  //
  // Se oculta con estilo en linea e !important, no con hoja inyectada: una
  // hoja con un selector invalido muere entera al parsear, mientras que aqui
  // cada regla falla sola dentro de su try.
  function casaTexto(el, t) {
    const txt = el.innerText || el.textContent || '';
    if (t.tx !== undefined) return txt.includes(t.tx);
    try { return new RegExp(t.rx, t.fl || '').test(txt); } catch { return false; }
  }

  function aplicarExtendidas() {
    for (const r of extendidas) {
      try {
        if (r.css) {
          document.querySelectorAll(r.css).forEach((el) => ocultarExtendido(el));
          continue;
        }
        for (const c of document.querySelectorAll(r.o)) {
          let casa = false;
          if (!r.i) {
            casa = casaTexto(c, r.t);
          } else {
            const sel = r.i.trim().startsWith('>') ? ':scope ' + r.i : r.i;
            for (const d of c.querySelectorAll(sel)) {
              if (casaTexto(d, r.t)) { casa = true; break; }
            }
          }
          if (casa) ocultarExtendido(c);
        }
      } catch {
        // Selector que este navegador no soporta: la regla falla sola.
      }
    }
  }

  function ocultarExtendido(el) {
    if (!ocultosExtendidos.has(el)) {
      el.style.setProperty('display', 'none', 'important');
      ocultosExtendidos.add(el);
    }
    // Cuenta como cubierto: el detector no debe reportar lo que una lista
    // extendida ya resuelve.
    cubiertos.add(el);
  }

  function estaCubierto(nodo) {
    let n = nodo;
    while (n && n !== document.documentElement) {
      if (cubiertos.has(n)) return true;
      n = n.parentElement;
    }
    return false;
  }

  // Cobertura POR EFECTO, no por selector.
  //
  // Un envoltorio al que ninguna regla nombra puede quedar igualmente invisible:
  // si las listas ocultan la publicidad que lleva dentro, el envoltorio se queda
  // sin contenido y COLAPSA solo. Reportarlo seria pedirle trabajo a un
  // mantenedor por un hueco que ya no existe.
  //
  // Medido el 10-ago-2026 sobre cuatro candidatas: en lavozdemichoacan.com.mx
  // (.lv-ads) y criteriohidalgo.com los envoltorios colapsan y el aporte real de
  // una regla propia seria 32 px y 0 px. En elmanana.com no colapsan y quedan
  // 23 unidades con mas de un millon de px2 — ahi el hueco es real. Sin esta
  // comprobacion, tres de cuatro candidatas se habrian reportado de mas.
  //
  // CUBIERTO NO ES COLAPSADO, y confundirlos salio caro. Hasta el 13-ago-2026
  // esta funcion INFERIA el colapso —"si todo lo de dentro esta cubierto, el
  // envoltorio se vacia"— y el comentario de aqui mismo ya admitia el agujero:
  // no ve la caja que reserva altura propia. Ese agujero se trago el mejor
  // hallazgo del proyecto. Medido el 13-ago con la red bloqueada y las 13,907
  // reglas de cobertura aplicadas: en elmanana.com el detector devolvia CERO
  // huecos descartando 12 unidades que siguen midiendo 1,095,977 px2 y 3,560 px
  // de alto, y en quadratin.com.mx descartaba .banner--faro, vivo a 1110x90 con
  // anuncio dentro. Dos sitios, mismo fallo: era sistematico.
  //
  // Ahora se MIDE en vez de suponerse: se oculta lo que ya esta cubierto, se
  // mide el envoltorio y se restaura. Cuesta un reflow por candidato.
  //
  // Sigue sin sustituir la prueba de recarga que firma una persona: reduce el
  // ruido que esa persona revisa, que es distinto.
  function estadoAlVaciarse(envoltorio) {
    const marcas = [...envoltorio.querySelectorAll(SEMILLAS)];
    for (const f of envoltorio.querySelectorAll('iframe')) {
      if (esIframeDeAnuncio(f)) marcas.push(f);
    }
    const nada = { todoCubierto: false, colapsa: false };
    if (!marcas.length) return nada;
    if (!marcas.every((m) => estaCubierto(m))) return nada;

    // Se guarda valor Y prioridad: restaurar con una asignacion simple le
    // quitaria el !important a quien ya lo tuviera.
    const previos = marcas.map((m) => [
      m.style.getPropertyValue('display'),
      m.style.getPropertyPriority('display'),
    ]);
    marcas.forEach((m) => m.style.setProperty('display', 'none', 'important'));
    const r = envoltorio.getBoundingClientRect();
    marcas.forEach((m, i) => {
      const [valor, prioridad] = previos[i];
      if (valor) m.style.setProperty('display', valor, prioridad);
      else m.style.removeProperty('display');
    });

    // Mismo umbral con el que detectar() descarta por tamano: por debajo de eso
    // no le quita pantalla a nadie.
    return { todoCubierto: true, colapsa: r.width < 50 || r.height < 20 };
  }

  // --- Semillas: el hueco publicitario concreto, no su envoltorio ---
  function reunirSemillas() {
    const s = new Set();
    document.querySelectorAll(SEMILLAS).forEach((e) => s.add(e));

    document.querySelectorAll('iframe').forEach((e) => {
      if (esIframeDeAnuncio(e)) s.add(e);
    });

    // La etiqueta "Publicidad" la escribe el propio publicador y no depende de
    // como llame a sus clases. Por eso funciona donde el nombre de clase no.
    document.querySelectorAll('p,span,div,small').forEach((e) => {
      if (esEtiqueta(e)) s.add(e);
    });
    return s;
  }

  // Se sube desde la semilla mientras el nodo siga siendo SOLO anuncio. En
  // cuanto arrastra texto editorial o varios enlaces, se para: ese es el limite
  // entre ocultar un anuncio y ocultar media pagina.
  function envolver(semilla) {
    let nodo = semilla, envoltorio = semilla;
    for (let paso = 0; paso < 6 && nodo.parentElement; paso++) {
      nodo = nodo.parentElement;
      if (nodo === document.body || nodo === document.documentElement) break;
      const txt = (nodo.innerText || '')
        .replace(/publicidad|anuncio|advertisement|patrocinado/gi, '').trim();
      if (txt.length > 40) break;
      if (nodo.querySelectorAll('a[href]').length > 2) break;
      envoltorio = nodo;
    }
    return envoltorio;
  }

  // Devuelve null cuando el elemento NO se puede nombrar. Antes caia al nombre
  // de etiqueta, y eso era un error grave: en zocalo.com.mx (3-ago-2026)
  // producia 21 candidatos con selector "li". Proponer "zocalo.com.mx##li"
  // aguas arriba ocultaria cada elemento de lista del sitio.
  //
  // Un elemento sin id ni clase no es un hueco que se pueda cerrar con una
  // regla cosmetica: es el caso intratable del censo, y se cuenta aparte en vez
  // de inventarle un nombre.
  function selectorDe(el) {
    if (el.id && /^[A-Za-z][\w-]*$/.test(el.id)) return '#' + el.id;
    const cls = (typeof el.className === 'string' ? el.className : '').trim();
    if (!cls) return null;
    const partes = cls.split(/\s+/).filter((c) => /^[A-Za-z_-][\w-]*$/.test(c));
    if (!partes.length) return null;
    return '.' + partes.join('.');
  }

  // Un nombre puede existir y aun asi no servir para una regla.
  //
  // Dos formas de fragilidad, las dos medidas el 13-ago-2026:
  //   - CSS utilitario: en criteriohidalgo.com el detector proponia
  //     ".bg-white.p-4" y en lavozdemichoacan ".home-e.py-4". Esa regla apunta
  //     al anuncio y a media pagina por igual, y manana casa con lo que sea. Es
  //     el caso intratable que el censo del 30-jul-2026 ya habia descrito en
  //     ese mismo sitio.
  //   - Identificadores volatiles: proyectopuente.com.mx sirve "#tdi_314_a7a"
  //     en una plantilla y "#tdi_314_c7d" en otra. El sufijo lo genera tagDiv.
  //
  // Se AVISA, no se descarta. Un descarte silencioso es como se perdio el
  // hallazgo de elmanana.com esta misma manana: el ruido se revisa, el falso
  // negativo desaparece y nadie lo busca. Que la persona lo vea y decida.
  const PREFIJO_UTIL = /^(p|m|px|py|pt|pb|pl|pr|mx|my|mt|mb|ml|mr|w|h|min|max|gap|space|text|bg|border|rounded|shadow|font|leading|tracking|flex|grid|col|row|items|justify|self|place|inset|top|left|right|bottom|z|opacity|overflow|object|aspect|order|basis|divide|ring)-/;
  const UTIL_SUELTA = /^(flex|grid|block|inline|hidden|table|static|fixed|absolute|relative|sticky|container|truncate|italic|uppercase|border|rounded|shadow)$/;
  const ID_VOLATIL = /^(tdi_\d+|[0-9a-f]{8,})/;

  function nombreFragil(sel) {
    if (sel.startsWith('#')) return ID_VOLATIL.test(sel.slice(1));
    const clases = sel.replace(/^\./, '').split('.');
    // Frágil solo si NINGUNA clase aporta un nombre propio: basta una clase con
    // significado (.lapub, .ad-zone, .home-e) para que la regla se sostenga.
    return clases.every((c) => PREFIJO_UTIL.test(c) || UTIL_SUELTA.test(c));
  }

  // ¿Esta regla ocultaria algo que NO es publicidad?
  //
  // Es la prueba que el proyecto exige a mano —"se comprobo uno por uno EN ESTE
  // sitio"— hecha automaticamente: si el selector casa con UN elemento que no
  // contiene marca publicitaria, la regla romperia contenido y no se propone.
  //
  // No sustituye a la prueba de recarga que firma una persona. Reduce el ruido
  // que esa persona tiene que revisar, que es distinto.
  function esSeguro(sel) {
    let casan;
    try { casan = [...document.querySelectorAll(sel)]; } catch { return null; }
    if (!casan.length) return null;
    const limpios = casan.filter((e) => !tieneMarca(e));
    return limpios.length === 0 ? casan.length : null;
  }

  // --- El detector ---
  function detectar() {
    marcarCubiertos();
    aplicarExtendidas();

    // Con el detector apagado se sigue contando y aplicando lo extendido —eso
    // es bloqueo, no deteccion— pero no se busca nada que se haya colado.
    if (!detectorActivo) {
      huecos = [];
      descartes = { sinNombre: 0, sobrecobertura: 0, yaCubiertoEnEfecto: 0 };
      ceguera = false;
      informar(0);
      return;
    }

    const vistos = new Set();
    const selectoresVistos = new Set();
    const encontrados = [];
    let sinNombre = 0;
    let sobrecobertura = 0;
    let yaCubiertoEnEfecto = 0;

    for (const semilla of reunirSemillas()) {
      const env = envolver(semilla);
      if (vistos.has(env)) continue;
      vistos.add(env);

      if (estaCubierto(env)) continue;
      const vaciado = estadoAlVaciarse(env);
      if (vaciado.colapsa) { yaCubiertoEnEfecto++; continue; }

      const r = env.getBoundingClientRect();
      if (r.width < 50 || r.height < 20) continue;

      const sel = selectorDe(env);
      if (!sel) { sinNombre++; continue; }

      const casan = esSeguro(sel);
      if (casan === null) { sobrecobertura++; continue; }

      // Varios envoltorios hermanos dan el MISMO selector, y la regla es una
      // sola: repetirla infla el reporte y multiplica el trabajo de quien pulsa
      // "Ocultar aqui". Cuantos elementos alcanza ya lo dice `alcance`.
      if (selectoresVistos.has(sel)) continue;
      selectoresVistos.add(sel);

      encontrados.push({
        selector: sel.slice(0, 120),
        ancho: Math.round(r.width),
        alto: Math.round(r.height),
        // Cuantos elementos ocultaria la regla. Un numero alto sobre una clase
        // de maquetacion es la se~nal de que hay que mirarla con ojos.
        alcance: casan,
        // Un hueco con anuncio servido pesa mas que uno con la caja vacia, y el
        // reporte debe decir cual es cual.
        servido: !!env.querySelector('iframe, ins.adsbygoogle[data-ad-status="filled"]'),
        // Las listas ya cubren la publicidad de dentro y AUN ASI el envoltorio
        // ocupa: es espacio en blanco reservado. Distinguirlo importa porque es
        // lo que hay que declarar al reportar —#364 lo hizo a mano— y porque
        // ordena la revision: primero lo servido, luego lo reservado.
        soloEspacioReservado: vaciado.todoCubierto,
        // El selector existe pero no aguanta: CSS utilitario o id volatil. Se
        // avisa para que nadie lo aplique a ciegas ni lo reporte aguas arriba.
        nombreFragil: nombreFragil(sel),
      });
    }

    huecos = encontrados;

    // Se~nal de ceguera: hay una red publicitaria sirviendo y no se encontro
    // NINGUNA unidad. Significa que el instrumento no ve lo que hay, y es la
    // pista del caso intratable —contenedores con CSS utilitario, sin clase ni
    // marca reconocible—. Vale mas admitirlo que reportar un cero limpio.
    const terceros = new Set();
    for (const r of performance.getEntriesByType('resource')) {
      try {
        const u = new URL(r.name);
        // Sufijo de DOMINIO, no de cadena: "nottribuna.com.mx" NO es primera
        // parte de "tribuna.com.mx", aunque endsWith diga que si.
        const primeraParte = u.hostname === host || u.hostname.endsWith('.' + host);
        if (!primeraParte && !ANALITICA.test(u.hostname)) terceros.add(u.hostname);
      } catch {}
    }
    ceguera = [...terceros].some((h) => REDES.test(h)) && vistos.size === 0;
    // Se guardan aparte porque significan cosas distintas y confundirlas seria
    // mentir: "sin nombre" es publicidad que NINGUNA regla cosmetica puede
    // cerrar —el caso intratable del censo— y no es lo mismo que no haber
    // encontrado nada.
    descartes = { sinNombre, sobrecobertura, yaCubiertoEnEfecto };

    informar(huecos.length);
  }

  // Lo NUEVO para el total desde la instalacion se calcula aqui y no en el
  // service worker: el worker de MV3 muere y revive cada poco y pierde su
  // memoria, y sumar desde alli contaria la pagina entera otra vez en cada
  // resurreccion. Esta pesta~na vive lo que vive la pagina.
  let yaInformados = 0;
  function informar(nHuecos) {
    const nuevos = Math.max(0, ocultos - yaInformados);
    yaInformados = Math.max(yaInformados, ocultos);
    // El try ademas del catch de la promesa: si el contexto se invalido entre
    // el arranque de detectar() y esta linea, sendMessage lanza SINCRONO.
    try {
      chrome.runtime.sendMessage({ tipo: 'contar', ocultos, huecos: nHuecos, nuevos }).catch(() => {});
    } catch {}
  }

  // --- Arranque y observacion ---
  //
  // Se re-analiza cuando el DOM cambia, que es como aparecen los huecos de mas
  // abajo conforme la persona baja por su cuenta. Con freno: un observador sin
  // freno en un sitio de noticias se dispara cientos de veces por segundo.
  let pendiente = null;
  let observador = null;

  // Cuando la extension se recarga (el boton ↻, o una actualizacion), los
  // content scripts de las pesta~nas YA abiertas quedan huerfanos: su
  // chrome.runtime se vuelve undefined, pero su MutationObserver sigue vivo.
  // Sin esta comprobacion, cada mutacion del DOM en una pesta~na vieja —Gmail
  // muta sin parar— lanza un TypeError, para siempre. Visto en el Chrome de
  // Edgar el 6-ago-2026 tras la primera recarga. Un huerfano debe apagarse
  // solo, en silencio.
  function extensionViva() {
    return !!(chrome.runtime && chrome.runtime.id);
  }

  function programar(ms) {
    clearTimeout(pendiente);
    pendiente = setTimeout(() => {
      if (!extensionViva()) {
        if (observador) observador.disconnect();
        clearTimeout(pendiente);
        return;
      }
      detectar();
    }, ms);
  }

  chrome.runtime.sendMessage({ tipo: 'selectoresDelSitio', host })
    .then((r) => {
      selectores = (r && r.selectores) || [];
      extendidas = (r && r.extendidas) || [];
      locales = (r && r.locales) || [];
      cobertura = (r && r.cobertura) || [];
      detectorActivo = !(r && r.detector === false);
      detectar();

      observador = new MutationObserver(() => programar(1200));
      observador.observe(document.documentElement, { childList: true, subtree: true });
    })
    .catch(() => {});

  // --- El popup pregunta que se encontro ---
  chrome.runtime.onMessage.addListener((msg, _s, responder) => {
    if (msg?.tipo === 'huecosDeLaPagina') {
      responder({
        host,
        url: location.href,
        ocultos,
        selectoresAplicados: selectores.length,
        huecos,
        descartes,
        ceguera,
        detector: detectorActivo,
        // El ancho CAMBIA el resultado, y por eso viaja en el reporte. Medido el
        // 3-ago-2026 en quadratin.com.mx: a 296 px de ancho el detector encuentra
        // 0 huecos y a 1280 px encuentra 4. No es ruido — los sitios sirven
        // maquetas distintas, y a lo ancho de movil esconden con .d-none las
        // unidades de escritorio. Un reporte sin el ancho no se puede reproducir.
        ancho: window.innerWidth,
      });
      return true;
    }
    if (msg?.tipo === 'reanalizar') {
      detectar();
      responder({ ok: true, huecos: huecos.length });
      return true;
    }
  });
})();
