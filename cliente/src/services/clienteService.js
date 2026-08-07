import api from "../config/axiosConfig";

const obtenerClientes = (buscar) => {
  return api.get("/clientes", { params: buscar ? { buscar } : {} });
};

const obtenerQR = (id) => api.get(`/clientes/${id}/qr`);

const crearCliente = (cliente) => {
  return api.post("/clientes", cliente);
};

const eliminarCliente = (id) => {
  return api.delete(`/clientes/${id}`);
};

const actualizarCliente = (id, cliente) => {
  return api.put(`/clientes/${id}`, cliente);
};

export { obtenerClientes, crearCliente, eliminarCliente, actualizarCliente, obtenerQR };
