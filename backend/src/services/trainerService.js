import { createTrainer as createTrainerRepo, getTrainerById, listTrainers, updateTrainer as updateTrainerRepo } from '../repositories/trainerRepository.js'

function normalizeTrainerPayload(data) {
  return {
    userId: data.userId || null,
    specialty: String(data.specialty || '').trim(),
    bio: data.bio?.trim() || null,
    isActive: data.isActive === undefined ? true : data.isActive === true || data.isActive === 'true'
  }
}

export function getTrainers(filters = {}) {
  const where = {}

  if (filters.isActive !== undefined) {
    where.isActive = String(filters.isActive) === 'false' ? false : Boolean(filters.isActive)
  }

  if (filters.search) {
    where.OR = [
      { specialty: { contains: filters.search, mode: 'insensitive' } },
      { bio: { contains: filters.search, mode: 'insensitive' } }
    ]
  }

  return listTrainers(where)
}

export function getTrainer(id) {
  return getTrainerById(id)
}

export function createTrainer(data) {
  const payload = normalizeTrainerPayload(data)

  if (!payload.specialty) {
    const error = new Error('La especialidad es obligatoria')
    error.statusCode = 400
    throw error
  }

  return createTrainerRepo(payload)
}

export function updateTrainer(id, data) {
  return updateTrainerRepo(id, normalizeTrainerPayload(data))
}

export async function deactivateTrainer(id) {
  return updateTrainerRepo(id, { isActive: false })
}
