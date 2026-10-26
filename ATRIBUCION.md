# Atribución

Verificado contra fuente primaria el **31 de julio de 2026**. Antes de esta fecha esta tabla contenía una afirmación equivocada; ver el registro al final.

## EasyList y EasyPrivacy

| | |
|---|---|
| Autoría | The EasyList authors |
| Licencia | **Doble**: GNU GPL versión 3 *o posterior*, **y** Creative Commons Attribution-ShareAlike 3.0 Unported *o posterior* |
| Fuente | https://easylist.to/pages/licence.html — declarada en el encabezado `! Licence:` de cada lista |
| Atribución | Acreditar a **"The EasyList authors"** como fuente |
| Compartir igual | Sí, por la cláusula ShareAlike |

Aplica igual a **EasyList Spanish**, que declara el mismo encabezado de licencia.

## uBlock Origin: scriptlets y reglas de YouTube (extensión 1.1.0)

Verificado el **7 de octubre de 2026** contra los archivos `LICENSE` de los dos repositorios.

| | |
|---|---|
| Autoría | **Raymond Hill y colaboradores de uBlock Origin** |
| Qué se toma | El motor de *scriptlets* (`src/js/resources/` y `platform/mv3/extension/js/offscreen/make-scriptlets.js`, fijado a **uBlock Origin 1.75.0**) y las reglas `+js()` de YouTube de las listas «uBlock filters», «quick fixes» y «unbreak» |
| Licencia | **GNU GPL versión 3** — la misma de este proyecto, así que se puede incorporar sin cambiarla |
| Fuente | https://github.com/gorhill/uBlock (`LICENSE.txt`) y https://github.com/uBlockOrigin/uAssets (`LICENSE`) |
| Dónde vive | `herramientas/extension/ubo/` (código sin modificar, con su `LICENSE.txt`) y, compilado, `extension/reglas/scriptlets-*.js` |
| Atribución | En la página de opciones y en la ficha de la tienda |

**No se reescribieron a propósito.** YouTube cambia su reproductor cada pocas semanas para esquivarlos, y quien publica los arreglos es uBlock Origin. Tomar su código tal cual es lo que permite recoger esos arreglos recompilando, en vez de perseguirlos a mano.

## EasyList Portuguese y EasyList Cookie List (extensión 1.2.0)

Verificado el **23 de octubre de 2026** contra el encabezado de cada lista tal como se sirve.

| | EasyList Portuguese | EasyList Cookie List |
|---|---|---|
| Fuente | `https://easylist-downloads.adblockplus.org/easylistportuguese.txt` | `https://secure.fanboy.co.nz/fanboy-cookiemonster.txt` |
| Encabezado de licencia | `! Licence: https://easylist.to/pages/licence.html` | `! License: http://creativecommons.org/licenses/by/3.0/` |
| Licencia | La de EasyList: **GPLv3 o posterior y CC BY-SA 3.0 o posterior** | **Creative Commons Attribution 3.0** — solo pide atribución, sin compartir igual |
| Autoría | The EasyList authors | Declara `Homepage: https://easylist.to/` y el correo de EasyList; no nombra autor |
| Cómo viaja | Compilada en `extension/reglas/red-pt.json` y `cosmeticas-pt.json`. Se enciende sola si el navegador está en portugués | Compilada en `red-cookies.json` y `cosmeticas-cookies.json`. **Apagada de fábrica**: la enciende la persona en opciones |
| Atribución | En la página de opciones y en la ficha de la tienda | Ídem, con el nombre de la licencia |

### Las demás regionales (también 1.2.0)

Verificadas el **23 de octubre de 2026** contra el encabezado de cada lista servida. Se encienden solas por idioma del navegador, como en uBlock Origin.

