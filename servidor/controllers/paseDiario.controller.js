const prisma = require("../config/db");

async function listar(req, res) {
  const { fecha } = req.query; // filtro opcional por día (YYYY-MM-DD)

  let where;
  if (fecha) {
    const inicio = new Date(fecha);
    const fin = new Date(fecha);
    fin.setDate(fin.getDate() + 1);
    where = { fecha: { gte: inicio, lt: fin } };
  }

  const pases = await prisma.paseDiario.findMany({
    where,
    include: { usuario: { select: { id: true, nombre: true } } },
    orderBy: { fecha: "desc" },
  });

  res.json(pases);
}

// Registro rápido: NO crea un Cliente, solo el pago + entrada de ese día (según lo definido)
async function crear(req, res) {
  const { nombre, dni, monto } = req.body;

  if (!nombre || monto == null) {
    return res.status(400).json({ mensaje: "nombre y monto son obligatorios." });
  }

  const pase = await prisma.paseDiario.create({
    data: {
      nombre,
      dni,
      monto: Number(monto),
      usuarioId: req.usuario.id,
    },
  });

  res.status(201).json(pase);
}

module.exports = { listar, crear };
