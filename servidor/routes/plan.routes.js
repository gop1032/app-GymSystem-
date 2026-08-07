const { Router } = require("express");
const verificarAuth = require("../middlewares/auth.middleware");
const verificarRol = require("../middlewares/role.middleware");
const ctrl = require("../controllers/plan.controller");

const router = Router();

router.use(verificarAuth);

// Admin y Empleado pueden VER los planes (para asignarlos a un cliente)
router.get("/", verificarRol(["ADMIN", "EMPLEADO"]), ctrl.listar);
router.get("/:id", verificarRol(["ADMIN", "EMPLEADO"]), ctrl.obtener);

// Solo Admin puede crear/editar/eliminar planes (regla de negocio pedida)
router.post("/", verificarRol(["ADMIN"]), ctrl.crear);
router.put("/:id", verificarRol(["ADMIN"]), ctrl.actualizar);
router.delete("/:id", verificarRol(["ADMIN"]), ctrl.eliminar);

module.exports = router;
