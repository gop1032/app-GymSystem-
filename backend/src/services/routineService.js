import { createRoutine as createRoutineRepo, deleteRoutine as deleteRoutineRepo, getRoutineById, listRoutines, updateRoutine as updateRoutineRepo } from '../repositories/routineRepository.js'
import { prisma } from '../config/prisma.js'

function normalizeExercises(exercises) {
  if (!Array.isArray(exercises)) {
    return undefined
  }

  return exercises
    .filter((exercise) => exercise && exercise.name)
    .map((exercise) => ({
      name: String(exercise.name || '').trim(),
      sets: Number(exercise.sets || 0),
      reps: String(exercise.reps || '').trim(),
      restSeconds: Number(exercise.restSeconds || 0),
      notes: exercise.notes?.trim() || null
    }))
}

function normalizeRoutinePayload(data) {
  return {
    name: String(data.name || '').trim(),
    description: data.description?.trim() || null,
    clientId: data.clientId,
    trainerId: data.trainerId,
    exercises: normalizeExercises(data.exercises)
  }
}

function buildRoutineData(payload) {
  const { exercises, ...routineData } = payload

  if (Array.isArray(exercises) && exercises.length) {
    return {
      ...routineData,
      exercises: {
        create: exercises
      }
    }
  }

  return routineData
}

export function getRoutines(filters = {}) {
  const where = {}

  if (filters.clientId) {
    where.clientId = filters.clientId
  }

  if (filters.trainerId) {
    where.trainerId = filters.trainerId
  }

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } }
    ]
  }

  return listRoutines(where)
}

export function getRoutine(id) {
  return getRoutineById(id)
}

export function createRoutine(data) {
  const payload = normalizeRoutinePayload(data)

  if (!payload.name || !payload.clientId || !payload.trainerId) {
    const error = new Error('La rutina, el cliente y el entrenador son obligatorios')
    error.statusCode = 400
    throw error
  }

  return createRoutineRepo(buildRoutineData(payload))
}

export function updateRoutine(id, data) {
  const payload = normalizeRoutinePayload(data)

  const routineData = buildRoutineData(payload)

  if (routineData.exercises?.create) {
    return prisma.routine.update({
      where: { id },
      data: {
        ...routineData,
        exercises: {
          deleteMany: {},
          create: routineData.exercises.create
        }
      }
    })
  }

  return updateRoutineRepo(id, routineData)
}

export function deleteRoutine(id) {
  return deleteRoutineRepo(id)
}
