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
> **Si se saltan dos revisiones mensuales seguidas, la lista se despublica.** No se deja ahí "por si acaso": una lista sin mantener es peor que ninguna.

## Qué comprueba la revisión automática, y qué no

**Sí detecta:** que una regla haya quedado muerta porque el sitio cambió el nombre de su contenedor. Es la forma de podrirse más común y la más silenciosa.

**No detecta —y por eso hace falta la revisión trimestral con ojos:**

- Que el sitio **reutilice la clase para contenido editorial**. Si eso pasa, la regla empieza a ocultar notas y la comprobación automática lo sigue reportando como correcto. Es el daño más grave que esta lista puede causar.
- Contenedores que inyecta JavaScript, que no aparecen en el HTML servido.

**La regla que más vigilancia pide es `eldiariodechihuahua.mx##.banner`.** Se verificó elemento por elemento —los 8 contenían publicidad, ninguno era editorial— pero `.banner` es un nombre genérico y nada impide que ese sitio lo reutilice mañana.

## Registro de revisiones

| Fecha | Resultado | Quién |
|---|---|---|
| 2026-07-31 | 6 de 6 reglas vivas. Sin cambios | Revisión inicial |

Cuando una revisión encuentre algo, se anota aquí — incluso si no se arregla en el momento. **Un registro con huecos es información:** dice que la lista lleva tiempo sin mirarse, y eso es exactamente lo que un usuario merece poder ver antes de confiar en ella.
