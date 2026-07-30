# Reportes preparados para EasyList

**Esta es la vía principal, no la secundaria.**

La medición del 30 de julio de 2026 mostró que el hueco no es mexicano: los regionales de España y Argentina tienen el mismo, por el mismo mecanismo. Si el problema es global, una lista aparte solo le sirve a quien se suscriba, mientras que la misma regla en EasyList Spanish le sirve a todos **y la mantiene alguien más.**

Para dos personas cuyo riesgo principal es abandonar el proyecto, eso último no es un detalle: es la diferencia entre una contribución que sobrevive y una que se pudre.

**Orden de trabajo:** se reporta aguas arriba primero. La lista propia queda como zona de paso para lo que allá no acepten o tarde.

---

## Cómo se reporta

EasyList recibe reportes en el rastreador de incidencias de su repositorio. Un reporte útil lleva: la URL exacta, qué se ve, la regla propuesta y la prueba de que no rompe el sitio.

**No abrir un reporte sin haber hecho la prueba de recarga de `CONTRIBUIR.md`.** Un reporte con una regla sin verificar cuesta tiempo del voluntario que lo revise y quema credibilidad para el siguiente.

---

## Pendientes de reportar

### 1. `elsiglodetorreon.com.mx` — **la regla que ya existe quedó obsoleta**

Este no es un hueco sin cubrir: es una regla suya que dejó de funcionar. Conviene reportarlo así, porque es más útil y más fácil de aceptar.

> **Sitio:** https://www.elsiglodetorreon.com.mx
> **Regla existente:** `elsiglodetorreon.com.mx##.col-4 > div.bg-light:has(> div.pub)`
> **Qué pasa:** ese selector **coincide con 0 elementos** en el sitio actual, comprobado el 30-jul-2026 en un navegador con soporte de `:has()` (control: `div:has(> div)` coincide con 40 elementos, así que el soporte no es el problema). El sitio tampoco tiene ningún `.pub`.
> **Lo que sí hay:** 15 contenedores con clase `.lapub`, 8 de ellos visibles.
> **Regla propuesta:** `elsiglodetorreon.com.mx##.lapub`
> **Verificado el 30-jul-2026:** sin pérdida de titulares, enlaces, imágenes ni texto. Cierra 546 px de alto.

### 2. `zocalo.com.mx` — contenedores `.banner-medio`

> **Sitio:** https://www.zocalo.com.mx
> **Qué pasa:** 14 contenedores del plugin **Advanced Ads** de WordPress, con atributo `data-advadstrackid` y rutas de Google Ad Manager, envueltos en `.banner-medio`.
> **Regla propuesta:** `zocalo.com.mx##.banner-medio`
> **Verificado el 30-jul-2026:** sin pérdida de titulares, enlaces, imágenes ni texto. Cierra 848 px de alto.

### 3. `periodicocorreo.com.mx` — contenedores `.zone-ads`

> **Sitio:** https://periodicocorreo.com.mx
> **Qué pasa:** 4 zonas `.zone-ads`, cada una con `<p>Publicidad</p>`, `adsbygoogle` y slots `div-gpt-ad`. Tres quedan visibles, de 300x310 y 300x804 en la columna lateral.
> **Regla propuesta:** `periodicocorreo.com.mx##.zone-ads`
> **Verificado el 30-jul-2026:** sin pérdida de titulares, enlaces ni imágenes. Cierra 92 px. Los 86 caracteres de texto que desaparecen son las etiquetas "Publicidad" de las propias zonas.

### 4. `elmanana.com.mx` — contenedores `.ad-zone`

> **Sitio:** https://www.elmanana.com.mx
> **Qué pasa:** 12 contenedores `.ad-zone`, cada uno con un `div[data-ad-slot="banner-N"]`.
> **Regla propuesta:** `elmanana.com.mx##.ad-zone`
> **Verificado el 30-jul-2026 como seguro**, sin pérdida de nada. **Reportar con la salvedad:** al medir, los espacios estaban sin llenar y la página no encogió. El beneficio está inferido de que reservan alto (`min-height:165px`), no observado con anuncio servido. Conviene volver a mirarlo con inventario lleno antes de reportar.

