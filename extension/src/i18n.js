// Textos de las paginas de la extension (popup, opciones, bienvenida).
//
// Las cadenas viven en _locales/, generadas por
// herramientas/extension/generar-locales.mjs — editar ahi, no en los JSON.
//
// data-i18n       -> textContent
// data-i18n-html  -> innerHTML. Solo para textos NUESTROS empaquetados con la
//                    extension (llevan <b>, <em>); nunca para datos de la pagina.
// data-i18n-title -> title
// data-i18n-aria  -> aria-label

function t(clave, ...subs) {
  return chrome.i18n.getMessage(clave, subs.map(String)) || clave;
}

const IDIOMA = t('idioma');

function traducir(raiz = document) {
  document.documentElement.lang = IDIOMA.slice(0, 2);
  raiz.querySelectorAll('[data-i18n]').forEach((e) => { e.textContent = t(e.dataset.i18n); });
  raiz.querySelectorAll('[data-i18n-html]').forEach((e) => { e.innerHTML = t(e.dataset.i18nHtml); });
  raiz.querySelectorAll('[data-i18n-title]').forEach((e) => { e.title = t(e.dataset.i18nTitle); });
  raiz.querySelectorAll('[data-i18n-aria]').forEach((e) => { e.setAttribute('aria-label', t(e.dataset.i18nAria)); });
}

function numero(n) {
  return Number(n || 0).toLocaleString(IDIOMA);
}

traducir();
