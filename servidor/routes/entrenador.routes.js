const { Router } = require("express");
const verificarAuth = require("../middlewares/auth.middleware");
const verificarRol = require("../middlewares/role.middleware");
const ctrl = require("../controllers/entrenador.controller");

const router = Router();

router.use(verificarAuth); // todas las rutas de este módulo requieren estar logueado

// Admin y Empleado pueden ver entrenadores (para asignarlos a un cliente)
router.get("/", verificarRol(["ADMIN", "EMPLEADO"]), ctrl.listar);
router.get("/:id", verificarRol(["ADMIN", "EMPLEADO"]), ctrl.obtener);

// Solo Admin puede crear/editar/eliminar entrenadores
router.post("/", verificarRol(["ADMIN"]), ctrl.crear);
router.put("/:id", verificarRol(["ADMIN"]), ctrl.actualizar);
router.delete("/:id", verificarRol(["ADMIN"]), ctrl.eliminar);

module.exports = router;
