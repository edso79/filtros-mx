# Lista México — filtros publicitarios para sitios mexicanos

Complemento de EasyList y EasyPrivacy con reglas para sitios mexicanos. **Gratuita, abierta y sin versión de paga.**

> **2 reglas. Cubre 2 sitios.** Es un principio, no un producto terminado.

## Qué es

Medimos 9 sitios mexicanos el 30 de julio de 2026, ejecutando los selectores cosméticos de las cinco listas principales contra el DOM real de cada uno. Resultado: **las listas existentes ocultan el 79% del área publicitaria, y el 21% que sobrevive está concentrado en 2 de los 9 sitios.**

Método, datos y límites: [`MEDICION.md`](MEDICION.md).

Lo que separa a un sitio cubierto de uno que no **no es la región, es el maquetado**:

| Montaje de anuncios | Cobertura |
|---|---|
| Estándar — Google Ad Manager, Taboola, Freestar, adsbygoogle | ~100% |
| Envoltorio propio o de plugin de WordPress | 0-22% |

Las reglas genéricas nombran los contenedores estándar. No pueden nombrar una clase que se inventó un desarrollador en Torreón. Ahí está el hueco, y es lo que esta lista atiende.

> El caso que lo resume: EasyList Spanish trae la regla `.pub`; `elsiglodetorreon.com.mx` usa `.lapub`. **Falla por dos letras**, y con ella se quedan fuera los 9 contenedores publicitarios del sitio.

**No sustituye a las listas base: se usa además de ellas.**

## Qué NO afirma

- **No decimos que bloquee más ni mejor que ninguna otra lista.** En 6 de los 9 sitios medidos las listas existentes ya lo resuelven al 100%, y ahí esta lista no aporta nada.
- **La medición es de 9 sitios elegidos a mano.** El 21% no es una estimación poblacional: con la fuga concentrada en 2 sitios, cambiar uno mueve el resultado decenas de puntos.
- **No está demostrado que el hueco sea mexicano.** No se midieron sitios de España o Argentina. La hipótesis alternativa —que los medios pequeños están peor cubiertos en todas partes— sigue viva y es plausible.
- **Que un sitio no tenga regla propia no significa que muestre anuncios.**

## Compromisos

1. **Nada se cobra.** No hay plan de paga, no hay funciones reservadas, no habrá.
2. **Ningún anunciante puede pagar para pasar el filtro.** No existe ni existirá lista blanca pagada.
3. **No se recolecta nada.** La lista es un archivo de texto: no ejecuta código, no reporta, no sabe quién la usa.
4. **Si deja de mantenerse, se retira.** Una lista sin mantener es peor que ninguna — el usuario se cree protegido y no lo está. Si esto se abandona, se despublica y se dice.

## Cómo suscribirse

*Pendiente hasta que haya una URL pública y al menos una regla verificada.*

Cuando la haya, se agrega como lista personalizada en uBlock Origin, uBlock Origin Lite o AdGuard. Funciona en cualquier bloqueador que acepte el formato de Adblock Plus.

## Cómo contribuir

Ver [CONTRIBUIR.md](CONTRIBUIR.md). La regla corta: **ninguna regla entra sin haberse verificado en el sitio real.**

## Licencia y atribución

GPLv3 — ver [LICENSE](LICENSE). Cualquier obra derivada se comparte igual.

Este trabajo se apoya en EasyList, EasyPrivacy y la lista de Peter Lowe. Ver [ATRIBUCION.md](ATRIBUCION.md); la atribución es obligación legal, no cortesía.

## Estado

| | |
|---|---|
| Reglas | 2, ambas verificadas |
| Sitios cubiertos | 2 de 9 medidos (los otros 7 ya los cubren las listas base) |
| Publicada | No |
| Licencia ratificada por el equipo | **Pendiente** |
| Mantenimiento comprometido | **Pendiente por escrito** |
