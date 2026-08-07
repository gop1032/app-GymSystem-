import api from "../config/axiosConfig";

const API_BASE = api.defaults.baseURL;

// Redirige el navegador al backend, que a su vez redirige a Google.
function iniciarLoginGoogle() {
  window.location.href = `${API_BASE}/auth/google`;
}

function obtenerPerfil() {
  return api.get("/auth/perfil");
}

function cerrarSesion() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}

export { iniciarLoginGoogle, obtenerPerfil, cerrarSesion };