### 5. `eldiariodechihuahua.mx` — **añadir el dominio a una regla que ya existe**

El reporte más barato de todos: no hace falta regla nueva, solo un dominio más en una que ya mantienen.

> **Sitio:** https://www.eldiariodechihuahua.mx
> **Qué pasa:** sus 8 elementos `.banner` contienen `<p>Publicidad</p>` y un slot `div-gpt-ad` — 8 de 8, ninguno editorial. El sitio **no aparece en ninguna regla de ninguna lista**.
> **Lo que ya existe:** una regla multi-dominio que termina en `##.banner` y que ya incluye `diario.mx`, `elimparcial.com`, `informador.mx`, `laverdadnoticias.com` y unos sesenta más.
> **Petición:** **añadir `eldiariodechihuahua.mx` a esa lista de dominios.** Es el mismo CMS que `diario.mx`, que ya está dentro.
> **Verificado el 30-jul-2026:** sin pérdida de titulares, enlaces ni imágenes. Cierra 561 px. Los 87 caracteres perdidos son las etiquetas "PUBLICIDAD".
> **Aparte:** `.side-banner-home` envuelve a uno de los ocho y quedaría con hueco residual. Si aceptan, proponer también `eldiariodechihuahua.mx##.side-banner-home`.

### 6. Global, no regional — proveedores que EasyList aún no alcanza

Observados en `unotv.com`, no cubiertos por EasyList ni EasyPrivacy. **No son mexicanos**, así que su sitio natural es EasyPrivacy, no una lista regional:

| Host | Qué es |
|---|---|
| `static.fsrv.io` | Freestar, iframe de sincronización de cookies (`/load-cookie.html`) |
| `api.mantis-intelligence.com` | Freestar, clasificación contextual del artículo para segmentación (`/freestar/article/classification`) |

**Les falta la prueba de recarga.** No reportar hasta hacerla.

---

## El patrón `.mr-banner`: rastreado y descartado como regla genérica

La hipótesis era que `.mr-banner` fuera la firma de un CMS extendido, y que **una sola regla cubriera decenas de medios**. Se rastreó el 30-jul-2026 y **no se sostiene.**

**La firma real del CMS** no es la clase, es la ruta: sirve sus recursos desde `/core/<slug>/assets/` y declara `<meta name="application-name">`.

| Sitio | Huella | Veredicto |
|---|---|---|
| `periodicocorreo.com.mx` | `/core/correo/assets` | Confirmado |
| `eldiariodechihuahua.mx` | `/core/dch/assets` | Confirmado |
| `diario.mx` | `/core/dmx/assets` | Confirmado — **y ya está cubierto** |

**3 de 36 sitios mexicanos probados.** El CMS existe y es identificable, pero es angosto: no da para una regla genérica, y de los tres, dos ya tienen regla propia en esta lista y el tercero ya lo cubre EasyList.

**Conclusión: no se propone ninguna regla genérica sobre `.mr-banner`.** Una regla que afecta a terceros necesita justificar su alcance, y el alcance resultó ser tres sitios.

Lo que sí salió del rastreo, y vale más: descubrir que `diario.mx` ya está dentro de la regla multi-dominio `##.banner`, lo que convierte el reporte de `eldiariodechihuahua.mx` en "añadan un dominio" en vez de "acepten una regla nueva".

## Una pista que NO se reporta todavía

El atributo `data-advadstrackid` es la firma del plugin **Advanced Ads** de WordPress, que usan muchos medios pequeños. Una regla genérica sobre esa firma podría cubrir a decenas de sitios de una vez.

**Es la pieza de mayor rendimiento por hora y también la más peligrosa.** Una regla genérica mal hecha rompe sitios en masa, y quien la propone sin haberla probado en muchos sitios distintos hace daño y pierde la confianza del proyecto que la recibe. Verificar en al menos diez sitios que usen el plugin antes de siquiera proponerla.

---

## Registro

Cuando un reporte se envíe, anotar aquí la fecha y el enlace. Cuando una regla se acepte aguas arriba, **retirarla de `mexico.txt`**: mantener dos copias de la misma regla es trabajo duplicado y una de las dos se quedará vieja.
