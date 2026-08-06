# Reportes preparados para EasyList

**Esta es la vía principal, no la secundaria.**

La medición del 30 de julio de 2026 mostró que el hueco no es mexicano: los regionales de España y Argentina tienen el mismo, por el mismo mecanismo. Si el problema es global, una lista aparte solo le sirve a quien se suscriba, mientras que la misma regla en EasyList Spanish le sirve a todos **y la mantiene alguien más.**

Que la mantenga alguien más no es un detalle: es la diferencia entre una contribución que sobrevive al abandono y una que se pudre.

**Orden de trabajo:** se reporta aguas arriba primero. La lista propia queda como zona de paso para lo que allá no acepten o tarde.

---

## A dónde se manda — verificado el 31-jul-2026

**Los cinco reportes van a EasyList Spanish, no a EasyList.** Comprobado: la regla multi-dominio `##.banner` que ya incluye `diario.mx` vive en `easylistspanish.txt`, y todos nuestros sitios son de habla hispana.

Hay tres canales. Los dos primeros los declara la propia lista en su encabezado `! Please report...`:

| Canal | Dónde | Cuándo conviene |
|---|---|---|
| **GitHub** | https://github.com/easylist/easylistspanish/issues | **El recomendado.** Queda rastro público, se puede editar, y es donde vive el archivo |
| Foro | https://forums.lanik.us/viewforum.php?f=103 | Alternativa oficial. Requiere registro |
| Correo | `easylistspanish@protonmail.com` | Si no quieres cuenta en ninguno de los dos |

*(El foro respondió `HTTP 429` al comprobarlo — límite de peticiones, no caída. Con un navegador normal abre bien.)*

**Escribe en inglés.** Los mantenedores de EasyList son internacionales; el foro español es para reportes de usuarios, pero las incidencias técnicas se leen mejor en inglés. Los textos de abajo ya están en inglés.

**No abras un reporte sin haber hecho la prueba de recarga de `CONTRIBUIR.md`.** Un reporte con una regla sin verificar cuesta tiempo del voluntario que lo revise y quema credibilidad para el siguiente.

### Por cuál empezar

*(Histórico: así se decidió el orden el 31-jul. Salió bien — se enviaron los cinco y entraron los cinco. Se conserva como método para el siguiente lote.)*

No los mandes los cinco de golpe. **Empieza por `eldiariodechihuahua.mx`** —solo pide añadir un dominio a una regla que ya mantienen— y por `elsiglodetorreon.com.mx`, que les avisa de que una regla suya lleva tiempo muerta. Son los dos más fáciles de aceptar.

Si esos dos entran, ya sabes que el canal funciona y que los reportes están bien formados. Los otros tres van después.

---

## Segundo lote — ENVIADO COMPLETO el 6-ago-2026

Los dos reportes cumplieron el estándar completo de julio: prueba de recarga **en dos días distintos** (3 y 5 de agosto), todas las plantillas revisadas, y la comprobación contra reglas existentes hecha.

