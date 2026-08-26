# Mantenimiento

Esta lista promete algo incómodo en su README: **si deja de mantenerse, se retira.** Este archivo dice qué significa eso en concreto, para que se pueda comprobar en vez de creer.

## Por qué hace falta escribirlo

Una regla cosmética **no avisa cuando se muere**. El sitio cambia el nombre de su contenedor, la regla deja de coincidir con nada, y el usuario sigue viendo el anuncio creyendo que está protegido.

No es hipotético. EasyList —un proyecto con equipo, proceso y quince años de rodaje— tiene una regla para `elsiglodetorreon.com.mx` que hoy **coincide con cero elementos**. Se murió cuando el sitio se rehizo, y nadie lo había notado. Una lista mantenida por una persona no va a ser más afortunada; solo puede ser más honesta sobre ello.

## El compromiso

No está expresado en horas al mes, porque nadie puede estimar eso de verdad. Está expresado en **una acción concreta con una periodicidad concreta**:

> **Una revisión al mes.** Se comprueba que cada regla siga coincidiendo con algo en su sitio. Está automatizado: es un comando y tarda menos de un minuto.
>
> **Una revisión con ojos cada tres meses.** Abrir los sitios y confirmar que las reglas siguen ocultando publicidad y no contenido. Esto no se puede automatizar.
>
> **Si se dejan de hacer, la respuesta es graduada** (acordado el 10-ago-2026, contando desde la última revisión anotada abajo):
>
> - **A los 60 días:** aviso de abandono al inicio de este repositorio y en la ficha de la Chrome Web Store — *"sin mantenimiento desde [fecha]"*.
> - **A los 90 días:** se despublica la lista y se retira la extensión.

**Por qué el aviso va antes que el retiro.** Lo que este compromiso protege es que **nadie se crea protegido cuando no lo está**. Decirlo a los 60 días cumple eso de inmediato y es reversible en un minuto; retirar a los 60 castigaría una ausencia temporal —una enfermedad, un cambio de trabajo— con un daño total e irreversible para quien ya la tenía instalada. El detalle y las razones, en `documentos/acuerdo-mantenimiento-2026-08-10.md`, que es el documento que manda si alguna vez discrepan.

## Qué comprueba la revisión automática, y qué no

**Sí detecta:** que una regla haya quedado muerta porque el sitio cambió el nombre de su contenedor. Es la forma de podrirse más común y la más silenciosa.

**No detecta —y por eso hace falta la revisión trimestral con ojos:**

- Que el sitio **reutilice la clase para contenido editorial**. Si eso pasa, la regla empieza a ocultar notas y la comprobación automática lo sigue reportando como correcto. Es el daño más grave que esta lista puede causar.
- Contenedores que inyecta JavaScript, que no aparecen en el HTML servido.

*(Aquí decía que la regla más delicada era `eldiariodechihuahua.mx##.banner`, por ser `.banner` un nombre genérico. Se retiró el 3-ago-2026 al aceptarse aguas arriba — y **el riesgo no desapareció, cambió de dueño**: ahora `.banner` sobre ese dominio lo mantiene EasyList Spanish. Si alguna vez ese sitio reutiliza la clase para contenido editorial, se reporta allá.)*

## Qué se revisa cuando la lista está vacía

Desde el 3-ago-2026 la lista tiene **0 reglas activas**: las 6 se aceptaron aguas arriba. Una lista vacía no puede pudrirse por reglas muertas, así que la revisión mensual cambia de objeto — **no se suspende**:

1. **¿Siguen cubiertos los 9 sitios aguas arriba?** Si EasyList Spanish borra o rompe alguna de las reglas que aportamos, el hueco vuelve y esta lista vuelve a tener trabajo. Es lo que sustituye a "¿siguen vivas mis reglas?".
2. **¿Apareció un hueco nuevo?** El corpus de 17 sitios sigue ahí para volver a medirlo.
3. **La revisión trimestral con ojos sigue igual**, aplicada a los 9 sitios: confirmar que las reglas de aguas arriba ocultan publicidad y no contenido.

**El compromiso sigue vigente y se mide igual:** aviso a los 60 días sin revisión, retiro a los 90 (ver arriba). Estar vacía no es excusa para dejar de mirar — es cuando más fácil sería olvidarla.

## La fecha única: 10 de agosto

Es el único día del año con obligaciones fijas: se revisa el acuerdo de mantenimiento, se confirma que el dominio `filtrosmx.com` se renovó, y que la tarjeta asociada en Cloudflare sigue vigente. Con la renovación automática activada, lo que puede matar el dominio ya no es el olvido sino una tarjeta caducada.

