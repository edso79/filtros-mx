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

### En preparación: `elmanana.com` (Reynosa) — falta la segunda carga

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

**Comentario LISTO PARA PEGAR en #364** (sigue abierta, así que no hay que reabrir nada). Lo envía Edgar:

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

*(El enlace de abajo ya se usó — se conserva como plantilla. NO volver a pulsarlo.)*

[Incidencia pre-llenada de elmanana.com — YA ENVIADA](https://github.com/easylist/easylistspanish/issues/new?title=elmanana.com%3A%20uncovered%20ad%20containers%20(template-publicidad-*)&body=Not%20covered%20by%20any%20rule%20in%20EasyList%2C%20EasyPrivacy%20or%20EasyList%20Spanish.%0A%0ASite%3A%20https%3A%2F%2Fwww.elmanana.com%20(Reynosa%2C%20Tamaulipas%2C%20Mexico)%0AViewport%3A%201280px%0A%0ANote%20this%20is%20NOT%20the%20same%20site%20as%20elmanana.com.mx%20(Nuevo%20Laredo)%2C%20which%20is%20already%20covered%20by%20elmanana.com.mx%23%23.ad-zone.%20They%20are%20sibling%20newspapers%20on%20different%20platforms%3B%20the%20.com%20runs%20a%20newer%20CMS%20with%20its%20own%20ad%20container%20family.%20The%20.com.mx%20rule%20still%20works%20correctly%20%E2%80%94%20checked%20on%20the%20same%20day.%0A%0AThe%20platform%20names%20its%20ad%20containers%20with%20a%20common%20prefix%2C%20plus%20a%20sticky%20unit%3A%0A%0A%20%20%20%20template-publicidad-cuadrada-independiente%20%20%20(5%20units%2C%20309x250)%0A%20%20%20%20template-publicidad-cuadrada-dos-columnas%0A%20%20%20%20template-publicidad-cuadrada-notas%0A%20%20%20%20%23stickyunit%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20(1280x90)%0A%0A24%20elements%20of%20the%20family%20on%20the%20homepage%2C%20checked%20one%20by%20one%3A%20every%20one%20is%20an%20ad%20container%2C%20none%20holds%20editorial%20content.%20On%20article%20pages%20the%20family%20matches%200%20elements%2C%20so%20the%20rules%20are%20inert%20there.%0A%0AProposed%20rules%3A%0A%0A%20%20%20%20elmanana.com%23%23%5Bclass%5E%3D%22template-publicidad-cuadrada%22%5D%0A%20%20%20%20elmanana.com%23%23%23stickyunit%0A%0ATested%20by%20applying%20the%20rules%20and%20reloading%2C%20on%20two%20separate%20days%20(2026-08-06%20and%202026-08-10)%2C%20with%20all%20EasyList%2FEasyPrivacy%2FEasyList%20Spanish%20rules%20also%20applied%3A%20no%20loss%20of%20headlines%2C%20links%2C%20images%2C%20menus%20or%20form%20fields.%20Measured%20on%20top%20of%20the%20existing%20lists%2C%20these%20rules%20still%20remove%2023%20visible%20ad%20containers%20and%20~1%2C095%2C975%20px2%20of%20ad%20surface%2C%20so%20they%20are%20not%20redundant%20with%20current%20coverage.%0A%0AThe%20only%20text%20removed%20is%2010%20%22PUBLICIDAD%22%20labels%20inside%20the%20containers%20themselves%20plus%20the%20%22x%22%20of%20the%20sticky%20unit%20%E2%80%94%20same%20situation%20declared%20in%20the%20periodicocorreo.com.mx%20report%20in%20July.%0A%0ACaveat%20stated%20up%20front%3A%20on%20both%20test%20days%20the%20slots%20were%20empty%20reserved%20boxes%20rather%20than%20served%20ads.%20The%20rules%20remove%20the%20reserved%20space%2C%20which%20is%20the%20observed%20benefit.%0A%0AFound%20with%20Filtros%20MX%20(https%3A%2F%2Fgithub.com%2Fedso79%2Ffiltros-mx).)

*(El cuerpo aclara por adelantado que NO es el mismo sitio que `elmanana.com.mx`, para que nadie lo cierre como duplicado de la regla de julio.)*

## En preparación: `imagendelgolfo.mx` — el más grande medido hasta hoy (14-ago-2026)

Encontrado al ampliar el corpus el 14-ago. **Ninguna de las tres listas menciona el dominio** (verificado con `grep` sobre `easylist.txt`, `easyprivacy.txt` y `easylistspanish.txt`), y con el bloqueo puesto no se le oculta **ni un elemento**.

> **Regla candidata:** `imagendelgolfo.mx##.bannersaas`

| Selector | Con bloqueo real + Reforzado | Prueba de pérdida | Veredicto |
|---|---|---|---|
| **`.bannersaas`** | **17/31 visibles, 1,746,600 px², 3,500 px de alto** | limpia: 0 titulares, 0 enlaces, 0 texto, 0 campos | ✅ **candidata** |
| `.banner-container` | 10/10, 1,066,500 px², 900 px | limpia | envoltorio de las anteriores |
| `.sass-com-badv-content` | 7/8, 864,800 px², 2,600 px | limpia | dentro de `.bannersaas` |
| `.sass-bs-m2c-bannerContent` | 1/1, 989,045 px² | **ROMPE: −5 titulares, −12 enlaces, −622 caracteres** | ❌ **NO TOCAR** |

**Es más grande que #364**: 1,746,600 px² contra 1,095,977. Los tamaños son los estándar de IAB —970×90, 336×280, 336×600— y **miden exactamente igual con y sin bloqueador**: las cajas reservan su espacio y no colapsan al vaciarse. Es el mecanismo de `elmanana.com`, que ya se aceptó como argumento válido.

### La trampa, a un sufijo de distancia

`.sass-bs-m2c-bannerContent**Aux**` es publicitario. `.sass-bs-m2c-bannerContent`, **sin el sufijo**, es la columna editorial de la portada —350×2826, con «El ocaso del glaciar Jamapa» dentro— y ocultarla se lleva 5 titulares y 12 enlaces. Dos clases hermanas, una borra publicidad y la otra borra el periódico. **Ninguna regla de este sitio se propone sin pasar la prueba de pérdida.**

### Pista viva, sin afirmar nada: el CMS es Bluestack

El prefijo `saas` no es decorativo: el sitio corre sobre **Bluestack CMS** (`bluestack.la`), un CMS de terceros. Si la familia `.bannersaas` viaja con el CMS, la regla valdría para más medios y sería candidata a multi-dominio, que es lo que más rinde aguas arriba.

**No se afirma hasta contarlo.** El precedente es `.mr-banner`, que prometía lo mismo y apareció en **3 de 36** sitios: demasiado angosto. Aquí hay que medir en cuántos sitios del corpus aparece `.bannersaas` antes de proponer nada que afecte a terceros.

### Lo que falta antes de enviar

1. **Segunda carga en día distinto** — el estándar que hizo entrar los cinco de julio sin discusión.
2. **Plantilla de nota**, que hoy no se pudo sacar: la portada se arma por JavaScript y el sitio devuelve 403 a navegadores no estándar. Con Chrome for Testing sí entra, así que va con la segunda carga.

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
| 2026-08-06 | `quadratin.com.mx` — proponer `.banner--cinturon2`, `.banner--faro`, `#custom_html-2` | [#363](https://github.com/easylist/easylistspanish/issues/363) | **Cerrada, arreglo distinto** 10-ago — **cubre a medias**. Seguimiento con segunda observación **enviado el 11-ago**; en espera de respuesta | Reglas por medidas + 2 multi-dominio de `img[width]`. Sobreviven 2 unidades servidas |
| 2026-08-10 | `elmanana.com` (Reynosa) — proponer `[class^="template-publicidad-cuadrada"]` y `#stickyunit` | [#364](https://github.com/easylist/easylistspanish/issues/364) | **Abierta** | — |

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
