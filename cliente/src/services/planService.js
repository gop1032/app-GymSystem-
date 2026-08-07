import api from "../config/axiosConfig";

const obtenerPlanes = () => api.get("/planes");
const crearPlan = (plan) => api.post("/planes", plan);
const actualizarPlan = (id, plan) => api.put(`/planes/${id}`, plan);
const eliminarPlan = (id) => api.delete(`/planes/${id}`);

export { obtenerPlanes, crearPlan, actualizarPlan, eliminarPlan };
