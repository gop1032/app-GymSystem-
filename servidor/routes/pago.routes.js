const { Router } = require("express");
const verificarAuth = require("../middlewares/auth.middleware");
const verificarRol = require("../middlewares/role.middleware");
const ctrl = require("../controllers/pago.controller");

const router = Router();

router.use(verificarAuth);
router.use(verificarRol(["ADMIN", "EMPLEADO"]));

router.get("/resumen-mensual", ctrl.resumenMensual);
router.get("/resumen-por-metodo", ctrl.resumenPorMetodo);
router.get("/", ctrl.listar);
router.post("/", ctrl.crear);

module.exports = router;
