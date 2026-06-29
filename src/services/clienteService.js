import api from "../config/connectDB";

const obtenerClientes = () => {
    return api.get("/clientes");
};

export {
    obtenerClientes,
};