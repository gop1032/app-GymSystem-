import { prisma } from '../config/prisma.js'

export function listTrainers(where = {}) {
  return prisma.trainer.findMany({
    where,
    orderBy: { specialty: 'asc' },
    include: {
      user: true,
      _count: { select: { clients: true, routines: true, trainerClients: true } }
    }
  })
}

export function getTrainerById(id) {
  return prisma.trainer.findUnique({
    where: { id },
    include: {
      user: true,
      clients: true,
      routines: true,
      trainerClients: true,
      _count: { select: { clients: true, routines: true, trainerClients: true } }
    }
  })
}

export function createTrainer(data) {
  return prisma.trainer.create({ data })
}

export function updateTrainer(id, data) {
  return prisma.trainer.update({ where: { id }, data })
}
