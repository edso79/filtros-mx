# Reportes preparados para EasyList

**Esta es la vía principal, no la secundaria.**

La medición del 30 de julio de 2026 mostró que el hueco no es mexicano: los regionales de España y Argentina tienen el mismo, por el mismo mecanismo. Si el problema es global, una lista aparte solo le sirve a quien se suscriba, mientras que la misma regla en EasyList Spanish le sirve a todos **y la mantiene alguien más.**

Que la mantenga alguien más no es un detalle: es la diferencia entre una contribución que sobrevive al abandono y una que se pudre.

**Orden de trabajo:** se reporta aguas arriba primero. La lista propia queda como zona de paso para lo que allá no acepten o tarde.

---

## ✅ ENVIADAS el 31-ago-2026 — [#368](https://github.com/easylist/easylistspanish/issues/368) (`codigoqro.mx`) y [#369](https://github.com/easylist/easylistspanish/issues/369) (`posta.com.mx`), las dos abiertas

**Las dos cumplían el estándar de envío y salieron el mismo día.** Lo que les faltaba era la
segunda carga en día distinto —el requisito que #365 y #366 cumplieron y que convirtió sus
cifras en prueba— y se hizo seis días después: **las once filas medidas repiten al píxel**.

Con esto el proyecto lleva **doce reportes**: diez resueltos y **dos abiertos**, los primeros
desde que #366 cerró el 26-ago.

Detalle completo, con el instrumento y los límites: `documentos/segunda-carga-codigoqro-posta-2026-08-31.md`.

| Fila | 25-ago | 31-ago |
|---|---|---|
| cqro portada `.banner-container` | 7/7 · 1,045,814 px² · 1,140 px | **idéntico** |
| cqro portada `.soft-news-banner` | 3/3 · 225,000 px² · 750 px | **idéntico** |
| cqro portada `.sidebar-banner` | 1/1 · 180,000 px² · 600 px | **idéntico** |
| cqro portada `.banner-wrapper` | 10/10 · 226,260 px² · 1,380 px | **idéntico** |
| posta portada `[class^="publicidad_"]` | 5/7 · 548,388 px² · 641 px | **idéntico** |
| posta portada `.publicidad_posta` | 3/3 · 472,122 px² · 378 px | **idéntico** |
| posta portada `.publicidad_ads` | 1/3 · 73,261 px² · 253 px | **idéntico** |
| posta nota 1 `.publicidad_posta` | 1/1 · 164,868 px² · 132 px | **idéntico** |
| posta nota 1 `.publicidad_ads` | 0/0 · 0 px² · 0 px | **idéntico** |
| posta nota 2 `.publicidad_posta` | 1/1 · 164,868 px² · 132 px | **idéntico** |
| posta nota 2 `.publicidad_ads` | 0/0 · 0 px² · 0 px | **idéntico** |

**0 menciones de ambos dominios en las tres listas**, recomprobado el 31-ago contra las
descargadas ese día (EasyList Spanish `202608311832`). Y **ninguna incidencia previa** sobre
ninguno de los dos, comprobado contra la API de GitHub — no se duplica nada.

El barrido eligió los sitios por **estado no representado en el corpus** —Colima, Querétaro,
BCS, Estado de México, Tlaxcala/Puebla y Nuevo León— **no buscando hueco**. Es el criterio
del barrido del 21-ago, que evita el sesgo que el del 13-ago tuvo que declarar. Se evitaron
a propósito los «soles» de OEM: ya está medido que ahí no hay nada que hacer.

Resultado del barrido: **4 medidos y cubiertos o limpios, 2 candidatas, 1 no medible, 1
dominio equivocado.**

| Sitio | Estado | Veredicto |
|---|---|---|
| `codigoqro.mx` | Querétaro | **CANDIDATA** — 1,045,814 px² |
| `posta.com.mx` | Nuevo León | **CANDIDATA** — 548,388 px² |
| `bcsnoticias.mx` | BCS | cubierto (8 frenadas, 1 oculto, 0 huecos) |
| `diariodecolima.mx` | Colima | cubierto (8 frenadas, 5 ocultos, 0 huecos) |
| `lajornadadeoriente.com.mx` | Puebla/Tlaxcala | **cubierto** — 18 contenedores, todos en 0×0 |
| `heraldoedomex.com.mx` | Estado de México | **NO MEDIBLE** — no responde ni al navegador ni a curl |

**`diariocolima.com` no es el dominio: redirige a `diariodecolima.mx`.** Es el tropiezo de
`poresto.net` otra vez, y lo cazó el mensaje del arnés que lista las pestañas vistas —
escrito el 14-ago exactamente para esto.

---


---

### ✅ `lajornadadeoriente.com.mx` — cubierto entero, comprobado por EFECTO

Saltó la señal de ceguera (14 peticiones frenadas, 19 elementos ocultos, 0 huecos) y sus
contenedores son de los más limpios del corpus: **ids semánticos propios** —`#header_ad`,
`#side1_ad`, `#side2_ad`, `#bottom1_ad`, `#bottom2_ad`, `#bottom3_ad`— sirviendo Google Ad
Manager desde `/4424848/Jornada/`. Sobre el papel, una candidata de manual.

**Con la cobertura puesta no aporta nada.** Los seis ids, y los 18 que casa
`div[id$="_ad"]`, salen **0×0 y ocultos**: 0 px² y 0 px de altura. La prueba de pérdida sale
limpia, pero da igual — no hay nada que ocultar que no esté ya oculto.

Es `criteriohidalgo` y `lavozdemichoacan` otra vez: **un contenedor con buen nombre no es un
hueco si las listas ya lo vacían**. Y es la razón de la regla del 10-ago —comprobar por
efecto, no por selector— aplicada tal cual.

**Dato para el diseño futuro de la señal de ceguera, no para tocarla hoy:** el mismo día saltó
en `codigoqro.mx`, con 1,045,814 px² sin cubrir, y aquí, con cobertura total. **La señal no
discrimina entre las dos situaciones: solo dice «ve a mirar».** Eso es exactamente lo que se
le pide, y confirma lo anotado el 14-ago sobre que nombra mal su causa. No se afina.

### ⛔ `heraldoedomex.com.mx` — no medible, y no cuenta como limpio

Tres intentos: con `www`, sin `www`, y sin extensión. Con la extensión el content script
nunca responde («Receiving end does not exist»); sin ella el navegador carga algo con
**0 proveedores de terceros, 0 iframes y 0 pistas publicitarias**; y `curl` no llega a
conectar siquiera (`http 000`).

**Cuenta como no medible, igual que `elhorizonte.mx` y `debate.com.mx`, nunca como sitio
cubierto.** El Estado de México sigue sin representación en el corpus.

---

### 🕐 `codigoqro.mx` (Querétaro) — la más grande de las dos

Ninguna de las tres listas publicadas menciona el dominio: **0 en EasyList Spanish
(`202608251602`), 0 en EasyList, 0 en EasyPrivacy**, comprobado el 25-ago contra las listas
descargadas ese día, no contra la caché del repositorio.

Portada, con bloqueo real y modo Reforzado:

| Selector | Casan | Visibles | Área visible | Altura |
|---|---|---|---|---|
| `.banner-container` | 7 | **7** | **1,045,814 px²** | 1,140 px |
| `.soft-news-banner` | 3 | 3 | 225,000 px² | 750 px |
| `.sidebar-banner` | 1 | 1 | 180,000 px² | 600 px |
| `.banner-wrapper` | 10 | 10 | 226,260 px² | 1,380 px |

**Publicidad genuina de terceros:** AdSense (`ca-pub-4629112407486041`), con
`pagead2.googlesyndication.com` y `googleads.g.doubleclick.net` entre los proveedores.
**Prueba de pérdida limpia en los cuatro selectores:** 0 titulares, 0 enlaces, 0 imágenes,
0 campos, 0 caracteres.

**El aviso que hay que llevar por delante: `banner-container` y `banner-wrapper` NO son
nombres propios de este sitio.** Aparecen ya en las listas —23 y 15 veces en EasyList, 3 y 2
en EasyList Spanish— lo que dice que son nombres de tema o de plugin que usan otros medios.
Eso no los descalifica, porque esas reglas van por dominio, pero **obliga a proponerlos con
dominio y jamás como genéricas**. `.banner-wrapper` además trae cinco cajas de 2 px de ancho:
su cifra de área está inflada por elementos que no se ven.

**Lo que probablemente basta es `.banner-container` sola**: envuelve a la mayoría de los
`.banner-wrapper`. Hay que confirmarlo en la segunda carga en vez de proponer cuatro reglas
donde una hace el trabajo.

#### Segunda carga — 31-ago-2026: los cuatro selectores idénticos, y los tres pendientes cerrados

**(1) Cifra idéntica al píxel** en los cuatro selectores, seis días después.

**(2) Plantilla de nota medida**, dos notas de secciones distintas, **idénticas entre sí**:

| Selector | casan | visibles | área | altura |
|---|---|---|---|---|
| `.banner-container` | 4 | 4 | 590,991 px² | 614 px |
| `.sidebar-banner` | 4 | 4 | 405,000 px² | 1,350 px |
| `.soft-news-banner` | 0 | 0 | 0 px² | 0 px |
| **unión de los tres** | **8** | **8** | **995,991 px²** | **1,964 px** |

**(3) El «contenido dentro 7/7» era iframe vacío, no anuncio servido**, que es lo que se
sospechaba y no se podía afirmar. Cada caja lleva **1 iframe, 0 imágenes y texto vacío**. El
contraste sin extensión lo remata: la caja pasa de 970×**130** a 970×**132**, y el wrapper de
**2**×90 a **970**×92. **El ancho depende de que el anuncio cargue; la altura está reservada y
no.** El cuerpo del reporte lo declara por adelantado en vez de decir «se ven anuncios».

**Cuántas reglas hacen falta, medido y no deducido.** El 25-ago se supuso que «probablemente
basta `.banner-container` sola». **Es falso, y lo contrario también:**

| Comprobación | Resultado |
|---|---|
| `.banner-container .banner-wrapper` | **7** |
| `.soft-news-banner .banner-wrapper` | **3** |
| `.sidebar-banner .banner-wrapper` | 0 |
| los 4 cruces entre los otros tres | **0 en las dos direcciones** |

Los 10 `.banner-wrapper` están dentro de los otros dos, así que **sobra**; y los tres restantes
no se anidan entre sí, así que **hacen falta los tres**. `.banner-container` sola dejaría
**405,000 px² sin cubrir en las notas**, donde `.sidebar-banner` lleva cuatro unidades en vez
de una. *(El solapamiento se midió a propósito en vez de deducirlo de que la unión cuadrara con
la suma: una suma que cuadra no distingue «no se solapan» de «el instrumento cuenta dos veces».)*

**Publicidad genuina de terceros:** AdSense `ca-pub-4629112407486041`, servido desde
`googleads.g.doubleclick.net`. Y **ninguna regla cosmética aplica a este dominio**: 0 elementos
ocultos en las tres páginas.

**Quinta observación del límite estructural del detector:** `huecos: 0` con señal de ceguera en
las tres páginas, sobre 1,045,814 px² sin cubrir.

### Estado: CUMPLE el estándar de envío (31-ago-2026)

1. ✅ **Segunda carga en día distinto** — 25 y 31-ago, cifra idéntica en los cuatro selectores.
2. ✅ **Plantilla de nota** — dos notas reales, ambas con superficie y ambas limpias.
3. ✅ **Prueba de pérdida limpia** en las tres páginas, con `--probar-perdida`.

**Cómo se hizo (reproducible):**

```bash
node herramientas/extension/medir-sitio.mjs https://codigoqro.mx/ --reforzado --probar-perdida --selector ".banner-container" --selector ".soft-news-banner" --selector ".sidebar-banner" --selector ".banner-wrapper"
```

### Texto de la incidencia, listo para enviar

El cuerpo declara por adelantado lo que un mantenedor preguntaría: que las cajas están **vacías
y reservadas** (y qué cambia sin bloqueador); **por qué tres reglas y no una**, con el
anidamiento medido; **por qué NO se propone `.banner-wrapper`** pese a parecer un objetivo; y
que **`banner-container` no es nombre propio del sitio**, con el precedente que lo respalda.

