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

  const [pagos, pasesDiarios] = await Promise.all([
    prisma.pago.aggregate({
      where: { fecha: { gte: inicioMes } },
      _sum: { monto: true },
      _count: true,
    }),
    prisma.paseDiario.aggregate({
      where: { fecha: { gte: inicioMes } },
      _sum: { monto: true },
      _count: true,
    }),
  ]);

  res.json({
    ingresosMembresias: pagos._sum.monto || 0,
    cantidadPagosMembresias: pagos._count,
    ingresosPasesDiarios: pasesDiarios._sum.monto || 0,
    cantidadPasesDiarios: pasesDiarios._count,
    ingresosTotales: (pagos._sum.monto || 0) + (pasesDiarios._sum.monto || 0),
  });
}

module.exports = { listar, crear, resumenMensual };
