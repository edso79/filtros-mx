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

---

# Texto listo para pegar

Los reportes de arriba explican el *por qué*. Lo de abajo es el *qué se pega*, uno por incidencia, en el rastreador de EasyList.

**Una incidencia por sitio.** Agruparlas hace que se revisen más lento y que un rechazo arrastre a las demás.

---

### Incidencia 1 — `elsiglodetorreon.com.mx`

**Título:** `elsiglodetorreon.com.mx — existing rule matches zero elements`

```
The existing rule for this site no longer matches anything:

    elsiglodetorreon.com.mx##.col-4 > div.bg-light:has(> div.pub)

Verified 2026-07-30 in a browser with :has() support (control selector
`div:has(> div)` matched 40 elements, so support is not the issue).
The selector matches 0 elements, and the site has no `.pub` elements at all.

The ad containers are now `.lapub` — 15 of them, 8 visible on the homepage,
ids `#portadaA` through `#portadaN`.

Proposed replacement:

    elsiglodetorreon.com.mx##.lapub

Tested by applying the rule and reloading: no loss of headlines, links,
images or text. Closes 546px of vertical space.
```

---

### Incidencia 2 — `eldiariodechihuahua.mx`

**Título:** `eldiariodechihuahua.mx — add domain to existing ##.banner rule`

```
This site is not covered by any rule in EasyList, EasyPrivacy or
EasyList Spanish.

All 8 `.banner` elements on the homepage contain `<p>Publicidad</p>` and a
`div-gpt-ad` slot. 8 of 8 — none is editorial content.

The site runs the same CMS as diario.mx (both serve from /core/<slug>/assets/),
and diario.mx is already included in the existing multi-domain rule ending in
`##.banner`.

Request: add `eldiariodechihuahua.mx` to that domain list.

Tested by applying the rule and reloading: no loss of headlines, links or
images. Closes 561px. The 87 characters of text removed are the "PUBLICIDAD"
labels inside the containers themselves.

Optional, same site: `eldiariodechihuahua.mx##.side-banner-home` wraps one of
the eight and leaves residual space when the inner one is hidden.
```

---

### Incidencia 3 — `zocalo.com.mx`

**Título:** `zocalo.com.mx — uncovered ad containers (.banner-medio)`

```
Not covered by any rule in EasyList, EasyPrivacy or EasyList Spanish.

14 ad containers wrapped in `.banner-medio`. They carry the Advanced Ads
WordPress plugin attribute `data-advadstrackid` and Google Ad Manager paths.

Proposed rule:

    zocalo.com.mx##.banner-medio

Tested by applying the rule and reloading: no loss of headlines, links,
images or text. Closes 848px.

Note: a `<nav>` shows as collapsed after applying the rule. It is a
dropdown that is closed by default — identical with and without the rule.
```

---

### Incidencia 4 — `periodicocorreo.com.mx`

**Título:** `periodicocorreo.com.mx — uncovered ad containers (.zone-ads)`

```
The site has 3 existing rules, none of which covers its ad zones.

4 `.zone-ads` containers, each holding `<p>Publicidad</p>`, adsbygoogle and
`div-gpt-ad` slots. Three remain visible, at 300x310 and 300x804 in the
sidebar.

Proposed rule:

    periodicocorreo.com.mx##.zone-ads

Tested by applying the rule and reloading: no loss of headlines, links or
images. Closes 92px. The 86 characters of text removed are the "Publicidad"
labels inside the zones themselves.
```

---

### Incidencia 5 — `elmanana.com.mx`

**Título:** `elmanana.com.mx — uncovered ad containers (.ad-zone)`

```
Not covered by any rule in EasyList, EasyPrivacy or EasyList Spanish.

12 `.ad-zone` containers, each holding a `div[data-ad-slot="banner-N"]`.

Proposed rule:

    elmanana.com.mx##.ad-zone

Tested by applying the rule and reloading: no loss of headlines, links,
images or text — the rule is safe.

Caveat, stated up front: at the time of testing the slots were unfilled, so
the page height did not change. The benefit is inferred from the containers
reserving height (`min-height:165px`), not observed with an ad served.
Worth a second look on a page load with filled inventory.
```

---

## Lo que NO se reporta, y por qué

- **`static.fsrv.io` y `api.mantis-intelligence.com`** (Freestar, vistos en `unotv.com`): les falta la prueba de recarga. Un reporte sin verificar cuesta tiempo del voluntario que lo revise y quema credibilidad para el siguiente.
- **Cualquier regla genérica sobre `.mr-banner` o `data-advadstrackid`**: sin haberla probado en 10+ sitios, una regla que afecta a terceros no se propone.
