#!/usr/bin/env node
// Genera los iconos PNG de la extension.
//
// Se generan por codigo y no se guardan como binarios "porque si": un PNG
// commiteado que nadie sabe reproducir es una dependencia opaca. Aqui el icono
// es el guion, y cambiarlo es editar cuatro numeros.
//
// El manifiesto de Chrome NO acepta SVG para los iconos, asi que hay que
// producir PNG de verdad. Se escribe el formato a mano —cabecera, IDAT con
// deflate, CRC32— para no arrastrar una dependencia de imagenes por 4 archivos.
//
// Uso:  node herramientas/extension/generar-iconos.mjs

import zlib from 'node:zlib';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DESTINO = path.join(HERE, '..', '..', 'extension', 'iconos');

const VERDE = [15, 123, 108];     // el cuadro, en estado normal
const GRIS = [124, 134, 130];     // el cuadro, cuando el sitio esta en Apagado
const BLANCO = [255, 255, 255];   // el monograma

// --- CRC32, que el formato PNG exige por cada trozo ---
const TABLA_CRC = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = TABLA_CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function trozo(tipo, datos) {
  const largo = Buffer.alloc(4);
  largo.writeUInt32BE(datos.length);
  const cuerpo = Buffer.concat([Buffer.from(tipo, 'ascii'), datos]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(cuerpo));
  return Buffer.concat([largo, cuerpo, crc]);
}

function png(ancho, alto, pixeles) {
  const firma = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(ancho, 0);
  ihdr.writeUInt32BE(alto, 4);
  ihdr[8] = 8;    // 8 bits por canal
  ihdr[9] = 6;    // RGBA
  ihdr[10] = 0;   // compresion deflate
  ihdr[11] = 0;   // filtrado estandar
  ihdr[12] = 0;   // sin entrelazado

  // Cada linea lleva delante un byte de filtro; 0 = sin filtro.
  const crudo = Buffer.alloc(alto * (1 + ancho * 4));
  let p = 0;
  for (let y = 0; y < alto; y++) {
    crudo[p++] = 0;
    for (let x = 0; x < ancho; x++) {
      const i = (y * ancho + x) * 4;
      crudo[p++] = pixeles[i];
      crudo[p++] = pixeles[i + 1];
      crudo[p++] = pixeles[i + 2];
      crudo[p++] = pixeles[i + 3];
    }
  }

  return Buffer.concat([
    firma,
    trozo('IHDR', ihdr),
    trozo('IDAT', zlib.deflateSync(crudo, { level: 9 })),
    trozo('IEND', Buffer.alloc(0)),
  ]);
}

// --- El dibujo: cuadro redondeado verde con el monograma MX en blanco ---
//
// Variante elegida por Edgar el 6-ago-2026 entre cuatro opciones vistas en
// tama~nos reales. El circulo con barra ("prohibido") se descarto porque es el
// simbolo generico de media tienda de bloqueadores; MX es el nombre, y ponerlo
// en el pixel identifica de un vistazo.
//
// Se muestrea 3x3 por pixel para que el borde no salga dentado. A 16x16 la
// diferencia entre eso y no hacerlo es la diferencia entre un icono y una
// mancha.
const distSeg = (px, py, ax, ay, bx, by) => {
  const dx = bx - ax, dy = by - ay;
  const l2 = dx * dx + dy * dy;
  let t = l2 ? ((px - ax) * dx + (py - ay) * dy) / l2 : 0;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(ax + t * dx - px, ay + t * dy - py);
};

// Trazos de "MX" en coordenadas de caja de glifo (0..1, y=0 arriba).
const TRAZOS_MX = [
  [0.04, 1.00, 0.04, 0.00], [0.04, 0.00, 0.27, 0.60],
  [0.27, 0.60, 0.50, 0.00], [0.50, 0.00, 0.50, 1.00],
  [0.62, 0.00, 0.97, 1.00], [0.97, 0.00, 0.62, 1.00],
];

