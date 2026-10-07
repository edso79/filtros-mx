// Pagina de bienvenida. Se abre UNA vez, en la instalacion (fondo.js,
// onInstalled con reason 'install'). Este archivo existe porque las paginas de
// extension no permiten script en linea (CSP de Manifest V3).

document.getElementById('opciones').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});
