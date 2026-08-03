# Filtros MX — filtros publicitarios para sitios mexicanos

Complemento de EasyList y EasyPrivacy con reglas para sitios mexicanos. **Gratuita, abierta y sin versión de paga.**

> **0 reglas activas — porque las 6 que tenía se aceptaron en EasyList Spanish el 3-ago-2026.** Lo que esta lista cubría ahora lo cubre una lista que ya viene activada en tu bloqueador. **Hoy no necesitas instalar esta.**

## Lo primero, para no hacerte perder el tiempo

Esta lista **está vacía hoy**. No oculta nada, y no tiene sentido que la agregues.

Los 5 sitios mexicanos que cubría —`elsiglodetorreon.com.mx`, `zocalo.com.mx`, `elmanana.com.mx`, `eldiariodechihuahua.mx` y `periodicocorreo.com.mx`— quedaron cubiertos por **EasyList Spanish**, que la mayoría de los bloqueadores activa sola según el idioma del navegador. Reportamos los 5 huecos el 31-jul-2026 y el mantenedor los arregló todos el 3-ago. Detalle: [`AGUAS-ARRIBA.md`](AGUAS-ARRIBA.md).

**Eso es el éxito del proyecto, no su fracaso.** El objetivo nunca fue tener una lista grande; era que estos sitios dejaran de mostrar publicidad a quien usa un bloqueador. Se logró en el lugar donde le sirve a todo el mundo y donde **lo mantiene más gente que nosotros dos**.

Sigue publicada porque no se rompe a quien ya la tenga puesta, y porque vuelve a llenarse en cuanto se mida un hueco nuevo que aguas arriba no tome.

## Qué es

Medimos 17 sitios mexicanos el 30 de julio de 2026, ejecutando los selectores cosméticos de las cinco listas principales contra el DOM real de cada uno. Resultado: **9 quedan cubiertos, 1 no tiene publicidad, y 6 tienen al menos un contenedor que ninguna lista nombra.** De esos 6, uno resultó ser autopromoción del propio sitio y se excluyó a propósito — los otros **5 son los que esta lista cubrió, y que desde el 3-ago-2026 cubre EasyList Spanish**.

Método, datos y límites: [`MEDICION.md`](MEDICION.md).

Lo que separa a un sitio cubierto de uno que no **no es la región, es el maquetado**:

| Montaje de anuncios | Cobertura |
|---|---|
| Estándar — Google Ad Manager, Taboola, Freestar, adsbygoogle | Completa |
| Envoltorio propio o de plugin de WordPress | Poca o ninguna |

Las reglas genéricas nombran los contenedores estándar. No pueden nombrar una clase que se inventó un desarrollador. Ahí está el hueco, y es lo que esta lista atiende.

> El caso que lo resume: EasyList tenía una regla para `elsiglodetorreon.com.mx` que **coincidía con cero elementos** — quedó obsoleta cuando el sitio cambió su maquetado. Los contenedores eran `.lapub`. Lo reportamos, y el 3-ago-2026 el mantenedor reemplazó la regla muerta. **Encontrar una regla ajena que se murió resultó valer tanto como escribir una nueva.**

**No sustituye a las listas base: se usa además de ellas.**

## Qué NO afirma

- **México NO está peor cubierto que otros países, y lo medimos.** En tres regionales de España y Argentina sobreviven contenedores propios sin cubrir, igual que en los mexicanos. El hueco es de los medios pequeños en cualquier país, no de México. Detalle: [`CONTROLES.md`](CONTROLES.md).
- **No decimos que bloquee más ni mejor que ninguna otra lista.** En 9 de los 17 sitios medidos las listas existentes ya lo resuelven, y ahí esta lista no aporta nada.
- **La medición es de 17 sitios elegidos a mano.** No es una estimación poblacional: con la fuga concentrada en pocos sitios, cambiar uno mueve el resultado.
- **Que un sitio no tenga regla propia no significa que muestre anuncios.**

## Por qué existe entonces

Porque estos sitios tienen publicidad visible que ninguna lista cubre, y alguien tiene que escribir las reglas. Se trabajan sitios mexicanos porque son los que conocemos y podemos verificar — no porque estén peor.

**Y por eso mismo, lo que se pueda, se reporta aguas arriba a EasyList Spanish antes que quedarse aquí.** Si el problema es global, la regla sirve más allá donde la mantiene más gente.

## Compromisos