function dibujar(lado, color) {
  const px = Buffer.alloc(lado * lado * 4);
  const c = (lado - 1) / 2;
  const half = lado * 0.47;
  const r = lado * 0.24;
  const gx0 = lado * 0.16, gx1 = lado * 0.84;
  const gy0 = lado * 0.30, gy1 = lado * 0.72;
  const grosor = lado * 0.062;
  const M = 3;

  const enForma = (fx, fy) => {
    const qx = Math.max(Math.abs(fx - c) - (half - r), 0);
    const qy = Math.max(Math.abs(fy - c) - (half - r), 0);
    return qx * qx + qy * qy <= r * r;
  };
  const enGlifo = (fx, fy) => {
    for (const [ax, ay, bx, by] of TRAZOS_MX) {
      const d = distSeg(fx, fy,
        gx0 + ax * (gx1 - gx0), gy0 + ay * (gy1 - gy0),
        gx0 + bx * (gx1 - gx0), gy0 + by * (gy1 - gy0));
      if (d <= grosor) return true;
    }
    return false;
  };

  for (let y = 0; y < lado; y++) {
    for (let x = 0; x < lado; x++) {
      let dentro = 0;
      let glifo = 0;
      for (let sy = 0; sy < M; sy++) {
        for (let sx = 0; sx < M; sx++) {
          const fx = x + (sx + 0.5) / M - 0.5;
          const fy = y + (sy + 0.5) / M - 0.5;
          if (!enForma(fx, fy)) continue;
          dentro++;
          if (enGlifo(fx, fy)) glifo++;
        }
      }
      const i = (y * lado + x) * 4;
      if (dentro === 0) { px[i + 3] = 0; continue; }

      const alfa = dentro / (M * M);
      const mezcla = glifo / dentro;
      px[i] = Math.round(color[0] * (1 - mezcla) + BLANCO[0] * mezcla);
      px[i + 1] = Math.round(color[1] * (1 - mezcla) + BLANCO[1] * mezcla);
      px[i + 2] = Math.round(color[2] * (1 - mezcla) + BLANCO[2] * mezcla);
      px[i + 3] = Math.round(alfa * 255);
    }
  }
  return px;
}

fs.mkdirSync(DESTINO, { recursive: true });
// La variante gris existe para que el modo Apagado se vea en la barra sin
// abrir el popup. Mismo dibujo a proposito: cambia el estado, no la identidad.
for (const [nombre, color] of [['icono', VERDE], ['icono-gris', GRIS]]) {
  for (const lado of [16, 32, 48, 128]) {
    const archivo = path.join(DESTINO, `${nombre}-${lado}.png`);
    fs.writeFileSync(archivo, png(lado, lado, dibujar(lado, color)));
    console.log(`   ok ${nombre}-${lado}.png`);
  }
}
console.log(`\nEscrito en ${path.relative(process.cwd(), DESTINO)}/`);

// --- Iconos del sitio filtrosmx.com (26-oct-2026) ---------------------------
//
// El sitio llevaba solo un favicon SVG en linea (data:). Los navegadores piden
// /favicon.ico igual, y las metricas de Cloudflare lo mostraban como 404 en
// cada visita. Y lo que importa mas: Google NO usa un favicon data: para el
// icono junto al resultado de busqueda; pide un archivo rastreable de lado
// multiplo de 48. Se escriben:
//   favicon.ico          16, 32 y 48 dentro (ICO con PNG embebido, valido desde Vista)
//   icono-192.png        el que se declara para buscadores y Android
//   apple-touch-icon.png 180, OPACO: iOS pinta de negro lo transparente y
//                        redondea el solo, asi que va a sangre sobre el verde
const SITIO = path.join(HERE, '..', '..', 'sitio');

function ico(lados) {
  const imagenes = lados.map((l) => png(l, l, dibujar(l, VERDE)));
  const cabecera = Buffer.alloc(6);
  cabecera.writeUInt16LE(0, 0);
  cabecera.writeUInt16LE(1, 2);            // 1 = icono
  cabecera.writeUInt16LE(lados.length, 4);
  const entradas = [];
  let desplazamiento = 6 + 16 * lados.length;
  lados.forEach((l, k) => {
    const e = Buffer.alloc(16);
    e[0] = l; e[1] = l;                    // ancho y alto (0 seria 256)
    e.writeUInt16LE(1, 4);                 // planos
    e.writeUInt16LE(32, 6);                // bits por pixel
    e.writeUInt32LE(imagenes[k].length, 8);
    e.writeUInt32LE(desplazamiento, 12);
    desplazamiento += imagenes[k].length;
    entradas.push(e);
  });
  return Buffer.concat([cabecera, ...entradas, ...imagenes]);
}

function opaco(lado) {
  const px = dibujar(lado, VERDE);
  // Lo transparente (las esquinas redondeadas) se rellena de verde.
  for (let i = 0; i < px.length; i += 4) {
    const a = px[i + 3] / 255;
    for (let k = 0; k < 3; k++) px[i + k] = Math.round(px[i + k] * a + VERDE[k] * (1 - a));
    px[i + 3] = 255;
  }
  return png(lado, lado, px);
}

fs.writeFileSync(path.join(SITIO, 'favicon.ico'), ico([16, 32, 48]));
fs.writeFileSync(path.join(SITIO, 'icono-192.png'), png(192, 192, dibujar(192, VERDE)));
fs.writeFileSync(path.join(SITIO, 'apple-touch-icon.png'), opaco(180));
console.log('Iconos del sitio en sitio/: favicon.ico, icono-192.png, apple-touch-icon.png');
