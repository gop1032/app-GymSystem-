const { Router } = require("express");
const verificarAuth = require("../middlewares/auth.middleware");
const verificarRol = require("../middlewares/role.middleware");
const ctrl = require("../controllers/membresia.controller");

const router = Router();

router.use(verificarAuth);
router.use(verificarRol(["ADMIN", "EMPLEADO"])); // ambos roles gestionan membresías en recepción

router.get("/alertas", ctrl.alertas); // debe ir antes de "/:id" para no chocar con la ruta dinámica
router.get("/", ctrl.listar);
router.get("/:id", ctrl.obtener);
router.post("/", ctrl.crear); // crea o renueva
router.patch("/:id/cancelar", ctrl.cancelar);

module.exports = router;
