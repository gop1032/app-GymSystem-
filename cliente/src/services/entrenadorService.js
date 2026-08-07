import api from "../config/axiosConfig";

const obtenerEntrenadores = () => api.get("/entrenadores");
const obtenerEntrenador = (id) => api.get(`/entrenadores/${id}`);
const crearEntrenador = (entrenador) => api.post("/entrenadores", entrenador);
const actualizarEntrenador = (id, entrenador) => api.put(`/entrenadores/${id}`, entrenador);
const eliminarEntrenador = (id) => api.delete(`/entrenadores/${id}`);

export {
  obtenerEntrenadores,
  obtenerEntrenador,
  crearEntrenador,
  actualizarEntrenador,
  eliminarEntrenador,
};
