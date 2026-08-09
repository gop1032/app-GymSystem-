const { Router } = require("express");
const verificarAuth = require("../middlewares/auth.middleware");
const verificarRol = require("../middlewares/role.middleware");
const ctrl = require("../controllers/cliente.controller");

const router = Router();

router.use(verificarAuth);

// Admin y Empleado: gestión diaria de clientes
router.get("/", verificarRol(["ADMIN", "EMPLEADO"]), ctrl.listar);
router.get("/:id", verificarRol(["ADMIN", "EMPLEADO"]), ctrl.obtener);
router.post("/", verificarRol(["ADMIN", "EMPLEADO"]), ctrl.crear);
router.put("/:id", verificarRol(["ADMIN", "EMPLEADO"]), ctrl.actualizar);

// Solo Admin puede eliminar clientes
router.delete("/:id", verificarRol(["ADMIN"]), ctrl.eliminar);

// QR y control de acceso (ambos roles pueden operar la recepción)
router.get("/:id/qr", verificarRol(["ADMIN", "EMPLEADO"]), ctrl.obtenerQR);
router.post("/:id/regenerar-qr", verificarRol(["ADMIN"]), ctrl.regenerarQR);
router.post("/acceso/validar", verificarRol(["ADMIN", "EMPLEADO"]), ctrl.validarAcceso);

module.exports = router;
