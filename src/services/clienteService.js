import api from "../config/connectDB";

const obtenerClientes = () => {
    return api.get("/clientes");
};

const crearCliente = (cliente) => {
    return api.post("/clientes", cliente);
};

export {
    obtenerClientes,
    crearCliente,
};