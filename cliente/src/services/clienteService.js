import api from "../config/axiosConfig";

const obtenerClientes = () => {
  return api.get("/clientes");
};

const crearCliente = (cliente) => {
  return api.post("/clientes", cliente);
};

const eliminarCliente = (id) => {
  return api.delete(`/clientes/${id}`);
};

const actualizarCliente = (id, cliente) => {
  return api.put(`/clientes/${id}`, cliente);
};

export { obtenerClientes, crearCliente, eliminarCliente, actualizarCliente };
