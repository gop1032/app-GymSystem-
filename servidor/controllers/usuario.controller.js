const prisma = require("../config/db");

async function listar(req, res) {
  const usuarios = await prisma.usuario.findMany({
    include: { rol: true },
    orderBy: { nombre: "asc" },
  });
  res.json(usuarios);
}

async function crear(req, res) {
  const { nombre, correo, rolId } = req.body;

  if (!nombre || !correo || !rolId) {
    return res.status(400).json({ mensaje: "nombre, correo y rolId son obligatorios." });
  }

  try {
    // Se registra SIN googleId todavía: se vincula automáticamente
    // la primera vez que esa persona inicie sesión con Google (ver passport.js).
    const usuario = await prisma.usuario.create({
      data: { nombre, correo, rolId: Number(rolId) },
      include: { rol: true },
    });
    res.status(201).json(usuario);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ mensaje: "Ya existe un usuario con ese correo." });
    }
    res.status(500).json({ mensaje: "Error al crear el usuario.", error: error.message });
  }
}

async function actualizar(req, res) {
  const { id } = req.params;
  const { nombre, rolId, activo } = req.body;

  try {
    const usuario = await prisma.usuario.update({
      where: { id: Number(id) },
      data: {
        nombre,
        rolId: rolId ? Number(rolId) : undefined,
        activo,
      },
      include: { rol: true },
    });
    res.json(usuario);
  } catch (error) {
    res.status(404).json({ mensaje: "Usuario no encontrado." });
  }
}

// Baja lógica (nunca se borra: hay pagos/registros históricos ligados a este usuario)
async function eliminar(req, res) {
  const { id } = req.params;

  if (Number(id) === req.usuario.id) {
    return res.status(400).json({ mensaje: "No puedes desactivar tu propia cuenta." });
  }

  try {
    const usuario = await prisma.usuario.update({
      where: { id: Number(id) },
      data: { activo: false },
    });
    res.json({ mensaje: "Usuario desactivado.", usuario });
  } catch (error) {
    res.status(404).json({ mensaje: "Usuario no encontrado." });
  }
}

module.exports = { listar, crear, actualizar, eliminar };
