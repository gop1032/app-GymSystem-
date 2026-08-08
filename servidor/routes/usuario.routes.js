const { Router } = require("express");
const verificarAuth = require("../middlewares/auth.middleware");
const verificarRol = require("../middlewares/role.middleware");
const ctrl = require("../controllers/usuario.controller");

const router = Router();

router.use(verificarAuth);
router.use(verificarRol(["ADMIN"])); // gestión de staff: exclusivo del Administrador

router.get("/", ctrl.listar);
router.post("/", ctrl.crear);
router.put("/:id", ctrl.actualizar);
router.delete("/:id", ctrl.eliminar);

module.exports = router;
