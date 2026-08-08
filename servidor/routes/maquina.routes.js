const { Router } = require("express");
const verificarAuth = require("../middlewares/auth.middleware");
const verificarRol = require("../middlewares/role.middleware");
const ctrl = require("../controllers/maquina.controller");

const router = Router();

router.use(verificarAuth);

router.get("/", ctrl.listar);
router.get("/resumen", ctrl.resumen);

// Solo Admin administra el inventario de equipamiento
router.post("/", verificarRol(["ADMIN"]), ctrl.crear);
router.put("/:id", verificarRol(["ADMIN"]), ctrl.actualizar);
router.delete("/:id", verificarRol(["ADMIN"]), ctrl.eliminar);

module.exports = router;
