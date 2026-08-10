const prisma = require("../config/db");

async function listar(req, res) {
  const { desde, hasta } = req.query;

  const pagos = await prisma.pago.findMany({
    where:
      desde || hasta
        ? {
            fecha: {
              gte: desde ? new Date(desde) : undefined,
              lte: hasta ? new Date(hasta) : undefined,
            },
          }
        : undefined,
    include: {
      usuario: { select: { id: true, nombre: true } },
      membresia: { include: { cliente: true, plan: true } },
    },
    orderBy: { fecha: "desc" },
  });

  res.json(pagos);
}

async function crear(req, res) {
  const { membresiaId, monto, metodo } = req.body;

  if (!membresiaId || monto == null) {
    return res.status(400).json({ mensaje: "membresiaId y monto son obligatorios." });
  }

  const membresia = await prisma.membresia.findUnique({ where: { id: Number(membresiaId) } });
  if (!membresia) return res.status(404).json({ mensaje: "Membresía no encontrada." });

  const pago = await prisma.pago.create({
    data: {
      membresiaId: Number(membresiaId),
      usuarioId: req.usuario.id, // quién lo registró, tomado del JWT (no del body, por seguridad)
      monto: Number(monto),
      metodo: metodo || "EFECTIVO",
    },
    include: { membresia: { include: { cliente: true } } },
  });

  res.status(201).json(pago);
}

// Ingresos totales del mes actual (Pagos de membresías + Pases diarios), para el Dashboard
async function resumenMensual(req, res) {
  const hoy = new Date();
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const inicioHoy = new Date();
  inicioHoy.setHours(0, 0, 0, 0);
  const finHoy = new Date(inicioHoy);
  finHoy.setDate(finHoy.getDate() + 1);

  const [pagosMes, pasesMes, pagosHoy, pasesHoy] = await Promise.all([
    prisma.pago.aggregate({ where: { fecha: { gte: inicioMes } }, _sum: { monto: true }, _count: true }),
    prisma.paseDiario.aggregate({ where: { fecha: { gte: inicioMes } }, _sum: { monto: true }, _count: true }),
    prisma.pago.aggregate({ where: { fecha: { gte: inicioHoy, lt: finHoy } }, _sum: { monto: true } }),
    prisma.paseDiario.aggregate({ where: { fecha: { gte: inicioHoy, lt: finHoy } }, _sum: { monto: true } }),
  ]);

  res.json({
    ingresosMembresias: pagosMes._sum.monto || 0,
    cantidadPagosMembresias: pagosMes._count,
    ingresosPasesDiarios: pasesMes._sum.monto || 0,
    cantidadPasesDiarios: pasesMes._count,
    ingresosTotales: (pagosMes._sum.monto || 0) + (pasesMes._sum.monto || 0),
    ingresosHoy: (pagosHoy._sum.monto || 0) + (pasesHoy._sum.monto || 0),
  });
}

module.exports = { listar, crear, resumenMensual, resumenPorMetodo };

// Ingresos de hoy y del mes, desglosados por método de pago (Efectivo/Yape/Plin/...),
// combinando Pagos de membresía + Pases diarios.
async function resumenPorMetodo(req, res) {
  const hoy = new Date();
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const finMes = new Date(inicioMes);
  finMes.setMonth(finMes.getMonth() + 1);

  const inicioHoy = new Date();
  inicioHoy.setHours(0, 0, 0, 0);
  const finHoy = new Date(inicioHoy);
  finHoy.setDate(finHoy.getDate() + 1);

  async function combinarPorMetodo(desde, hasta) {
    const [pagos, pases] = await Promise.all([
      prisma.pago.groupBy({ by: ["metodo"], where: { fecha: { gte: desde, lt: hasta } }, _sum: { monto: true } }),
      prisma.paseDiario.groupBy({ by: ["metodo"], where: { fecha: { gte: desde, lt: hasta } }, _sum: { monto: true } }),
    ]);

    const combinado = {};
    for (const p of pagos) combinado[p.metodo] = (combinado[p.metodo] || 0) + (p._sum.monto || 0);
    for (const p of pases) combinado[p.metodo] = (combinado[p.metodo] || 0) + (p._sum.monto || 0);
    return combinado;
  }

  const [hoyPorMetodo, mesPorMetodo] = await Promise.all([
    combinarPorMetodo(inicioHoy, finHoy),
    combinarPorMetodo(inicioMes, finMes),
  ]);

  const totalHoy = Object.values(hoyPorMetodo).reduce((a, b) => a + b, 0);
  const totalMes = Object.values(mesPorMetodo).reduce((a, b) => a + b, 0);

  res.json({ hoyPorMetodo, mesPorMetodo, totalHoy, totalMes });
}
