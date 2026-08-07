import api from "../config/axiosConfig";

// Escaneo con cámara -> manda { qrCode }. Búsqueda manual -> manda { clienteId }.
function validarAcceso({ qrCode, clienteId }) {
  return api.post("/clientes/acceso/validar", { qrCode, clienteId });
}

function buscarClientes(texto) {
  return api.get("/clientes", { params: { buscar: texto } });
}

export { validarAcceso, buscarClientes };
