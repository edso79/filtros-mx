# Lista México — filtros publicitarios para sitios mexicanos

Complemento de EasyList y EasyPrivacy con reglas para sitios mexicanos. **Gratuita, abierta y sin versión de paga.**

> **4 reglas. Cubre 4 sitios de 14 medidos.** Es un principio, no un producto terminado.

## Qué es

Medimos 14 sitios mexicanos el 30 de julio de 2026, ejecutando los selectores cosméticos de las cinco listas principales contra el DOM real de cada uno. Resultado: **8 quedan cubiertos al 100%, y 5 tienen al menos un contenedor publicitario que ninguna lista nombra.**

Método, datos y límites: [`MEDICION.md`](MEDICION.md).

Lo que separa a un sitio cubierto de uno que no **no es la región, es el maquetado**:

| Montaje de anuncios | Cobertura |
|---|---|
| Estándar — Google Ad Manager, Taboola, Freestar, adsbygoogle | ~100% |
| Envoltorio propio o de plugin de WordPress | 0-22% |

Las reglas genéricas nombran los contenedores estándar. No pueden nombrar una clase que se inventó un desarrollador. Ahí está el hueco, y es lo que esta lista atiende.

> El caso que lo resume: EasyList Spanish trae la regla `.pub`; `elsiglodetorreon.com.mx` usa `.lapub`. **Falla por dos letras**, y con ella se quedan fuera los 9 contenedores publicitarios del sitio.

**No sustituye a las listas base: se usa además de ellas.**

## Qué NO afirma

- **México NO está peor cubierto que otros países, y lo medimos.** Tres regionales de España y Argentina salieron entre 32% y 46% de cobertura, *peor* que el promedio mexicano de 79%. El hueco es de los medios pequeños en cualquier país, no de México. Detalle: [`CONTROLES.md`](CONTROLES.md).
- **No decimos que bloquee más ni mejor que ninguna otra lista.** En 8 de los 14 sitios medidos las listas existentes ya lo resuelven al 100%, y ahí esta lista no aporta nada.
- **La medición es de 14 sitios elegidos a mano.** No es una estimación poblacional: con la fuga concentrada en pocos sitios, cambiar uno mueve el resultado.
- **Que un sitio no tenga regla propia no significa que muestre anuncios.**

## Por qué existe entonces

Porque estos sitios tienen publicidad visible que ninguna lista cubre, y alguien tiene que escribir las reglas. Se trabajan sitios mexicanos porque son los que conocemos y podemos verificar — no porque estén peor.

**Y por eso mismo, lo que se pueda, se reporta aguas arriba a EasyList Spanish antes que quedarse aquí.** Si el problema es global, la regla sirve más allá donde la mantiene más gente.

## Compromisos

1. **Nada se cobra.** No hay plan de paga, no hay funciones reservadas, no habrá.
2. **Ningún anunciante puede pagar para pasar el filtro.** No existe ni existirá lista blanca pagada.
3. **No se recolecta nada.** La lista es un archivo de texto: no ejecuta código, no reporta, no sabe quién la usa.
4. **Si deja de mantenerse, se retira.** Una lista sin mantener es peor que ninguna — el usuario se cree protegido y no lo está. Si esto se abandona, se despublica y se dice.

## Cómo suscribirse

*Pendiente: falta la URL pública.*

Cuando la haya, se agrega como lista personalizada en uBlock Origin, uBlock Origin Lite o AdGuard. Funciona en cualquier bloqueador que acepte el formato de Adblock Plus.

## Cómo contribuir

Ver [CONTRIBUIR.md](CONTRIBUIR.md). La regla corta: **ninguna regla entra sin haberse verificado en el sitio real.**

## Aguas arriba primero

Si el hueco no es mexicano —y medimos que no lo es—, la regla rinde más en EasyList Spanish, donde le sirve a todos y **la mantiene alguien más**. Los reportes preparados y el procedimiento están en [AGUAS-ARRIBA.md](AGUAS-ARRIBA.md).

Cuando una regla se acepte allá, **se retira de aquí**: dos copias de la misma regla es trabajo duplicado, y una de las dos se queda vieja.

## Licencia y atribución

GPLv3 — ver [LICENSE](LICENSE). Cualquier obra derivada se comparte igual.

Este trabajo se apoya en EasyList, EasyPrivacy y la lista de Peter Lowe. Ver [ATRIBUCION.md](ATRIBUCION.md); la atribución es obligación legal, no cortesía.

## Estado

| | |
|---|---|
| Reglas | 4, todas verificadas |
| Sitios cubiertos | 4 de 14 medidos (8 los cubren ya las listas base) |
| Publicada | No |
| Licencia ratificada por el equipo | **Pendiente** |
| Mantenimiento comprometido | **Pendiente por escrito** |
