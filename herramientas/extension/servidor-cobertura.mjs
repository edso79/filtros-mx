#!/usr/bin/env node
// Sirve al navegador la cobertura cosmetica de un dominio.
//
// Es el equivalente, para la extension, de lo que herramientas/eje-visual/
// servidor.mjs hace para el medidor: permite auditar un sitio real sin tener
// que inyectar miles de selectores en cada evaluacion.
//
// Sirve desde extension/reglas/cosmeticas.json —lo que la extension consume de
// verdad— y no desde las listas crudas. Auditar contra otra cosa mediria un
// mundo distinto del que el usuario tiene instalado.
//
// Devuelve DOS listas, que responden preguntas distintas:
//   ocultar:  lo que la extension oculta (especificas del dominio)
//   cobertura: TODO lo que alguna lista cubre, genericas incluidas. Es contra
//              esto que se decide si un hueco vale la pena reportarse — si no,
//              se reporta algo que una generica ya cubria. Paso el 3-ago-2026
//              con 2 de 4 candidatos en quadratin.com.mx.
//
// Uso:  node herramientas/extension/servidor-cobertura.mjs [puerto]

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MAPA = path.join(HERE, '..', '..', 'extension', 'reglas', 'cosmeticas.json');
const PUERTO = Number(process.argv[2]) || 8732;

if (!fs.existsSync(MAPA)) {
  console.error(`No existe ${MAPA}. Correr primero: node herramientas/extension/construir.mjs`);
  process.exit(1);
}

const mapa = JSON.parse(fs.readFileSync(MAPA, 'utf8'));

function dominiosPadre(hostname) {
  const limpio = hostname.replace(/^www\./, '').toLowerCase();
  const partes = limpio.split('.');
  const salida = [limpio];
  for (let i = 1; i < partes.length - 1; i++) salida.push(partes.slice(i).join('.'));
  return salida;
}

function para(host) {
  const candidatos = dominiosPadre(host);
  const especificas = new Set();
  for (const d of candidatos) for (const s of mapa.porDominio[d] || []) especificas.add(s);
  for (const d of candidatos) for (const s of mapa.excepciones[d] || []) especificas.delete(s);

  return {
    host,
    ocultar: [...especificas],
    cobertura: [...new Set([...especificas, ...mapa.genericas])],
  };
}

http.createServer((req, res) => {
  // localhost es origen confiable para Chrome, asi que una pagina HTTPS puede
  // consumirlo sin bloqueo de contenido mixto, siempre que se permita CORS.
  res.setHeader('Access-Control-Allow-Origin', '*');
  const u = new URL(req.url, 'http://localhost');
  const d = u.searchParams.get('d');
  if (!d || !/^[a-z0-9.-]+$/i.test(d)) {
    res.writeHead(400).end('dominio invalido');
    return;
  }
  res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify(para(d)));
// Se ata a 127.0.0.1 y NO a 0.0.0.0. Sin el segundo argumento, Node escucha en
// todas las interfaces y esto queda expuesto a la red local: cualquiera en la
// misma wifi puede consultarlo. Es una herramienta de desarrollo que solo tiene
// que hablar con el navegador de esta maquina.
}).listen(PUERTO, '127.0.0.1', () => {
  console.log(`Cobertura cosmetica en http://localhost:${PUERTO}/?d=<dominio>`);
  console.log(`   ${Object.keys(mapa.porDominio).length.toLocaleString()} dominios con reglas especificas`);
  console.log(`   ${mapa.genericas.length.toLocaleString()} reglas genericas`);
});
