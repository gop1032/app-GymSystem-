import { validationResult } from 'express-validator'
import { errorResponse, successResponse } from '../utils/response.js'
import { createRoutine, deleteRoutine, getRoutine, getRoutines, updateRoutine } from '../services/routineService.js'

function handleValidation(req, res) {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    return errorResponse(res, 'Validación fallida', 422, result.array())
  }
  return null
}

export async function listRoutinesController(req, res, next) {
  try {
    const routines = await getRoutines(req.query)
    return successResponse(res, routines, 'Rutinas obtenidas')
  } catch (error) {
    return next(error)
  }
}

export async function getRoutineController(req, res, next) {
  try {
    const routine = await getRoutine(req.params.id)
    if (!routine) return errorResponse(res, 'Rutina no encontrada', 404)
    return successResponse(res, routine, 'Rutina obtenida')
  } catch (error) {
    return next(error)
  }
}

export async function createRoutineController(req, res, next) {
  try {
    const validation = handleValidation(req, res)
    if (validation) return validation
    const routine = await createRoutine(req.body)
    return successResponse(res, routine, 'Rutina creada', 201)
  } catch (error) {
    return next(error)
  }
}

export async function updateRoutineController(req, res, next) {
  try {
    const validation = handleValidation(req, res)
    if (validation) return validation
    const routine = await updateRoutine(req.params.id, req.body)
    return successResponse(res, routine, 'Rutina actualizada')
  } catch (error) {
    return next(error)
  }
}

export async function deleteRoutineController(req, res, next) {
  try {
    const routine = await deleteRoutine(req.params.id)
    return successResponse(res, routine, 'Rutina eliminada')
  } catch (error) {
    return next(error)
  }
}
