# Medición del eje visual: ¿queda publicidad visible en sitios mexicanos?

**Fecha:** 30 de julio de 2026
**Pregunta:** con las listas que un usuario mexicano ya recibe, ¿cuánta superficie publicitaria sigue siendo visible?
**Corpus final:** 17 sitios mexicanos, medidos en cuatro pasadas el mismo día. *(El documento es cronológico: cada pasada corrige a la anterior. Las cifras de una pasada no se comparan con las de otra — la métrica de área cambió a mitad del ejercicio.)*
**Resultado: 9 sitios quedan cubiertos por las listas existentes, 1 no tiene publicidad, 6 tienen al menos un contenedor que ninguna lista nombra, y 1 de esos 6 resultó ser autopromoción del propio sitio.**

---

## Por qué esta medición y no la anterior

La medición de red del mismo día (`medicion-unotv-2026-07-30.md`) concluyó que 72 de 80 hosts ya estaban cubiertos. Esa medición **es ciega a tres cuartas partes del problema**: la Compuerta Cero midió que las listas regionales son 73-77% cosméticas. Un anuncio cuyo contenedor nadie oculta deja un hueco visible aunque la petición se bloquee.

Esta medición ataca justo ese eje, que es el que el plan siempre señaló como decisivo y el que nunca se había medido.

## Método

Para cada sitio, sin ningún bloqueador instalado:

1. Se descargan EasyList, EasyPrivacy, EasyList Spanish, AdGuard Base y AdGuard Español/Portugués el mismo día.
2. Se extraen los selectores cosméticos: **14,202 genéricos** más los específicos del dominio. Se descartan los extendidos (`:has`, `:contains`, `#?#`) porque `querySelectorAll` no los entiende y darlos por buenos produciría un falso "oculto".
3. Se carga el sitio, se recorre entero en 10 pasos para disparar la carga diferida, y se vuelve arriba.
4. **Se ejecutan los selectores contra el DOM real** y se marca cada elemento que quedaría oculto.
5. Se localizan las unidades publicitarias y se mide su área renderizada.
6. Una unidad cuenta como **oculta** si ella o cualquiera de sus ancestros coincide con algún selector.

Esto es exactamente la corrección que la objeción 15 del borrador de la PoC exigía: correr los selectores cosméticos sobre el hueco publicitario concreto, en vez de deducir la visibilidad desde una traza de red.

### Un fallo del instrumento, y es el hallazgo metodológico

La primera versión del detector solo reconocía contenedores estándar: iframes de redes conocidas, `ins.adsbygoogle`, `div-gpt-ad`, Taboola, Outbrain. **Sobre `elsiglodetorreon.com.mx` devolvió cero unidades publicitarias.**

Era falso. El sitio tiene 15 contenedores propios (`#portadaA` … `#portadaN`, clase `.lapub`) que el detector no reconocía por no llamarse como los estándar.

**El fallo era silencioso y de una sola dirección: convertía en "sin anuncios" justo a los sitios con maquetado propio, que son los que la tesis del proyecto señala.** Los cuatro primeros sitios se midieron con esa versión y hubo que repetirlos. Es la misma clase de error que el defecto CRLF de la Compuerta Cero, y por la misma razón hay que dejarlo escrito.

La versión corregida reconoce además contenedores propios por sus clases (`lapub`, `pub250`, `banner-medio`, `ADX`, `anuncio`, `publicidad`, `patrocinado`) y por la firma `data-advadstrackid`. **Todos los resultados de abajo son de la versión corregida.**

## Resultados

