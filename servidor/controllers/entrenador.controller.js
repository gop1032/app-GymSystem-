const prisma = require("../config/db");

async function listar(req, res) {
  const entrenadores = await prisma.entrenador.findMany({
    orderBy: { nombre: "asc" },
    include: { _count: { select: { clientes: true } } },
  });
  res.json(entrenadores);
}

async function obtener(req, res) {
  const { id } = req.params;
  const entrenador = await prisma.entrenador.findUnique({
    where: { id: Number(id) },
    include: { clientes: true }, // "registro de alumnos que tiene"
  });

  if (!entrenador) return res.status(404).json({ mensaje: "Entrenador no encontrado." });
  res.json(entrenador);
}

async function crear(req, res) {
  const { nombre, especialidad, telefono } = req.body;

  if (!nombre) return res.status(400).json({ mensaje: "El nombre es obligatorio." });

  const entrenador = await prisma.entrenador.create({
    data: { nombre, especialidad, telefono },
  });
  res.status(201).json(entrenador);
}

async function actualizar(req, res) {
  const { id } = req.params;
  const { nombre, especialidad, telefono, activo } = req.body;

  try {
    const entrenador = await prisma.entrenador.update({
      where: { id: Number(id) },
      data: { nombre, especialidad, telefono, activo },
    });
    res.json(entrenador);
  } catch (error) {
    res.status(404).json({ mensaje: "Entrenador no encontrado." });
  }
}

async function eliminar(req, res) {
  const { id } = req.params;
  try {
    // Baja lógica: se desactiva en vez de borrar, para no perder el historial
    // de clientes que tuvo asignados.
    await prisma.entrenador.update({
      where: { id: Number(id) },
      data: { activo: false },
    });
    res.json({ mensaje: "Entrenador desactivado." });
  } catch (error) {
    res.status(404).json({ mensaje: "Entrenador no encontrado." });
  }
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
