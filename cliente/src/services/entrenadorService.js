import api from "../config/axiosConfig";

const obtenerEntrenadores = () => api.get("/entrenadores");
const obtenerEntrenador = (id) => api.get(`/entrenadores/${id}`);
const crearEntrenador = (entrenador) => api.post("/entrenadores", entrenador);
const actualizarEntrenador = (id, entrenador) => api.put(`/entrenadores/${id}`, entrenador);
const eliminarEntrenador = (id) => api.delete(`/entrenadores/${id}`);

// Horarios de disponibilidad del entrenador
const agregarHorario = (entrenadorId, horario) => api.post(`/entrenadores/${entrenadorId}/horarios`, horario);
const eliminarHorario = (horarioId) => api.delete(`/entrenadores/horarios/${horarioId}`);

export {
  obtenerEntrenadores,
  obtenerEntrenador,
  crearEntrenador,
  actualizarEntrenador,
  eliminarEntrenador,
  agregarHorario,
  eliminarHorario,
};
