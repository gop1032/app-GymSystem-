const prisma = require("../config/db");

// Lista quién asistió un día específico (socios con QR + visitantes de pase diario)
// y cuánto pagó cada uno ese día. GET /api/asistencias?fecha=YYYY-MM-DD
async function listar(req, res) {
  const { fecha } = req.query;

  const inicio = fecha ? new Date(fecha) : new Date();
  inicio.setHours(0, 0, 0, 0);

  const fin = new Date(inicio);
  fin.setDate(fin.getDate() + 1);

  const [asistencias, pagosDelDia, pasesDiarios] = await Promise.all([
    prisma.asistencia.findMany({
      where: { fechaHora: { gte: inicio, lt: fin } },
      include: { cliente: { select: { id: true, nombre: true, dni: true } } },
    }),
    // Pagos de membresía registrados ese mismo día (ej: alguien que vino a renovar y entró)
    prisma.pago.findMany({
      where: { fecha: { gte: inicio, lt: fin } },
      include: { membresia: { select: { clienteId: true } } },
    }),
    prisma.paseDiario.findMany({ where: { fecha: { gte: inicio, lt: fin } } }),
  ]);

  const pagosPorCliente = {};
  for (const p of pagosDelDia) {
    const clienteId = p.membresia.clienteId;
    pagosPorCliente[clienteId] = (pagosPorCliente[clienteId] || 0) + p.monto;
  }

  const registros = [
    ...asistencias.map((a) => ({
      tipo: "socio",
      clienteId: a.cliente.id,
      nombre: a.cliente.nombre,
      dni: a.cliente.dni,
      hora: a.fechaHora,
      // Monto que pagó ESE día (si coincidió con una renovación); 0 si solo vino a entrenar.
      monto: pagosPorCliente[a.cliente.id] || 0,
    })),
    ...pasesDiarios.map((p) => ({
      tipo: "pase_diario",
      clienteId: null,
      nombre: p.nombre,
      dni: p.dni || "—",
      hora: p.fecha,
      monto: p.monto,
    })),
  ].sort((a, b) => new Date(b.hora) - new Date(a.hora));

  const ingresosDia = registros.reduce((acc, r) => acc + r.monto, 0);

  res.json({
    fecha: inicio.toISOString().slice(0, 10),
    totalVisitantes: registros.length,
    ingresosDia,
    registros,
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

module.exports = { listar, promedio, estadisticas };

// Estadísticas completas para la pantalla de Reportes: promedio, máximo, mínimo
// por día, y las horas de mayor/menor afluencia dentro del horario de atención.
async function estadisticas(req, res) {
  const dias = Number(req.query.dias) || 30;

  const desde = new Date();
  desde.setHours(0, 0, 0, 0);
  desde.setDate(desde.getDate() - (dias - 1));

  const [asistencias, config] = await Promise.all([
    prisma.asistencia.findMany({ where: { fechaHora: { gte: desde } }, select: { fechaHora: true } }),
    prisma.configuracionGimnasio.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } }),
  ]);

  // Conteo por día (incluye días en 0 para que el promedio sea real, no solo de días con actividad)
  const conteoPorDia = {};
  for (let i = 0; i < dias; i++) {
    const d = new Date(desde);
    d.setDate(d.getDate() + i);
    conteoPorDia[d.toISOString().slice(0, 10)] = 0;
  }
  for (const a of asistencias) {
    const clave = a.fechaHora.toISOString().slice(0, 10);
    if (clave in conteoPorDia) conteoPorDia[clave]++;
  }

  const totalesPorDia = Object.values(conteoPorDia);
  const totalAsistencias = totalesPorDia.reduce((a, b) => a + b, 0);
  const promedioDiario = Number((totalAsistencias / dias).toFixed(1));
  const maximo = totalesPorDia.length ? Math.max(...totalesPorDia) : 0;
  const minimo = totalesPorDia.length ? Math.min(...totalesPorDia) : 0;

  // Bloques de 2 horas dentro del horario de atención, para hallar hora pico / valle
  const horaApertura = Number(config.horaApertura.split(":")[0]);
  const horaCierre = Number(config.horaCierre.split(":")[0]);

  const bloques = {};
  for (let h = horaApertura; h < horaCierre; h += 2) bloques[h] = 0;

  for (const a of asistencias) {
    const hora = a.fechaHora.getHours();
    const bloqueInicio = Math.floor((hora - horaApertura) / 2) * 2 + horaApertura;
    if (bloqueInicio in bloques) bloques[bloqueInicio]++;
  }

  const fmt = (h) => `${String(h).padStart(2, "0")}:00`;
  const entradas = Object.entries(bloques);

  let horaPico = null;
  let horaMenosConcurrida = null;

  if (entradas.length) {
    const pico = entradas.reduce((max, e) => (e[1] > max[1] ? e : max));
    const valle = entradas.reduce((min, e) => (e[1] < min[1] ? e : min));
    horaPico = { inicio: fmt(Number(pico[0])), fin: fmt(Number(pico[0]) + 2), total: pico[1] };
    horaMenosConcurrida = { inicio: fmt(Number(valle[0])), fin: fmt(Number(valle[0]) + 2), total: valle[1] };
  }

  res.json({ dias, promedioDiario, maximo, minimo, horaPico, horaMenosConcurrida });
}
