import { validationResult } from 'express-validator'
import { errorResponse, successResponse } from '../utils/response.js'
import { getCurrentUser, loginUser, registerUser, requestPasswordReset, resetPassword, loginOrRegisterWithGoogle } from '../services/authService.js'

function handleValidation(req, res) {
  const result = validationResult(req)

  if (!result.isEmpty()) {
    return errorResponse(res, 'Validación fallida', 422, result.array())
  }

  return null
}

export async function register(req, res, next) {
  try {
    const validation = handleValidation(req, res)
    if (validation) return validation

    const result = await registerUser(req.body)
    return successResponse(res, result, 'Usuario registrado', 201)
  } catch (error) {
    return next(error)
  }
}

export async function login(req, res, next) {
  try {
    const validation = handleValidation(req, res)
    if (validation) return validation

    const result = await loginUser(req.body)
    return successResponse(res, result, 'Inicio de sesión exitoso')
  } catch (error) {
    return next(error)
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const validation = handleValidation(req, res)
    if (validation) return validation

    const result = await requestPasswordReset(req.body.email)
    return successResponse(res, result, result.message)
  } catch (error) {
    return next(error)
  }
}

export async function resetPasswordController(req, res, next) {
  try {
    const validation = handleValidation(req, res)
    if (validation) return validation

    const result = await resetPassword(req.body.token, req.body.password)
    return successResponse(res, result, result.message)
  } catch (error) {
    return next(error)
  }
}

export async function me(req, res, next) {
  try {
    const user = await getCurrentUser(req.user.id)
    return successResponse(res, user, 'Usuario autenticado')
  } catch (error) {
    return next(error)
  }
}

export async function googleLogin(req, res, next) {
  try {
    const result = await loginOrRegisterWithGoogle(req.body)
    return successResponse(res, result, 'Inicio de sesión con Google exitoso')
  } catch (error) {
    return next(error)
  }
}
