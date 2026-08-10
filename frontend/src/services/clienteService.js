import api from "../config/api";

const obtenerClientes = async () => {
  const res = await api.get("/clients");
  const array = res.data?.data || res.data;
  
  if (array && Array.isArray(array)) {
    res.data = array.map(client => ({
      id: client.id,
      nombre: client.name,
      dni: client.dni,
      telefono: client.phone,
      correo: client.email || "",
      estado: client.status === "ACTIVE" ? "Activo" : "Inactivo",
      plan: client.memberships && client.memberships.length > 0 ? client.memberships[0].plan : "Sin Plan"
    }));
  }
  return res;
};

const crearCliente = (cliente) => {
  const payload = {
    name: cliente.nombre,
    dni: cliente.dni,
    phone: cliente.telefono,
    email: cliente.correo || null,
    status: cliente.estado === "Activo" ? "ACTIVE" : "INACTIVE"
  };
  return api.post("/clients", payload);
};

const eliminarCliente = (id) => {
  return api.delete(`/clients/${id}`);
};

const actualizarCliente = (id, cliente) => {
  const payload = {
    name: cliente.nombre,
    dni: cliente.dni,
    phone: cliente.telefono,
    email: cliente.correo || null,
    status: cliente.estado === "Activo" ? "ACTIVE" : "INACTIVE"
  };
  return api.put(`/clients/${id}`, payload);
};

export {
  obtenerClientes,
  crearCliente,
  eliminarCliente,
  actualizarCliente,
};
