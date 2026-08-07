const prisma = require("../config/db");
const { generarImagenQR } = require("../services/qr.service");

// Trae la membresía más reciente de un cliente (la que manda para saber si está vigente)
function membresiaVigente(cliente) {
  if (!cliente.membresias.length) return null;
  return [...cliente.membresias].sort((a, b) => b.fechaFin - a.fechaFin)[0];
}

async function listar(req, res) {
  const { buscar } = req.query; // búsqueda manual por nombre o DNI (respaldo al QR)

  const clientes = await prisma.cliente.findMany({
    where: buscar
      ? {
          OR: [
            { nombre: { contains: buscar, mode: "insensitive" } },
            { dni: { contains: buscar } },
          ],
        }
      : undefined,
    include: {
      entrenador: { select: { id: true, nombre: true } },
      membresias: { orderBy: { fechaFin: "desc" }, take: 1, include: { plan: true } },
    },
    orderBy: { fechaRegistro: "desc" },
  });

  res.json(clientes);
}

async function obtener(req, res) {
  const { id } = req.params;
  const cliente = await prisma.cliente.findUnique({
    where: { id: Number(id) },
    include: {
      entrenador: true,
      membresias: { orderBy: { fechaFin: "desc" }, include: { plan: true } },
      asistencias: { orderBy: { fechaHora: "desc" }, take: 10 },
    },
  });

  if (!cliente) return res.status(404).json({ mensaje: "Cliente no encontrado." });
  res.json(cliente);
}

async function crear(req, res) {
  const { nombre, dni, telefono, correo, entrenadorId, planId, fechaInicio } = req.body;

  if (!nombre || !dni) {
    return res.status(400).json({ mensaje: "Nombre y DNI son obligatorios." });
  }

  try {
    const cliente = await prisma.cliente.create({
      data: {
        nombre,
        dni,
        telefono,
        correo,
        entrenadorId: entrenadorId ? Number(entrenadorId) : null,
      },
    });

    // Si se envía un plan al momento de registrar, se crea directo su primera membresía
    if (planId) {
      const plan = await prisma.plan.findUnique({ where: { id: Number(planId) } });
      if (!plan) return res.status(404).json({ mensaje: "Plan no encontrado." });

      const inicio = fechaInicio ? new Date(fechaInicio) : new Date();
      const fin = new Date(inicio);
      fin.setDate(fin.getDate() + plan.duracionDias);

      await prisma.membresia.create({
        data: {
          clienteId: cliente.id,
          planId: plan.id,
          fechaInicio: inicio,
          fechaFin: fin,
        },
      });
    }

    const clienteCompleto = await prisma.cliente.findUnique({
      where: { id: cliente.id },
      include: { membresias: { include: { plan: true } } },
    });

    res.status(201).json(clienteCompleto);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ mensaje: "Ya existe un cliente con ese DNI." });
    }
    res.status(500).json({ mensaje: "Error al crear el cliente.", error: error.message });
  }
}

async function actualizar(req, res) {
  const { id } = req.params;
  const { nombre, telefono, correo, entrenadorId } = req.body;

  try {
    const cliente = await prisma.cliente.update({
      where: { id: Number(id) },
      data: {
        nombre,
        telefono,
        correo,
        entrenadorId: entrenadorId ? Number(entrenadorId) : null,
      },
    });
    res.json(cliente);
  } catch (error) {
    res.status(404).json({ mensaje: "Cliente no encontrado." });
  }
}

async function eliminar(req, res) {
  const { id } = req.params;
  try {
    await prisma.cliente.delete({ where: { id: Number(id) } });
    res.json({ mensaje: "Cliente eliminado." });
  } catch (error) {
    // P2003: tiene registros relacionados (membresías, pagos, asistencias) -> no se puede borrar
    if (error.code === "P2003") {
      return res.status(409).json({
        mensaje: "No se puede eliminar: el cliente tiene historial (membresías/asistencias) asociado.",
      });
    }
    res.status(404).json({ mensaje: "Cliente no encontrado." });
  }
}

// Devuelve la imagen del QR del cliente (para mostrar/imprimir como carnet)
async function obtenerQR(req, res) {
  const { id } = req.params;
  const cliente = await prisma.cliente.findUnique({ where: { id: Number(id) } });

  if (!cliente) return res.status(404).json({ mensaje: "Cliente no encontrado." });

  const imagen = await generarImagenQR(cliente.qrCode);
  res.json({ qrCode: cliente.qrCode, imagen });
}

// Control de acceso: se llama al escanear el QR (o al buscar manualmente) en la entrada
async function validarAcceso(req, res) {
  const { qrCode, clienteId } = req.body; // uno de los dos: escaneo (qrCode) o búsqueda manual (clienteId)

  const cliente = await prisma.cliente.findUnique({
    where: qrCode ? { qrCode } : { id: Number(clienteId) },
    include: { membresias: { orderBy: { fechaFin: "desc" }, include: { plan: true } } },
  });

  if (!cliente) {
    return res.status(404).json({ acceso: false, mensaje: "Cliente no encontrado / QR inválido." });
  }

  const membresia = membresiaVigente(cliente);
  const hoy = new Date();

  if (!membresia || membresia.fechaFin < hoy || membresia.estado !== "ACTIVA") {
    return res.status(200).json({
      acceso: false,
      mensaje: `${cliente.nombre}: membresía vencida o inexistente. No se registra el ingreso.`,
      cliente: { id: cliente.id, nombre: cliente.nombre, dni: cliente.dni },
      membresia,
    });
  }

  const asistencia = await prisma.asistencia.create({
    data: { clienteId: cliente.id },
  });

  res.json({
    acceso: true,
    mensaje: `Bienvenido, ${cliente.nombre}. Membresía vigente hasta ${membresia.fechaFin.toLocaleDateString()}.`,
    cliente: { id: cliente.id, nombre: cliente.nombre, dni: cliente.dni },
    membresia,
    asistencia,
  });
}

module.exports = { listar, obtener, crear, actualizar, eliminar, obtenerQR, validarAcceso };
