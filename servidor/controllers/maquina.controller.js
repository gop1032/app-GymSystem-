const prisma = require("../config/db");

async function listar(req, res) {
  const maquinas = await prisma.maquina.findMany({ orderBy: { nombre: "asc" } });
  res.json(maquinas);
}

async function crear(req, res) {
  const { nombre, tipo, cantidad, estado, imagenUrl } = req.body;

  if (!nombre || !tipo) {
    return res.status(400).json({ mensaje: "nombre y tipo son obligatorios." });
  }

  const maquina = await prisma.maquina.create({
    data: { nombre, tipo, cantidad: cantidad ? Number(cantidad) : 1, estado, imagenUrl },
  });
  res.status(201).json(maquina);
}

async function actualizar(req, res) {
  const { id } = req.params;
  const { nombre, tipo, cantidad, estado, imagenUrl } = req.body;

  try {
    const maquina = await prisma.maquina.update({
      where: { id: Number(id) },
      data: {
        nombre,
        tipo,
        cantidad: cantidad != null ? Number(cantidad) : undefined,
        estado,
        imagenUrl,
      },
    });
    res.json(maquina);
  } catch (error) {
    res.status(404).json({ mensaje: "Máquina no encontrada." });
  }
}

async function eliminar(req, res) {
  const { id } = req.params;
  try {
    await prisma.maquina.delete({ where: { id: Number(id) } });
    res.json({ mensaje: "Máquina eliminada." });
  } catch (error) {
    res.status(404).json({ mensaje: "Máquina no encontrada." });
  }
}

// Resumen para el Dashboard: total de máquinas y desglose por tipo
async function resumen(req, res) {
  const maquinas = await prisma.maquina.findMany();
  const totalUnidades = maquinas.reduce((acc, m) => acc + m.cantidad, 0);

  const porTipo = maquinas.reduce((acc, m) => {
    acc[m.tipo] = (acc[m.tipo] || 0) + m.cantidad;
    return acc;
  }, {});

  res.json({ totalModelos: maquinas.length, totalUnidades, porTipo });
}

module.exports = { listar, crear, actualizar, eliminar, resumen };
