const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const rolAdmin = await prisma.rol.upsert({
    where: { nombre: "ADMIN" },
    update: {},
    create: { nombre: "ADMIN" },
  });

  await prisma.rol.upsert({
    where: { nombre: "EMPLEADO" },
    update: {},
    create: { nombre: "EMPLEADO" },
  });

  // ⚠️ Cambia este correo por el correo de Google real del administrador del gimnasio.
  // Es el único correo que podrá iniciar sesión la primera vez.
  await prisma.usuario.upsert({
    where: { correo: "admin@gmail.com" },
    update: {},
    create: {
      nombre: "Administrador Principal",
      correo: "admin@gmail.com",
      rolId: rolAdmin.id,
    },
  });

  console.log("Seed ejecutado: roles y usuario administrador creados.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
