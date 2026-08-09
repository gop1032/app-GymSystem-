import api from "../config/axiosConfig";

const obtenerMembresias = (clienteId) =>
  api.get("/membresias", { params: clienteId ? { clienteId } : {} });

const obtenerAlertas = (dias = 3) => api.get("/membresias/alertas", { params: { dias } });

// data: { clienteId, planId, fechaInicio?, registrarPago?, monto?, metodo? }
const crearMembresia = (data) => api.post("/membresias", data);

const cancelarMembresia = (id) => api.patch(`/membresias/${id}/cancelar`);

const obtenerReporte = () => api.get("/membresias/reporte");

export { obtenerMembresias, obtenerAlertas, crearMembresia, cancelarMembresia, obtenerReporte };
