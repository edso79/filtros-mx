# Cómo agregar una regla

## La regla que manda

**Ninguna regla entra sin haberse verificado en el sitio real.**

Una regla inventada rompe páginas, y el usuario no sabe por qué: ve un sitio a medias y culpa al sitio, no al bloqueador. Ese daño es peor que el anuncio que se quería quitar.

## Procedimiento

**1. Abrir el sitio sin bloqueador y ver qué anuncio aparece.** No basta con suponer que un dominio sirve anuncios.

**2. Identificar la petición o el elemento.**
- Herramientas de desarrollador, pestaña Red, y localizar la petición que trae el anuncio.
- Si el anuncio es de primera parte —servido por el mismo dominio del sitio— no hay petición separada que bloquear: toca regla cosmética.

**3. Escribir la regla más específica que funcione.** Una regla amplia bloquea de más y rompe cosas que nadie pidió romper.

**4. Recargar con la regla puesta y comprobar dos cosas:**
- Que el anuncio ya no está.
- Que **el resto de la página sigue funcionando**: menús, video, inicio de sesión, formularios, carrusel de portada.

El segundo paso es el que se salta la gente y es el que causa el daño.

**5. Anotar el respaldo encima de la regla:**

```
! unotv.com — verificado 2026-08-03, banner superior de portada
||ejemplo-adserver.mx/tags^
```

Sin esa línea la regla no entra. Dentro de seis meses hay que poder saber si la regla sigue haciendo falta, y sin el sitio y la fecha no se puede.

**6. Si la regla se adaptó de otra lista, citarla.** Ver [ATRIBUCION.md](ATRIBUCION.md).

## Reglas de red y reglas cosméticas

| | Red | Cosmética |
|---|---|---|
| Formato | `\|\|dominio^` | `dominio##selector` |
| Qué hace | Impide la descarga | Oculta el elemento ya descargado |
| Ahorra datos | Sí | No |
| Sirve para publicidad de primera parte | Rara vez | Sí |

Las listas regionales existentes son **73-77% cosméticas**. Es de esperarse que aquí pase lo mismo: gran parte del trabajo será cerrar huecos visuales, no bloquear peticiones.

## Excepciones

Si una lista base rompe un sitio mexicano, la solución es una excepción (`@@||dominio^`), **con el motivo escrito**. Una excepción sin motivo es indistinguible de una lista blanca, y las listas blancas son exactamente lo que este proyecto promete no tener.

## Qué nunca entra

- Reglas que **desbloqueen anuncios a petición de alguien**. Ningún anunciante puede pagar ni pedir para pasar el filtro. Si llega esa solicitud, se responde que no y se archiva.
- Reglas generadas por IA sin que un ingeniero las haya verificado en el sitio.
- Reglas copiadas de otra lista sin cita.
- Reglas "por si acaso", sobre dominios que nadie comprobó que sirvan anuncios.

## Reportar un anuncio no bloqueado

Abrir una incidencia en https://github.com/edso79/filtros-mx/issues

Lo mínimo que hay que incluir: el sitio, la URL exacta, una captura, y qué listas tenía activas quien reporta. Sin eso no se puede reproducir, y una regla que no se puede reproducir no se escribe.