1. **Nada se cobra.** No hay plan de paga, no hay funciones reservadas, no habrá.
2. **Ningún anunciante puede pagar para pasar el filtro.** No existe ni existirá lista blanca pagada.
3. **No se recolecta nada.** La lista es un archivo de texto: no ejecuta código, no reporta, no sabe quién la usa.
4. **Si deja de mantenerse, se retira.** Una lista sin mantener es peor que ninguna — el usuario se cree protegido y no lo está. Qué significa eso en concreto, y cada cuándo se revisa: [MANTENIMIENTO.md](MANTENIMIENTO.md).

## Esto no es un bloqueador. Es una lista para tu bloqueador.

**Filtros MX no se instala.** No es una extensión y no hay nada que descargar.

Es un archivo de texto con reglas. Quien bloquea es tu bloqueador — **uBlock Origin**, uBlock Origin Lite o AdGuard — y esta lista le dice qué ocultar en unos sitios mexicanos que sus listas base no cubren.

Si no tienes bloqueador, primero instala uno. **uBlock Origin** es gratuito, abierto y el más recomendado.

## Cómo agregarla

> **Hoy no hace falta.** La lista tiene 0 reglas: agregarla no cambia nada. Estas instrucciones sirven para cuando vuelva a tener contenido, y para quien quiera dejarla puesta desde ya.

**En uBlock Origin** (Chrome, Firefox, Edge):

1. Clic en el icono de uBlock Origin → el engrane (**Panel de control**)
2. Pestaña **Listas de filtros**
3. Hasta abajo, **Personalizado** → marca **Importar…**
4. Pega esta URL en el recuadro:

```
https://raw.githubusercontent.com/edso79/filtros-mx/main/mexico.txt
```

5. **Aplicar cambios**

**En AdGuard:** Configuración → Bloqueador de anuncios → Filtros → Filtros personalizados → Añadir filtro, y pega la misma URL.

Funciona en cualquier bloqueador que acepte el formato de Adblock Plus.

> **Déjala junto a las que ya tienes activadas, no en lugar de ellas.** Esta lista llegó a cubrir 5 sitios; EasyList cubre decenas de miles. Sola no sirve de gran cosa — y hoy, vacía, no sirve de nada sin ellas.

## Cómo contribuir

Ver [CONTRIBUIR.md](CONTRIBUIR.md). La regla corta: **ninguna regla entra sin haberse verificado en el sitio real.**

## Aguas arriba primero

Si el hueco no es mexicano —y medimos que no lo es—, la regla rinde más en EasyList Spanish, donde le sirve a todos y **la mantiene alguien más**. Los reportes preparados y el procedimiento están en [AGUAS-ARRIBA.md](AGUAS-ARRIBA.md).

Cuando una regla se acepte allá, **se retira de aquí**: dos copias de la misma regla es trabajo duplicado, y una de las dos se queda vieja.

**Eso ya pasó, con las 6.** Es la razón de que la lista esté vacía. La regla se cumplió aunque dejara al proyecto sin contenido — que es cuando se sabe si una regla era de verdad.

## Licencia y atribución

Copyright (C) 2026 Edgar Alonso Sosa Camargo.

GPLv3 — ver [LICENSE](LICENSE). Cualquier obra derivada se comparte igual.

Las 6 reglas que tuvo eran originales: se escribieron observando sitios, no se copiaron de ninguna lista. **Esta lista no es obra derivada de EasyList ni de ninguna otra**, así que hoy no arrastra sus cláusulas — la GPLv3 es elección propia. Eso cambia en cuanto se copie o adapte una regla ajena.

Las licencias de las listas base se verificaron contra su fuente el 31-jul-2026 y una afirmación resultó falsa. Ver [ATRIBUCION.md](ATRIBUCION.md).

## Estado

| | |
|---|---|
| Reglas activas | **0** — las 6 se aceptaron aguas arriba el 3-ago-2026 |
| Reglas aportadas a EasyList Spanish | 5 incidencias, 5 aceptadas ([#357–#361](https://github.com/easylist/easylistspanish/issues)) |
| Sitios cubiertos | 5 de 17 medidos — **hoy los cubre EasyList Spanish, no esta lista** |
| Publicada | Sí, vacía. No se despublica: la estructura y el compromiso siguen |
| Licencia | GPLv3 |
| Mantenimiento | Revisión mensual — ver [MANTENIMIENTO.md](MANTENIMIENTO.md) |
