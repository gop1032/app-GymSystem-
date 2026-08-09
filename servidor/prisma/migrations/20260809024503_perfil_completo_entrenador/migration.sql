/*
  Warnings:

  - A unique constraint covering the columns `[dni]` on the table `entrenadores` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "entrenadores" ADD COLUMN     "correo" TEXT,
ADD COLUMN     "direccion" TEXT,
ADD COLUMN     "dni" TEXT,
ADD COLUMN     "fotoUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "entrenadores_dni_key" ON "entrenadores"("dni");
