import { errorResponse } from '../utils/response.js'
import logger from '../config/logger.js'

export function errorHandler(err, _req, res, _next) {
  logger.error({ err }, err.message)
  return errorResponse(res, err.message || 'Error interno del servidor', err.statusCode || 500)
}
