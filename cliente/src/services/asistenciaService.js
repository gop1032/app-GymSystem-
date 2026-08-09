import api from "../config/axiosConfig";

const validarAcceso = ({ qrCode, clienteId }) => api.post("/clientes/acceso/validar", { qrCode, clienteId });
const buscarClientes = (texto) => api.get("/clientes", { params: { buscar: texto } });
const obtenerAsistencias = (fecha) => api.get("/asistencias", { params: fecha ? { fecha } : {} });
const obtenerPromedioAsistencias = (dias = 30) => api.get("/asistencias/reporte/promedio", { params: { dias } });

const obtenerEstadisticas = (dias = 30) => api.get("/asistencias/reporte/estadisticas", { params: { dias } });

export { validarAcceso, buscarClientes, obtenerAsistencias, obtenerPromedioAsistencias, obtenerEstadisticas };
