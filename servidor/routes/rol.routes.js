const { Router } = require("express");
const verificarAuth = require("../middlewares/auth.middleware");
const verificarRol = require("../middlewares/role.middleware");
const prisma = require("../config/db");

const router = Router();

router.get("/", verificarAuth, verificarRol(["ADMIN"]), async (req, res) => {
  const roles = await prisma.rol.findMany({ orderBy: { nombre: "asc" } });
  res.json(roles);
});

module.exports = router;
