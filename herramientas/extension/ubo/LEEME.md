# Código de uBlock Origin 1.75.0

Copia **sin modificar** de los archivos de uBlock Origin que hacen falta para compilar los scriptlets de YouTube. Autoría: Raymond Hill y colaboradores. Licencia: GPLv3 (`LICENSE.txt`), la misma de Filtros MX.

| Aquí | En el repositorio de uBlock (etiqueta `1.75.0`) |
|---|---|
| `js/resources/*.js` | `src/js/resources/` — los scriptlets |
| `js/arglist-parser.js`, `js/jsonpath.js`, `js/urlskip.js` | `src/js/` — dependencias de los anteriores |
| `js/offscreen/make-scriptlets.js`, `make-utils.js`, `safe-replace.js`, `scriptlet.template.js` | `platform/mv3/extension/js/offscreen/` — cómo uBO Lite empaqueta los scriptlets bajo Manifest V3 |

**Única pieza que no es de uBlock:** `js/offscreen/regex-analyzer.js`, un sustituto de una línea. El original arrastra una biblioteca entera que solo sirve para reglas con dominio por expresión regular, y esas ya se descartan antes.

## Cómo actualizar

YouTube cambia su reproductor para esquivar estas reglas. Cuando uBlock publique una versión con arreglos en los scriptlets:

1. Bajar la etiqueta nueva de https://github.com/gorhill/uBlock y copiar encima los mismos archivos de la tabla.
2. Cambiar `VERSION_UBO` en `../construir-scriptlets.mjs`.
3. `node herramientas/extension/construir.mjs`, luego `node herramientas/extension/medir-youtube.mjs`, y **solo si la medición sale bien**, empaquetar.

Las **reglas** (no el motor) se bajan solas en cada compilación desde las listas de uAssets: casi todos los arreglos de YouTube llegan por ahí sin tocar esta carpeta.