| Sitio | Tipo | Unidades | Área total (px²) | **% oculto** | Reglas específicas |
|---|---|---|---|---|---|
| heraldodemexico.com.mx | nacional | 5 | 461,040 | **100%** | 0 |
| oem.com.mx | red estatal | 7 | 1,414,107 | **100%** | 0 |
| lasillarota.com | digital nacional | 10 | 1,348,100 | **100%** | 1 |
| kiwilimon.com | recetas | 7 | 559,360 | **100%** | 1 |
| elimparcial.com | regional, Sonora | 8 | 1,128,510 | **100%** | 2 |
| unotv.com | nacional | 5 | 1,325,018 | **99%** | 0 |
| eluniversal.com.mx | nacional | 4 | 901,227 | **83%** | 7 |
| zocalo.com.mx | regional, Coahuila | 17 | 931,930 | **22%** | 0 |
| elsiglodetorreon.com.mx | regional, Coahuila | 9 | 988,656 | **0%** | 2 |
| **TOTAL** | | **72** | **9,057,948** | **79%** | |

**Sobrevive el 21% del área publicitaria.** Y está concentrada: de 1,881,732 px² visibles, **1,714,766 —el 91%— están en `elsiglodetorreon.com.mx` y `zocalo.com.mx`.**

## Segunda pasada: 5 sitios más

Ampliado el mismo día a regionales mexicanos, con la métrica de área acotada al alto de ventana (ver limitación 1 en `controles-espana-argentina-2026-07-30.md`):

| Sitio | Unidades | % oculto | Contenedor sin cubrir |
|---|---|---|---|
| `vanguardia.com.mx` | 8 | **100%** | — |
| `am.com.mx` | 9 | **100%** | — |
| `noroeste.com.mx` | 1 | **100%** | — |
| `periodicocorreo.com.mx` | 11 | **64%** | `.zone-ads` (3 unidades, hasta 300x804) |
| `elmanana.com.mx` | 1 | **0%** | `.ad-zone` (12 contenedores) |

**Corpus mexicano acumulado: 14 sitios.** Ocho quedan al 100% y **cinco tienen al menos un contenedor publicitario que ninguna lista cubre**: `elsiglodetorreon.com.mx`, `zocalo.com.mx`, `periodicocorreo.com.mx`, `elmanana.com.mx` y `eluniversal.com.mx` (`.aviopo-banner`, 300x497).

> **Precisión del 31-jul-2026 sobre `.aviopo-banner`:** al inspeccionarlo para escribirle regla resultó ser **autopromoción de primera parte** — un carrusel "Banner Aviso Oportuno" que enlaza a `empleos.eluniversal.com.mx`, el portal de clasificados del propio periódico. **No se le escribe regla:** ocultar la autopromoción de un sitio es una decisión de política distinta a ocultar publicidad, y EasyList tampoco lo hace. Queda contado como hueco *medido* pero excluido de la lista *a propósito*.

Ese conteo por sitios —5 de 14— es más robusto que cualquier porcentaje de área, porque no depende de la métrica que cambió a mitad del ejercicio.

## Tercera pasada: 3 sitios más, y dos refinamientos del método

| Sitio | Resultado |
|---|---|
| `tribuna.com.mx` | **Cubierto.** Lo que sobrevive son iframes de Google Ad Manager, no envoltorios — ver refinamiento 1 |
| `eldiariodechihuahua.mx` | **8 contenedores `.banner` sin cubrir**, todos con `<p>Publicidad</p>` y slot `div-gpt-ad`. Regla escrita |
| `lajornadamaya.mx` | **Sin publicidad.** Cero iframes, solo analítica. No es un cero del instrumento: es un sitio sin anuncios |

**Corpus mexicano: 17 sitios.**

### Refinamiento 1 — un iframe publicitario que sobrevive al filtro cosmético no es fuga

En `tribuna.com.mx` sobrevivían tres `google_ads_iframe_…` de 300x250. **No cuentan**: son el anuncio mismo, no su envoltorio, y la regla de red mata la petición antes de que se rendericen.

La distinción importa y estaba implícita: **solo cuenta como fuga un envoltorio que ocupa espacio con independencia de si el anuncio carga.** Todas las reglas escritas hasta hoy apuntan a envoltorios, así que ninguna cambia — pero la regla queda escrita para que nadie cuente iframes como hueco.