| Lista | Idiomas que la encienden | Encabezado de licencia | Licencia |
|---|---|---|---|
| EasyList Germany | `de` | `! Licence: https://easylist.to/pages/licence.html` | La de EasyList (GPLv3 / CC BY-SA 3.0) |
| EasyList Italy | `it` | `! Licenza: https://easylist.to/pages/licence.html` | La de EasyList |
| EasyList Dutch | `nl` | `! Licence: https://easylist.to/pages/licence.html` | La de EasyList |
| EasyList Polish | `pl` | `! Licence: https://easylist.to/pages/licence.html` | La de EasyList |
| EasyList China | `zh` | `! License: https://easylist.to/pages/licence.html` | La de EasyList |
| Liste FR | `fr` | `! Licence : https://creativecommons.org/licenses/by-sa/3.0/` | **CC BY-SA 3.0** |
| RU AdList (`advblock.txt`) | `ru`, `uk`, `be`, `kk` | `! Лицензия CC-BY: http://creativecommons.org/licenses/by/3.0/` | **CC BY 3.0** |

Todas se sirven desde `easylist.to` o `easylist-downloads.adblockplus.org`. Atribución en la página de opciones de la extensión, en los once idiomas.

**Ojo con la URL de la Cookie List:** `easylist.to/easylist/easylist-cookie.txt` y la de `easylist-downloads.adblockplus.org` dan **404** (medido el 23-oct-2026). La que sirve es la de `secure.fanboy.co.nz`, que es la que enlazan uBlock Origin y AdGuard.

## Lista de Peter Lowe

> ⚠️ **No declara licencia. Ninguna.**

Se revisaron el 31-jul-2026 la página del proyecto, la página de política y el encabezado de la lista servida en dos formatos. **En ninguna hay nombre de licencia, versión ni condiciones de redistribución.**

Lo único que hay:

- El encabezado declara `Credits: Peter Lowe - pgl@yoyo.org`.
- La página del proyecto dice, informalmente, que se puede combinar la lista con otras y publicarla.

**Eso es un permiso informal del autor, no una licencia.** No concede por escrito derechos de redistribución con condiciones conocidas, y no se puede tratar como si fuera CC BY-SA ni GPL.

**Qué significa en la práctica para este proyecto:** `mexico.txt` **no contiene ni una sola entrada tomada de la lista de Peter Lowe** — las 6 reglas que llegó a tener salieron de observar sitios, y desde el 3-ago-2026 está vacía. Mientras eso siga así, no hay obligación que cumplir ni riesgo que correr.

**Si algún día se quiere incorporar material suyo, hay que escribirle a `pgl@yoyo.org` y pedirlo**, no asumirlo.

## Una distinción que conviene tener clara

`mexico.txt` es una lista **complementaria de reglas originales**, no una obra derivada de EasyList: no incluye, copia ni adapta sus entradas. **Hoy no hay ninguna cláusula de compartir igual que la obligue.**

La GPLv3 de esta lista es, por tanto, **una elección del equipo**, no una imposición heredada. Se mantiene porque es la convención del ecosistema —uBlock Origin la usa— y porque protege que cualquiera que la reutilice comparta igual. Pero conviene no repetir el argumento de que "corresponde al material del que se parte", porque no se parte de él.

**Esto cambia en el momento en que se copie o adapte una regla de EasyList.** A partir de ahí sí aplica la doble licencia y sí hay obligación de atribuir y compartir igual.

## Cómo se cita una regla tomada de otra lista

Si una regla se copia o se adapta, se anota en el archivo, en la línea de arriba:

```
! Adaptada de EasyList — (c) The EasyList authors, GPLv3 / CC BY-SA 3.0
||ejemplo.com.mx/banner^
```

**Sin esa línea la regla no entra.** Dentro de seis meses nadie va a recordar de dónde salió, y la obligación de atribución no prescribe.

## Reglas propias

Una regla escrita observando un sitio, sin copiar de ninguna lista, es original y no necesita cita. Aun así se anota la fecha y el sitio donde se verificó — ver [CONTRIBUIR.md](CONTRIBUIR.md).

## Registro de correcciones

**31-jul-2026.** Este archivo afirmaba que la lista de Peter Lowe estaba bajo "CC BY-SA 4.0 y GPLv3". **Es falso**: no declara ninguna licencia. La afirmación se escribió sin comprobar la fuente y se corrige aquí. También se precisa que EasyList es GPLv3 *o posterior* y CC BY-SA 3.0 *o posterior*, no versiones fijas.

**Pendiente, y no es menor:** nada de lo anterior es asesoría legal. Antes de la primera publicación conviene que alguien con criterio jurídico revise al menos la elección de licencia y la ausencia de licencia en la lista de Peter Lowe.
