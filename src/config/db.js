const { PrismaClient } = require("@prisma/client");

// Instancia única de Prisma reutilizada en todo el backend
const prisma = new PrismaClient();

module.exports = prisma;