### Refinamiento 2 — un cero puede ser verdadero, y hay que distinguirlo

`lajornadamaya.mx` devolvió cero unidades. Tras el falso cero de `elsiglodetorreon.com.mx`, la disciplina obliga a inspeccionar: cero iframes, ningún contenedor publicitario, y de terceros solo `googletagmanager`, `analytics.google.com` y Cloudflare Insights. **El sitio no tiene publicidad.**

Un cero verdadero y un cero del instrumento se ven igual en el resultado. Solo los separa mirar el DOM.

## Cuarta pasada: el detector se rompió tres veces y hubo que rehacerlo

Cinco sitios más, y ninguno dio regla nueva. Lo que dieron fue mejor: **tres modos de fallo del instrumento, los tres del mismo origen** — clasificar por nombre de clase.

| Sitio | Qué pasó |
|---|---|
| `elsiglodedurango.com.mx` | 100% cubierto. No usa `.lapub` pese a ser del mismo grupo que el de Torreón: la marca compartida no implica plantilla compartida |
| `criteriohidalgo.com` | **Ciego.** Tiene publicidad servida (doubleclick, pubmatic) y devolvió cero: sus contenedores se llaman `mx-auto my-[10px] py-[10px]` |
| `zetatijuana.com` | **Falso positivo.** Marcó `.tdc-zone`, que es el sistema de columnas del tema tagDiv. Uno de los elementos era el envoltorio del encabezado — ocultarlo rompe el sitio |
| `riodoce.mx` | **Falso positivo masivo.** 28 contenedores de notas de Elementor marcados como publicidad |
| `imagenzacatecas.com` | No cargó |

**El nombre de clase no generaliza.** Lo que sí generaliza es el contenido: un hueco publicitario contiene el slot de una red, o lleva al lado la etiqueta "Publicidad" que el propio publicador está obligado a poner.

### v3: detectar por contenido

El medidor se rehízo para partir de **semillas** —`ins.adsbygoogle`, `div-gpt-ad`, `data-advadstrackid`, iframes de redes conocidas, y etiquetas de texto "Publicidad"— y subir desde ahí mientras el ancestro siga sin arrastrar contenido editorial.

Resultado contra los mismos casos:

| Sitio | v2 | v3 |
|---|---|---|
| `riodoce.mx` | 28 falsos positivos | **1 unidad real** (`.google-auto-placed`) |
| `criteriohidalgo.com` | 0 (ciego) | **10 unidades** |

Además la v3 reporta `sospechaDeCeguera`: si hay red publicitaria en el tráfico y cero unidades encontradas, el instrumento avisa de que está ciego en lugar de devolver un cero silencioso.

### Y un límite que no es del instrumento, sino del método

En `criteriohidalgo.com` la v3 **encuentra** las diez unidades, pero mírense sus selectores: `.py-4`, `.my-4`, `.bg-white.p-4`, `.col-span-full.md:col-span-4`.

Son clases utilitarias de Tailwind. **No hay selector que apunte al anuncio sin apuntar también a media página.** Una regla sobre `.py-4` ocultaría contenido arbitrario del sitio.

> **Un sitio construido con CSS utilitario no se puede atender con reglas cosméticas clásicas.** No es que falte trabajo de curaduría: es que no existe el selector.

Eso tiene consecuencia directa sobre el proyecto. Los bloqueadores resuelven estos casos con **selectores extendidos** (`:has()`, `:contains()`), que uBlock Origin completo sí aplica y que **Manifest V3 no permite del mismo modo**. A medida que más medios se rehacen con Tailwind, la fracción del problema que una lista declarativa puede resolver se encoge — y encoge más para una extensión MV3 que para uBO completo.

## Lo que discrimina no es la región: es el maquetado

La tentación es concluir "los medios regionales están desatendidos". **El dato lo desmiente:** `elimparcial.com`, regional de Sonora, sale al 100%.

