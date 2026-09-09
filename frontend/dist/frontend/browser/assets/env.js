(function (window) {
  window.__env = window.__env || {};
  // URL dinámica del backend para despliegue en producción.
  // Si está vacío "", se usan rutas relativas o el proxy inverso de Nginx.
  // Si se define un dominio (ej. "https://api.mipena.com"), la aplicación consumirá ese backend.
  window.__env.apiUrl = "";
})(this);
