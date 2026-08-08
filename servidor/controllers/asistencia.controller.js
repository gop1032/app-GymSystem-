const prisma = require("../config/db");

// Lista las asistencias de un día específico (por defecto, hoy).
// GET /api/asistencias?fecha=YYYY-MM-DD
async function listar(req, res) {
  const { fecha } = req.query;

  const inicio = fecha ? new Date(fecha) : new Date();
  inicio.setHours(0, 0, 0, 0);

  const fin = new Date(inicio);
  fin.setDate(fin.getDate() + 1);

  const asistencias = await prisma.asistencia.findMany({
    where: { fechaHora: { gte: inicio, lt: fin } },
    include: { cliente: { select: { id: true, nombre: true, dni: true } } },
    orderBy: { fechaHora: "desc" },
  });

  res.json({
    fecha: inicio.toISOString().slice(0, 10),
    total: asistencias.length,
    asistencias,
  });
}

module.exports = { listar };
