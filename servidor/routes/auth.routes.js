const { Router } = require("express");
const passport = require("passport");
const verificarAuth = require("../middlewares/auth.middleware");
const { googleCallback, perfil } = require("../controllers/auth.controller");

const router = Router();

// Paso 1: el frontend redirige aquí para iniciar el flujo de Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

// Paso 2: Google redirige aquí después de que el usuario acepta
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=no_autorizado`,
  }),
  googleCallback
);

// Ruta protegida: devuelve el usuario autenticado (usada por el frontend al cargar la app)
router.get("/perfil", verificarAuth, perfil);

module.exports = router;
