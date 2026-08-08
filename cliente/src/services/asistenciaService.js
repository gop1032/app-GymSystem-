import api from "../config/axiosConfig";

const validarAcceso = ({ qrCode, clienteId }) => api.post("/clientes/acceso/validar", { qrCode, clienteId });
const buscarClientes = (texto) => api.get("/clientes", { params: { buscar: texto } });
const obtenerAsistencias = (fecha) => api.get("/asistencias", { params: fecha ? { fecha } : {} });

export { validarAcceso, buscarClientes, obtenerAsistencias };
