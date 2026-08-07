import api from "../config/axiosConfig";

const obtenerPasesDiarios = (fecha) => api.get("/pases-diarios", { params: fecha ? { fecha } : {} });
const registrarPaseDiario = (pase) => api.post("/pases-diarios", pase); // { nombre, dni?, monto }

export { obtenerPasesDiarios, registrarPaseDiario };
