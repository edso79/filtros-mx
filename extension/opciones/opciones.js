// Pagina de opciones.
//
// Muestra el informe del compilador tal cual, incluido lo que NO se pudo
// aplicar. Ensenar solo lo que si entro daria la impresion de cobertura total,
// que es exactamente el enga~no que el proyecto quiere evitar: que el usuario
// se crea protegido y no lo este.

// t(), numero() e IDIOMA vienen de ../src/i18n.js.
const $ = (id) => document.getElementById(id);
const CLAVES = ['cosmeticas', 'genericas', 'detector'];

// clase 'fuera' atenua las filas de lo NO aplicable: siguen a la vista —son
// parte de la honestidad de esta pantalla— pero no compiten visualmente con lo
// que si se esta aplicando.
function fila(etiqueta, valor, clase) {
  const tr = document.createElement('tr');
  if (clase) tr.className = clase;
  const a = document.createElement('td');
  a.textContent = etiqueta;
  const b = document.createElement('td');
  b.textContent = valor;
  tr.append(a, b);
  return tr;
}

(async () => {
  const estado = await chrome.runtime.sendMessage({ tipo: 'estado' });
  for (const k of CLAVES) {
    $(k).checked = !!estado.ajustes[k];
    $(k).addEventListener('change', async () => {
      const ajustes = Object.fromEntries(CLAVES.map((c) => [c, $(c).checked]));
      await chrome.runtime.sendMessage({ tipo: 'guardarAjustes', ajustes });
    });
  }

  // Cambiar el predeterminado cambia como se lee la tabla de sitios: se repinta.
  $('genericas').addEventListener('change', () => setTimeout(pintarSitios, 50));

  // --- Listas que se suman a la principal (1.2.0) -----------------------
  // Regionales: encendidas solas por idioma, salvo que la persona elija.
  // Opcionales: apagadas de fabrica. La eleccion explicita gana siempre, y
  // "Volver a automatico" la borra para que decida otra vez el idioma.
  async function pintarListas(grupos) {
    if (!grupos) ({ grupos } = await chrome.runtime.sendMessage({ tipo: 'grupos' }));
    const cont = $('listas');
    cont.textContent = '';
    for (const g of grupos) {
      const div = document.createElement('div');
      div.className = 'opcion';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.id = 'grupo-' + g.id;
      input.checked = g.activo;
      input.addEventListener('change', async () => {
        const r = await chrome.runtime.sendMessage({ tipo: 'fijarGrupo', id: g.id, valor: input.checked });
        pintarListas(r.grupos);
      });
      const cuerpo = document.createElement('div');
      const label = document.createElement('label');
      label.htmlFor = input.id;
      // Texto propio del proyecto (generar-locales.mjs), no de la pagina.
      const clave = 'oGrupo_' + g.id; // el empaquetador comprueba estas claves por meta.json
      label.innerHTML = t(clave) || g.fuentes.join(', ');
      if (g.tipo === 'regional') {
        const auto = document.createElement('span');
        auto.className = 'auto';
        if (g.automatico) {
          auto.textContent = '· ' + t('oAuto');
        } else {
          const btn = document.createElement('button');
          btn.className = 'enlace';
          btn.textContent = t('oVolverAuto');
          btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const r = await chrome.runtime.sendMessage({ tipo: 'fijarGrupo', id: g.id, valor: 'auto' });
            pintarListas(r.grupos);
          });
          auto.append(btn);
        }
        label.append(auto);
      }
      const p = document.createElement('p');
      // Las regionales comparten una sola explicacion; las opcionales llevan
      // la suya. Si una lista no cupo en el limite de Chrome, se dice.
      p.textContent = g.tipo === 'regional' ? t('oRegionalAyuda') : t(clave + 'Ayuda');
      if (g.activo && g.sinCupo) p.textContent += ' ' + t('oSinCupo');
      cuerpo.append(label, p);
      div.append(input, cuerpo);
      cont.append(div);
    }
  }
  await pintarListas();

  // --- Sitios con modo propio, con boton para devolverlos al predeterminado ---
  const NOMBRE_MODO = { apagado: t('modoApagado'), basico: t('modoBasico'), completo: t('modoCompleto') };
  async function pintarSitios() {
    const { apagados, reforzados, basicos } = await chrome.runtime.sendMessage({ tipo: 'listaSitios' });
    const ts = $('tablaSitios');
    ts.textContent = '';
    const filaSitio = (host, modo) => {
      const tr = document.createElement('tr');
      const a = document.createElement('td'); a.textContent = host;
      const b = document.createElement('td');
      b.textContent = NOMBRE_MODO[modo]; b.className = 'modo-txt';
      const c = document.createElement('td');
      const btn = document.createElement('button');
      btn.textContent = t('oVolver');
      btn.className = 'enlace';
      btn.addEventListener('click', async () => {
        // Un modo que no es ninguno de los tres deja el sitio sin excepcion:
        // vuelve al predeterminado, sea cual sea.
        await chrome.runtime.sendMessage({ tipo: 'fijarModo', host, modo: 'predeterminado' });
        pintarSitios();
      });
      c.append(btn);
      tr.append(a, b, c);
      return tr;
    };
    for (const h of apagados) ts.append(filaSitio(h, 'apagado'));
    for (const h of reforzados) ts.append(filaSitio(h, 'completo'));
    for (const h of basicos) ts.append(filaSitio(h, 'basico'));
    if (!apagados.length && !reforzados.length && !basicos.length) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 3;
      td.className = 'vacio';
      td.textContent = t('oSitiosVacio');
      tr.append(td);
      ts.append(tr);
    }
  }
  await pintarSitios();

  // --- Reglas locales ("Ocultar aqui"), con su deshacer -----------------
  async function pintarTuyas() {
    const { locales } = await chrome.runtime.sendMessage({ tipo: 'listaLocales' });
    const tt = $('tablaTuyas');
    tt.textContent = '';
    const entradas = Object.entries(locales || {});
    if (!entradas.length) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 3;
      td.className = 'vacio';
      td.textContent = t('oTuyasVacio');
      tr.append(td);
      tt.append(tr);
      return;
    }
    for (const [host, sels] of entradas) {
      for (const sel of sels) {
        const tr = document.createElement('tr');
        const a = document.createElement('td');
        a.textContent = host;
        const b = document.createElement('td');
        const code = document.createElement('code');
        code.textContent = sel;
        b.append(code);
        const c = document.createElement('td');
        const btn = document.createElement('button');
        btn.textContent = t('oMostrarDeNuevo');
        btn.className = 'enlace';
        btn.addEventListener('click', async () => {
          await chrome.runtime.sendMessage({ tipo: 'quitarReglaLocal', host, selector: sel });
          pintarTuyas();
        });
        c.append(btn);
        tr.append(a, b, c);
        tt.append(tr);
      }
    }
  }
  await pintarTuyas();

  $('verBienvenida').href = chrome.runtime.getURL('bienvenida/bienvenida.html');

  const meta = await chrome.runtime.sendMessage({ tipo: 'meta' });
  const tabla = $('tabla');

  tabla.append(fila(t('oFilaRed'), numero(meta.reglasRed)));
  tabla.append(fila(t('oFilaLineas'), numero(meta.lineasDeRedCompiladas)));
  tabla.append(fila(t('oFilaDominios'), numero(meta.dominiosConCosmeticas)));
  tabla.append(fila(t('oFilaSelectores'), numero(meta.selectoresCosmeticos)));
  tabla.append(fila(t('oFilaExtendidas'), numero(meta.extendidasAplicables)));
  // Los grupos encendidos, con lo que suman. Los apagados no salen: decir
  // "0" de una lista que no se esta usando parece cobertura que no hay.
  const { grupos } = await chrome.runtime.sendMessage({ tipo: 'grupos' });
  for (const g of grupos.filter((x) => x.activo)) {
    const m = (meta.grupos || []).find((x) => x.id === g.id);
    if (!m) continue;
    tabla.append(fila(t('oFilaGrupo', g.fuentes.join(', ')),
      numero(m.reglasRed) + ' · ' + numero(m.selectoresCosmeticos)));
  }
  // Los scriptlets de YouTube viven en su propio archivo: si el paquete no los
  // trae, la fila no aparece en vez de decir un cero que parece cobertura.
  try {
    const yt = await (await fetch(chrome.runtime.getURL('reglas/scriptlets.json'))).json();
    tabla.append(fila(t('oFilaYoutube', yt.uBlockOrigin), numero(yt.reglasCompiladas)));
  } catch {}

  // Lo que no entro. Va en la misma tabla, no escondido en otra pantalla.
  const d = meta.descartes;
  tabla.append(fila(t('oFilaNoExt'), numero(d.cosmeticaExtendida), 'fuera'));
  tabla.append(fila(t('oFilaNoScript'), numero(d.scriptlet), 'fuera'));
  tabla.append(fila(t('oFilaNoRegex'), numero(d.regex), 'fuera'));
  tabla.append(fila(t('oFilaNoPopup'), numero(d.popup), 'fuera'));
  tabla.append(fila(t('oFilaRecortadas'), numero(meta.recortadasPorPresupuesto), 'fuera'));
  tabla.append(fila(t('oFilaFecha'), new Date(meta.compilado).toLocaleDateString(IDIOMA), 'fuera'));
})();
