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

### 1. `elsiglodetorreon.com.mx` — contenedores `.lapub`

> **Sitio:** https://www.elsiglodetorreon.com.mx
> **Qué pasa:** los 9 contenedores publicitarios del sitio (`#portadaA` … `#portadaN`) usan la clase `.lapub`. EasyList Spanish trae la regla `.pub`, que no coincide.
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

### 5. `eldiariodechihuahua.mx` — contenedores `.banner`

> **Sitio:** https://www.eldiariodechihuahua.mx
> **Qué pasa:** los 8 elementos `.banner` del sitio contienen `<p>Publicidad</p>` y un slot `div-gpt-ad`. **8 de 8**; ninguno es contenido editorial. `.side-banner-home` envuelve a uno y quedaría con hueco residual.
> **Reglas propuestas:** `eldiariodechihuahua.mx##.banner` y `eldiariodechihuahua.mx##.side-banner-home`
> **Verificado el 30-jul-2026:** sin pérdida de titulares, enlaces ni imágenes. Cierra 561 px. Los 87 caracteres perdidos son las etiquetas "PUBLICIDAD".
> **Advertir al reportar:** `.banner` es una clase genérica. Aquí solo es segura porque se comprobó elemento por elemento en este sitio. No proponerla como regla genérica.

### 6. Global, no regional — proveedores que EasyList aún no alcanza

Observados en `unotv.com`, no cubiertos por EasyList ni EasyPrivacy. **No son mexicanos**, así que su sitio natural es EasyPrivacy, no una lista regional:

| Host | Qué es |
|---|---|
| `static.fsrv.io` | Freestar, iframe de sincronización de cookies (`/load-cookie.html`) |
| `api.mantis-intelligence.com` | Freestar, clasificación contextual del artículo para segmentación (`/freestar/article/classification`) |

**Les falta la prueba de recarga.** No reportar hasta hacerla.

---

## Un patrón que puede valer más que las cinco reglas juntas

`periodicocorreo.com.mx` (Guanajuato) y `eldiariodechihuahua.mx` (Chihuahua) comparten el mismo maquetado publicitario, hasta en los nombres de clase:

```html
<p>Publicidad</p>
<div class="mr-banner">
  <div id="div-gpt-ad-…">
```

Dos periódicos de estados distintos con `.mr-banner`, la misma etiqueta y la misma estructura **es un CMS o una agencia compartida**, no una coincidencia. Si atiende a más regionales mexicanos, una sola regla sobre ese patrón cubriría a todos de golpe.

**Antes de proponer nada hay que averiguar cuántos sitios lo usan.** Con dos casos no se propone una regla que afecta a terceros. Es la pieza de mayor rendimiento pendiente, y es barata: buscar `.mr-banner` en los regionales que faltan por medir.

## Una pista que NO se reporta todavía

El atributo `data-advadstrackid` es la firma del plugin **Advanced Ads** de WordPress, que usan muchos medios pequeños. Una regla genérica sobre esa firma podría cubrir a decenas de sitios de una vez.

**Es la pieza de mayor rendimiento por hora y también la más peligrosa.** Una regla genérica mal hecha rompe sitios en masa, y quien la propone sin haberla probado en muchos sitios distintos hace daño y pierde la confianza del proyecto que la recibe. Verificar en al menos diez sitios que usen el plugin antes de siquiera proponerla.

---

## Registro

Cuando un reporte se envíe, anotar aquí la fecha y el enlace. Cuando una regla se acepte aguas arriba, **retirarla de `mexico.txt`**: mantener dos copias de la misma regla es trabajo duplicado y una de las dos se quedará vieja.
