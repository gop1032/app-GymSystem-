const { Router } = require("express");
const verificarAuth = require("../middlewares/auth.middleware");
const verificarRol = require("../middlewares/role.middleware");
const ctrl = require("../controllers/configuracion.controller");

const router = Router();

router.use(verificarAuth);

// Cualquiera logueado puede VER el horario (se muestra en varias pantallas)
router.get("/", ctrl.obtener);

// Solo Admin puede cambiar el horario de atención del gimnasio
router.put("/", verificarRol(["ADMIN"]), ctrl.actualizar);

module.exports = router;
