const prisma = require("../config/db");

// Patrón singleton: siempre se lee/edita la fila con id=1.
// Si no existe todavía (primera vez), se crea con los valores por defecto.
async function obtener(req, res) {
  const config = await prisma.configuracionGimnasio.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
  res.json(config);
}

async function actualizar(req, res) {
  const { horaApertura, horaCierre, diasAtencion } = req.body;

  const config = await prisma.configuracionGimnasio.upsert({
    where: { id: 1 },
    update: { horaApertura, horaCierre, diasAtencion },
    create: { id: 1, horaApertura, horaCierre, diasAtencion },
  });

  res.json(config);
}

module.exports = { obtener, actualizar };