- **`tribuna.com.mx` — [#362](https://github.com/easylist/easylistspanish/issues/362)**, abierta.
- **`quadratin.com.mx` — [#363](https://github.com/easylist/easylistspanish/issues/363)**, abierta.

**Los dos enlaces de un clic ya se usaron; no volver a pulsarlos** — duplicarían las incidencias.

Es el primer lote del ciclo completo con la extensión en medio: el detector encontró los huecos, la verificación los depuró (2 candidatos cayeron por estar ya cubiertos por una genérica, uno por regla frágil), y los reportes salieron con la evidencia de dos días.

### En preparación: `pulsoslp.com.mx` — falta la segunda carga

Encontrado por el detector el 6-ago-2026 al ampliar el corpus. **`#StickHeader_UP1`** (1265×90, anuncio servido), presente **en portada y en nota** con el mismo identificador, sin regla en ninguna lista. Prueba de recarga limpia en ambas plantillas: cero pérdida de titulares, enlaces, texto, menús y formularios.

> **Regla candidata:** `pulsoslp.com.mx###StickHeader_UP1`

**NO se envía hasta la segunda carga en día distinto.**

### En preparación: `elmanana.com` (Reynosa) — falta la segunda carga

Hallazgo del 6-ago-2026 con una aclaración que evita un susto: **`elmanana.com` y `elmanana.com.mx` son periódicos hermanos en plataformas distintas** — `.com` es Reynosa (plataforma nueva) y `.com.mx` es Nuevo Laredo, cuyos 12 `.ad-zone` **siguen vivos**: la regla aceptada en julio está bien. Pero las reglas cosméticas son por dominio, y el `.com` **no tiene ni una en ninguna lista**.

Su plataforma nombra la publicidad con familia propia: `template-publicidad-cuadrada-independiente` (5 unidades de 309×250), `-dos-columnas` y `-notas`, más un `#stickyunit` de 1280×90. **24 elementos de la familia en portada, cero editorial** — el único texto que se pierde son 10 etiquetas "PUBLICIDAD" y el "×" del sticky, igual que en el reporte de `periodicocorreo` de julio. En nota individual la familia casa 0: inofensiva.

> **Reglas candidatas:**
> ```
> elmanana.com##[class^="template-publicidad-cuadrada"]
> elmanana.com###stickyunit
> ```

Los slots estaban como cajas vacías reservadas en esta carga — **el mismo hábito de su hermano de julio**, y se declarará igual en el reporte.

**NO se envía hasta la segunda carga en día distinto.**

### En preparación: `criteriohidalgo.com` — el ex-intratable, falta la segunda carga

**El caso que el censo declaró intratable, reclasificado con medición el 6-ago-2026** (detalle en `documentos/censo-intratabilidad-2026-07-30.md`, sección "Revisita"). Sus envoltorios siguen siendo Tailwind puro e inatacables por clase, pero el selector anclado al contenido los nombra:

> **Regla candidata:**
> ```
> criteriohidalgo.com##div:has(> [id^="div-gpt-ad"])
> ```
> Casa 11 envoltorios, todos publicitarios, cero editorial. Recarga limpia; cierra 200 px de tiras reservadas. **EasyList ya acepta `:has()` bajo `##`** — la vieja regla de Torreón lo era.

**Salvedad para el reporte:** los slots estaban vacíos en la primera carga; los propios slots ya los cubre la genérica `[id^="div-gpt-ad"]` — lo que esta regla cierra es el envoltorio residual.

**NO se envía hasta la segunda carga en día distinto.**

### `quadratin.com.mx` — contenedores propios sin cubrir

**El primero encontrado con ayuda de la extensión** (detector de `extension/src/contenido.js`), no enteramente a mano. Verificado el 3-ago-2026 a 1280 px de ancho.

> **Sitio:** https://www.quadratin.com.mx
> **Qué pasa:** el sitio **no tiene ni una sola regla cosmética** en EasyList, EasyPrivacy ni EasyList Spanish. Tres contenedores propios con anuncio servido de Google Ad Manager sobreviven en portada.
> **Reglas propuestas:**
> ```
> quadratin.com.mx##.banner--cinturon2
> quadratin.com.mx##.banner--faro
> quadratin.com.mx###custom_html-2
> ```
> **Verificado (prueba de recarga, las tres a la vez):** sin pérdida de titulares, enlaces, texto, menús, formularios ni carruseles. Cierra 712 px. Las 2 imágenes que desaparecen son marcadores SVG vacíos de carga diferida dentro de los propios contenedores.
> **Tamaños:** 630x598, 1110x90 y 350x758, los tres con anuncio servido.

**Lo que NO se propone, y por qué importa decirlo:**

- **NO añadir `quadratin.com.mx` a la regla multi-dominio `##.banner`.** Era la tentación —es el reporte más barato, como el de `eldiariodechihuahua.mx`— y la prueba de recarga lo desmintió: **quita 16 titulares, 14 enlaces y 1,019 caracteres.** `.banner--sidebar` envuelve el bloque editorial "LO ÚLTIMO". De 6 elementos `.banner` del sitio, solo 3 son publicidad.
- **NO reportar los contenedores `#div-gpt-ad-*`.** Ya los cubre la regla genérica `[id^="div-gpt-ad"]` de EasyList.

**Segunda carga hecha el 5-ago-2026:** los tres selectores presentes con las mismas dimensiones (630×598, 1110×90, 350×758), **los tres con anuncio servido**, y la prueba de recarga volvió a pasar: cero pérdida de titulares, enlaces, texto, menús, formularios y carruseles; cierra 712 px. Además, en la carga intermedia del mismo día los slots aparecieron como cajas vacías reservadas — el reporte declara ambos estados. **✅ ENVIADA el 6-ago-2026: [#363](https://github.com/easylist/easylistspanish/issues/363).**

*(El enlace de abajo ya se usó — se conserva como plantilla del formato. NO volver a pulsarlo.)*

[Incidencia pre-llenada de quadratin.com.mx — YA ENVIADA](https://github.com/easylist/easylistspanish/issues/new?title=quadratin.com.mx%3A%20uncovered%20ad%20containers&body=Not%20covered%20by%20any%20rule%20in%20EasyList%2C%20EasyPrivacy%20or%20EasyList%20Spanish.%0A%0ASite%3A%20https%3A%2F%2Fwww.quadratin.com.mx%20(Michoacan%2C%20Mexico)%0AViewport%3A%201280px%20(the%20mobile%20layout%20hides%20these%20units%20with%20Bootstrap%20d-none%2C%20so%20measure%20on%20desktop%20width)%0A%0AThree%20ad%20containers%20with%20Google%20Ad%20Manager%20slots%20survive%20on%20the%20homepage%3A%0A%0A%20%20%20%20quadratin.com.mx%23%23.banner--cinturon2%0A%20%20%20%20quadratin.com.mx%23%23.banner--faro%0A%20%20%20%20quadratin.com.mx%23%23%23custom_html-2%0A%0ASizes%3A%20630x598%2C%201110x90%20and%20350x758.%20All%20three%20held%20served%20ads%20on%20both%20test%20days%3B%20on%20one%20intermediate%20load%20the%20slots%20were%20empty%20reserved%20boxes%2C%20which%20the%20rules%20also%20remove.%0A%0ATested%20by%20applying%20the%20three%20rules%20and%20reloading%2C%20on%20two%20separate%20days%20(2026-08-03%20and%202026-08-05)%3A%20no%20loss%20of%20headlines%2C%20links%2C%20images%2C%20text%2C%20menus%2C%20forms%20or%20carousels.%20Closes%20712px%20of%20vertical%20space.%0A%0ANote%3A%20the%20site's%20%23div-gpt-ad-*%20containers%20are%20already%20covered%20by%20the%20generic%20rule%20%5Bid%5E%3D%22div-gpt-ad%22%5D%20and%20are%20NOT%20part%20of%20this%20request.%0A%0AOne%20caution%20we%20checked%20so%20you%20don't%20have%20to%3A%20please%20do%20NOT%20solve%20this%20by%20adding%20the%20domain%20to%20the%20multi-domain%20%23%23.banner%20rule.%20On%20this%20site%20.banner--sidebar%20wraps%20an%20editorial%20%22LO%20ULTIMO%22%20block%3A%20hiding%20.banner%20removes%2016%20headlines%2C%2014%20links%20and%20~1%2C000%20characters%20of%20text.%20Only%203%20of%20its%206%20.banner%20elements%20are%20ads.)

*(El cuerpo incluye la advertencia de NO resolverlo metiendo el dominio en la multi-dominio `##.banner` — es exactamente como el mantenedor resolvió `periodicocorreo`, y aquí rompería el sitio.)*

### `tribuna.com.mx` — familia de huecos con nombre propio

Encontrado con el detector el 3-ago-2026, ampliando el corpus. **Una sola regla cubre el sitio entero**, que es el mejor caso posible: menos que mantener aguas arriba.

> **Sitio:** https://www.tribuna.com.mx (Sonora)
> **Qué pasa:** el sitio **no tiene ni una regla cosmética** en ninguna lista. Sus huecos publicitarios llevan identificadores propios con un prefijo común, una familia por plantilla, y **los 12 encontrados son publicidad, ninguno editorial**:
> - Portada: `Tribuna_Home_Rectangle_1/2/3`, `Tribuna_Home_Horizontal_1/2`
> - Secciones: `Tribuna_Secciones_Horizontal_1`, `Tribuna_Secciones_Rectangle_1`, `Tribuna_Secciones_HalfPage_1`
> - Notas: `Tribuna_Notas_Rectangle_1/2`, `Tribuna_Notas_Horizontal_1`, `Tribuna_Notas_HalfPage_1`
>
> **Regla propuesta:**
> ```
> tribuna.com.mx##[id^="Tribuna_"]
> ```
> **Verificado el 3-ago-2026 (portada y sección) y el 5-ago-2026 (portada de nuevo, nota individual y página de video), a 1280 px:** sin pérdida de titulares, enlaces, imágenes, texto, menús ni formularios en ninguna plantilla. En la página de video la regla casa 0 elementos — inofensiva. Los slots vacíos reservan tiras visibles de 30 px que la regla también cierra.

**Por qué el prefijo y no los identificadores sueltos:** los individuales cambian por plantilla —`Home`, `Secciones`, `Notas`— así que una regla por identificador dejaría fuera plantillas enteras y obligaría a volver. **La nota individual del 5-ago lo demostró:** reveló la familia `Tribuna_Notas_*`, que una lista fija de identificadores se habría perdido completa.

**Segunda carga hecha el 5-ago-2026, tercera plantilla incluida. ✅ ENVIADA el 6-ago-2026: [#362](https://github.com/easylist/easylistspanish/issues/362).**

*(El enlace pre-llenado de abajo ya se usó — se conserva solo como plantilla del formato. NO volver a pulsarlo: duplicaría la incidencia.)*

[Incidencia pre-llenada de tribuna.com.mx — YA ENVIADA](https://github.com/easylist/easylistspanish/issues/new?title=tribuna.com.mx%3A%20uncovered%20ad%20containers%20(%5Bid%5E%3D%22Tribuna_%22%5D)&body=Not%20covered%20by%20any%20rule%20in%20EasyList%2C%20EasyPrivacy%20or%20EasyList%20Spanish.%0A%0ASite%3A%20https%3A%2F%2Fwww.tribuna.com.mx%20(Sonora%2C%20Mexico)%0AViewport%3A%201280px%0A%0AThe%20site's%20ad%20slots%20carry%20its%20own%20IDs%20with%20a%20common%20prefix%2C%20one%20family%20per%20template%3A%0A%0A%20%20%20%20homepage%3A%20Tribuna_Home_Rectangle_1%2F2%2F3%2C%20Tribuna_Home_Horizontal_1%2F2%0A%20%20%20%20sections%3A%20Tribuna_Secciones_Horizontal_1%2C%20Tribuna_Secciones_Rectangle_1%2C%20Tribuna_Secciones_HalfPage_1%0A%20%20%20%20articles%3A%20Tribuna_Notas_Rectangle_1%2F2%2C%20Tribuna_Notas_Horizontal_1%2C%20Tribuna_Notas_HalfPage_1%0A%0A12%20slots%20checked%20one%20by%20one%20across%20the%20three%20templates%3A%20every%20one%20is%20an%20ad%20slot%20(Google%20Ad%20Manager%20iframes%20or%20reserved%20boxes)%2C%20none%20contains%20editorial%20content.%0A%0AProposed%20rule%3A%0A%0A%20%20%20%20tribuna.com.mx%23%23%5Bid%5E%3D%22Tribuna_%22%5D%0A%0AThe%20prefix%20rather%20than%20an%20ID%20list%2C%20deliberately%3A%20the%20IDs%20change%20per%20template%20(Home%2FSecciones%2FNotas)%2C%20so%20a%20fixed%20list%20would%20miss%20whole%20templates%20and%20need%20a%20follow-up%20report.%0A%0ATested%20by%20applying%20the%20rule%20and%20reloading%20on%20homepage%2C%20section%20and%20article%20pages%2C%20on%20two%20separate%20days%20(2026-08-03%20and%202026-08-05)%3A%20no%20loss%20of%20headlines%2C%20links%2C%20images%2C%20text%2C%20menus%20or%20forms.%20Empty%20slots%20reserve%20visible%2030px%20strips%20which%20the%20rule%20also%20removes.)

---

## Los reportes, y en qué acabó cada uno

*Se conservan íntegros. Son el modelo de reporte que funcionó: cinco de cinco aceptados.*

### 1. `elsiglodetorreon.com.mx` — **la regla que ya existe quedó obsoleta** ✅ ACEPTADA: [#358](https://github.com/easylist/easylistspanish/issues/358)

Este no es un hueco sin cubrir: es una regla suya que dejó de funcionar. Conviene reportarlo así, porque es más útil y más fácil de aceptar.

> **Sitio:** https://www.elsiglodetorreon.com.mx
> **Regla existente:** `elsiglodetorreon.com.mx##.col-4 > div.bg-light:has(> div.pub)`
> **Qué pasa:** ese selector **coincide con 0 elementos** en el sitio actual, comprobado el 30-jul-2026 en un navegador con soporte de `:has()` (control: `div:has(> div)` coincide con 40 elementos, así que el soporte no es el problema). El sitio tampoco tiene ningún `.pub`.
> **Lo que sí hay:** 15 contenedores con clase `.lapub`, 8 de ellos visibles.
> **Regla propuesta:** `elsiglodetorreon.com.mx##.lapub`
> **Verificado el 30-jul-2026:** sin pérdida de titulares, enlaces, imágenes ni texto. Cierra 546 px de alto.

### 2. `zocalo.com.mx` — contenedores `.banner-medio` ✅ ACEPTADA: [#359](https://github.com/easylist/easylistspanish/issues/359)

> **Sitio:** https://www.zocalo.com.mx
> **Qué pasa:** 14 contenedores del plugin **Advanced Ads** de WordPress, con atributo `data-advadstrackid` y rutas de Google Ad Manager, envueltos en `.banner-medio`.
> **Regla propuesta:** `zocalo.com.mx##.banner-medio`
> **Verificado el 30-jul-2026:** sin pérdida de titulares, enlaces, imágenes ni texto. Cierra 848 px de alto.

### 3. `periodicocorreo.com.mx` — contenedores `.zone-ads` ⚠️ CERRADA CON OTRO ARREGLO: [#360](https://github.com/easylist/easylistspanish/issues/360)

> **Sitio:** https://periodicocorreo.com.mx
> **Qué pasa:** 4 zonas `.zone-ads`, cada una con `<p>Publicidad</p>`, `adsbygoogle` y slots `div-gpt-ad`. Tres quedan visibles, de 300x310 y 300x804 en la columna lateral.
> **Regla propuesta:** `periodicocorreo.com.mx##.zone-ads`
> **Verificado el 30-jul-2026:** sin pérdida de titulares, enlaces ni imágenes. Cierra 92 px. Los 86 caracteres de texto que desaparecen son las etiquetas "Publicidad" de las propias zonas.

### 4. `elmanana.com.mx` — contenedores `.ad-zone` ✅ ACEPTADA: [#361](https://github.com/easylist/easylistspanish/issues/361)

> **Sitio:** https://www.elmanana.com.mx
> **Qué pasa:** 12 contenedores `.ad-zone`, cada uno con un `div[data-ad-slot="banner-N"]`.
> **Regla propuesta:** `elmanana.com.mx##.ad-zone`
> **Verificado el 30-jul-2026 como seguro**, sin pérdida de nada. **Revisado de nuevo el 31-jul en una segunda carga, día distinto: sigue sin llenar** — 12 contenedores, cero iframes — y el primero reserva una caja visible de 616x165. El beneficio ya es observado, no inferido: la regla quita cajas vacías reservadas. La salvedad va incluida en el texto del reporte.

### 5. `eldiariodechihuahua.mx` — **añadir el dominio a una regla que ya existe** ✅ ACEPTADA: [#357](https://github.com/easylist/easylistspanish/issues/357)

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

| Fecha | Reporte | Incidencia | Estado | Qué entró aguas arriba |
|---|---|---|---|---|
| 2026-07-31 | `eldiariodechihuahua.mx` — añadir dominio a `##.banner` | [#357](https://github.com/easylist/easylistspanish/issues/357) | **Aceptada** 3-ago | El dominio, en la regla multi-dominio que se pidió |
| 2026-07-31 | `elsiglodetorreon.com.mx` — regla obsoleta, proponer `.lapub` | [#358](https://github.com/easylist/easylistspanish/issues/358) | **Aceptada** 3-ago | `##.lapub` tal cual + `##.pubBoxDG` + borraron la regla muerta |
| 2026-07-31 | `zocalo.com.mx` — proponer `.banner-medio` | [#359](https://github.com/easylist/easylistspanish/issues/359) | **Aceptada** 3-ago | `##.banner-medio` tal cual + `.anuncio-lateral-detalle` + `##.banner-top` |
| 2026-07-31 | `periodicocorreo.com.mx` — proponer `.zone-ads` | [#360](https://github.com/easylist/easylistspanish/issues/360) | **Cerrada, arreglo distinto** 3-ago | `###floor-ad` + el dominio en `##.banner`. **No** `.zone-ads` |
| 2026-07-31 | `elmanana.com.mx` — proponer `.ad-zone` | [#361](https://github.com/easylist/easylistspanish/issues/361) | **Aceptada** 3-ago | `##.ad-zone` tal cual |
| 2026-08-06 | `tribuna.com.mx` — proponer `##[id^="Tribuna_"]` | [#362](https://github.com/easylist/easylistspanish/issues/362) | **Abierta** | — |
| 2026-08-06 | `quadratin.com.mx` — proponer `.banner--cinturon2`, `.banner--faro`, `#custom_html-2` | [#363](https://github.com/easylist/easylistspanish/issues/363) | **Abierta** | — |

## Resultado: 5 de 5 cerradas como completadas en ~3 días

Los cinco reportes se enviaron el 31-jul y **los cinco se cerraron con commit el 3-ago-2026**, entre las 09:03 y las 09:16 UTC. Ninguno recibió comentario: el mantenedor arregló y cerró.

Verificado el 3-ago contra la lista publicada que consumen los usuarios (`easylist-downloads.adblockplus.org/easylistspanish.txt`, versión `202608031801`), no solo contra el repositorio. Los cambios ya están en circulación.

**Consecuencia inmediata: `mexico.txt` se quedó con 0 reglas activas.** Las 6 se retiraron el 3-ago. El registro de cuáles eran y por qué se fueron vive en el propio `mexico.txt`, en la sección RETIRADAS, para que nadie las reescriba dentro de seis meses creyendo que encontró un hueco.

### Los dos casos que hubo que medir, no suponer

**Cerrada no es lo mismo que "entró mi regla".** Dos de las seis no se podían retirar por el hecho de que la incidencia estuviera cerrada:

- **`periodicocorreo.com.mx`** — el mantenedor **no** aceptó `.zone-ads`; arregló el sitio de otra forma. Y `.banner` está *dentro* de `.zone-ads`, así que la sospecha razonable era que quedara hueco residual. Medido contra el DOM real el 3-ago: con solo las reglas de aguas arriba, el área visible de las 4 zonas cae a **0**, desaparecen las **12** etiquetas "PUBLICIDAD" y el documento encoge **877 px**. Nuestra regla aporta **0 área y 0 altura** encima. Cubierto.
- **`eldiariodechihuahua.mx##.side-banner-home`** — no se pidió ni se aceptó aguas arriba, y se retira igual: medido el 3-ago, el contenedor colapsa solo con `##.banner` (área visible 0, altura extra 0). El hueco residual que se temía el 30-jul **no se produce**.

Si alguno de los dos hubiera dado un número distinto de cero, esa regla se habría quedado. La comprobación no era ceremonia.

### Qué aprendió el proyecto con esto

1. **El canal funciona, y rápido.** Tres días de la incidencia al archivo publicado, sin discusión. La hipótesis de `AGUAS-ARRIBA.md` —que la vía principal debía ser aguas arriba— queda confirmada por observación, no por argumento.
2. **Un reporte bien formado se acepta sin negociar.** Los cinco llevaban sitio, selector, prueba de recarga y salvedades declaradas por adelantado. Ninguno necesitó una segunda ronda.
3. **Reportar una regla muerta ajena vale tanto como proponer una nueva.** El de `elsiglodetorreon` fue el más productivo de los cinco: además de aceptar el reemplazo, borraron la regla obsoleta y agregaron una que no habíamos visto.
4. **El mantenedor puede arreglar mejor que lo propuesto.** En `zocalo` y `elsiglodetorreon` agregaron selectores extra. Proponer la regla no es imponerla.

---

# Enlaces de un clic

> **YA SE USARON LOS CINCO. No los vuelvas a pulsar** — abrirían incidencias duplicadas de cosas ya arregladas, que es justo lo que quema credibilidad con un mantenedor. Se conservan como plantilla para el siguiente lote.

Cada enlace abre el formulario de incidencia de EasyList Spanish **ya escrito** — título y cuerpo pre-llenados con los textos de arriba. Hace falta sesión de GitHub. El trabajo restante: revisar que se vea bien y pulsar **Submit new issue**.

**1. eldiariodechihuahua.mx**
[Abrir incidencia pre-llenada](https://github.com/easylist/easylistspanish/issues/new?title=eldiariodechihuahua.mx%3A%20add%20domain%20to%20existing%20%23%23.banner%20rule&body=This%20site%20is%20not%20covered%20by%20any%20rule%20in%20EasyList%2C%20EasyPrivacy%20or%20EasyList%20Spanish.%0A%0AAll%208%20%60.banner%60%20elements%20on%20the%20homepage%20contain%20%60%3Cp%3EPublicidad%3C%2Fp%3E%60%20and%20a%20%60div-gpt-ad%60%20slot.%208%20of%208%20%E2%80%94%20none%20is%20editorial%20content.%0A%0AThe%20site%20runs%20the%20same%20CMS%20as%20diario.mx%20(both%20serve%20from%20%60%2Fcore%2F%3Cslug%3E%2Fassets%2F%60)%2C%20and%20diario.mx%20is%20already%20included%20in%20the%20existing%20multi-domain%20rule%20ending%20in%20%60%23%23.banner%60.%0A%0ARequest%3A%20add%20%60eldiariodechihuahua.mx%60%20to%20that%20domain%20list.%0A%0ATested%20by%20applying%20the%20rule%20and%20reloading%3A%20no%20loss%20of%20headlines%2C%20links%20or%20images.%20Closes%20561px.%20The%2087%20characters%20of%20text%20removed%20are%20the%20%22PUBLICIDAD%22%20labels%20inside%20the%20containers%20themselves.%0A%0AOptional%2C%20same%20site%3A%20%60eldiariodechihuahua.mx%23%23.side-banner-home%60%20wraps%20one%20of%20the%20eight%20and%20leaves%20residual%20space%20when%20the%20inner%20one%20is%20hidden.)

**2. elsiglodetorreon.com.mx**
[Abrir incidencia pre-llenada](https://github.com/easylist/easylistspanish/issues/new?title=elsiglodetorreon.com.mx%3A%20existing%20rule%20matches%20zero%20elements&body=The%20existing%20rule%20for%20this%20site%20no%20longer%20matches%20anything%3A%0A%0A%60%60%60%0Aelsiglodetorreon.com.mx%23%23.col-4%20%3E%20div.bg-light%3Ahas(%3E%20div.pub)%0A%60%60%60%0A%0AVerified%202026-07-30%20in%20a%20browser%20with%20%60%3Ahas()%60%20support%20(control%20selector%20%60div%3Ahas(%3E%20div)%60%20matched%2040%20elements%2C%20so%20support%20is%20not%20the%20issue).%20The%20selector%20matches%200%20elements%2C%20and%20the%20site%20has%20no%20%60.pub%60%20elements%20at%20all.%0A%0AThe%20ad%20containers%20are%20now%20%60.lapub%60%20%E2%80%94%2015%20of%20them%2C%208%20visible%20on%20the%20homepage%2C%20ids%20%60%23portadaA%60%20through%20%60%23portadaN%60.%0A%0AProposed%20replacement%3A%0A%0A%60%60%60%0Aelsiglodetorreon.com.mx%23%23.lapub%0A%60%60%60%0A%0ATested%20by%20applying%20the%20rule%20and%20reloading%3A%20no%20loss%20of%20headlines%2C%20links%2C%20images%20or%20text.%20Closes%20546px%20of%20vertical%20space.)

**3. zocalo.com.mx**
[Abrir incidencia pre-llenada](https://github.com/easylist/easylistspanish/issues/new?title=zocalo.com.mx%3A%20uncovered%20ad%20containers%20(.banner-medio)&body=Not%20covered%20by%20any%20rule%20in%20EasyList%2C%20EasyPrivacy%20or%20EasyList%20Spanish.%0A%0A14%20ad%20containers%20wrapped%20in%20%60.banner-medio%60.%20They%20carry%20the%20Advanced%20Ads%20WordPress%20plugin%20attribute%20%60data-advadstrackid%60%20and%20Google%20Ad%20Manager%20paths.%0A%0AProposed%20rule%3A%0A%0A%60%60%60%0Azocalo.com.mx%23%23.banner-medio%0A%60%60%60%0A%0ATested%20by%20applying%20the%20rule%20and%20reloading%3A%20no%20loss%20of%20headlines%2C%20links%2C%20images%20or%20text.%20Closes%20848px.%0A%0ANote%3A%20a%20%60%3Cnav%3E%60%20shows%20as%20collapsed%20after%20applying%20the%20rule.%20It%20is%20a%20dropdown%20that%20is%20closed%20by%20default%20%E2%80%94%20identical%20with%20and%20without%20the%20rule.)

**4. periodicocorreo.com.mx**
[Abrir incidencia pre-llenada](https://github.com/easylist/easylistspanish/issues/new?title=periodicocorreo.com.mx%3A%20uncovered%20ad%20containers%20(.zone-ads)&body=The%20site%20has%203%20existing%20rules%2C%20none%20of%20which%20covers%20its%20ad%20zones.%0A%0A4%20%60.zone-ads%60%20containers%2C%20each%20holding%20%60%3Cp%3EPublicidad%3C%2Fp%3E%60%2C%20adsbygoogle%20and%20%60div-gpt-ad%60%20slots.%20Three%20remain%20visible%2C%20at%20300x310%20and%20300x804%20in%20the%20sidebar.%0A%0AProposed%20rule%3A%0A%0A%60%60%60%0Aperiodicocorreo.com.mx%23%23.zone-ads%0A%60%60%60%0A%0ATested%20by%20applying%20the%20rule%20and%20reloading%3A%20no%20loss%20of%20headlines%2C%20links%20or%20images.%20Closes%2092px.%20The%2086%20characters%20of%20text%20removed%20are%20the%20%22Publicidad%22%20labels%20inside%20the%20zones%20themselves.)

**5. elmanana.com.mx**
[Abrir incidencia pre-llenada](https://github.com/easylist/easylistspanish/issues/new?title=elmanana.com.mx%3A%20uncovered%20ad%20containers%20(.ad-zone)&body=Not%20covered%20by%20any%20rule%20in%20EasyList%2C%20EasyPrivacy%20or%20EasyList%20Spanish.%0A%0A12%20%60.ad-zone%60%20containers%2C%20each%20holding%20a%20%60div%5Bdata-ad-slot%3D%22banner-N%22%5D%60.%0A%0AProposed%20rule%3A%0A%0A%60%60%60%0Aelmanana.com.mx%23%23.ad-zone%0A%60%60%60%0A%0ATested%20by%20applying%20the%20rule%20and%20reloading%3A%20no%20loss%20of%20headlines%2C%20links%2C%20images%20or%20text%20%E2%80%94%20the%20rule%20is%20safe.%0A%0ACaveat%2C%20stated%20up%20front%3A%20on%20two%20separate%20page%20loads%20(2026-07-30%20and%202026-07-31)%20the%20slots%20were%20unfilled%3A%2012%20containers%2C%20zero%20ad%20iframes.%20The%20first%20container%20still%20reserves%20a%20visible%20616x165%20empty%20box%20(%60min-height%3A165px%60)%2C%20which%20is%20exactly%20what%20this%20rule%20removes.%20Not%20yet%20observed%20with%20an%20ad%20actually%20served.)

Cuando una se envíe, anotar la fecha y el enlace de la incidencia en el **Registro** de arriba.

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

Caveat, stated up front: on two separate page loads (2026-07-30 and 2026-07-31) the slots were unfilled: 12 containers, zero ad iframes. The first container still reserves a visible 616x165 empty box (min-height:165px), which is exactly what this rule removes. Not yet observed with an ad actually served.
```

---

## Lo que NO se reporta, y por qué

- **`static.fsrv.io` y `api.mantis-intelligence.com`** (Freestar, vistos en `unotv.com`): les falta la prueba de recarga. Un reporte sin verificar cuesta tiempo del voluntario que lo revise y quema credibilidad para el siguiente.
- **Cualquier regla genérica sobre `.mr-banner` o `data-advadstrackid`**: sin haberla probado en 10+ sitios, una regla que afecta a terceros no se propone.