Lo que separa a los sitios cubiertos de los que no es **cómo montan sus anuncios**:

| Montaje | Cobertura | Ejemplos |
|---|---|---|
| Stack estándar — GPT, Taboola, Freestar, adsbygoogle | ~100% | unotv, oem, lasillarota, kiwilimon, elimparcial, heraldo |
| **Envoltorio propio o de plugin** | **0-22%** | elsiglodetorreon (`.lapub`), zocalo (`.banner-medio` + plugin Advanced Ads) |

Las reglas genéricas de EasyList nombran los contenedores estándar. **No pueden nombrar una clase que se inventó un desarrollador en Torreón.** Ahí está la brecha, y es real.

### El caso que lo resume

EasyList Spanish trae una regla cosmética: **`.pub`**. `elsiglodetorreon.com.mx` usa la clase **`.lapub`**. La regla falla por dos letras, y con ella se quedan fuera los 9 contenedores publicitarios del sitio.

## Reglas verificadas

Dos, y pasaron el procedimiento completo de `CONTRIBUIR.md`, incluida la prueba que exige comprobar que el resto de la página sigue funcionando:

| Regla | Titulares | Enlaces | Imágenes | Texto | Hueco cerrado |
|---|---|---|---|---|---|
| `elsiglodetorreon.com.mx##.lapub` | sin pérdida | sin pérdida | sin pérdida | sin pérdida | 546 px de alto |
| `zocalo.com.mx##.banner-medio` | sin pérdida | sin pérdida | sin pérdida | sin pérdida | 848 px de alto |

En Zócalo apareció un `<nav>` colapsado tras aplicar la regla. Se comprobó quitándola: es un desplegable cerrado por defecto, idéntico con y sin regla. **No lo causa la regla.** Se deja anotado porque una comprobación que no se hace es una regla que rompe un sitio.

## Una pista de alto rendimiento

Los contenedores de Zócalo llevan el atributo **`data-advadstrackid`**, firma del plugin **Advanced Ads** de WordPress. No es una clase inventada por un sitio: es un plugin que usan muchos medios pequeños.

**Una sola regla genérica sobre esa firma podría cubrir a decenas de publicadores a la vez.** Es la pieza de mayor rendimiento por hora de trabajo que salió de esta medición, y no está probada: una regla genérica mal hecha rompe sitios en masa, así que exige mucha más verificación que una regla por sitio.

## Limitaciones

1. **n=9, sin muestreo aleatorio.** Los sitios se eligieron a mano desde el corpus del borrador de la PoC. Con 9 sitios y una fuga concentrada en 2, cualquier porcentaje global tiene un intervalo enorme: cambiar un sitio mueve el resultado decenas de puntos. **El 21% no es una estimación poblacional y no debe citarse como tal.**
2. **Una carga por sitio, un día, una ubicación.** El inventario publicitario rota y se subasta; otra carga da otro resultado.
3. **La detección de unidades es heurística.** La v2 encuentra lo que la v1 no veía, pero nada garantiza que no queden montajes que tampoco reconoce. **El error va en la misma dirección: subestimar la fuga.**
4. **Solo portadas.** Las notas interiores suelen traer más publicidad que la portada.
5. **Se ignoran los selectores extendidos**, que uBlock Origin sí aplica. Para un usuario de uBO completo la cobertura real es mayor que la medida aquí.
6. **Sin control geográfico.** No se midieron sitios de España o Argentina, así que esto no distingue "México está peor cubierto" de "los medios pequeños están peor cubiertos en todas partes". Es la hipótesis alternativa más probable, y sigue viva.

## Cómo repetirlo

El instrumento quedó en `herramientas/eje-visual/`. Requiere el servidor local de selectores y un navegador.

```bash
node herramientas/eje-visual/servidor.mjs
```

Luego se ejecuta `medidor.js` en la consola del sitio a medir.
