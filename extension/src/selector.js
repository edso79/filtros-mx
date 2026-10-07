// "Quitar un elemento": el usuario elige con el raton algo de la pagina y
// desaparece, tambien en sus proximas visitas (1.0.0).
//
// Por que hace falta aunque exista el detector: el detector solo ve lo que
// reconoce como publicidad, y su limite esta medido —en codigoqro.mx dio cero
// con 1,045,814 px2 de anuncios en pantalla—. Cuando el detector no ve, el
// usuario si. Sin esta salida, un anuncio que se cuela y no se puede quitar
// termina en desinstalacion.
//
// Lo inyecta el popup con chrome.scripting.executeScript, solo al pulsar el
// boton. No corre en ninguna pagina por su cuenta.
//
// Lo que crea es una REGLA LOCAL, igual que el boton "Quitar" de lo colado:
// vive en este equipo, se deshace desde el popup u opciones y no viaja a
// ningun lado. Por eso puede permitirse un selector mas especifico (con
// :nth-of-type) que el que se propondria a una lista que mantiene otra persona.

(() => {
  if (window.__filtrosMxSelector) return;
  window.__filtrosMxSelector = true;

  const t = (clave, ...subs) => chrome.i18n.getMessage(clave, subs.map(String)) || clave;

  // --- Nombrar el elemento elegido -----------------------------------------
  const ID_VOLATIL = /^(tdi_\d+|[0-9a-f]{8,})|\d{5,}/;
  const CLASE_DE_ESTADO = /^(active|show|open|hover|focus|visible|selected|current|is-|has-|js-)/;

  function idUtil(el) {
    return el.id && /^[A-Za-z][\w-]*$/.test(el.id) && !ID_VOLATIL.test(el.id) ? el.id : null;
  }

  function cuantos(sel) {
    try { return document.querySelectorAll(sel).length; } catch { return 0; }
  }

  function segmento(el) {
    const tag = el.tagName.toLowerCase();
    const clases = [...el.classList]
      .filter((c) => /^[A-Za-z_-][\w-]*$/.test(c) && !CLASE_DE_ESTADO.test(c))
      .slice(0, 3);
    let s = tag + clases.map((c) => '.' + CSS.escape(c)).join('');
    const padre = el.parentElement;
    if (padre && [...padre.children].filter((h) => h !== el && h.matches(s)).length) {
      const mismos = [...padre.children].filter((h) => h.tagName === el.tagName);
      s += `:nth-of-type(${mismos.indexOf(el) + 1})`;
    }
    return s;
  }

  // Se sube hasta que el selector apunta SOLO a lo elegido: ocultar de mas lo
  // que el usuario no pidio es exactamente romper el sitio.
  function selectorPara(el) {
    const id = idUtil(el);
    if (id && cuantos('#' + CSS.escape(id)) === 1) return '#' + CSS.escape(id);
    const partes = [];
    let n = el;
    while (n && n !== document.body && n !== document.documentElement) {
      const idN = n !== el ? idUtil(n) : null;
      if (idN) { partes.unshift('#' + CSS.escape(idN)); break; }
      partes.unshift(segmento(n));
      const sel = partes.join(' > ');
      if (cuantos(sel) === 1) return sel;
      n = n.parentElement;
    }
    const sel = partes.join(' > ');
    return n === document.body ? 'body > ' + sel : sel;
  }

  // --- Interfaz, en un shadow root para que el CSS del sitio no la toque ----
  const anfitrion = document.createElement('filtros-mx-selector');
  anfitrion.style.cssText = 'all:initial;position:fixed;inset:0;z-index:2147483647;pointer-events:none;';
  const raiz = anfitrion.attachShadow({ mode: 'closed' });
  raiz.innerHTML = `
    <style>
      :host { all: initial; }
      * { box-sizing: border-box; font: 13px/1.4 system-ui, -apple-system, "Segoe UI", sans-serif; }
      .marco { position: fixed; pointer-events: none; border: 2px solid #b45309;
        background: rgba(180, 83, 9, .14); border-radius: 3px; transition: all .05s; display: none; }
      .barra { position: fixed; left: 50%; top: 14px; transform: translateX(-50%);
        pointer-events: auto; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
        max-width: calc(100vw - 32px); padding: 9px 12px; border-radius: 12px;
        background: #101716; color: #e9efed; box-shadow: 0 6px 24px rgba(0,0,0,.35); }
      .marca { font-weight: 700; color: #3fb89f; }
      .texto { color: #e9efed; }
      button { cursor: pointer; border-radius: 8px; padding: 6px 10px; font-weight: 600;
        border: 1px solid #3a4743; background: #1c2624; color: #e9efed; }
      button:hover { background: #26312e; }
      button.principal { background: #3fb89f; border-color: #3fb89f; color: #08100f; }
      button.principal:hover { filter: brightness(1.08); }
      button:disabled { opacity: .45; cursor: default; }
      [hidden] { display: none !important; }
    </style>
    <div class="marco"></div>
    <div class="barra">
      <span class="marca">Filtros MX</span>
      <span class="texto"></span>
      <span class="acciones" hidden>
        <button data-a="chico"></button>
        <button data-a="grande"></button>
        <button data-a="quitar" class="principal"></button>
      </span>
      <button data-a="deshacer" hidden></button>
      <button data-a="salir"></button>
    </div>`;
  document.documentElement.append(anfitrion);

  const marco = raiz.querySelector('.marco');
  const texto = raiz.querySelector('.texto');
  const acciones = raiz.querySelector('.acciones');
  const boton = (a) => raiz.querySelector(`[data-a="${a}"]`);
  boton('chico').textContent = t('selMasChico');
  boton('grande').textContent = t('selMasGrande');
  boton('quitar').textContent = t('selQuitar');
  boton('deshacer').textContent = t('selDeshacer');
  boton('salir').textContent = t('selCancelar');
  texto.textContent = t('selPista');

  let fase = 'eligiendo';   // eligiendo | elegido | hecho
  let actual = null;
  let pila = [];            // para "Más chico": el camino de vuelta hacia abajo
  let estilo = null;
  let reglaGuardada = null;

  function enmarcar(el) {
    if (!el) { marco.style.display = 'none'; return; }
    const r = el.getBoundingClientRect();
    Object.assign(marco.style, {
      display: 'block', left: r.left + 'px', top: r.top + 'px',
      width: r.width + 'px', height: r.height + 'px',
    });
  }

  function esNuestro(e) {
    return e.composedPath().includes(anfitrion);
  }

  function bajoElRaton(e) {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    return el && el !== anfitrion && el !== document.documentElement && el !== document.body ? el : null;
  }

  function pintarEleccion() {
    enmarcar(actual);
    const n = cuantos(selectorPara(actual));
    texto.textContent = n === 1 ? t('selUno') : t('selVarios', n);
    acciones.hidden = false;
    boton('chico').disabled = pila.length === 0;
    const padre = actual.parentElement;
    boton('grande').disabled = !padre || padre === document.body || padre === document.documentElement;
  }

  // Captura, no burbuja: el clic de eleccion no debe llegar a la pagina (si
  // no, elegir un enlace navegaria fuera).
  function alMover(e) {
    if (fase !== 'eligiendo' || esNuestro(e)) return;
    actual = bajoElRaton(e);
    enmarcar(actual);
  }

  function alPulsar(e) {
    if (esNuestro(e) || fase === 'hecho') return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    // Con algo ya elegido, otro clic en la pagina cambia la eleccion: es lo que
    // se espera cuando se apunto mal.
    if (e.type !== 'click') return;
    actual = bajoElRaton(e);
    if (!actual) return;
    fase = 'elegido';
    pila = [];
    pintarEleccion();
  }

  function alTeclear(e) {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); salir(); }
  }

  function alDesplazar() {
    if (actual && fase !== 'hecho') enmarcar(actual);
  }

  window.addEventListener('mousemove', alMover, true);
  for (const tipo of ['click', 'mousedown', 'mouseup', 'pointerdown', 'pointerup', 'auxclick']) {
    window.addEventListener(tipo, alPulsar, true);
  }
  window.addEventListener('keydown', alTeclear, true);
  window.addEventListener('scroll', alDesplazar, true);

  function soltarEventos() {
    window.removeEventListener('mousemove', alMover, true);
    for (const tipo of ['click', 'mousedown', 'mouseup', 'pointerdown', 'pointerup', 'auxclick']) {
      window.removeEventListener(tipo, alPulsar, true);
    }
    window.removeEventListener('keydown', alTeclear, true);
    window.removeEventListener('scroll', alDesplazar, true);
  }

  function salir() {
    soltarEventos();
    anfitrion.remove();
    window.__filtrosMxSelector = false;
  }

  // La barra recibe eventos (pointer-events:auto) aunque el anfitrion no.
  raiz.querySelector('.barra').addEventListener('click', async (e) => {
    const a = e.target.closest('button')?.dataset.a;
    if (!a) return;
    if (a === 'salir') return salir();
    if (a === 'grande' && actual?.parentElement) {
      pila.push(actual);
      actual = actual.parentElement;
      return pintarEleccion();
    }
    if (a === 'chico' && pila.length) {
      actual = pila.pop();
      return pintarEleccion();
    }
    if (a === 'quitar' && actual) {
      const sel = selectorPara(actual);
      // Efecto inmediato con una hoja propia; en la proxima visita lo inyecta
      // fondo.js antes de pintar, como cualquier regla local.
      estilo = document.createElement('style');
      estilo.textContent = `${sel}{display:none !important}`;
      (document.head || document.documentElement).append(estilo);
      reglaGuardada = sel;
      try {
        await chrome.runtime.sendMessage({ tipo: 'agregarReglaLocal', host: location.hostname, selector: sel });
      } catch {}
      fase = 'hecho';
      soltarEventos();
      enmarcar(null);
      acciones.hidden = true;
      texto.textContent = t('selListo');
      boton('deshacer').hidden = false;
      boton('salir').textContent = '✕';
      setTimeout(() => { if (document.contains(anfitrion)) salir(); }, 9000);
      return;
    }
    if (a === 'deshacer' && reglaGuardada) {
      estilo?.remove();
      try {
        await chrome.runtime.sendMessage({ tipo: 'quitarReglaLocal', host: location.hostname, selector: reglaGuardada });
      } catch {}
      salir();
    }
  });
})();
