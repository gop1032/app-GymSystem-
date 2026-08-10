import { validationResult } from 'express-validator'
import { errorResponse, successResponse } from '../utils/response.js'
import { createTrainer, deactivateTrainer, getTrainer, getTrainers, updateTrainer } from '../services/trainerService.js'

function handleValidation(req, res) {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    return errorResponse(res, 'Validación fallida', 422, result.array())
  }
  return null
}

export async function listTrainersController(req, res, next) {
  try {
    const trainers = await getTrainers(req.query)
    return successResponse(res, trainers, 'Entrenadores obtenidos')
  } catch (error) {
    return next(error)
  }
}

export async function getTrainerController(req, res, next) {
  try {
    const trainer = await getTrainer(req.params.id)
    if (!trainer) return errorResponse(res, 'Entrenador no encontrado', 404)
    return successResponse(res, trainer, 'Entrenador obtenido')
  } catch (error) {
    return next(error)
  }
}

export async function createTrainerController(req, res, next) {
  try {
    const validation = handleValidation(req, res)
    if (validation) return validation
    const trainer = await createTrainer(req.body)
    return successResponse(res, trainer, 'Entrenador creado', 201)
  } catch (error) {
    return next(error)
  }
}

export async function updateTrainerController(req, res, next) {
  try {
    const validation = handleValidation(req, res)
    if (validation) return validation
    const trainer = await updateTrainer(req.params.id, req.body)
    return successResponse(res, trainer, 'Entrenador actualizado')
  } catch (error) {
    return next(error)
  }
}

export async function deleteTrainerController(req, res, next) {
  try {
    const trainer = await deactivateTrainer(req.params.id)
    return successResponse(res, trainer, 'Entrenador desactivado')
  } catch (error) {
    return next(error)
  }
}
