const prisma = require("../config/db");

async function listar(req, res) {
  const planes = await prisma.plan.findMany({ orderBy: { precio: "asc" } });
  res.json(planes);
}

async function obtener(req, res) {
  const { id } = req.params;
  const plan = await prisma.plan.findUnique({ where: { id: Number(id) } });
  if (!plan) return res.status(404).json({ mensaje: "Plan no encontrado." });
  res.json(plan);
}

async function crear(req, res) {
  const { nombre, descripcion, precio, duracionDias } = req.body;

  if (!nombre || precio == null || !duracionDias) {
    return res.status(400).json({ mensaje: "nombre, precio y duracionDias son obligatorios." });
  }

  const plan = await prisma.plan.create({
    data: { nombre, descripcion, precio: Number(precio), duracionDias: Number(duracionDias) },
  });
  res.status(201).json(plan);
}

async function actualizar(req, res) {
  const { id } = req.params;
  const { nombre, descripcion, precio, duracionDias, activo } = req.body;

  try {
    const plan = await prisma.plan.update({
      where: { id: Number(id) },
      data: {
        nombre,
        descripcion,
        precio: precio != null ? Number(precio) : undefined,
        duracionDias: duracionDias != null ? Number(duracionDias) : undefined,
        activo,
      },
    });
    res.json(plan);
  } catch (error) {
    res.status(404).json({ mensaje: "Plan no encontrado." });
  }
}

async function eliminar(req, res) {
  const { id } = req.params;
  try {
    // Baja lógica: si tiene membresías asociadas no se puede borrar sin perder historial.
    const plan = await prisma.plan.update({
      where: { id: Number(id) },
      data: { activo: false },
    });
    res.json({ mensaje: "Plan desactivado.", plan });
  } catch (error) {
    res.status(404).json({ mensaje: "Plan no encontrado." });
  }
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
