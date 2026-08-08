const { Router } = require("express");
const verificarAuth = require("../middlewares/auth.middleware");
const verificarRol = require("../middlewares/role.middleware");
const ctrl = require("../controllers/asistencia.controller");

const router = Router();

router.use(verificarAuth);
router.use(verificarRol(["ADMIN", "EMPLEADO"]));

router.get("/reporte/promedio", ctrl.promedio); // antes de "/" no aplica (rutas distintas), pero se declara junto por claridad
router.get("/", ctrl.listar);

module.exports = router;
