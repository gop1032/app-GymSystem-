import api from "../config/axiosConfig";

const obtenerMaquinas = () => api.get("/maquinas");
const obtenerResumenMaquinas = () => api.get("/maquinas/resumen");
const crearMaquina = (maquina) => api.post("/maquinas", maquina);
const actualizarMaquina = (id, maquina) => api.put(`/maquinas/${id}`, maquina);
const eliminarMaquina = (id) => api.delete(`/maquinas/${id}`);

export { obtenerMaquinas, obtenerResumenMaquinas, crearMaquina, actualizarMaquina, eliminarMaquina };