## Registro de revisiones

| Fecha | Resultado | Quién |
|---|---|---|
| 2026-07-31 | 6 de 6 reglas vivas. Sin cambios | Revisión inicial |
| 2026-08-03 | **Las 5 incidencias aguas arriba se aceptaron. Las 6 reglas se retiran; la lista queda en 0.** Verificado contra la lista publicada (`202608031801`) y contra el DOM de `periodicocorreo.com.mx` y `eldiariodechihuahua.mx`: ninguna de las 6 aporta ya nada medible | Revisión por evento (cierre de #357–#361) |
| 2026-08-10 | **Los 5 sitios de julio siguen cubiertos.** Cerraron #362 y #363, las dos con arreglos distintos a lo propuesto: `tribuna.com.mx` **cubierto** (verificado en 3 plantillas), `quadratin.com.mx` **cubierto a medias** — sobreviven `.banner--faro` y `#custom_html-2` con anuncio servido, 256,000 px², pendiente de segunda observación. Enviada #364 (`elmanana.com`). Verificado contra la lista publicada `202608101702` | Revisión por evento (cierre de #362–#363) |
| 2026-08-21 | **Los 5 sitios siguen cubiertos**, verificado contra la lista publicada `202608211543`. **#364 y #365 siguen ABIERTAS sin respuesta del mantenedor** —comprobado también contra la lista, donde no aparece ni `elmanana.com` ni `imagendelgolfo`— y el **residuo de #363 sigue sin atender** (las reglas por medidas de agosto siguen siendo las únicas de `quadratin`). Contraste anotado: los 5 de julio cerraron en 3 días; #364 lleva 11 abierta. Un lote no es tendencia, y esto tampoco lo es | Revisión mensual, automatizada |
| 2026-08-24 | **#364 y #365 ACEPTADAS y VERIFICADAS**, lista publicada `202608241622` (commits `a6bfa0b` y `fa4fc86`). Comprobadas contra la lista **y contra el DOM** con bloqueo real y Reforzado: `elmanana.com` **0/24 contenedores visibles** (había 23 y 1,095,977 px²) e `imagendelgolfo.mx` **0 visibles en portada y en dos notas** (había 1,746,600 px² en portada). El mantenedor amplió las dos reglas por su cuenta: `class*=` en vez de `class^=`, y `.bannersaas` a tres dominios. **Del residuo de #363 tomó `.banner--faro`** (ahora 0×0) y dejó `#custom_html-2`, que encogió a 350×96 sin anuncio servido: **se decide no insistir**, queda por debajo del estándar propio. **Y esta revisión pasó a vigilar 9 sitios en vez de 5** — los 4 de #362–#365 no los miraba nadie. **La misma tarde se envió [#366](https://github.com/easylist/easylistspanish/issues/366)** (`diariodemorelos.com`, `.c-banner`, 818,793 px² repetidos al píxel el 21 y el 24-ago), así que el proyecto vuelve a tener un reporte abierto | Revisión por evento (cierre de #364–#365) |
| 2026-08-26 | **#366 ACEPTADA y VERIFICADA en dos días**, lista publicada `202608261503` (commit `8f1e5fc`), sin un solo comentario en la incidencia. Comprobada contra la lista **y contra el DOM** con bloqueo real y Reforzado: `diariodemorelos.com` da **0/7 contenedores visibles en portada y 0/8 en cada una de las dos notas**, donde había 818,793 y 864,391 px². El contador de ocultos lo confirma por la otra punta: **de 7 a 14 en portada y de 8 a 16 en las notas**, exactamente el número de `.c-banner` de cada página. El mantenedor volvió a ampliarla por su cuenta, a **multi-dominio de 9 dominios**. **La trampa aguantó:** `.c-publications` —las portadas del propio periódico— sigue visible, que era el riesgo real del reporte. **Esta revisión pasa a vigilar 10 sitios**, añadido el mismo día de la aceptación. Con #366 dentro, **el proyecto se queda otra vez sin reportes abiertos**: 10 enviados, 10 resueltos | Revisión por evento (cierre de #366) |

Cuando una revisión encuentre algo, se anota aquí — incluso si no se arregla en el momento. **Un registro con huecos es información:** dice que la lista lleva tiempo sin mirarse, y eso es exactamente lo que un usuario merece poder ver antes de confiar en ella.
