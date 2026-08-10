import api from "../config/axiosConfig";

const obtenerPagos = (filtros = {}) => api.get("/pagos", { params: filtros });
const registrarPago = (pago) => api.post("/pagos", pago); // { membresiaId, monto, metodo }
const obtenerResumenMensual = () => api.get("/pagos/resumen-mensual");

const obtenerResumenPorMetodo = () => api.get("/pagos/resumen-por-metodo");

export { obtenerPagos, registrarPago, obtenerResumenMensual, obtenerResumenPorMetodo };
