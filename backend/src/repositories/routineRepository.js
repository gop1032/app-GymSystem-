import { prisma } from '../config/prisma.js'

export function listRoutines(where = {}) {
  return prisma.routine.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      client: true,
      trainer: true,
      exercises: true,
      _count: { select: { exercises: true } }
    }
  })
}

export function getRoutineById(id) {
  return prisma.routine.findUnique({
    where: { id },
    include: {
      client: true,
      trainer: true,
      exercises: true,
      _count: { select: { exercises: true } }
    }
  })
}

export function createRoutine(data) {
  return prisma.routine.create({ data })
}

export function updateRoutine(id, data) {
  return prisma.routine.update({ where: { id }, data })
}

export function deleteRoutine(id) {
  return prisma.routine.delete({ where: { id } })
}
