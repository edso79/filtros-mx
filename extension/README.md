# Filtros MX — extensión para Chrome (Manifest V3)

Bloqueador de anuncios que además **te dice qué publicidad ninguna lista está cubriendo.**

> **Estado: verificada en un Chrome real el 5-ago-2026** — carga, reglas activas, filtrado cosmético, detector y popup, con la página intacta. Detalle y lo que sigue pendiente: [Qué está probado y qué no](#qué-está-probado-y-qué-no).

## Por qué existe, si ya está uBlock Origin Lite

**No es por bloquear mejor. No bloquea mejor.** Carga las mismas listas públicas y, bajo Manifest V3, con menos capacidad cosmética que uBlock Origin completo.

Existe por el **detector de huecos**: localiza unidades publicitarias **por su contenido** —el slot de una red, un iframe de un servidor de anuncios, la etiqueta "Publicidad" que el propio medio está obligado a poner— y no por el nombre de sus clases. Después comprueba cuáles de ellas **ninguna lista alcanza**, y prepara el reporte aguas arriba.

Eso ningún bloqueador lo hace: bloquean lo que su lista nombra, y no te dicen qué se les escapó.

Detectar por contenido no es un capricho. Clasificar por nombre de clase falló de tres formas medidas el 30-jul-2026 —ciego con Tailwind, falso positivo con tagDiv y con Elementor— y las tres venían de lo mismo. El detalle está en `herramientas/eje-visual/medidor.js`.

## Cómo instalarla hoy

No está en la Chrome Web Store. Se carga a mano:

1. `chrome://extensions`
2. Activar **Modo de desarrollador** (arriba a la derecha)
3. **Cargar descomprimida** → seleccionar esta carpeta `extension/`

Antes hay que compilar las listas, porque `reglas/` se genera y no se versiona:

```bash
node herramientas/extension/construir.mjs
```

## Cómo está hecha

| Pieza | Archivo | Qué hace |
|---|---|---|
| Motor de red | `reglas/red.json` | Reglas `declarativeNetRequest` compiladas de las listas |
| Motor cosmético | `src/fondo.js` | Inyecta CSS por dominio. **MV3 no trae filtrado cosmético**; sin esto se perdería el 73-77% de lo que hacen las listas regionales |
| **Motor extendido** | `src/contenido.js` | Aplica 299 de las 305 reglas `#?#` de las listas: `:has()` es CSS nativo desde Chrome 105 y el texto (`:has-text()`) lo evalúa un motor propio. Llegan **precompiladas** por `construir.mjs` — el cliente no parsea sintaxis ABP |
| Detector | `src/contenido.js` | Encuentra publicidad que ninguna lista cubre |
| Modos por sitio | `src/fondo.js` | **Apagado / Básico / Completo** desde la 1.0.0. Completo (genéricas incluidas) es el de fábrica, salvo donde la propia lista lo prohíbe con `$generichide`; Básico es la salida a un clic si un sitio se rompe. Gestión en opciones |
| **«Quitar un elemento»** | `src/selector.js` | Selector con el ratón (1.0.0), inyectado por el popup solo al pulsar el botón. Crea una regla local como la de abajo. Es la salida cuando el detector no ve |
| **Textos es/en** | `_locales/`, `src/i18n.js` | Generados por `herramientas/extension/generar-locales.mjs`; no se editan a mano |
| **Reglas locales** | `src/fondo.js`, `popup/` | El botón **«Quitar»** de cada anuncio colado (antes «Ocultar aquí») crea una regla cosmética del usuario: local, reversible desde el popup y opciones, y que no toca ninguna lista. Es lo que convierte al detector en beneficio directo — no solo en instrumento de reporte |
| Contador de red | `popup/` | Peticiones frenadas por pestaña vía `getMatchedRules`. **Filtra las excepciones** (van primero, ids `1..reglasPermiso` de `meta.json`): contar un permiso como bloqueo sería presumir un bloqueo que no ocurrió. La ventana de 5 minutos de Chrome se declara en la propia etiqueta |
| Icono por modo | `src/fondo.js` | Gris cuando el sitio está en Apagado — el estado se ve sin abrir el popup |
| Bienvenida | `bienvenida/` | Se abre **una sola vez**, al instalar: qué hace, qué no hace, cómo leer el popup |
| Interfaz | `popup/`, `opciones/` | Estado, cifras, y el reporte listo para revisar |

El CSS cosmético se inyecta desde `webNavigation.onCommitted` y no desde el content script **a propósito**: el content script corre en `document_idle`, o sea después de que la página pintó. Ocultar el anuncio después de que ya se vio no sirve de nada.

## Lo que esta extensión no hace, y no va a hacer

1. **No manda nada a ningún servidor.** No hay una sola petición de red a terceros en todo el código. El análisis es local. Principio 3 del proyecto: cero datos de navegación fuera del dispositivo.
2. **No reporta sola.** Un reporte solo sale si la persona lo pulsa, **viendo el texto completo antes**. Un envío automático de URLs sería telemetría con otro nombre.
3. **No manda reportes sin verificar a EasyList.** El texto que genera lleva escrito, en mayúsculas, que falta la prueba de recarga. Un aluvión de reportes automáticos quemaría en una semana la relación que se estrenó el 3-ago-2026.
4. **No afirma bloquear más ni mejor** que ningún otro bloqueador.
5. **No tiene lista blanca pagada**, ni la tendrá con donativos de por medio.

## Qué está probado y qué no

**Probado:**

- **Las 13,403 reglas cumplen el esquema de `declarativeNetRequest`** — `herramientas/extension/validar-reglas.mjs`. Importa porque Chrome valida el conjunto entero y, si algo no le cuadra, lo rechaza completo **y falla en silencio**: la extensión queda instalada, con su icono, sin bloquear nada.
- **Las tres listas caben enteras.** 114,158 líneas de filtro → 13,403 reglas, con **cero recortes por presupuesto**, gracias a fusionar por `requestDomains`. Sin esa fusión era una regla por línea contra un tope de 29,000: se habría caído el 75% de EasyList. *(La cifra sale de `reglas/meta.json`, que es la fuente de verdad; se recompila con las listas.)*
- **Los PNG generados son válidos** y el manifiesto los referencia.

**Verificado en un Chrome real el 5-ago-2026** (carga manual):

- **Cargó sin errores** — la tarjeta apareció limpia, sin botón de "Errores", y el service worker activo.
- **Las 13,409 reglas están indexadas y encendidas, con prueba aritmética:** `getEnabledRulesets()` devolvió `['principal']` y `getAvailableStaticRuleCount()` devolvió 316,591 — el tope global de Chrome es 330,000, y 330,000 − 316,591 = **13,409 exactas**.
- **El filtrado cosmético funciona:** en `zocalo.com.mx` la insignia marcó **18 elementos ocultos** y la página quedó intacta — titulares, menús e imágenes en su lugar.
- **El detector funciona en vivo:** reportó 3 huecos con selector, tamaño y alcance, y **declaró sus descartes** (2 sin nombre posible, 1 por sobrecobertura) en vez de esconderlos tras un cero.
- Popup, apagado por sitio e insignia, operando.

**Añadido el 6-ago-2026, construido y probado en compilador pero NO verificado en navegador:**

- El **motor extendido** (299/305 reglas `#?#`, parser probado con 6/6 formas reales) y los **modos por sitio**. Verificarlos exige recargar la extensión (↻ en `chrome://extensions`) y mirar sitios reales.
- **La comparación con uBlock sigue prohibida hasta medirla.** El texto de opciones lo dice así: capacidad construida, no medida.

**Añadido el 10-ago-2026 (mejoras de producto) — VERIFICADO el 12-ago-2026:**

- **Contador de peticiones frenadas**: verificado en el Chrome real de Edgar (4 y 29 peticiones en sitios con publicidad; 0 en Apagado; raya honesta donde no hay sitio). El filtrado de excepciones ya se había probado con maqueta (27 de 29).
- **Icono gris en Apagado**: verificado en Chrome real — tras corregir un defecto real que la verificación destapó: `setIcon` desde el service worker resolvía mal las **rutas relativas** y el error moría en un catch vacío. Rutas ahora absolutas (`/iconos/...`) y el fallo, si vuelve, se escribe en consola.
- **Página de bienvenida**: verificada en Chrome real desde el enlace de opciones.
- **Reglas locales "Ocultar aquí"**: verificadas **de punta a punta con arnés automatizado** (`herramientas/extension/probar-ocultar-aqui.mjs`): guardado por el mismo mensaje del botón, inyección al recargar (caja `display:none`, editorial intacto, el señuelo GPT correctamente descartado por la genérica) y deshacer. El detector encontró el hueco garantizado de la página de prueba en el Chrome real de Edgar (1 hueco, con botón).
- El permiso `declarativeNetRequestFeedback` **pasó de opcional a fijo** (lo exige el contador) y la versión subió a **0.2.0**.

**El arnés que lo hizo posible — y el candado que abre:** `probar-ocultar-aqui.mjs` usa **Chrome for Testing** (firmado por Google) con CDP a pelo sobre el WebSocket nativo de Node. **La política de la máquina bloquea binarios sin firma (el Chromium de Playwright), pero Chrome for Testing SÍ corre** — comprobado el 12-ago-2026. Eso significa que `probar-bloqueo.mjs` y cualquier verificación automatizada de la extensión ya pueden correr en esta máquina, sin carga manual.

**Cerrado el 6-ago-2026 — bloqueo de red observado petición a petición:** la consola del Chrome real reportó `ERR_BLOCKED_BY_CLIENT` sobre `googletagservices.com/tag/js/gpt.js` (regla de EasyList) y `google-analytics.com/analytics.js` (EasyPrivacy) con Filtros MX como único bloqueador activo. Ese error lo emite Chrome cuando una extensión detiene la petición: es la observación directa que el arnés no pudo dar. *(Efecto secundario coherente: con `gpt.js` bloqueado los slots nunca se llenan — de ahí tanta "caja vacía reservada" en el detector.)*

## Medir un sitio real con el bloqueo puesto (13-ago-2026)

`herramientas/extension/medir-sitio.mjs` carga la extensión de verdad, navega a un sitio, lo recorre para disparar la carga diferida y hace dos cosas: **le pregunta al detector embarcado** qué quedó visible encima, y **audita reglas candidatas** — cuánta área y altura visible aportarían de verdad. Cuenta también las peticiones frenadas, que es la prueba de que el bloqueo estaba puesto.

```bash
node herramientas/extension/medir-sitio.mjs <chrome.exe> https://sitio.com --reforzado --selector ".mi-clase"
```

`--reforzado` aplica las genéricas: **es el modo que modela al usuario real**, porque uBlock Origin las trae activadas. `--sin-extension` da el contraste con un navegador limpio, y `--puerto` permite medir dos sitios a la vez.

**El defecto que destapó el primer día que se usó.** El detector devolvía **`huecos: 0` en `elmanana.com`** —el hallazgo más grande del proyecto, 3,560 px de alto de espacio reservado— porque `colapsariaAlVaciarse` *deducía* el colapso: si las listas cubren la publicidad de dentro, el envoltorio se vacía. **Cubierto no es colapsado:** una caja con altura propia reservada sigue ocupando la pantalla. El propio comentario de la función ya lo advertía y aun así descartaba. Ahora `estadoAlVaciarse` **mide** — oculta lo cubierto, mide el envoltorio, restaura — y los dos sitios volvieron de 0 a 1 hueco, coincidiendo con reportes que una persona había validado a mano por separado. Detalle en `../documentos/medicion-con-bloqueo-2026-08-13.md`.

**Lo que sigue pendiente, dicho sin maquillar:**

- El arnés `probar-bloqueo.mjs` queda como confirmatorio sistemático (línea base con/sin extensión) para una máquina sin la política de firmas; la observación de arriba es real pero puntual.
- **Los sitios que el detector declaró limpios antes del 13-ago hay que remedirlos.** El falso negativo apareció en los dos sitios que se midieron, así que era sistemático: "limpio" dicho por el detector viejo no vale como limpio.
- Los candidatos que el detector encuentra **siguen necesitando la prueba de recarga humana** antes de reportarse. El botón de reporte lo dice en el propio texto que genera.

## Licencia y atribución

GPLv3 — ver `../filtros/LICENSE`. Copyright (C) 2026 Edgar Alonso Sosa Camargo.

Las listas base son de **The EasyList authors**, bajo GPLv3 y CC BY-SA 3.0. La extensión las compila, no las modifica. Ver `../filtros/ATRIBUCION.md`.
