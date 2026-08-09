const prisma = require("../config/db");

async function listar(req, res) {
  const entrenadores = await prisma.entrenador.findMany({
    orderBy: { nombre: "asc" },
    include: { _count: { select: { clientes: true } }, horarios: true },
  });
  res.json(entrenadores);
}

async function obtener(req, res) {
  const { id } = req.params;
  const entrenador = await prisma.entrenador.findUnique({
    where: { id: Number(id) },
    include: {
      clientes: true, // "registro de alumnos que tiene"
      horarios: { orderBy: [{ diaSemana: "asc" }, { horaInicio: "asc" }] },
    },
  });

  if (!entrenador) return res.status(404).json({ mensaje: "Entrenador no encontrado." });
  res.json(entrenador);
}

async function crear(req, res) {
  const { nombre, tipo, dni, especialidad, direccion, telefono, correo, fotoUrl, disponibilidad } = req.body;

  if (!nombre) return res.status(400).json({ mensaje: "El nombre es obligatorio." });

  try {
    const entrenador = await prisma.entrenador.create({
      data: {
        nombre,
        tipo: tipo || "INSTRUCTOR",
        dni: dni || null,
        especialidad,
        direccion,
        telefono,
        correo,
        fotoUrl,
        disponibilidad,
      },
    });
    res.status(201).json(entrenador);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ mensaje: "Ya existe un entrenador registrado con ese DNI." });
    }
    res.status(500).json({ mensaje: "Error al crear el entrenador.", error: error.message });
  }
}

async function actualizar(req, res) {
  const { id } = req.params;
  const { nombre, tipo, dni, especialidad, direccion, telefono, correo, fotoUrl, disponibilidad, activo } = req.body;

  try {
    const entrenador = await prisma.entrenador.update({
      where: { id: Number(id) },
      data: { nombre, tipo, dni, especialidad, direccion, telefono, correo, fotoUrl, disponibilidad, activo },
    });
    res.json(entrenador);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ mensaje: "Ya existe un entrenador registrado con ese DNI." });
    }
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

// ------------ Horarios de disponibilidad ------------

async function agregarHorario(req, res) {
  const { id } = req.params; // id del entrenador
  const { diaSemana, horaInicio, horaFin } = req.body;

  if (diaSemana == null || !horaInicio || !horaFin) {
    return res.status(400).json({ mensaje: "diaSemana, horaInicio y horaFin son obligatorios." });
  }

  const horario = await prisma.horarioEntrenador.create({
    data: {
      entrenadorId: Number(id),
      diaSemana: Number(diaSemana),
      horaInicio,
      horaFin,
    },
  });
  res.status(201).json(horario);
}

async function eliminarHorario(req, res) {
  const { horarioId } = req.params;
  try {
    await prisma.horarioEntrenador.delete({ where: { id: Number(horarioId) } });
    res.json({ mensaje: "Horario eliminado." });
  } catch (error) {
    res.status(404).json({ mensaje: "Horario no encontrado." });
  }
}

module.exports = {
  listar,
  obtener,
  crear,
  actualizar,
  eliminar,
  agregarHorario,
  eliminarHorario,
};
