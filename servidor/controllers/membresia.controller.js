const prisma = require("../config/db");

async function listar(req, res) {
  const { clienteId } = req.query;

  const membresias = await prisma.membresia.findMany({
    where: clienteId ? { clienteId: Number(clienteId) } : undefined,
    include: { cliente: { select: { id: true, nombre: true, dni: true } }, plan: true },
    orderBy: { fechaFin: "desc" },
  });

  res.json(membresias);
}

async function obtener(req, res) {
  const { id } = req.params;
  const membresia = await prisma.membresia.findUnique({
    where: { id: Number(id) },
    include: { cliente: true, plan: true, pagos: true },
  });

  if (!membresia) return res.status(404).json({ mensaje: "Membresía no encontrada." });
  res.json(membresia);
}

// Crear/renovar membresía. Si se manda registrarPago:true además crea el Pago asociado.
async function crear(req, res) {
  const { clienteId, planId, fechaInicio, registrarPago, monto, metodo } = req.body;

  if (!clienteId || !planId) {
    return res.status(400).json({ mensaje: "clienteId y planId son obligatorios." });
  }

  const plan = await prisma.plan.findUnique({ where: { id: Number(planId) } });
  if (!plan) return res.status(404).json({ mensaje: "Plan no encontrado." });

  const inicio = fechaInicio ? new Date(fechaInicio) : new Date();
  const fin = new Date(inicio);
  fin.setDate(fin.getDate() + plan.duracionDias);

  const membresia = await prisma.membresia.create({
    data: {
      clienteId: Number(clienteId),
      planId: Number(planId),
      fechaInicio: inicio,
      fechaFin: fin,
    },
    include: { plan: true, cliente: true },
  });

  if (registrarPago) {
    await prisma.pago.create({
      data: {
        membresiaId: membresia.id,
        usuarioId: req.usuario.id, // quién la registró (del JWT)
        monto: monto != null ? Number(monto) : plan.precio,
        metodo: metodo || "EFECTIVO",
      },
    });
  }

  res.status(201).json(membresia);
}

async function cancelar(req, res) {
  const { id } = req.params;
  try {
    const membresia = await prisma.membresia.update({
      where: { id: Number(id) },
      data: { estado: "CANCELADA" },
    });
    res.json(membresia);
  } catch (error) {
    res.status(404).json({ mensaje: "Membresía no encontrada." });
  }
}

// Para las alertas del Dashboard: vencidas y por vencer en los próximos `dias` (default 3)
async function alertas(req, res) {
  const dias = Number(req.query.dias) || 3;
  const hoy = new Date();
  const limite = new Date();
  limite.setDate(hoy.getDate() + dias);

  const [vencidas, porVencer] = await Promise.all([
    prisma.membresia.findMany({
      where: { estado: "ACTIVA", fechaFin: { lt: hoy } },
      include: { cliente: true, plan: true },
      orderBy: { fechaFin: "desc" },
    }),
    prisma.membresia.findMany({
      where: { estado: "ACTIVA", fechaFin: { gte: hoy, lte: limite } },
      include: { cliente: true, plan: true },
      orderBy: { fechaFin: "asc" },
    }),
  ]);

  res.json({ vencidas, porVencer });
}

module.exports = { listar, obtener, crear, cancelar, alertas };
