import { validationResult } from 'express-validator'
import { errorResponse, successResponse } from '../utils/response.js'
import { checkInAttendance, getAttendanceByClientId, getAttendances, getTodayAttendanceList } from '../services/attendanceService.js'

function handleValidation(req, res) {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    return errorResponse(res, 'Validación fallida', 422, result.array())
  }
  return null
}

export async function listAttendanceController(req, res, next) {
  try {
    const attendances = await getAttendances(req.query)
    return successResponse(res, attendances, 'Asistencias obtenidas')
  } catch (error) {
    return next(error)
  }
}

export async function checkInController(req, res, next) {
  try {
    const validation = handleValidation(req, res)
    if (validation) return validation
    const attendance = await checkInAttendance({ ...req.body, registeredById: req.user.id })
    return successResponse(res, attendance, 'Asistencia registrada', 201)
  } catch (error) {
    return next(error)
  }
}

export async function todayAttendanceController(_req, res, next) {
  try {
    const attendances = await getTodayAttendanceList()
    return successResponse(res, attendances, 'Asistencias de hoy obtenidas')
  } catch (error) {
    return next(error)
  }
}

export async function attendanceByClientController(req, res, next) {
  try {
    const attendances = await getAttendanceByClientId(req.params.clientId)
    return successResponse(res, attendances, 'Historial de asistencia del cliente')
  } catch (error) {
    return next(error)
  }
}