```
Not covered by any rule in EasyList, EasyPrivacy or EasyList Spanish. The domain is not mentioned in any of the three lists (re-checked 2026-08-31).

Site: https://codigoqro.mx (Queretaro, Mexico)
Viewport: 1280px
Ad server: Google AdSense (ca-pub-4629112407486041)

Every ad unit on the site sits in one of three containers:

    .banner-container    (7 on the homepage, 4 on articles)
    .soft-news-banner    (3 on the homepage, 0 on articles)
    .sidebar-banner      (1 on the homepage, 4 on articles)

Proposed rules:

    codigoqro.mx##.banner-container
    codigoqro.mx##.soft-news-banner
    codigoqro.mx##.sidebar-banner

All three are needed: measured, they do not nest inside one another in either direction. .banner-container on its own leaves 405,000 px2 uncovered on article pages, where .sidebar-banner carries four units instead of one.

Deliberately NOT proposing .banner-wrapper, even though it looks like a target too: all 10 of them are already inside .banner-container (7) or .soft-news-banner (3), so it is redundant, and 5 of them are 2px wide, which inflates any area figure based on it.

banner-container and banner-wrapper are not site-specific names - they already appear 22 and 14 times in EasyList. That is why these are proposed per-domain and never as generic rules. .soft-news-banner does appear to be site-specific: 0 occurrences in either list.

Measured with all EasyList / EasyPrivacy / EasyList Spanish rules applied, including generic cosmetic rules, in a browser with network blocking active. Two separate days, identical to the pixel:

Homepage (2026-08-25 and 2026-08-31):

    .banner-container   7 of 7 visible, 1,045,814 px2, 1,140 px of vertical space
    .soft-news-banner   3 of 3 visible,   225,000 px2,   750 px
    .sidebar-banner     1 of 1 visible,   180,000 px2,   600 px
    Combined: 11 containers, 1,450,814 px2, 2,490 px

Article pages (two different articles, both identical):

    Combined: 8 containers, 995,991 px2, 1,964 px
    /nota/deportes/2026/08/29/mourinho
    /nota/codigo-elite/2026/08/28/danna-y-belinda-estrenan-dolce-vita-su-esperada-colaboracion

No existing cosmetic rule applies to this domain at all: 0 elements hidden on any of the three pages.

Reload test on all three pages, both days: no loss of headlines, links, images, menus or form fields.

Caveat stated up front: with a blocker active the boxes hold an empty AdSense iframe rather than a served ad, so what the rule removes is reserved space. Measured without a blocker, the same containers are 2px taller and the inner wrapper goes from 2px to 970px wide - the width depends on the ad loading, the height does not. Same situation as the elmanana.com (#364), imagendelgolfo.mx (#365) and diariodemorelos.com (#366) reports, where the mechanism was accepted.

Found with Filtros MX (https://github.com/edso79/filtros-mx).
```

