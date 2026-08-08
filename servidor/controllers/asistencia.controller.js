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

// Promedio de asistencias por día en los últimos `dias` (por defecto 30).
// GET /api/asistencias/reporte/promedio?dias=30
async function promedio(req, res) {
  const dias = Number(req.query.dias) || 30;

  const desde = new Date();
  desde.setHours(0, 0, 0, 0);
  desde.setDate(desde.getDate() - (dias - 1));

  const asistencias = await prisma.asistencia.findMany({
    where: { fechaHora: { gte: desde } },
    select: { fechaHora: true },
  });

  // Agrupa manualmente por día (YYYY-MM-DD) para armar el detalle día por día
  const conteoPorDia = {};
  for (const a of asistencias) {
    const clave = a.fechaHora.toISOString().slice(0, 10);
    conteoPorDia[clave] = (conteoPorDia[clave] || 0) + 1;
  }

  const porDia = Object.entries(conteoPorDia)
    .map(([fecha, total]) => ({ fecha, total }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha));

  const totalAsistencias = asistencias.length;
  const promedioDiario = totalAsistencias / dias;

  res.json({
    dias,
    totalAsistencias,
    promedioDiario: Number(promedioDiario.toFixed(1)),
    diaConMasAsistencias: porDia.reduce(
      (max, d) => (d.total > (max?.total || 0) ? d : max),
      null
    ),
    porDia,
  });
}

module.exports = { listar, promedio };
