import { verifyToken } from '../utils/jwt.js'
import { errorResponse } from '../utils/response.js'

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization || ''
  let token = header.split(' ')[1]

  // Fallback to query param (useful for downloads)
  if (!token && req.query.token) {
    token = req.query.token
  }

  if (!token) {
    return errorResponse(res, 'No autorizado', 401)
  }

  try {
    req.user = verifyToken(token)
    return next()
  } catch (error) {
    return errorResponse(res, 'Token inválido o expirado', 401)
  }
}
