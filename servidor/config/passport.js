const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const prisma = require("./db");

/**
 * IMPORTANTE - Regla de negocio:
 * GymSystem NO permite auto-registro. Solo Administrador y Empleado usan el sistema,
 * y sus cuentas las crea el Administrador previamente (con su correo).
 * Por eso, al loguearse con Google, buscamos al Usuario por su correo:
 *   - Si existe -> se vincula su googleId (si no lo tenía) y se le permite entrar.
 *   - Si NO existe -> se rechaza el login (no está autorizado en el sistema).
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const correo = profile.emails?.[0]?.value;

        if (!correo) {
          return done(null, false, { message: "No se pudo obtener el correo de Google" });
        }

        const usuario = await prisma.usuario.findUnique({
          where: { correo },
          include: { rol: true },
        });

        if (!usuario) {
          return done(null, false, {
            message: "Este correo no está autorizado. Contacta al administrador para que te registre.",
          });
        }

        if (!usuario.activo) {
          return done(null, false, { message: "Tu cuenta está desactivada." });
        }

        if (!usuario.googleId) {
          await prisma.usuario.update({
            where: { id: usuario.id },
            data: { googleId: profile.id },
          });
        }

        return done(null, usuario);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// No usamos sesiones persistentes de passport (usamos JWT propio),
// pero serialize/deserialize son requeridos por la librería para el flujo interno.
passport.serializeUser((usuario, done) => done(null, usuario.id));
passport.deserializeUser(async (id, done) => {
  try {
    const usuario = await prisma.usuario.findUnique({ where: { id } });
    done(null, usuario);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