> ✅ **ENVIADA el 31-ago-2026 por Edgar — [#368](https://github.com/easylist/easylistspanish/issues/368), abierta.** Cuerpo verificado contra la API de GitHub: llegó **íntegro**, con las tres reglas propuestas, los 1,045,814 px² de portada, los 405,000 px² que justifican no proponer `.banner-container` sola, y la línea de cierre `Found with Filtros MX` — **que es la prueba de que no se truncó**. 0 comentarios al enviarse, y GitHub no la marcó como duplicado.

*(El enlace de abajo ya se usó — se conserva como plantilla. NO volver a pulsarlo.)*

[Incidencia pre-llenada de codigoqro.mx — YA ENVIADA](https://github.com/easylist/easylistspanish/issues/new?title=codigoqro.mx%3A%20uncovered%20ad%20containers%20(.banner-container%2C%20.soft-news-banner%2C%20.sidebar-banner)&body=Not%20covered%20by%20any%20rule%20in%20EasyList%2C%20EasyPrivacy%20or%20EasyList%20Spanish.%20The%20domain%20is%20not%20mentioned%20in%20any%20of%20the%20three%20lists%20(re-checked%202026-08-31).%0A%0ASite%3A%20https%3A%2F%2Fcodigoqro.mx%20(Queretaro%2C%20Mexico)%0AViewport%3A%201280px%0AAd%20server%3A%20Google%20AdSense%20(ca-pub-4629112407486041)%0A%0AEvery%20ad%20unit%20on%20the%20site%20sits%20in%20one%20of%20three%20containers%3A%0A%0A%20%20%20%20.banner-container%20%20%20%20(7%20on%20the%20homepage%2C%204%20on%20articles)%0A%20%20%20%20.soft-news-banner%20%20%20%20(3%20on%20the%20homepage%2C%200%20on%20articles)%0A%20%20%20%20.sidebar-banner%20%20%20%20%20%20(1%20on%20the%20homepage%2C%204%20on%20articles)%0A%0AProposed%20rules%3A%0A%0A%20%20%20%20codigoqro.mx%23%23.banner-container%0A%20%20%20%20codigoqro.mx%23%23.soft-news-banner%0A%20%20%20%20codigoqro.mx%23%23.sidebar-banner%0A%0AAll%20three%20are%20needed%3A%20measured%2C%20they%20do%20not%20nest%20inside%20one%20another%20in%20either%20direction.%20.banner-container%20on%20its%20own%20leaves%20405%2C000%20px2%20uncovered%20on%20article%20pages%2C%20where%20.sidebar-banner%20carries%20four%20units%20instead%20of%20one.%0A%0ADeliberately%20NOT%20proposing%20.banner-wrapper%2C%20even%20though%20it%20looks%20like%20a%20target%20too%3A%20all%2010%20of%20them%20are%20already%20inside%20.banner-container%20(7)%20or%20.soft-news-banner%20(3)%2C%20so%20it%20is%20redundant%2C%20and%205%20of%20them%20are%202px%20wide%2C%20which%20inflates%20any%20area%20figure%20based%20on%20it.%0A%0Abanner-container%20and%20banner-wrapper%20are%20not%20site-specific%20names%20-%20they%20already%20appear%2022%20and%2014%20times%20in%20EasyList.%20That%20is%20why%20these%20are%20proposed%20per-domain%20and%20never%20as%20generic%20rules.%20.soft-news-banner%20does%20appear%20to%20be%20site-specific%3A%200%20occurrences%20in%20either%20list.%0A%0AMeasured%20with%20all%20EasyList%20%2F%20EasyPrivacy%20%2F%20EasyList%20Spanish%20rules%20applied%2C%20including%20generic%20cosmetic%20rules%2C%20in%20a%20browser%20with%20network%20blocking%20active.%20Two%20separate%20days%2C%20identical%20to%20the%20pixel%3A%0A%0AHomepage%20(2026-08-25%20and%202026-08-31)%3A%0A%0A%20%20%20%20.banner-container%20%20%207%20of%207%20visible%2C%201%2C045%2C814%20px2%2C%201%2C140%20px%20of%20vertical%20space%0A%20%20%20%20.soft-news-banner%20%20%203%20of%203%20visible%2C%20%20%20225%2C000%20px2%2C%20%20%20750%20px%0A%20%20%20%20.sidebar-banner%20%20%20%20%201%20of%201%20visible%2C%20%20%20180%2C000%20px2%2C%20%20%20600%20px%0A%20%20%20%20Combined%3A%2011%20containers%2C%201%2C450%2C814%20px2%2C%202%2C490%20px%0A%0AArticle%20pages%20(two%20different%20articles%2C%20both%20identical)%3A%0A%0A%20%20%20%20Combined%3A%208%20containers%2C%20995%2C991%20px2%2C%201%2C964%20px%0A%20%20%20%20%2Fnota%2Fdeportes%2F2026%2F08%2F29%2Fmourinho%0A%20%20%20%20%2Fnota%2Fcodigo-elite%2F2026%2F08%2F28%2Fdanna-y-belinda-estrenan-dolce-vita-su-esperada-colaboracion%0A%0ANo%20existing%20cosmetic%20rule%20applies%20to%20this%20domain%20at%20all%3A%200%20elements%20hidden%20on%20any%20of%20the%20three%20pages.%0A%0AReload%20test%20on%20all%20three%20pages%2C%20both%20days%3A%20no%20loss%20of%20headlines%2C%20links%2C%20images%2C%20menus%20or%20form%20fields.%0A%0ACaveat%20stated%20up%20front%3A%20with%20a%20blocker%20active%20the%20boxes%20hold%20an%20empty%20AdSense%20iframe%20rather%20than%20a%20served%20ad%2C%20so%20what%20the%20rule%20removes%20is%20reserved%20space.%20Measured%20without%20a%20blocker%2C%20the%20same%20containers%20are%202px%20taller%20and%20the%20inner%20wrapper%20goes%20from%202px%20to%20970px%20wide%20-%20the%20width%20depends%20on%20the%20ad%20loading%2C%20the%20height%20does%20not.%20Same%20situation%20as%20the%20elmanana.com%20(%23364)%2C%20imagendelgolfo.mx%20(%23365)%20and%20diariodemorelos.com%20(%23366)%20reports%2C%20where%20the%20mechanism%20was%20accepted.%0A%0AFound%20with%20Filtros%20MX%20(https%3A%2F%2Fgithub.com%2Fedso79%2Ffiltros-mx).%0A)

> Al enviarla, anotar aquí la fecha y el número. Y después, **verificar contra la lista publicada Y contra el DOM antes de dar nada por cubierto** — «cerrado ≠ aceptado».

---

### 🕐 `posta.com.mx` (Nuevo León) — nombres propios, y una trampa que la prueba de pérdida cazó

Nuevo León estaba **sin medir**: `elhorizonte.mx` se nos sirvió sin publicidad el 21-ago y
quedó anotado como no medible, no como sitio limpio. Este lo cubre.

Ninguna de las tres listas menciona el dominio: **0 en las tres**, mismo día y mismo método
que arriba.

| Página | Selector | Casan | Visibles | Área visible | Altura |
|---|---|---|---|---|---|
| Portada | `[class^="publicidad_"]` | 7 | **5** | **548,388 px²** | 641 px |
| Portada | `.publicidad_posta` | 3 | 3 | 472,122 px² | 378 px |
| Portada | `.publicidad_ads` | 3 | 1 | 73,261 px² | 253 px |
| Nota 1 | `[class^="publicidad_"]` | 1 | 1 | 164,868 px² | 132 px |
| Nota 2 | `[class^="publicidad_"]` | 1 | 1 | 164,868 px² | 132 px |

**Las dos notas dan la misma cifra al píxel**, que es la señal de espacio reservado que
validó #365 y #366.

**Publicidad genuina de terceros:** Google Ad Manager, con
`/22672383948/posta.com.mx/responsive_portada_leaderboard_*` dentro de cada caja y
`securepubads.g.doubleclick.net` como proveedor.

**Se propone el prefijo y no las clases sueltas.** `[class^="publicidad_"]` cubre la familia
entera —`publicidad_posta`, `publicidad_posta_lightback`, `publicidad_ads`,
`publicidad_ads_box1`— con pérdida limpia, y **no lleva `div` por delante a propósito**:
`.publicidad_ads` vive en un `<article>`, así que `div[class^="publicidad_"]` se deja fuera
73,261 px². Es la lección de #363: nombrar la familia, no las medidas ni el caso de hoy.

#### La trampa: `.logoheader` es el logotipo del periódico

El detector propuso **cuatro** huecos y uno era `.logoheader` (1249×130, 162,370 px²), con
`nombreFragil: false`. **La prueba de pérdida lo cazó: −1 enlace, −1 imagen.** Es el logo de
la cabecera.

Es el séptimo defecto en forma nueva: el 13-ago proponía ocultar el **menú**, hoy la
**identidad del sitio**. No se afina el detector sobre la marcha —el error del 13-ago costó el
mejor hallazgo del proyecto—, pero conviene anotar que **la salvaguarda que funcionó no fue
`esSeguro()`, fue `--probar-perdida`**, escrita el 14-ago justo para los selectores que el
filtro del detector no mira.

**Remedido el 31-ago: la trampa sigue en pie, y con la misma cifra.** `.logoheader` vuelve a
salir como hueco propuesto (1249×130, 162,370 px², `nombreFragil: false`) y la prueba de
pérdida vuelve a marcarlo **ROMPE CONTENIDO: −1 enlace, −1 imagen**. **No entra en el reporte,
y el cuerpo lo advierte** para que nadie de aguas arriba lo "mejore" añadiéndolo.

#### Segunda carga — 31-ago-2026: las cinco filas idénticas

**Cifra idéntica al píxel** en las tres páginas, seis días después. Las dos notas siguen dando
la misma cifra entre sí (1/1, 164,868 px², 132 px), que es la señal de espacio reservado.

**Publicidad genuina de terceros, comprobada sin extensión:** Google Ad Manager sirviendo
`728x90` y `300x250` dentro de las propias cajas, desde
`/22672383948/posta.com.mx/responsive_portada_leaderboard_1_0` y `_3_0`.

**Y el matiz que el cuerpo declara en vez de esconder:** con bloqueo, **«con contenido dentro
0» en todas las cajas de las tres páginas**. Son cajas vacías que siguen ocupando 548,388 px².
Lo que la regla retira es espacio reservado — el mismo caso aceptado en #364, #365 y #366.

**Lo que no se infla:** de los 5 visibles de portada, uno mide **301×10**. Son 3,010 px² de los
548,388, y el cuerpo lo dice.

### Estado: CUMPLE el estándar de envío (31-ago-2026)

1. ✅ **Segunda carga en día distinto** — 25 y 31-ago, cifra idéntica en las tres páginas.
2. ✅ **Plantilla de nota** — dos notas reales, idénticas entre sí y entre días.
3. ✅ **Prueba de pérdida limpia** en las tres páginas, con `--probar-perdida`.

**Cómo se hizo (reproducible):**

```bash
node herramientas/extension/medir-sitio.mjs https://www.posta.com.mx/ --reforzado --probar-perdida --selector "[class^=\"publicidad_\"]" --selector ".publicidad_posta" --selector ".publicidad_ads"
```

### Texto de la incidencia, listo para enviar

```
Not covered by any rule in EasyList, EasyPrivacy or EasyList Spanish. The domain is not mentioned in any of the three lists (re-checked 2026-08-31).

Site: https://www.posta.com.mx (Nuevo Leon, Mexico)
Viewport: 1280px
Ad server: Google Ad Manager, slots under /22672383948/posta.com.mx/ (securepubads.g.doubleclick.net)

The site wraps every ad unit in a class with the same prefix:

    .publicidad_posta, .publicidad_posta_lightback, .publicidad_ads, .publicidad_ads_box1

Proposed rule:

    posta.com.mx##[class^="publicidad_"]

Proposing the prefix rather than the individual classes so the whole family is covered, and without a div prefix on purpose: .publicidad_ads sits on an <article>, so div[class^="publicidad_"] would miss 73,261 px2 of it.

publicidad_ is a common name - EasyList Spanish already carries .publicidad_cabecera, .publicidad_dfp and .publicidad_footer_sticky as generics, plus per-domain rules such as 0221.com.ar##.publicidad_cont. None of them match this site's classes, which is why it is still uncovered. Proposed per-domain, not as a generic.

Measured with all EasyList / EasyPrivacy / EasyList Spanish rules applied, including generic cosmetic rules, in a browser with network blocking active. Two separate days, identical to the pixel:

Homepage (2026-08-25 and 2026-08-31):

    5 of 7 containers visible, 548,388 px2, 641 px of vertical space
    Sizes: 1249x132, 1249x123, 1249x123, 290x253, 301x10

Article pages (two different articles, both identical, both days):

    1 of 1 visible, 164,868 px2, 132 px
    /internacional/iso-la-nueva-droga-que-preocupa-a-la-onu-y-estas-son-sus-diferencias-con-el-fentanilo/vl2245616
    /nuevo-leon/dos-hombres-lesionados-en-accidente-vial-apodaca/vl2247168

Being precise about the homepage figure: one of the five visible boxes is 301x10, so 3,010 px2 of that total is a sliver. The bulk is the three 1249px bars and the 290x253 rectangle.

Reload test on all three pages, both days: no loss of headlines, links, images, menus or form fields.

One warning about a neighbouring class, in case it looks like a target: .logoheader is NOT advertising. It is the newspaper's own masthead logo (1249x130). Hiding it removes 1 link and 1 image, measured on both days.

Caveat stated up front: with a blocker active all of these boxes are empty reserved space - that is what the rule removes. Without a blocker the same containers hold served GAM creatives (728x90 leaderboards and 300x250 rectangles, under /22672383948/posta.com.mx/responsive_portada_leaderboard_1_0 and _3_0). Same situation as the elmanana.com (#364), imagendelgolfo.mx (#365) and diariodemorelos.com (#366) reports, where the mechanism was accepted.

Found with Filtros MX (https://github.com/edso79/filtros-mx).
```

> ✅ **ENVIADA el 31-ago-2026 por Edgar — [#369](https://github.com/easylist/easylistspanish/issues/369), abierta.** Cuerpo verificado contra la API: llegó **íntegro**, con la regla del prefijo, los 548,388 px² de portada, los 164,868 px² de las notas, **el aviso de que `.logoheader` NO es publicidad** y la línea de cierre `Found with Filtros MX`. 0 comentarios al enviarse.

*(El enlace de abajo ya se usó — se conserva como plantilla. NO volver a pulsarlo.)*

[Incidencia pre-llenada de posta.com.mx — YA ENVIADA](https://github.com/easylist/easylistspanish/issues/new?title=posta.com.mx%3A%20uncovered%20ad%20containers%20(%5Bclass%5E%3D%22publicidad_%22%5D)&body=Not%20covered%20by%20any%20rule%20in%20EasyList%2C%20EasyPrivacy%20or%20EasyList%20Spanish.%20The%20domain%20is%20not%20mentioned%20in%20any%20of%20the%20three%20lists%20(re-checked%202026-08-31).%0A%0ASite%3A%20https%3A%2F%2Fwww.posta.com.mx%20(Nuevo%20Leon%2C%20Mexico)%0AViewport%3A%201280px%0AAd%20server%3A%20Google%20Ad%20Manager%2C%20slots%20under%20%2F22672383948%2Fposta.com.mx%2F%20(securepubads.g.doubleclick.net)%0A%0AThe%20site%20wraps%20every%20ad%20unit%20in%20a%20class%20with%20the%20same%20prefix%3A%0A%0A%20%20%20%20.publicidad_posta%2C%20.publicidad_posta_lightback%2C%20.publicidad_ads%2C%20.publicidad_ads_box1%0A%0AProposed%20rule%3A%0A%0A%20%20%20%20posta.com.mx%23%23%5Bclass%5E%3D%22publicidad_%22%5D%0A%0AProposing%20the%20prefix%20rather%20than%20the%20individual%20classes%20so%20the%20whole%20family%20is%20covered%2C%20and%20without%20a%20div%20prefix%20on%20purpose%3A%20.publicidad_ads%20sits%20on%20an%20%3Carticle%3E%2C%20so%20div%5Bclass%5E%3D%22publicidad_%22%5D%20would%20miss%2073%2C261%20px2%20of%20it.%0A%0Apublicidad_%20is%20a%20common%20name%20-%20EasyList%20Spanish%20already%20carries%20.publicidad_cabecera%2C%20.publicidad_dfp%20and%20.publicidad_footer_sticky%20as%20generics%2C%20plus%20per-domain%20rules%20such%20as%200221.com.ar%23%23.publicidad_cont.%20None%20of%20them%20match%20this%20site's%20classes%2C%20which%20is%20why%20it%20is%20still%20uncovered.%20Proposed%20per-domain%2C%20not%20as%20a%20generic.%0A%0AMeasured%20with%20all%20EasyList%20%2F%20EasyPrivacy%20%2F%20EasyList%20Spanish%20rules%20applied%2C%20including%20generic%20cosmetic%20rules%2C%20in%20a%20browser%20with%20network%20blocking%20active.%20Two%20separate%20days%2C%20identical%20to%20the%20pixel%3A%0A%0AHomepage%20(2026-08-25%20and%202026-08-31)%3A%0A%0A%20%20%20%205%20of%207%20containers%20visible%2C%20548%2C388%20px2%2C%20641%20px%20of%20vertical%20space%0A%20%20%20%20Sizes%3A%201249x132%2C%201249x123%2C%201249x123%2C%20290x253%2C%20301x10%0A%0AArticle%20pages%20(two%20different%20articles%2C%20both%20identical%2C%20both%20days)%3A%0A%0A%20%20%20%201%20of%201%20visible%2C%20164%2C868%20px2%2C%20132%20px%0A%20%20%20%20%2Finternacional%2Fiso-la-nueva-droga-que-preocupa-a-la-onu-y-estas-son-sus-diferencias-con-el-fentanilo%2Fvl2245616%0A%20%20%20%20%2Fnuevo-leon%2Fdos-hombres-lesionados-en-accidente-vial-apodaca%2Fvl2247168%0A%0ABeing%20precise%20about%20the%20homepage%20figure%3A%20one%20of%20the%20five%20visible%20boxes%20is%20301x10%2C%20so%203%2C010%20px2%20of%20that%20total%20is%20a%20sliver.%20The%20bulk%20is%20the%20three%201249px%20bars%20and%20the%20290x253%20rectangle.%0A%0AReload%20test%20on%20all%20three%20pages%2C%20both%20days%3A%20no%20loss%20of%20headlines%2C%20links%2C%20images%2C%20menus%20or%20form%20fields.%0A%0AOne%20warning%20about%20a%20neighbouring%20class%2C%20in%20case%20it%20looks%20like%20a%20target%3A%20.logoheader%20is%20NOT%20advertising.%20It%20is%20the%20newspaper's%20own%20masthead%20logo%20(1249x130).%20Hiding%20it%20removes%201%20link%20and%201%20image%2C%20measured%20on%20both%20days.%0A%0ACaveat%20stated%20up%20front%3A%20with%20a%20blocker%20active%20all%20of%20these%20boxes%20are%20empty%20reserved%20space%20-%20that%20is%20what%20the%20rule%20removes.%20Without%20a%20blocker%20the%20same%20containers%20hold%20served%20GAM%20creatives%20(728x90%20leaderboards%20and%20300x250%20rectangles%2C%20under%20%2F22672383948%2Fposta.com.mx%2Fresponsive_portada_leaderboard_1_0%20and%20_3_0).%20Same%20situation%20as%20the%20elmanana.com%20(%23364)%2C%20imagendelgolfo.mx%20(%23365)%20and%20diariodemorelos.com%20(%23366)%20reports%2C%20where%20the%20mechanism%20was%20accepted.%0A%0AFound%20with%20Filtros%20MX%20(https%3A%2F%2Fgithub.com%2Fedso79%2Ffiltros-mx).%0A)

> Al enviarla, anotar aquí la fecha y el número. Y después, **verificar contra la lista publicada Y contra el DOM antes de dar nada por cubierto** — «cerrado ≠ aceptado».

---


---

## ✅ Octavo barrido — 25-ago-2026, misma tarde: 6 sitios, **CERO candidatas**

Se anota con el mismo detalle que los que salen bien, porque **un barrido vacío es un dato,
no un turno perdido**: es lo que impide leer el de la mañana como si fuera la norma.

Criterio, fijado antes de medir: **estados sin representación** (Estado de México, Tlaxcala) y
**segundos medios en estados donde el único medido quedó descartado** (Michoacán, SLP, Oaxaca,
Puebla). Ninguno se eligió buscando hueco.

| Sitio | Estado | Veredicto |
|---|---|---|
| `asisucede.com.mx` | Estado de México | cubierto (7 frenadas, 13 ocultos) |
| `mimorelia.com` | Michoacán | cubierto (4 frenadas, 9 ocultos, 6 descartes por sobrecobertura) |
| `planoinformativo.com` | San Luis Potosí | cubierto (3 frenadas, 5 ocultos) |
| `nvinoticias.com` | Oaxaca | **cubierto** — 12 contenedores, todos en 0×0 |
| `lineadecontraste.com` | Tlaxcala | **sin publicidad de terceros** |
| `intoleranciadiario.com` | Puebla | **NO MEDIBLE** — el content script no respondió |

**Con esto el Estado de México y Tlaxcala entran al corpus**, que era el hueco declarado del
barrido anterior. Ninguna de las tres listas menciona ninguno de los seis dominios.

### `nvinoticias.com` — el mismo desenlace que `lajornadadeoriente`, el mismo día

Saltó la señal de ceguera y sus contenedores tienen nombres propios y semánticos:
`#js-dfp-tag-nvi_home_rectangle`, `#js-dfp-tag-nvi_oaxaca_rectangle`,
`#js-dfp-tag-nvi_tech_pendon`, sirviendo GAM desde `//13661509/nvi-*`.

**Y no aporta nada:** los 12 que casa `[id^="js-dfp-tag-"]` salen **0×0**, igual que los 12 de
`div[id^="block-"][class*="block-dfp"]`. **0 px², 0 px de altura.** Lo que los cubre no nombra
al dominio: `block-dfp` sale ya 7 veces en EasyList, así que una genérica se lo lleva.

**Segundo sitio del día donde ids publicitarios impecables no valen un reporte.** Es la regla
del 10-ago —comprobar por efecto— ganándose el sueldo dos veces en una tarde.

### `lineadecontraste.com` — no tiene publicidad programática, y sus «banner» son el periódico

Sus proveedores de terceros son **solo analítica** (Google Analytics, GTM, Scorecard,
`stats.wp.com`): ningún servidor de anuncios, 0 iframes de terceros.

Sus ocho cajas con pista publicitaria son del propio medio: `.masthead-banner` lleva **el
logotipo**, `.banner-promotions-wrapper` un sello de certificación, y
`.banner-exclusive-posts-wrapper` y `.banner-trending-posts-wrapper` **titulares editoriales**.

**Anotado como prohibición, con el mismo trato que `tabascohoy.com` y `quadratin.com.mx`: este
dominio no entra en ninguna multi-dominio de la familia `banner`.** Hoy `##.banner` no le casa
—sus clases llevan prefijo— pero la nota queda escrita para que nadie lo proponga dentro de
seis meses viendo los nombres y no el contenido.

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

## Segundo lote — CERRADO el 10-ago-2026: uno cubierto, uno a medias

Los dos se cerraron como completados, **y los dos con arreglos distintos a lo propuesto**. Verificado contra la lista publicada (`202608101702`) y contra el DOM, que es lo que separa "cerrado" de "cubierto".

### ✅ `tribuna.com.mx` (#362) — CUBIERTO, con otra regla

El mantenedor no usó `[id^="Tribuna_"]`: **añadió `tribuna.com.mx` a la regla multi-dominio `##.ads`**. Verificado el 10-ago en las **tres plantillas**: portada (5 unidades), sección (3) y nota (4). **Las 12 caen dentro de un `.ads`; nuestra regla aporta 0 área, 0 altura y 0 unidades.** Cubierto de verdad.

### ⚠️ `quadratin.com.mx` (#363) — CUBIERTO A MEDIAS

El mantenedor resolvió **por medidas** en vez de por nombre: `###text-111`, `###text-115`, `##div[style="width:336px; height:280px;"]`, `##div[style^="width:630px; height:598px;"]`, más el dominio en las multi-dominio `##img[width="336"]` y `##img[width="728"]`.

Medido el 10-ago con **solo sus reglas** aplicadas:

| Lo que reportamos | Estado con su arreglo |
|---|---|
| `.banner--cinturon2` | **Cubierto** (0×0) — su regla de 630×598 lo vacía |
| `.banner--faro` | **VISIBLE, 1110×90** — dentro, un rotador sirviendo **970×90** |
| `#custom_html-2` | **VISIBLE, 350×446** — dentro, un **iframe de Google Ad Manager de 350×350 servido** |

**Sobreviven 256,000 px² de publicidad servida y 114 px de altura.**

**La causa, y es lo que vale del hallazgo:** una regla anclada a **medidas exactas** es frágil frente a un sitio que **rota creatividades de tamaños distintos**. `img[width="728"]` no alcanza un banner de 970×90; `img[width="336"]` no alcanza un iframe de 350×350. Las reglas por **nombre de contenedor** (`.banner--faro`, `#custom_html-2`) no tienen ese problema.

**CONFIRMADO el 11-ago-2026, segunda observación en día distinto** (lista publicada `202608111652`):

- `.banner--faro` visible a 1110×90, hoy sirviendo **iframes de 728×90 y 728×70** — el 10-ago era una creatividad de 970×90. **La rotación quedó observada directamente entre días**, y además cambió de vehículo: la creatividad llegó por iframe, que `img[width="728"]` no puede tocar (la imagen de respaldo sí queda oculta por su regla).
- `#custom_html-2` visible a 350×758 con su **iframe de 350×350 servido** los dos días (hoy además una imagen de 336×336, que su `img[width="336"]` sí oculta — el iframe queda).
- `.banner--cinturon2` cubierto los dos días por su regla de medidas. Ese quedó resuelto.

*Nota de método que dejó esta medición:* también sobreviven envoltorios de Refinery89 (`#r89-*-wrapper`), y **NO se reportan**: solo existen porque el panel de medición no bloquea red — con bloqueo activo esos scripts ni cargan (observado vía `ERR_BLOCKED_BY_CLIENT` el 6-ago). Los dos residuos de arriba, en cambio, sirven desde **iframes del propio dominio**, que el bloqueo de red no toca. **Lo que solo aparece sin bloqueador no es un hueco reportable.**

**Seguimiento ENVIADO el 11-ago-2026** como comentario en [#363](https://github.com/easylist/easylistspanish/issues/363), sin reabrir la incidencia — reabrir es decisión del mantenedor; el comentario le llega igual. **Queda en observación:** si lo toma, verificar contra la lista publicada Y contra el DOM antes de dar el residuo por cubierto — cerrado ≠ aceptado, la lección de siempre. El texto enviado:

```
Follow-up with a second observation on a different day (2026-08-10 and
2026-08-11), with the current published list (202608111652) applied:

Two of the three reported containers still show served ads:

- `.banner--faro` — visible at 1110x90. On Aug 10 it served a 970x90
  creative; on Aug 11 it served 728x90 and 728x70 iframes. The
  img[width="728"] rule hides the fallback image, but the rotator often
  delivers via iframe, which that rule cannot reach.
- `#custom_html-2` — visible at 350x758, with a 350x350 ad iframe served
  on both days (plus a 336x336 image on Aug 11, which img[width="336"]
  does hide — the iframe remains).
- `.banner--cinturon2` — fully covered by your div[style^="width:630px..."]
  rule on both days. That one is solved, thanks.

The pattern across both days: the site rotates creative sizes and delivery
(970x90 image / 728x90 iframe / 350x350 iframe), so size-anchored rules
cover whichever creative happened to load when tested. The two container
names don't change between loads:

    quadratin.com.mx##.banner--faro
    quadratin.com.mx###custom_html-2

Both were reload-tested on two separate days (2026-08-03 and 2026-08-05,
re-checked Aug 10-11): no loss of headlines, links, text, menus or forms.
```

**⚠️ EL RESIDUO SE TOMÓ A MEDIAS — verificado el 24-ago-2026.** `quadratin.com.mx##.banner--faro` **ya está en la lista publicada** (`202608241622`), sin comentario en la incidencia ni reapertura: apareció y punto. Medido contra el DOM con bloqueo real y Reforzado:

| Residuo del seguimiento del 11-ago | Entonces | Ahora (24-ago) |
|---|---|---|
| `.banner--faro` | **VISIBLE 1110×90**, iframes 728×90 servidos | **0×0, oculto** ✅ |
| `#custom_html-2` | **VISIBLE 350×758**, iframe GAM 350×350 **servido** | **VISIBLE 350×96**, 33,600 px², **1 imagen, sin iframe, nada servido** |

**Se da por cerrado y NO se insiste, por el estándar del propio proyecto.** Lo que queda son 96 px de alto sin anuncio servido — por debajo de donde el proyecto ya decidió no molestar a un mantenedor: `imparcialoaxaca` se descartó a 20 px y `ntrzacatecas` a 60 px sin servir. **Un residuo que encogió de 758 px con iframe servido a 96 px con una imagen no es el mismo hallazgo**, y llevarlo otra vez sería gastar crédito en lo que ya no lo merece.

**Queda en observación pasiva, mismo trato que `pulsoslp` y `lavozdemichoacan`:** si una carga futura lo enseña grande y sirviendo, vuelve a ser candidato. No antes.

**Y un hallazgo del detector que sale de esta misma medición, anotado sin tocar código:** propuso `.row` como hueco (1140×90, alcance 2) con **`nombreFragil: false`**. `.row` es la clase de rejilla de Bootstrap — proponerla aguas arriba sería de las peores reglas imaginables. Es el **octavo defecto asomando por tercera vez**: `esSeguro()` comprueba lo que casa HOY, y `.row` casa hoy perfectamente. La novedad es la familia: con los hashes de Elementor del 21-ago el problema era que el nombre es **volátil**; aquí es que es **universal**, que es un agujero distinto. **No se afina sobre la marcha** — añadir un descarte sin medirlo contra el corpus entero es exactamente el error del 13-ago, que costó el mejor hallazgo del proyecto.

## Segundo lote — enviado completo el 6-ago-2026

Los dos reportes cumplieron el estándar completo de julio: prueba de recarga **en dos días distintos** (3 y 5 de agosto), todas las plantillas revisadas, y la comprobación contra reglas existentes hecha.

- **`tribuna.com.mx` — [#362](https://github.com/easylist/easylistspanish/issues/362)**, abierta.
- **`quadratin.com.mx` — [#363](https://github.com/easylist/easylistspanish/issues/363)**, abierta.

**Los dos enlaces de un clic ya se usaron; no volver a pulsarlos** — duplicarían las incidencias.

Es el primer lote del ciclo completo con la extensión en medio: el detector encontró los huecos, la verificación los depuró (2 candidatos cayeron por estar ya cubiertos por una genérica, uno por regla frágil), y los reportes salieron con la evidencia de dos días.

### En preparación: `pulsoslp.com.mx` — falta la segunda carga

Encontrado por el detector el 6-ago-2026 al ampliar el corpus. **`#StickHeader_UP1`** (1265×90, anuncio servido), presente **en portada y en nota** con el mismo identificador, sin regla en ninguna lista. Prueba de recarga limpia en ambas plantillas: cero pérdida de titulares, enlaces, texto, menús y formularios.

> **Regla candidata:** `pulsoslp.com.mx###StickHeader_UP1`

**NO se envía hasta la segunda carga en día distinto.**

### ✅ ACEPTADA Y VERIFICADA — `elmanana.com` (Reynosa), [#364](https://github.com/easylist/easylistspanish/issues/364)

> **CERRADA como completada el 24-ago-2026** (commit `a6bfa0b`, «M: Fix #364»), verificada contra la lista publicada `202608241622` y contra el DOM el mismo día.
>
> **Entraron TRES reglas, y solo una es la que se propuso:**
>
> ```
> elmanana.com##div[class*="template-publicidad-"]     <- la buena, MAS AMPLIA que la propuesta
> diariolibre.com,elmanana.com###stickyunit            <- entro pese a que pedimos retirarlo
> elmanana.com##.ad-unit-leaderboard                   <- la anadio el mantenedor por su cuenta
> ```
>
> **Medido con bloqueo real y Reforzado en portada:**
>
> | Selector | Antes (13 y 14-ago) | Ahora (24-ago) |
> |---|---|---|
> | `div[class*="template-publicidad-"]` | — | **0/24 visibles, 0 px²** |
> | `[class^="template-publicidad-cuadrada"]` (lo propuesto) | 23/23 visibles, **1,095,977 px²**, 3,560 px | **0/23 visibles, 0 px²** |
> | `#stickyunit` | oculto, 1264×0 | oculto, 0×0 |
> | `.ad-unit-leaderboard` | — | **casa 0 elementos** |
>
> **El mantenedor eligió mejor que nosotros.** `[class*="template-publicidad-"]` casa **24** donde la propuesta casaba 23: el prefijo `cuadrada` dejaba fuera un miembro de la familia. Se anota como lección de redacción de reglas, no como corrección que haga falta pedir.
>
> **El seguimiento del 14-ago NO se aplicó, y no se insiste.** Pedimos retirar `###stickyunit` por redundante (medía 1264×0 dos días seguidos) y en cambio se añadió. **Es inocuo** —ocultar algo que ya mide cero no cuesta nada— y perseguir una regla que no hace daño gastaría el crédito que hace falta para el próximo reporte que sí importe. Se anota y se deja.
>
> **`.ad-unit-leaderboard` casa 0 elementos en portada el 24-ago.** Puede vivir en otra plantilla o venir de otra observación suya. No es problema nuestro ni se pregunta.

Hallazgo del 6-ago-2026 con una aclaración que evita un susto: **`elmanana.com` y `elmanana.com.mx` son periódicos hermanos en plataformas distintas** — `.com` es Reynosa (plataforma nueva) y `.com.mx` es Nuevo Laredo, cuyos 12 `.ad-zone` **siguen vivos**: la regla aceptada en julio está bien. Pero las reglas cosméticas son por dominio, y el `.com` **no tiene ni una en ninguna lista**.

Su plataforma nombra la publicidad con familia propia: `template-publicidad-cuadrada-independiente` (5 unidades de 309×250), `-dos-columnas` y `-notas`, más un `#stickyunit` de 1280×90. **24 elementos de la familia en portada, cero editorial** — el único texto que se pierde son 10 etiquetas "PUBLICIDAD" y el "×" del sticky, igual que en el reporte de `periodicocorreo` de julio. En nota individual la familia casa 0: inofensiva.

> **Reglas candidatas:**
> ```
> elmanana.com##[class^="template-publicidad-cuadrada"]
> elmanana.com###stickyunit
> ```

Los slots estaban como cajas vacías reservadas en esta carga — **el mismo hábito de su hermano de julio**, y se declara igual en el reporte.

**Segunda carga hecha el 10-ago-2026, y es la única de las cuatro que sobrevivió.** Medido con **toda la cobertura de las listas aplicada encima**: siguen **23 contenedores visibles y 1,095,975 px²**, sin pérdida de titulares, enlaces, imágenes, menús ni campos. No es redundante con lo que ya existe.

**✅ ENVIADA el 10-ago-2026: [#364](https://github.com/easylist/easylistspanish/issues/364), abierta.** GitHub marcó "2 potential duplicates" señalando #361 (`elmanana.com.mx`) al momento de crearla — exactamente lo que el segundo párrafo del cuerpo se adelanta a explicar. Poner esa aclaración arriba del todo no fue adorno.

**✅ CONFIRMADA CON BLOQUEO REAL el 13-ago-2026** (sigue abierta, 0 comentarios). Se repitió la medición con la extensión cargada en Chrome for Testing —reglas DNR activas, 18 peticiones frenadas— y **modo Reforzado**, que aplica las 13,907 reglas de cobertura encima:

| Regla propuesta | Con bloqueo + toda la cobertura | Veredicto |
|---|---|---|
| `[class^="template-publicidad-cuadrada"]` | **23/23 visibles, 1,095,977 px², 3,560 px de alto** | ✅ se sostiene |
| `###stickyunit` | **oculto, 1264×0** | ⚠️ ya redundante |

Los 1,095,977 px² medidos coinciden con los 1,095,975 px² del reporte: dos px² de redondeo. La salvedad declarada en el cuerpo —cajas vacías reservadas, y el beneficio es quitar el espacio— **se sostiene bajo bloqueo real**.

**✅ SEGUNDA OBSERVACIÓN EN DÍA DISTINTO — 14-ago-2026. El estándar queda cumplido y el comentario se puede enviar.** Misma orden, mismo modo Reforzado, 19 peticiones frenadas:

| Regla propuesta | 13-ago | 14-ago | Veredicto |
|---|---|---|---|
| `[class^="template-publicidad-cuadrada"]` | 23/23 visibles, 1,095,977 px², 3,560 px | **23/23 visibles, 1,095,977 px², 3,560 px** | ✅ **se sostiene, cifra idéntica** |
| `###stickyunit` | oculto, 1264×0 | **oculto, 1264×0** | ⚠️ **redundante, confirmado** |

Que las cifras del selector bueno coincidan **al px²** entre dos días es lo que separa una medición de una anécdota: el hallazgo de #364 no depende de qué día se cargó la página.

**Cómo se hizo (un comando, reproducible):**

```bash
node herramientas/extension/medir-sitio.mjs https://www.elmanana.com/ --reforzado --selector "#stickyunit"
```

El arnés localiza Chrome for Testing solo — está en `~/.cache/puppeteer`, y si faltara se reinstala con `npx @puppeteer/browsers install chrome@stable`.

**✅ COMENTARIO ENVIADO el 14-ago-2026** por Edgar, en la incidencia abierta (sin cerrarla ni reabrir nada: la primera regla sigue pendiente de aplicarse). Texto tal cual salió:

> Follow-up on the two rules proposed here. Measured again on 2026-08-13 and
> 2026-08-14 with all EasyList / EasyPrivacy / EasyList Spanish rules
> applied, including generic cosmetic rules, in a browser with network
> blocking active:
>
> - `elmanana.com##[class^="template-publicidad-cuadrada"]` — still worth
>   adding. 23 of 23 containers stay visible: 1,095,977 px² and 3,560 px of
>   vertical space. The ad slots inside no longer load, and the wrappers do
>   not collapse — they keep their reserved height.
> - `elmanana.com###stickyunit` — **no longer needed, please drop it.** With
>   generic cosmetic rules applied it already measures 1264x0, so the rule
>   would add nothing.
>
> Flagging it so you don't spend time on a rule that isn't pulling weight.

*(Retirar una regla propia porque ya no aporta es el mismo movimiento que vació `mexico.txt` el 3-ago. Cuesta poco y es exactamente lo que hace que el siguiente reporte se lea con confianza.)*

**Queda vigilar la respuesta.** Si el mantenedor aplica la regla que sí aporta, **verificar contra la lista publicada y contra el DOM antes de dar nada por cubierto** — es la lección de `periodicocorreo` en julio y de `tribuna` en agosto: cerrado no es aceptado, y aceptado no siempre es lo que se propuso.

*(El enlace de abajo ya se usó — se conserva como plantilla. NO volver a pulsarlo.)*

[Incidencia pre-llenada de elmanana.com — YA ENVIADA](https://github.com/easylist/easylistspanish/issues/new?title=elmanana.com%3A%20uncovered%20ad%20containers%20(template-publicidad-*)&body=Not%20covered%20by%20any%20rule%20in%20EasyList%2C%20EasyPrivacy%20or%20EasyList%20Spanish.%0A%0ASite%3A%20https%3A%2F%2Fwww.elmanana.com%20(Reynosa%2C%20Tamaulipas%2C%20Mexico)%0AViewport%3A%201280px%0A%0ANote%20this%20is%20NOT%20the%20same%20site%20as%20elmanana.com.mx%20(Nuevo%20Laredo)%2C%20which%20is%20already%20covered%20by%20elmanana.com.mx%23%23.ad-zone.%20They%20are%20sibling%20newspapers%20on%20different%20platforms%3B%20the%20.com%20runs%20a%20newer%20CMS%20with%20its%20own%20ad%20container%20family.%20The%20.com.mx%20rule%20still%20works%20correctly%20%E2%80%94%20checked%20on%20the%20same%20day.%0A%0AThe%20platform%20names%20its%20ad%20containers%20with%20a%20common%20prefix%2C%20plus%20a%20sticky%20unit%3A%0A%0A%20%20%20%20template-publicidad-cuadrada-independiente%20%20%20(5%20units%2C%20309x250)%0A%20%20%20%20template-publicidad-cuadrada-dos-columnas%0A%20%20%20%20template-publicidad-cuadrada-notas%0A%20%20%20%20%23stickyunit%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20(1280x90)%0A%0A24%20elements%20of%20the%20family%20on%20the%20homepage%2C%20checked%20one%20by%20one%3A%20every%20one%20is%20an%20ad%20container%2C%20none%20holds%20editorial%20content.%20On%20article%20pages%20the%20family%20matches%200%20elements%2C%20so%20the%20rules%20are%20inert%20there.%0A%0AProposed%20rules%3A%0A%0A%20%20%20%20elmanana.com%23%23%5Bclass%5E%3D%22template-publicidad-cuadrada%22%5D%0A%20%20%20%20elmanana.com%23%23%23stickyunit%0A%0ATested%20by%20applying%20the%20rules%20and%20reloading%2C%20on%20two%20separate%20days%20(2026-08-06%20and%202026-08-10)%2C%20with%20all%20EasyList%2FEasyPrivacy%2FEasyList%20Spanish%20rules%20also%20applied%3A%20no%20loss%20of%20headlines%2C%20links%2C%20images%2C%20menus%20or%20form%20fields.%20Measured%20on%20top%20of%20the%20existing%20lists%2C%20these%20rules%20still%20remove%2023%20visible%20ad%20containers%20and%20~1%2C095%2C975%20px2%20of%20ad%20surface%2C%20so%20they%20are%20not%20redundant%20with%20current%20coverage.%0A%0AThe%20only%20text%20removed%20is%2010%20%22PUBLICIDAD%22%20labels%20inside%20the%20containers%20themselves%20plus%20the%20%22x%22%20of%20the%20sticky%20unit%20%E2%80%94%20same%20situation%20declared%20in%20the%20periodicocorreo.com.mx%20report%20in%20July.%0A%0ACaveat%20stated%20up%20front%3A%20on%20both%20test%20days%20the%20slots%20were%20empty%20reserved%20boxes%20rather%20than%20served%20ads.%20The%20rules%20remove%20the%20reserved%20space%2C%20which%20is%20the%20observed%20benefit.%0A%0AFound%20with%20Filtros%20MX%20(https%3A%2F%2Fgithub.com%2Fedso79%2Ffiltros-mx).)

*(El cuerpo aclara por adelantado que NO es el mismo sitio que `elmanana.com.mx`, para que nadie lo cierre como duplicado de la regla de julio.)*

## ✅ ACEPTADA Y VERIFICADA — [#366](https://github.com/easylist/easylistspanish/issues/366): `diariodemorelos.com`, tercera candidata más grande del proyecto (enviada 24-ago · cerrada 26-ago-2026)

> **CERRADA como completada el 26-ago-2026** (commit `8f1e5fc`, lista `202608261503`), **dos días después de enviarse** — la más rápida desde el lote de julio. Verificada el mismo día **contra la lista publicada Y contra el DOM**, que es lo que el proyecto exige antes de dar nada por cubierto. Cero comentarios en la incidencia: apareció la regla y se cerró.
>
> **La regla que entró es MUCHO más amplia que la propuesta** — el mantenedor la hizo multi-dominio con **nueve** dominios, otra vez por su cuenta:
>
> ```
> atlanticohoy.com,cocheglobal.com,diario16plus.com,diariodemorelos.com,elnacional.cat,hibridosyelectricos.com,huleymantel.com,planetarealmadrid.com,zamora24horas.com##.c-banner
> ```
>
> **Y ahí está el desenlace del precedente que citamos:** el reporte se apoyaba en que `elnacional.cat##.c-banner` ya existía en EasyList. El mantenedor no solo lo aceptó como argumento — **agrupó ese dominio y siete más en una sola regla de EasyList Spanish**. `elnacional.cat##.c-banner` sigue además en EasyList (línea 70966), así que hoy está por duplicado; **no es asunto nuestro y no se le dice nada**, por lo mismo que no se insistió con `###stickyunit` en #364.
>
> **Medido con bloqueo real y modo Reforzado, lista `202608261503`, en las tres páginas del reporte original:**
>
> | Página | Antes (21 y 24-ago) | Ahora (26-ago) |
> |---|---|---|
> | Portada | 7/7 visibles, **818,793 px²**, 2,290 px | **0/7 visibles, 0 px²** |
> | Nota «exposiciones-inah…» | 5/8 visibles, **864,391 px²**, 2,650 px | **0/8 visibles, 0 px²** |
> | Nota «intensa-movilizacion…» | 5/8 visibles, **864,391 px²**, 2,650 px | **0/8 visibles, 0 px²** |
>
> Los ocho salen `0x0(oculto)` uno por uno, no «no encontrados» — que es la diferencia entre cubierto y ausente, la misma que obligó a mirar dos veces los hashes de Elementor el 25-ago.
>
> **El contador de ocultos lo confirma por la otra punta:** la portada pasó de **7 a 14** elementos ocultos por cosméticas y las dos notas de **8 a 16**. El aumento es exactamente el número de `.c-banner` de cada página — +7 y +8. No es una cifra que colapse por casualidad.
>
> **La trampa quedó intacta, que era el riesgo real de este reporte:** `.c-publications` sigue **1/1 visible con 459,172 px²** en portada. El aviso del cuerpo funcionó — nadie «mejoró» la regla llevándose las portadas del periódico. Tampoco entraron `.c-vbanners` ni `.o-layout--v-banners`, que era lo correcto: siguen midiendo millones de px² porque son la altura de la columna lateral, y hoy se ve claro que **esa cifra se mueve sola entre días** (8,943,484 px² el 26-ago en portada contra 9,578,719 el 21 y 9,184,281 el 24) mientras las cajas IAB no se movieron ni un píxel hasta desaparecer.
>
> **Y el detector no la encontró tampoco hoy:** `huecos: 0` con señal de ceguera en las tres páginas, esta vez con razón —ya no queda nada— pero por el mismo motivo de siempre. La ceguera **no distingue entre «cubierto del todo» y «hay 800,000 px² y no los veo»**, que es lo anotado el 25-ago al saltar el mismo día en `codigoqro.mx` y en `lajornadadeoriente`.
>
> **Añadida a `revisar-aguas-arriba.mjs` el mismo día**, que pasa a vigilar **10 aportaciones**. Se hizo en el momento y no «cuando toque la revisión» por lo que costó descubrir el 24-ago: una aportación que no está en ese archivo es una aportación que nadie vigila.

Encontrada en el sexto barrido del corpus. **Ninguna de las tres listas menciona el dominio** (verificado con `grep` sobre `easylist.txt`, `easyprivacy.txt` y `easylistspanish.txt` descargados el 21-ago).

> **Regla candidata:** `diariodemorelos.com##.c-banner`

### Lo medido el 21-ago-2026 — con bloqueo real y modo Reforzado

| Página | `.c-banner` | Prueba de pérdida |
|---|---|---|
| Portada | **7/7 visibles, 818,793 px², 2,290 px** | limpia |
| Nota «exposiciones-inah-conquistan-europa-asia…» | **5/8 visibles, 864,391 px², 2,650 px** | limpia |
| Nota «intensa-movilizacion-bomberos-en-cuautla…» | **5/8 visibles, 864,391 px², 2,650 px** | limpia |

**Las dos notas coinciden al píxel entre sí**, y en ambas 3 de las 8 cajas salen ya ocultas por cobertura existente: la regla aportaría sobre las 5 que quedan. Los tamaños son los canónicos de IAB — 970×250, 728×90, 300×600, 300×250 (×3) y un rascacielos de 120×600.

**El nombre tiene precedente aguas arriba:** EasyList ya lleva `elnacional.cat##.c-banner`. No es un nombre inventado por este sitio, es la convención BEM de su maquetado (`c-banner c-banner--970x250`), y por eso se propone la clase base y no los modificadores de medida — **la lección de #363**, donde el mantenedor resolvió `quadratin` por medidas exactas y la regla se cayó en cuanto el sitio rotó creatividades de otro tamaño.

### La trampa de este sitio: `.c-publications` es el propio periódico

`.c-publications` (1000×459) parece publicitario y **no lo es**: son las portadas del Diario de Morelos, Círculo M, Guía Médica, Guía de Restaurantes y Aniversario, todas con imagen alojada en casa. La prueba de pérdida lo confirmó: **−8 enlaces, −8 imágenes, −161 caracteres**. Es el caso de `tabascohoy.com` otra vez, y el de `.banner--sidebar` en quadratin. **NO se toca.**

### Lo que NO se propone, y por qué

`.c-vbanners` (9,578,719 px²) y `.o-layout--v-banners` (11,963,820 px²) dan cifras enormes porque son **el contenedor de la columna lateral, que se extiende los 9,579 px de la página entera** — no la superficie del anuncio. Llevar esas cifras a un mantenedor sería inflar el reporte con altura de maquetado. La cifra honesta es la de `.c-banner`.

### Lo que hay que declarar por adelantado

**Las cajas están vacías también sin bloqueador.** Medido el mismo día con `--sin-extension`: 7/7 visibles, 818,793 px², **cifra idéntica**. Es decir, no es el bloqueo lo que las vacía — en esa carga el inventario no se llenó. Lo que la regla retira es **espacio reservado**, igual que en #361 (`elmanana.com.mx`) y #364, y el mecanismo ya se aceptó aguas arriba las dos veces. Sirve GAM (`securepubads.g.doubleclick.net`).

### Segunda observación — 24-ago-2026, tres días después

Misma orden, mismo modo Reforzado, mismas tres páginas. **Las tres cifras repiten al píxel:**

| Página | 21-ago | 24-ago | Veredicto |
|---|---|---|---|
| Portada | 7/7, **818,793 px²**, 2,290 px | **7/7, 818,793 px², 2,290 px** | ✅ idéntico |
| Nota «exposiciones-inah…» | 5/8, **864,391 px²**, 2,650 px | **5/8, 864,391 px², 2,650 px** | ✅ idéntico |
| Nota «intensa-movilizacion…» | 5/8, **864,391 px²**, 2,650 px | **5/8, 864,391 px², 2,650 px** | ✅ idéntico |

Prueba de pérdida **limpia** en las tres, otra vez. Y `.c-publications` **volvió a romper con la misma cifra** —−8 enlaces, −8 imágenes, −161 caracteres—: la trampa está confirmada en dos días, no es de una carga.

**El dato que convierte esto en prueba y no en coincidencia:** los dos selectores que NO se proponen sí se movieron entre días — `.c-vbanners` pasó de 9,578,719 a 9,184,281 px² y `.o-layout--v-banners` de 11,963,820 a 11,471,167. Son la columna lateral, y su altura depende del contenido del día. **Las cajas IAB no se movieron ni un píxel porque su tamaño está reservado, y la columna sí.** Es exactamente la asimetría que validó `imagendelgolfo.mx` en #365.

**Recomprobado el 24-ago contra las tres listas descargadas ese día:** `diariodemorelos` aparece **0 veces** en EasyList (78,972 líneas), EasyPrivacy (56,707) y EasyList Spanish (2,708). Y el precedente del nombre sigue vivo: `elnacional.cat##.c-banner` está en EasyList.

### Estado: CUMPLE el estándar de envío (24-ago-2026)

1. ✅ **Segunda carga en día distinto** — 21 y 24-ago, cifra idéntica en las tres páginas.
2. ✅ **Plantilla de nota** — dos notas reales, ambas con superficie y ambas limpias.
3. ✅ **Prueba de pérdida limpia** en las tres páginas, con `--probar-perdida`.

**Cómo se hizo (reproducible):**

```bash
node herramientas/extension/medir-sitio.mjs https://www.diariodemorelos.com/ --reforzado --probar-perdida --selector ".c-banner" --selector ".c-vbanners" --selector ".o-layout--v-banners" --selector ".c-publications"
```

> **El detector NO la encontró, y el 24-ago tampoco.** Reportó `huecos: 0` con señal de ceguera en las tres páginas los dos días, mientras `.c-banner` seguía ahí. Es la **tercera confirmación** del límite estructural del 14-ago, tras `imagendelgolfo.mx` en dos observaciones: bajo bloqueo real la caja queda vacía y el detector, que reconoce por contenido, no tiene nada que reconocer. La encontró la cadena **señal de ceguera → `--explorar` → prueba de pérdida**, que es hoy la vía que halla lo grande.

### Texto de la incidencia, listo para enviar

El cuerpo declara por adelantado las cuatro cosas que un mantenedor preguntaría: que las cajas están **vacías y reservadas** (y que eso no lo causa el bloqueo, medido también sin extensión); **por qué la clase base y no los modificadores de medida**, que es la lección de #363; la **advertencia de `.c-publications`**, para que nadie "mejore" la regla y se lleve las portadas del periódico; y que **no se proponen** `.c-vbanners` ni `.o-layout--v-banners` pese a sus cifras enormes, porque son altura de maquetado.

```
Not covered by any rule in EasyList, EasyPrivacy or EasyList Spanish. The domain is not mentioned in any of the three lists (re-checked 2026-08-24).

Site: https://www.diariodemorelos.com (Morelos, Mexico)
Viewport: 1280px
Ad server: Google Ad Manager (securepubads.g.doubleclick.net)

The site uses BEM naming and wraps every ad unit in one base class:

    .c-banner        (with size modifiers: .c-banner--970x250, etc.)

Proposed rule:

    diariodemorelos.com##.c-banner

Proposing the base class rather than the size modifiers on purpose: a rule anchored to exact sizes stops matching as soon as the site rotates a creative of another size. The name already has precedent in EasyList - elnacional.cat##.c-banner.

Measured with all EasyList / EasyPrivacy / EasyList Spanish rules applied, including generic cosmetic rules, in a browser with network blocking active. Two separate days, identical to the pixel:

Homepage (2026-08-21 and 2026-08-24):

    7 of 7 containers visible, 818,793 px2, 2,290 px of vertical space
    Container sizes: 1000x250, 1000x90, 301x600, 301x250 (x3), 120x600

Article pages (same two days, two different articles, all four measurements identical):

    5 of 8 visible, 864,391 px2, 2,650 px
    .../noticias/exposiciones-inah-conquistan-europa-asia-mas-38-millones-personas-admiran-cultura-mexicana
    .../noticias/intensa-movilizacion-bomberos-en-cuautla-por-irresponsable-quema-basura-en-secundaria

On article pages 3 of the 8 are already hidden by existing coverage, so the rule adds the remaining 5.

Reload test on all three pages, both days: no loss of headlines, links, images, menus or form fields.

One warning about a neighbouring class, in case it looks like a target: .c-publications is NOT advertising. It holds the newspaper's own print-edition covers (Diario de Morelos, Circulo M, Guia Medica, Guia de Restaurantes), all self-hosted. Hiding it removes 8 links, 8 images and around 160 characters of text, measured on both days.

Not proposing .c-vbanners or .o-layout--v-banners either. They report very large numbers (9-12 million px2), but that is the height of the entire sidebar column, not ad surface.

Caveat stated up front: on both test days the slots were empty reserved boxes rather than served ads. Measured without a blocker as well and the figure is identical, so it is not the blocking that empties them - the inventory simply did not fill. What the rule removes is reserved space. Same situation as the elmanana.com.mx (#361) and elmanana.com (#364) reports, where the mechanism was accepted.

Found with Filtros MX (https://github.com/edso79/filtros-mx).
```

> ✅ **ENVIADA el 24-ago-2026 por Edgar — [#366](https://github.com/easylist/easylistspanish/issues/366), abierta.** Cuerpo verificado contra la API de GitHub: **2,627 caracteres, íntegro** —el enlace pre-llenado no truncó nada—, con la regla propuesta, las dos cifras, el aviso de `.c-publications`, el precedente de `elnacional.cat` y la salvedad de las cajas vacías, todo presente. 0 comentarios al enviarse, y GitHub **no** la marcó como duplicado potencial esta vez.

*(El enlace de abajo ya se usó — se conserva como plantilla. NO volver a pulsarlo.)*

[Incidencia pre-llenada de diariodemorelos.com — YA ENVIADA](https://github.com/easylist/easylistspanish/issues/new?title=diariodemorelos.com%3A%20uncovered%20ad%20containers%20(.c-banner)&body=Not%20covered%20by%20any%20rule%20in%20EasyList%2C%20EasyPrivacy%20or%20EasyList%20Spanish.%20The%20domain%20is%20not%20mentioned%20in%20any%20of%20the%20three%20lists%20(re-checked%202026-08-24).%0A%0ASite%3A%20https%3A%2F%2Fwww.diariodemorelos.com%20(Morelos%2C%20Mexico)%0AViewport%3A%201280px%0AAd%20server%3A%20Google%20Ad%20Manager%20(securepubads.g.doubleclick.net)%0A%0AThe%20site%20uses%20BEM%20naming%20and%20wraps%20every%20ad%20unit%20in%20one%20base%20class%3A%0A%0A%20%20%20%20.c-banner%20%20%20%20%20%20%20%20(with%20size%20modifiers%3A%20.c-banner--970x250%2C%20etc.)%0A%0AProposed%20rule%3A%0A%0A%20%20%20%20diariodemorelos.com%23%23.c-banner%0A%0AProposing%20the%20base%20class%20rather%20than%20the%20size%20modifiers%20on%20purpose%3A%20a%20rule%20anchored%20to%20exact%20sizes%20stops%20matching%20as%20soon%20as%20the%20site%20rotates%20a%20creative%20of%20another%20size.%20The%20name%20already%20has%20precedent%20in%20EasyList%20-%20elnacional.cat%23%23.c-banner.%0A%0AMeasured%20with%20all%20EasyList%20%2F%20EasyPrivacy%20%2F%20EasyList%20Spanish%20rules%20applied%2C%20including%20generic%20cosmetic%20rules%2C%20in%20a%20browser%20with%20network%20blocking%20active.%20Two%20separate%20days%2C%20identical%20to%20the%20pixel%3A%0A%0AHomepage%20(2026-08-21%20and%202026-08-24)%3A%0A%0A%20%20%20%207%20of%207%20containers%20visible%2C%20818%2C793%20px2%2C%202%2C290%20px%20of%20vertical%20space%0A%20%20%20%20Container%20sizes%3A%201000x250%2C%201000x90%2C%20301x600%2C%20301x250%20(x3)%2C%20120x600%0A%0AArticle%20pages%20(same%20two%20days%2C%20two%20different%20articles%2C%20all%20four%20measurements%20identical)%3A%0A%0A%20%20%20%205%20of%208%20visible%2C%20864%2C391%20px2%2C%202%2C650%20px%0A%20%20%20%20...%2Fnoticias%2Fexposiciones-inah-conquistan-europa-asia-mas-38-millones-personas-admiran-cultura-mexicana%0A%20%20%20%20...%2Fnoticias%2Fintensa-movilizacion-bomberos-en-cuautla-por-irresponsable-quema-basura-en-secundaria%0A%0AOn%20article%20pages%203%20of%20the%208%20are%20already%20hidden%20by%20existing%20coverage%2C%20so%20the%20rule%20adds%20the%20remaining%205.%0A%0AReload%20test%20on%20all%20three%20pages%2C%20both%20days%3A%20no%20loss%20of%20headlines%2C%20links%2C%20images%2C%20menus%20or%20form%20fields.%0A%0AOne%20warning%20about%20a%20neighbouring%20class%2C%20in%20case%20it%20looks%20like%20a%20target%3A%20.c-publications%20is%20NOT%20advertising.%20It%20holds%20the%20newspaper's%20own%20print-edition%20covers%20(Diario%20de%20Morelos%2C%20Circulo%20M%2C%20Guia%20Medica%2C%20Guia%20de%20Restaurantes)%2C%20all%20self-hosted.%20Hiding%20it%20removes%208%20links%2C%208%20images%20and%20around%20160%20characters%20of%20text%2C%20measured%20on%20both%20days.%0A%0ANot%20proposing%20.c-vbanners%20or%20.o-layout--v-banners%20either.%20They%20report%20very%20large%20numbers%20(9-12%20million%20px2)%2C%20but%20that%20is%20the%20height%20of%20the%20entire%20sidebar%20column%2C%20not%20ad%20surface.%0A%0ACaveat%20stated%20up%20front%3A%20on%20both%20test%20days%20the%20slots%20were%20empty%20reserved%20boxes%20rather%20than%20served%20ads.%20Measured%20without%20a%20blocker%20as%20well%20and%20the%20figure%20is%20identical%2C%20so%20it%20is%20not%20the%20blocking%20that%20empties%20them%20-%20the%20inventory%20simply%20did%20not%20fill.%20What%20the%20rule%20removes%20is%20reserved%20space.%20Same%20situation%20as%20the%20elmanana.com.mx%20(%23361)%20and%20elmanana.com%20(%23364)%20reports%2C%20where%20the%20mechanism%20was%20accepted.%0A%0AFound%20with%20Filtros%20MX%20(https%3A%2F%2Fgithub.com%2Fedso79%2Ffiltros-mx).%0A)

> Al enviarla, anotar aquí la fecha y el número. Y después, **vigilar la respuesta: si la aplican, verificar contra la lista publicada Y contra el DOM antes de dar nada por cubierto** — es lo que hizo falta con `periodicocorreo`, con `tribuna` y con las dos de esta semana.

---

## 🔻 ANOTADO SIN REPORTE — `hidrocalidodigital.com`: hay publicidad y superficie, y no hay nombre que proponer (21-ago-2026)

7 contenedores, **2,233,212 px² y 1,788 px de alto**, y son **publicidad genuina de terceros**: cada uno lleva un rótulo `<p class="elementor-heading-title">PUBLICIDAD</p>` y una imagen alojada en el propio WordPress que enlaza **fuera del dominio** — al portal de citas de FONACOT y a un portal de consulta de plazas. No es autopromoción: los enlaces salen del sitio. La prueba de pérdida da −1 enlace, −1 imagen y −11 caracteres por caja, que es exactamente el anuncio y su rótulo, con **0 titulares perdidos**.

**Lo que lo bloquea es el selector.** El único nombre que tienen los contenedores es un hash de Elementor:

    .elementor-element-1102992, .elementor-element-a7ba817, .elementor-element-bd0377c, …

Lo demás que comparten —`e-flex e-con-boxed e-con e-parent`— lo lleva **toda sección de Elementor de la página**, así que nombrar por ahí borraría el periódico. Es el precedente de `imparcialoaxaca` (descartado por hash de Elementor) y el de `proyectopuente.com.mx`, donde el id de tagDiv cambiaba entre plantillas.

**Y aquí el detector se equivocó en un matiz que conviene anotar:** marcó `nombreFragil: false` en los siete. `esSeguro()` comprueba lo que casa hoy, y un hash de Elementor casa hoy perfectamente. Es el **octavo defecto** asomando en otra forma. No se afina sobre la marcha: afinarlo exige medirlo contra el corpus entero, y el error contrario ya costó el mejor hallazgo del proyecto.

**Lo que sí queda, como pista viva y sin afirmar nada:** hay marca semántica. El contenedor se distingue por llevar dentro un heading cuyo texto es exactamente «PUBLICIDAD», y eso solo lo alcanza un **selector procedural** (`:has()` + texto), no una regla cosmética clásica. El motor propio lo aplicaría; uBO Lite y AdGuard MV3 no. **Antes de proponer nada hay que medir si los hashes de Elementor cambian entre días** — el proyecto lo ha supuesto siempre y nunca lo ha medido, y es el experimento que decide si esta familia de sitios es atacable o no.

---

## ✅ ACEPTADA Y VERIFICADA — [#365](https://github.com/easylist/easylistspanish/issues/365): `imagendelgolfo.mx`, el más grande medido del proyecto (enviada 17-ago · cerrada 24-ago-2026)

> **CERRADA como completada el 24-ago-2026** (commit `fa4fc86`, «M: Fix #365»), y **verificada el mismo día contra la lista publicada Y contra el DOM**, que es lo que el proyecto exige antes de dar nada por cubierto.
>
> **La regla que entró es MÁS AMPLIA que la propuesta** — el mantenedor la hizo multi-dominio por su cuenta:
>
> ```
> diariodelistmo.com,imagendelgolfo.mx,imagendeveracruz.mx##.bannersaas
> ```
>
> Y de paso metió `imagendeveracruz.mx` en la multi-dominio `##.banner-container` que ya existía.
>
> **Medido con bloqueo real y modo Reforzado, lista `202608241622`, en las tres páginas del reporte original:**
>
> | Página | Antes (17-ago) | Ahora (24-ago) |
> |---|---|---|
> | Portada | 17/31 visibles, **1,746,600 px²**, 3,500 px | **0/31 visibles, 0 px²** |
> | Nota `…concentra-operativos…` | 5/11 visibles, 689,730 px² | **0/11 visibles, 0 px²** |
> | Nota `…isidro-cano…` | 7/15 visibles, 1,091,160 px² | **0/15 visibles, 0 px²** |
>
> Y el dato que cierra el círculo: el reporte se sostenía en que **no se ocultaba ni un elemento** del dominio. Hoy la portada oculta **31**, que son exactamente los `.bannersaas`. **La superficie más grande medida por el proyecto —1.7 millones de px²— dejó de existir para todos los usuarios de EasyList Spanish, no solo para los nuestros.**
>
> **Lo que esto le hace a la pista de Bluestack, sin pasarse de frenada:** el mantenedor la aplicó a **tres** dominios. Es la primera evidencia de que `.bannersaas` viaja con el CMS — pero **la aportó él, no nosotros, y sigue sin contarse cuántos sitios lo usan**. El precedente `.mr-banner` también dio 3, y ahí se descartó por angosto. **La pista sigue viva y sigue sin afirmarse.**

Encontrado al ampliar el corpus el 14-ago. **Ninguna de las tres listas menciona el dominio** (verificado con `grep` sobre `easylist.txt`, `easyprivacy.txt` y `easylistspanish.txt`), y con el bloqueo puesto no se le oculta **ni un elemento** — 0 ocultos por cosméticas en las tres páginas medidas.

> **Regla candidata:** `imagendelgolfo.mx##.bannersaas`

### Portada, dos días separados por un fin de semana

| Selector | 14-ago | 17-ago | Prueba de pérdida | Veredicto |
|---|---|---|---|---|
| **`.bannersaas`** | 17/31, **1,746,600 px²**, 3,500 px | 17/31, **1,746,600 px²**, 3,500 px | limpia los dos días | ✅ **candidata** |
| `.banner-container` | 10/10, 1,066,500 px², 900 px | idéntico | limpia | envoltorio de las anteriores |
| `.sass-com-badv-content` | 7/8, 864,800 px², 2,600 px | idéntico | limpia | dentro de `.bannersaas` |
| `.sass-bs-m2c-bannerContent` | 1/1, 989,045 px² | 1/1, **1,000,245 px²** | **ROMPE los dos días: −5 titulares, −12 enlaces** | ❌ **NO TOCAR** |

**Los tres selectores publicitarios repiten la cifra al píxel; el editorial es el único que se movió.** Esa asimetría es en sí misma la prueba: las cajas de anuncio son de tamaño IAB reservado y no dependen del contenido del día, mientras la columna de titulares sí. El texto perdido por el selector malo también varió —622 caracteres el 14, 533 el 17— pero **los titulares y enlaces perdidos fueron idénticos**.

### Plantilla de nota — medida el 17-ago, dos notas reales

| Nota | `.bannersaas` | Prueba de pérdida |
|---|---|---|
| `…concentra-operativos-20260324-0084.html` | **5/11 visibles, 689,730 px², 930 px** | limpia |
| `…isidro-cano-hoy-21-de-marzo-20260320-0078.html` | **7/15 visibles, 1,091,160 px², 1,430 px** | limpia |

**La regla cubre las dos plantillas, y en la nota las unidades son otras** —1185×90, 803×250, 300×250, contra 970×90 / 336×280 / 336×600 de la portada—: no es la misma página repetida, es la misma clase envolviendo inventario distinto.

**Y la trampa editorial no existe fuera de la portada:** `.sass-bs-m2c-bannerContent` y `.sass-com-badv-content` **casan 0 elementos** en ambas notas. `.bannersaas` es segura en las dos plantillas.

### Por qué por clase y no por identificador

Los ids de las unidades de portada son `#home_desktop_middle_4` … `_11`. **Llevan `home_` en el nombre**, así que están atados a esa plantilla y en la nota son otros. Nombrar por id daría una regla que se cae al cambiar de página — el mismo defecto que dejó a `proyectopuente.com.mx` sin reporte posible. Sirve GAM (`securepubads.g.doubleclick.net`), con Comscore y GTM detrás.

**Es más grande que #364**: 1,746,600 px² contra 1,095,977. Los tamaños son los estándar de IAB —970×90, 336×280, 336×600— y **miden exactamente igual con y sin bloqueador**: las cajas reservan su espacio y no colapsan al vaciarse. Es el mecanismo de `elmanana.com`, que ya se aceptó como argumento válido.

### La trampa, a un sufijo de distancia

`.sass-bs-m2c-bannerContent**Aux**` es publicitario. `.sass-bs-m2c-bannerContent`, **sin el sufijo**, es la columna editorial de la portada —350×2826, con «El ocaso del glaciar Jamapa» dentro— y ocultarla se lleva 5 titulares y 12 enlaces. Dos clases hermanas, una borra publicidad y la otra borra el periódico. **Ninguna regla de este sitio se propone sin pasar la prueba de pérdida.**

### Pista viva, sin afirmar nada: el CMS es Bluestack

El prefijo `saas` no es decorativo: el sitio corre sobre **Bluestack CMS** (`bluestack.la`), un CMS de terceros. Si la familia `.bannersaas` viaja con el CMS, la regla valdría para más medios y sería candidata a multi-dominio, que es lo que más rinde aguas arriba.

**No se afirma hasta contarlo.** El precedente es `.mr-banner`, que prometía lo mismo y apareció en **3 de 36** sitios: demasiado angosto. Aquí hay que medir en cuántos sitios del corpus aparece `.bannersaas` antes de proponer nada que afecte a terceros.

### Estado: CUMPLE el estándar de envío (17-ago-2026)

1. ✅ **Segunda carga en día distinto** — el estándar que hizo entrar los cinco de julio sin discusión. Repite al píxel.
2. ✅ **Plantilla de nota** — dos notas, ambas con superficie y ambas limpias. El 14-ago no se pudo: la portada se arma por JavaScript y el sitio devuelve **403 a todo lo que no sea un navegador real** — `curl` no entra ni declarando ser Chrome, ni en portada ni en `sitemap.xml` ni en `feed`. Las URLs de nota hubo que sacarlas de un buscador; medirlas, con Chrome for Testing.
3. ✅ **Prueba de pérdida limpia** en las tres páginas, con `--probar-perdida`, no a ojo.

**Lo envía Edgar**, como todos. El cuerpo ya está redactado y el enlace pre-llenado, al final de esta sección.

**Cómo se hizo (dos comandos, reproducibles):**

```bash
node herramientas/extension/medir-sitio.mjs https://imagendelgolfo.mx/ --reforzado --probar-perdida --selector ".bannersaas" --selector ".banner-container" --selector ".sass-com-badv-content" --selector ".sass-bs-m2c-bannerContent"
```

```bash
node herramientas/extension/medir-sitio.mjs "https://imagendelgolfo.mx/estado/veracruz-se-mantiene-como-paso-constante-de-migrantes-concentra-operativos-20260324-0084.html" "https://imagendelgolfo.mx/estado/clima-en-veracruz-ya-despeja-con-vientos-del-este-nieblas-en-la-noche-preve-isidro-cano-hoy-21-de-marzo-20260320-0078.html" --reforzado --probar-perdida --selector ".bannersaas" --selector ".sass-bs-m2c-bannerContent" --selector ".sass-com-badv-content"
```

### Texto de la incidencia, listo para enviar

El cuerpo declara por adelantado las tres cosas que un mantenedor preguntaría: que las cajas están **vacías y reservadas**, no sirviendo anuncios (mismo aviso que en #364); que **no se propone nada multi-dominio** porque el conteo de Bluestack no está hecho; y **la advertencia de la clase hermana**, para que nadie “mejore” la regla con `.sass-bs-m2c-bannerContent` y se lleve la portada por delante.

> ✅ **ENVIADA el 17-ago-2026 por Edgar — [#365](https://github.com/easylist/easylistspanish/issues/365), abierta.** GitHub la marcó como duplicado potencial de #364, igual que hizo con #364 respecto a #361: lo dispara la referencia a #364 del último párrafo, que se dejó a propósito porque es la que le recuerda al mantenedor que el mecanismo —cajas vacías con altura reservada— ya lo aceptó él mismo. El cuerpo identifica el sitio en la tercera línea.
>
> **Queda vigilar la respuesta.** Si la aplican, **verificar contra la lista publicada y contra el DOM antes de dar nada por cubierto** — es la lección de `periodicocorreo` en julio y de `tribuna` en agosto: cerrado no es aceptado, y aceptado no siempre es lo que se propuso.

*(El enlace de abajo ya se usó — se conserva como plantilla. NO volver a pulsarlo.)*

[Incidencia pre-llenada de imagendelgolfo.mx — YA ENVIADA](https://github.com/easylist/easylistspanish/issues/new?title=imagendelgolfo.mx%3A%20uncovered%20ad%20containers%20(.bannersaas)&body=Not%20covered%20by%20any%20rule%20in%20EasyList%2C%20EasyPrivacy%20or%20EasyList%20Spanish.%20The%20domain%20is%20not%20mentioned%20in%20any%20of%20the%20three%20lists%2C%20and%20with%20all%20of%20them%20applied%20not%20a%20single%20element%20on%20the%20site%20is%20hidden.%0A%0ASite%3A%20https%3A%2F%2Fimagendelgolfo.mx%20(Veracruz%2C%20Mexico)%0AViewport%3A%201280px%0AAd%20server%3A%20Google%20Ad%20Manager%20(securepubads.g.doubleclick.net)%0A%0AThe%20site%20runs%20on%20Bluestack%20CMS%2C%20which%20wraps%20every%20ad%20unit%20in%20one%20class%3A%0A%0A%20%20%20%20.bannersaas%0A%0AProposed%20rule%3A%0A%0A%20%20%20%20imagendelgolfo.mx%23%23.bannersaas%0A%0AMeasured%20with%20all%20EasyList%20%2F%20EasyPrivacy%20%2F%20EasyList%20Spanish%20rules%20applied%2C%20including%20generic%20cosmetic%20rules%2C%20in%20a%20browser%20with%20network%20blocking%20active.%0A%0AHomepage%2C%20two%20separate%20days%20(2026-08-14%20and%202026-08-17)%2C%20identical%20to%20the%20pixel%3A%0A%0A%20%20%20%2017%20of%2031%20containers%20visible%2C%201%2C746%2C600%20px2%2C%203%2C500%20px%20of%20vertical%20space%0A%0AArticle%20pages%20(2026-08-17)%3A%0A%0A%20%20%20%205%20of%2011%20visible%2C%20%20%20689%2C730%20px2%20%20%20(...concentra-operativos-20260324-0084.html)%0A%20%20%20%207%20of%2015%20visible%2C%201%2C091%2C160%20px2%20%20%20(...isidro-cano-hoy-21-de-marzo-20260320-0078.html)%0A%0AThe%20rule%20covers%20both%20templates.%20The%20unit%20sizes%20differ%20between%20them%20(970x90%20%2F%20336x280%20%2F%20336x600%20on%20the%20homepage%2C%201185x90%20%2F%20803x250%20%2F%20300x250%20on%20articles)%2C%20so%20this%20is%20distinct%20inventory%20rather%20than%20the%20same%20page%20measured%20twice.%0A%0AReload%20test%20on%20all%20three%20pages%3A%20no%20loss%20of%20headlines%2C%20links%2C%20images%2C%20menus%20or%20form%20fields.%0A%0AOne%20warning%20about%20a%20neighbouring%20class%2C%20in%20case%20it%20looks%20like%20a%20better%20target%3A%20%60.sass-bs-m2c-bannerContentAux%60%20(with%20the%20suffix)%20is%20advertising%2C%20but%20%60.sass-bs-m2c-bannerContent%60%20(without%20it)%20is%20the%20editorial%20column%20on%20the%20homepage.%20Hiding%20that%20one%20removes%205%20headlines%2C%2012%20links%20and%20around%20600%20characters%20of%20text%2C%20measured%20on%20both%20test%20days.%20%60.bannersaas%60%20does%20not%20touch%20it.%0A%0ANot%20proposing%20anything%20multi-domain.%20The%20class%20may%20travel%20with%20the%20CMS%2C%20but%20I%20have%20not%20counted%20how%20many%20sites%20use%20it%2C%20so%20this%20report%20stays%20scoped%20to%20this%20domain.%0A%0ACaveat%20stated%20up%20front%3A%20on%20every%20test%20day%20the%20slots%20were%20empty%20reserved%20boxes%20rather%20than%20served%20ads.%20The%20containers%20keep%20their%20reserved%20height%20and%20do%20not%20collapse%2C%20so%20what%20the%20rule%20removes%20is%20reserved%20space.%20Same%20situation%20as%20in%20the%20elmanana.com%20report%20(%23364).%0A%0AFound%20with%20Filtros%20MX%20(https%3A%2F%2Fgithub.com%2Fedso79%2Ffiltros-mx).%0A)

> **Anotado para vigilar, no es un bloqueo:** las peticiones frenadas en este sitio son pocas —4 en portada, 6 en cada nota—. Hay carga real y los elementos casan, así que las mediciones son válidas, pero es un número bajo comparado con el resto del corpus (`zetatijuana` 43, `puentelibre` 19) y el 14-ago no quedó anotado para contrastar. Si una carga futura diera 0 frenadas y 0 ocultos, sería medición fallida y no sitio limpio — la lección de `proyectopuente`.

## Remedición del 14-ago-2026: los 4 que el arnés perdió el 13-ago

El barrido del 13-ago se llevó por delante 4 sitios por un defecto del propio arnés, no por nada de los sitios. Con el arnés corregido, los cuatro se midieron hoy en modo Reforzado. **Ninguno da hueco reportable, y uno abre trabajo:**

| Sitio | Frenadas | Ocultos | Descartes | Veredicto |
|---|---|---|---|---|
| `poresto.com` *(ver nota)* | 5 | 7 | 0/0/0 | ✅ limpio |
| `sipse.com` | 3 | 8 | 6 ya cubiertos en efecto | ✅ cubierto |
| `elsiglocoahuila.mx` | 6 | 22 | 2 sobrecobertura, 4 ya cubiertos | ✅ cubierto |
| `elorbe.com` | 4 | 21 | 0/0/0 | ⚠️ **CEGUERA** — mirar el DOM a mano |

Las cuatro son mediciones **válidas**: hay peticiones frenadas y elementos ocultos en todas, que es el criterio que se fijó el 13-ago tras el falso "limpio" de `proyectopuente` con cero en todo.

**`elorbe.com` se suma a `cuartopoder.mx` y `tabascohoy.com`**: tres sitios donde el bloqueo de red actúa pero **ninguna regla cosmética les aplica y el detector no encuentra contenedor nombrable**. Es exactamente para lo que existe la señal, y el precedente es `criteriohidalgo` el 6-ago: a mano apareció `div:has(> [id^="div-gpt-ad"])`, que el detector no sabe proponer porque nombra por clase.

### `poresto.net` no es el dominio: salta a `poresto.com`

Falló dos barridos seguidos con «no encuentro el tabId», y el arnés no decía a dónde había ido. Al listar las pestañas quedó claro: **`poresto.net` redirige a `poresto.com`, otro dominio.** Importa para el reporte, porque las reglas cosméticas son por dominio y proponer `poresto.net` habría sido proponer una regla inerte — el mismo error de identidad que casi se comete con los dos `elmanana`.

**Trampa de método que costó el rodeo:** `curl -L` devuelve **200 en `poresto.net` sin mostrar redirección**, porque el salto es de cliente, no HTTP. **Comprobar redirecciones con curl no descarta nada** cuando el sitio salta por JavaScript.

## Segundas cargas del 10-ago-2026: de 4 candidatas, sobrevive 1

Se midieron las cuatro contra **toda la cobertura de las listas aplicada** —específicas y genéricas— en vez de solo comprobar si algún selector las nombra. El resultado cambió tres de cuatro veredictos.

| Candidata | Aporte real sobre las listas | Veredicto |
|---|---|---|
| **`elmanana.com`** | **23 unidades, 1,095,975 px²** | ✅ **SE REPORTA** |
| `lavozdemichoacan.com.mx` | 32 px de altura, 0 área | ❌ ya cubierto |
| `criteriohidalgo.com` | 0 área, 0 altura | ❌ ya cubierto |
| `pulsoslp.com.mx` | Contenedor a 1265×**0**, sin anuncio hoy | ⏸ sin observar beneficio |

**El mecanismo que las tumbó, y que nadie había medido:** las listas ocultan la publicidad *dentro* del envoltorio, el envoltorio se queda sin contenido y **colapsa solo**. Ninguna regla los nombra —8 de 9 `.lv-ads` no las alcanza ningún selector— y aun así quedan invisibles. Un hueco que no se ve no es un hueco que reportar.

De ahí salió el **quinto defecto del detector**, ya corregido: medía cobertura por *selector* y no por *efecto*. Ahora descarta el envoltorio cuya publicidad interna ya está cubierta (`colapsariaAlVaciarse`). Sin eso, tres de cuatro candidatas se habrían reportado de más — al mismo mantenedor que acaba de atendernos siete veces.

**Y de esa corrección salió el SEXTO, el 13-ago-2026: sobre-corrigió y empezó a descartar en silencio.** `colapsariaAlVaciarse` *deducía* que un envoltorio con la publicidad cubierta acabaría vacío, sin comprobar que además se encogiera. **Cubierto no es colapsado**: una caja con altura propia reservada sigue ocupando. El detector llegó a devolver **`huecos: 0` en `elmanana.com`** —descartando las 12 unidades de #364— y a tragarse `#custom_html-2` en `quadratin.com.mx`. Corregido: ahora **mide** (`estadoAlVaciarse` oculta lo cubierto, mide el envoltorio y restaura), y con eso vuelve a encontrar los dos hallazgos que una persona ya había validado a mano. **La lección vale más que el defecto: una heurística que descarta en silencio es peor que ruido** — el ruido se revisa, el falso negativo desaparece del reporte y nadie lo busca.

### `pulsoslp.com.mx` — en pausa, sin beneficio observado

El 6-ago el contenedor medía 1265×90 con anuncio servido; el 10-ago existe pero mide **1265×0** y no sirve nada, ni tras recorrer la página para disparar la carga diferida. La regla sigue siendo segura (recarga limpia, cero pérdida), pero **el beneficio no se ha observado dos veces**. Se espera a una carga que lo muestre servido antes de reportar — es el mismo criterio que se aplicó a `elmanana.com.mx` en julio, donde la salvedad se declaró por adelantado.

*Tercera carga, 11-ago-2026: sigue a 1265×0, slot GPT sin llenar (esperas de 4 y 2 segundos incluidas). Sigue en pausa.*

**❌ DESCARTADO el 14-ago-2026, cuarta observación.** Medido con bloqueo real y modo Reforzado (15 peticiones frenadas, 15 elementos ocultos, **0 huecos reportables**): `#StickHeader_UP1` casa 1 elemento y sale **1249×0, oculto**. Marcador final: **una carga con anuncio servido (6-ago) contra tres sin él (10, 11 y 14-ago)**.

La regla nunca fue peligrosa —recarga limpia en las dos plantillas— pero eso no basta: **lo que se le lleva a un mantenedor es un beneficio observado, y aquí el beneficio aparece una vez de cada cuatro.** Se conserva anotado igual que `lavozdemichoacan.com.mx`: si una carga futura lo muestra servido, vuelve a ser candidata sin empezar de cero.

### Descartada: `lavozdemichoacan.com.mx` — ya cubierto en efecto

Las 9 `.lv-ads` (7 visibles, 8 con anuncio servido, 852,160 px² en crudo) **caen a 0 área visible** con las listas aplicadas. Aporte de una regla propia: **32 px de altura en toda la página**. No justifica el tiempo de un mantenedor. *(Se conserva anotado: si el sitio cambia y dejan de colapsar, vuelve a ser candidata.)*

### Descartada: `criteriohidalgo.com` — ya cubierto en efecto

Los 11 envoltorios `div:has(> [id^="div-gpt-ad"])` caen a **0** con las listas aplicadas: la genérica `[id^="div-gpt-ad"]` vacía los slots y los envoltorios colapsan. **Aporte: 0 área, 0 altura.** Es exactamente la salvedad que la revisita del censo dejó anotada el 6-ago —*"lo que esta regla cierra es el envoltorio residual"*— ahora cuantificada: ese residual es cero.

**Lo que NO cambia:** el sitio sigue siendo **atacable**, que era la conclusión de la revisita. Lo que se cae es que haga falta una regla nueva.

### En preparación: `lavozdemichoacan.com.mx` — ~~falta la segunda carga~~ DESCARTADA (ver arriba)

Hallazgo del detector del 6-ago-2026 (barrido vespertino). **La clase publicitaria propia del sitio**: `lv-` = La Voz. **9 unidades en portada y 6 en nota, todas con anuncio servido, cero editorial**, sin regla en ninguna lista. Es el cierre más grande medido hasta ahora: **1,725 px** en portada.

> **Regla candidata:** `lavozdemichoacan.com.mx##.lv-ads`
> Recarga limpia en ambas plantillas: cero pérdida de titulares, enlaces, imágenes, texto, menús y formularios. El envoltorio utilitario (`.home-e.py-4`) contiene un `.lv-ads` adentro — una sola regla basta.

**NO se envía hasta la segunda carga en día distinto.**

### Anotado SIN preparar reporte: `elheraldodesaltillo.mx` — huecos con nombre frágil

Tiene 3 huecos reales con anuncio servido, pero los únicos nombres disponibles son **generados por el tema tagDiv** (`#tdi_110`, `.vc_column.tdi_86…`, `#elher-<hash>`): cambian con cada reconstrucción del sitio. Proponerlos sembraría reglas destinadas a morir como la de Torreón. Queda para revisión con ojos — buscar un gancho estable en el DOM — o como caso de la familia "nombre frágil" del censo.

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
| 2026-08-06 | `tribuna.com.mx` — proponer `##[id^="Tribuna_"]` | [#362](https://github.com/easylist/easylistspanish/issues/362) | **Cerrada, arreglo distinto** 10-ago — **cubre** (verificado en 3 plantillas) | Dominio añadido a la multi-dominio `##.ads` |
| 2026-08-06 | `quadratin.com.mx` — proponer `.banner--cinturon2`, `.banner--faro`, `#custom_html-2` | [#363](https://github.com/easylist/easylistspanish/issues/363) | **Cerrada, arreglo distinto** 10-ago — **cubre a medias**. Seguimiento enviado el 11-ago; **medio residuo tomado el 24-ago**, el otro medio encogió por debajo del estándar: se deja | Reglas por medidas + 2 multi-dominio de `img[width]`, y después `##.banner--faro`. Queda `#custom_html-2` a 350×96 sin servir |
| 2026-08-10 | `elmanana.com` (Reynosa) — proponer `[class^="template-publicidad-cuadrada"]` y `#stickyunit` | [#364](https://github.com/easylist/easylistspanish/issues/364) | **ACEPTADA** 24-ago (`a6bfa0b`) — verificada contra lista publicada y DOM: **0/24 visibles, 0 px²** | `##div[class*="template-publicidad-"]`, **más amplia que la propuesta**. Además `###stickyunit` (que pedimos retirar) y `##.ad-unit-leaderboard`, que casa 0 |
| 2026-08-24 | `diariodemorelos.com` — proponer `.c-banner` | [#366](https://github.com/easylist/easylistspanish/issues/366) | **ACEPTADA** 26-ago (`8f1e5fc`, 2 días) — verificada contra lista publicada y DOM: **0 visibles, 0 px²** en portada y dos notas | Multi-dominio de **9 dominios**, `##.c-banner` — **la amplió él**, absorbiendo el `elnacional.cat` que citamos como precedente |
| 2026-08-17 | `imagendelgolfo.mx` — proponer `.bannersaas` | [#365](https://github.com/easylist/easylistspanish/issues/365) | **ACEPTADA** 24-ago (`fa4fc86`) — verificada en portada y dos notas: **0 visibles, 0 px²** en las tres | `diariodelistmo.com,imagendelgolfo.mx,imagendeveracruz.mx##.bannersaas` — **multi-dominio, la amplió él** |

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
