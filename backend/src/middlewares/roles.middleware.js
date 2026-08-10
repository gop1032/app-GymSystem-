import { errorResponse } from '../utils/response.js'

export function rolesMiddleware(...allowedRoles) {
  return (req, res, next) => {
    const role = req.user?.role

    if (!role || !allowedRoles.includes(role)) {
      return errorResponse(res, 'No tienes permisos para realizar esta acción', 403)
    }

    return next()
  }
}
