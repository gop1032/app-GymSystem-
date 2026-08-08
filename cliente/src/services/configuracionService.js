import api from "../config/axiosConfig";

const obtenerConfiguracion = () => api.get("/configuracion");
const actualizarConfiguracion = (config) => api.put("/configuracion", config);

export { obtenerConfiguracion, actualizarConfiguracion };
