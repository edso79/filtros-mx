# Controles de España y Argentina: la brecha no es mexicana

**Fecha:** 30 de julio de 2026
**Pregunta:** el hueco medido en sitios mexicanos, ¿es mexicano, o es de los medios pequeños en cualquier país?
**Resultado: NO ES MEXICANO. Los regionales de España y Argentina tienen el mismo hueco, por el mismo mecanismo, y al menos igual de grande.**

---

## Por qué este control

La medición del eje visual encontró que en el corpus mexicano hay sitios cuyos contenedores publicitarios ninguna lista nombra *(al cierre del día: 6 de 17 sitios)*. Pero identificó también el mecanismo: **los sitios con contenedores publicitarios propios quedan sin cubrir, porque una regla genérica no puede nombrar una clase que se inventó un desarrollador.**

Ese mecanismo **no tiene nada de mexicano**. Un desarrollador en Murcia o en La Plata puede inventarse una clase igual de bien. Si la hipótesis alternativa es cierta, la premisa que le quedaba al proyecto —*México está desatendido*— es falsa.

Era la última premisa sin falsificar. Se comprobó con el mismo instrumento, sobre regionales emparejados con el estrato mexicano donde apareció la fuga.

## Resultado

| Control | País | % del área oculto | Contenedor que sobrevive |
|---|---|---|---|
| `laopiniondemurcia.es` | España | **43%** | `.ft-layout-grid__ads-container` (4 unidades) |
| `eldia.com` (La Plata) | Argentina | **46%** | `.publi_trio_row` |
| `eldiadecordoba.es` | España | **32%** | `.board-advertising` (12 unidades) |

En el corpus mexicano, la mayoría de los sitios salieron cubiertos y una minoría con hueco *(al cierre: 6 de 17 con al menos un contenedor sin nombrar)*. **En los tres controles sobrevive al menos un contenedor propio sin cubrir — proporción de sitios afectados igual o peor que la mexicana.** *(Corrección del 31-jul-2026: esta sección comparaba porcentajes de área entre lotes con métrica distinta, cosa que el propio proyecto prohibió ese mismo día. Se reescribió en términos de conteo de sitios, que sí es comparable.)*

Y el mecanismo es idéntico, hasta en el detalle de que los contenedores llevan nombre en español: `.publi_trio_row` en La Plata es hermano de `.lapub` en Torreón y de `.banner-medio` en Saltillo. Ninguna lista los nombra, en ningún país.

## Qué queda falsificado

> **La v1.6 del plan sostenía que la asimetría de curaduría era real y mexicana: los dominios `.mx` reciben entre 1% y 3.4% de las referencias de las listas en español.**
>
> **Ese dato sigue siendo cierto. Su interpretación no.** Menos atención de curaduría no se traduce en más publicidad visible *en México específicamente*, porque los regionales de España y Argentina —que sí reciben esa atención— salen igual o peor.

Lo que existe no es una brecha mexicana. Es una **brecha de los medios pequeños**, en cualquier idioma y cualquier país, y su causa es estructural: las listas cubren bien los montajes publicitarios estándar y mal los caseros, y los medios pequeños usan montajes caseros.

Es la quinta premisa que este proyecto mata con su propia medición. Las anteriores: la cobertura de las listas en español, el foso de entrega, la ventaja de precio en B2B, y la de que el hueco estaría en el tráfico de red.

## Consecuencias

**1. El nombre y el encuadre de la lista dejan de sostenerse.** "Lista México" implica una brecha mexicana que no existe. Lo que la lista realmente hace es **cubrir sitios con maquetado publicitario propio que ninguna lista nombra** — cierto, útil y sin nada de regional.

**2. La contribución correcta es aguas arriba, no una lista aparte.** Si el problema es global, una lista mexicana separada solo le sirve a quien se suscriba, mientras que las mismas reglas en EasyList Spanish le sirven a todos y **las mantiene alguien más**. Eso último no es un detalle: es la diferencia entre una contribución que sobrevive al abandono y una que se pudre.

**3. Las dos reglas escritas siguen siendo válidas y siguen haciendo falta.** `elsiglodetorreon.com.mx` y `zocalo.com.mx` tienen publicidad visible que nadie cubre, y eso no cambió. Lo que cambió es el argumento de por qué existen, no su utilidad.

**4. Lo que el proyecto no tiene es un motivo distintivo.** No hay nada que este equipo pueda hacer por los medios mexicanos que no sea igual de necesario para los andaluces. Bajo el modelo abierto eso **no lo mata** — no hay que diferenciarse de nadie para escribir reglas útiles y publicarlas gratis. Pero sí retira el último argumento de que esto era *nuestro* hueco.

## Limitaciones, y una es de mi propio instrumento

**1. La métrica de área cambió a mitad del ejercicio y los porcentajes NO son comparables entre lotes.** El corpus mexicano se midió con área bruta; los controles, con el alto acotado al de la ventana, para no inflar contenedores de columna que miden 13,000 px. **Lo robusto es el hallazgo cualitativo** —en los tres controles sobreviven contenedores propios sin cubrir— no la comparación de porcentajes.

**2. n=3 controles.** Suficiente para falsificar "el hueco es exclusivamente mexicano", que es una afirmación universal y basta un contraejemplo. Insuficiente para afirmar que España esté *peor* que México.

**3. Confundidor de llenado publicitario.** En `lavoz.com.ar` los espacios existían pero medían 0x0: el inventario no se llenó. Un sitio sin anuncios servidos en el momento de la medición parece limpio y no lo es. No se controló la geografía aparente del navegador, que puede alterar qué inventario se sirve.

**4. Una carga por sitio, un día.**

## Cómo repetirlo

`herramientas/eje-visual/`, mismo procedimiento. El medidor tarda menos de un segundo; lo que se cuelga en sitios grandes es el recorrido de la página, que conviene partir en llamadas separadas.
