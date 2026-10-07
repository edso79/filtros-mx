# Filtros MX

**Bloqueador de anuncios para Chrome, gratuito y de código abierto, hecho en México** — y la lista de filtros para sitios mexicanos de la que nació.

- **Instalar la extensión:** [Chrome Web Store](https://chromewebstore.google.com/detail/ocpbbfpkealhfipeffcmajokbdoledgj)
- **Sitio:** [filtrosmx.com](https://filtrosmx.com) · **Contacto:** contacto@filtrosmx.com

Este repositorio tiene las dos piezas:

| Carpeta | Qué es |
|---|---|
| `extension/` | **La extensión**, Manifest V3: bloqueo de red, filtrado cosmético, el detector de anuncios que se cuelan, «Quitar un elemento» y la interfaz en español e inglés |
| `herramientas/extension/` | Cómo se construye: el compilador de listas, el empaquetador y las mediciones que se corren antes de publicar |
| `mexico.txt` y los `.md` de la raíz | **La lista** de filtros para sitios mexicanos, con su método, sus mediciones y su compromiso de mantenimiento |

## La extensión

Bloquea con **EasyList, EasyPrivacy y EasyList Spanish**, quita los anuncios de video de **YouTube** con las reglas de **uBlock Origin**, y cuando un anuncio se escapa de todas las listas **lo detecta en la página** para que lo quites con un clic o lo reportes a EasyList Spanish. **No manda nada a ningún servidor**: no tiene una sola llamada de red saliente, y eso se puede comprobar leyendo `extension/src/`.

### Compilarla desde el código

Hace falta Node.js 22 o posterior. Desde la raíz del repositorio:

```
node herramientas/extension/construir.mjs     # baja las listas y genera extension/reglas/
```

Después, en Chrome: `chrome://extensions` → **Modo de desarrollador** → **Cargar descomprimida** → la carpeta `extension/`.

```
node herramientas/extension/empaquetar.mjs    # el ZIP para la tienda, en paquetes/
```

`extension/reglas/` **no está en el repositorio a propósito**: se genera de las listas del día, y una copia guardada sería cobertura vieja.

### Antes de cada versión

```
node herramientas/extension/medir-youtube.mjs  # 12 videos: 0 con anuncio y 12 reproduciéndose, o no se publica
```

Necesita Chrome for Testing (`npx @puppeteer/browsers install chrome@stable`).

## La lista de filtros

> **0 reglas activas — porque las que tenía se aceptaron en EasyList Spanish.** Lo que esta lista cubría ahora lo cubre una lista que ya viene activada en tu bloqueador. **Hoy no necesitas agregar esta.**

### Lo primero, para no hacerte perder el tiempo

Esta lista **está vacía hoy**. No oculta nada, y no tiene sentido que la agregues.

Los sitios mexicanos que cubría quedaron cubiertos por **EasyList Spanish**, que la mayoría de los bloqueadores activa sola según el idioma del navegador. Desde julio de 2026 el proyecto ha enviado **12 reportes** allá: 9 aceptados, 2 resueltos con otro arreglo que medimos contra la página real, y 1 a medias. Detalle: [`AGUAS-ARRIBA.md`](AGUAS-ARRIBA.md).

**Eso es el éxito del proyecto, no su fracaso.** El objetivo nunca fue tener una lista grande; era que estos sitios dejaran de mostrar publicidad a quien usa un bloqueador. Se logró en el lugar donde le sirve a todo el mundo y donde **lo mantiene más gente que nosotros**.

Sigue publicada porque no se rompe a quien ya la tenga puesta, y porque vuelve a llenarse en cuanto se mida un hueco nuevo que aguas arriba no tome.

### Qué es

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

### Qué NO afirma

- **México NO está peor cubierto que otros países, y lo medimos.** En tres regionales de España y Argentina sobreviven contenedores propios sin cubrir, igual que en los mexicanos. El hueco es de los medios pequeños en cualquier país, no de México. Detalle: [`CONTROLES.md`](CONTROLES.md).
- **No decimos que bloquee más ni mejor que ninguna otra lista.** En 9 de los 17 sitios medidos las listas existentes ya lo resuelven, y ahí esta lista no aporta nada.
- **La medición es de 17 sitios elegidos a mano.** No es una estimación poblacional: con la fuga concentrada en pocos sitios, cambiar uno mueve el resultado.
- **Que un sitio no tenga regla propia no significa que muestre anuncios.**

### Por qué existe entonces

Porque estos sitios tienen publicidad visible que ninguna lista cubre, y alguien tiene que escribir las reglas. Se trabajan sitios mexicanos porque son los que conocemos y podemos verificar — no porque estén peor.

**Y por eso mismo, lo que se pueda, se reporta aguas arriba a EasyList Spanish antes que quedarse aquí.** Si el problema es global, la regla sirve más allá donde la mantiene más gente.

### Es una lista para tu bloqueador

La lista es un archivo de texto con reglas, y funciona en cualquier bloqueador que acepte el formato de Adblock Plus — **uBlock Origin**, uBlock Origin Lite, AdGuard o la propia extensión Filtros MX, que la incluye.

### Cómo agregarla

> **Hoy no hace falta.** La lista tiene 0 reglas: agregarla no cambia nada. Estas instrucciones sirven para cuando vuelva a tener contenido, y para quien quiera dejarla puesta desde ya.

**En uBlock Origin** (Chrome, Firefox, Edge):

1. Clic en el icono de uBlock Origin → el engrane (**Panel de control**)
2. Pestaña **Listas de filtros**
3. Hasta abajo, **Personalizado** → marca **Importar…**
4. Pega esta URL en el recuadro:

```
https://raw.githubusercontent.com/edso79/filtros-mx/main/mexico.txt
```

> **Esta URL no va a cambiar, y es a propósito.** El proyecto tiene dominio propio (`filtrosmx.com`) y aun así la lista se sirve desde GitHub: un dominio caduca y GitHub no. Si algún día caducara, quien lo comprara podría servirle reglas arbitrarias a todo el que la tenga suscrita — y los bloqueadores las descargan y aplican en silencio. **Desconfía de cualquier URL de esta lista que no apunte a `raw.githubusercontent.com/edso79/filtros-mx`.**

5. **Aplicar cambios**

**En AdGuard:** Configuración → Bloqueador de anuncios → Filtros → Filtros personalizados → Añadir filtro, y pega la misma URL.

Funciona en cualquier bloqueador que acepte el formato de Adblock Plus.

> **Déjala junto a las que ya tienes activadas, no en lugar de ellas.** Esta lista llegó a cubrir 5 sitios; EasyList cubre decenas de miles. Sola no sirve de gran cosa — y hoy, vacía, no sirve de nada sin ellas.

## Cómo contribuir

Ver [CONTRIBUIR.md](CONTRIBUIR.md). La regla corta: **ninguna regla entra sin haberse verificado en el sitio real.** Para un problema con la extensión: [abre una incidencia](https://github.com/edso79/filtros-mx/issues) o escribe a contacto@filtrosmx.com.

## Aguas arriba primero

Si el hueco no es mexicano —y medimos que no lo es—, la regla rinde más en EasyList Spanish, donde le sirve a todos y **la mantiene alguien más**. Los reportes preparados y el procedimiento están en [AGUAS-ARRIBA.md](AGUAS-ARRIBA.md).

Cuando una regla se acepte allá, **se retira de aquí**: dos copias de la misma regla es trabajo duplicado, y una de las dos se queda vieja.

**Eso ya pasó, con las 6.** Es la razón de que la lista esté vacía. La regla se cumplió aunque dejara al proyecto sin contenido — que es cuando se sabe si una regla era de verdad.

## Compromisos

1. **Nada se cobra.** No hay plan de paga, no hay funciones reservadas, no habrá.
2. **Ningún anunciante puede pagar para pasar el filtro.** No existe ni existirá lista blanca pagada.
3. **Cero datos de navegación fuera de tu equipo.** La lista es un archivo de texto que no ejecuta nada; la extensión analiza cada página en tu navegador y no tiene servidor al que mandar nada.
4. **Si deja de mantenerse, se retira.** Una lista sin mantener es peor que ninguna — el usuario se cree protegido y no lo está. Qué significa eso en concreto, y cada cuándo se revisa: [MANTENIMIENTO.md](MANTENIMIENTO.md).

## Licencia y atribución

Copyright (C) 2026 Edgar Alonso Sosa Camargo.

GPLv3 — ver [LICENSE](LICENSE). Cualquier obra derivada se comparte igual.

- **La lista** es original: sus reglas se escribieron observando sitios, no se copiaron de ninguna lista, así que no es obra derivada de EasyList.
- **La extensión** compila las listas de **The EasyList authors** (GPLv3 / CC BY-SA 3.0) y, para YouTube, incluye **sin modificar** el motor de scriptlets de **uBlock Origin** (Raymond Hill y colaboradores, GPLv3) en `herramientas/extension/ubo/`, con su licencia.
- **Las tipografías** del sitio son Bricolage Grotesque y Martian Mono, bajo SIL Open Font License.

Las licencias se verificaron contra su fuente. Ver [ATRIBUCION.md](ATRIBUCION.md).

## Estado

| | |
|---|---|
| Extensión | Publicada en la Chrome Web Store, en español e inglés |
| Reglas activas en la lista | **0** — las que tuvo se aceptaron aguas arriba |
| Reportes a EasyList Spanish | 12 (#357–#369): 9 aceptados, 2 resueltos con otro arreglo, 1 a medias |
| Licencia | GPLv3 |
| Mantenimiento | Revisión mensual — ver [MANTENIMIENTO.md](MANTENIMIENTO.md) |
