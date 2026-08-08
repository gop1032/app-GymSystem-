import api from "../config/axiosConfig";

const obtenerUsuarios = () => api.get("/usuarios");
const crearUsuario = (usuario) => api.post("/usuarios", usuario); // { nombre, correo, rolId }
const actualizarUsuario = (id, usuario) => api.put(`/usuarios/${id}`, usuario);
const eliminarUsuario = (id) => api.delete(`/usuarios/${id}`);
const obtenerRoles = () => api.get("/roles");

export { obtenerUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario, obtenerRoles };
