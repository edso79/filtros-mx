#!/usr/bin/env node
// Sirve la pagina de prueba del boton "Ocultar aqui" en http://localhost:8123
// (el content script solo corre en http/https, por eso no basta abrir el
// archivo con doble clic). Ctrl+C para detenerlo.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ARCHIVO = path.join(HERE, 'pagina-prueba', 'index.html');

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  // Se lee en cada peticion a proposito: editar la pagina no debe exigir
  // reiniciar el servidor (ya paso, y la prueba corrio contra la version vieja).
  res.end(fs.readFileSync(ARCHIVO));
}).listen(8123, () => {
  console.log('Pagina de prueba en  http://localhost:8123');
  console.log('Ctrl+C para detener.');
});
