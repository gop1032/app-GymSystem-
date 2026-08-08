-- CreateEnum
CREATE TYPE "TipoEntrenador" AS ENUM ('PERSONALIZADO', 'INSTRUCTOR');

-- CreateEnum
CREATE TYPE "TipoMaquina" AS ENUM ('CARDIO', 'FUERZA', 'PESO_LIBRE', 'FUNCIONAL', 'OTRO');

-- CreateEnum
CREATE TYPE "EstadoMaquina" AS ENUM ('OPERATIVA', 'MANTENIMIENTO', 'FUERA_DE_SERVICIO');

-- AlterTable
ALTER TABLE "entrenadores" ADD COLUMN     "tipo" "TipoEntrenador" NOT NULL DEFAULT 'INSTRUCTOR';

-- CreateTable
CREATE TABLE "horarios_entrenador" (
    "id" SERIAL NOT NULL,
    "entrenadorId" INTEGER NOT NULL,
    "diaSemana" INTEGER NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFin" TEXT NOT NULL,

    CONSTRAINT "horarios_entrenador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracion_gimnasio" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "horaApertura" TEXT NOT NULL DEFAULT '06:00',
    "horaCierre" TEXT NOT NULL DEFAULT '22:00',
    "diasAtencion" TEXT NOT NULL DEFAULT 'Lunes a Domingo',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracion_gimnasio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maquinas" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoMaquina" NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "estado" "EstadoMaquina" NOT NULL DEFAULT 'OPERATIVA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "maquinas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "horarios_entrenador" ADD CONSTRAINT "horarios_entrenador_entrenadorId_fkey" FOREIGN KEY ("entrenadorId") REFERENCES "entrenadores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
