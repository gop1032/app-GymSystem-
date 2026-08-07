const prisma = require("../config/db");
const { generarToken } = require("../utils/jwt");

// Se ejecuta después de que Passport valida al usuario con Google
function googleCallback(req, res) {
  const usuario = req.user; // seteado por passport (incluye rol)
  const token = generarToken(usuario);

  // Redirige al frontend con el token como query param.
  // El frontend lo toma, lo guarda (localStorage/cookie) y hace el fetch del perfil.
  res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
}

// Devuelve los datos del usuario autenticado (a partir del JWT ya validado)
async function perfil(req, res) {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.usuario.id },
      select: {
        id: true,
        nombre: true,
        correo: true,
        activo: true,
        rol: { select: { nombre: true } },
      },
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener el perfil.", error: error.message });
  }
}

module.exports = { googleCallback, perfil };
