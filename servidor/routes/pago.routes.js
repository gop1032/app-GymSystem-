const { Router } = require("express");
const verificarAuth = require("../middlewares/auth.middleware");
const verificarRol = require("../middlewares/role.middleware");
const ctrl = require("../controllers/pago.controller");

const router = Router();

router.use(verificarAuth);
router.use(verificarRol(["ADMIN", "EMPLEADO"]));

router.get("/resumen-mensual", ctrl.resumenMensual); // antes de "/:id" no aplica aquí, pero se mantiene el orden por claridad
router.get("/", ctrl.listar);
router.post("/", ctrl.crear);

module.exports = router;
