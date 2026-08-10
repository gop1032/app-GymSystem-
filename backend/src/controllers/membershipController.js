import { validationResult } from 'express-validator'
import { errorResponse, successResponse } from '../utils/response.js'
import { createMembresia, getMembresiaActiva, getMembresiaById, getMembresias, getMembresiasVenciendo, renovarMembresia, updateMembresia } from '../services/membershipService.js'

function handleValidation(req, res) {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    return errorResponse(res, 'Validación fallida', 422, result.array())
  }
  return null
}

export async function listMembershipsController(req, res, next) {
  try {
    const memberships = await getMembresias(req.query)
    return successResponse(res, memberships, 'Membresías obtenidas')
  } catch (error) {
    return next(error)
  }
}

export async function getMembershipController(req, res, next) {
  try {
    const membership = await getMembresiaById(req.params.id)
    if (!membership) return errorResponse(res, 'Membresía no encontrada', 404)
    return successResponse(res, membership, 'Membresía obtenida')
  } catch (error) {
    return next(error)
  }
}

export async function createMembershipController(req, res, next) {
  try {
    const validation = handleValidation(req, res)
    if (validation) return validation
    const membership = await createMembresia(req.body)
    return successResponse(res, membership, 'Membresía creada', 201)
  } catch (error) {
    return next(error)
  }
}

export async function updateMembershipController(req, res, next) {
  try {
    const membership = await updateMembresia(req.params.id, req.body)
    return successResponse(res, membership, 'Membresía actualizada')
  } catch (error) {
    return next(error)
  }
}

export async function renewMembershipController(req, res, next) {
  try {
    const membership = await renovarMembresia(req.params.id)
    return successResponse(res, membership, 'Membresía renovada')
  } catch (error) {
    return next(error)
  }
}

export async function expiringMembershipsController(req, res, next) {
  try {
    const memberships = await getMembresiasVenciendo(req.query.days || 7)
    return successResponse(res, memberships, 'Membresías próximas a vencer')
  } catch (error) {
    return next(error)
  }
}

export async function activeMembershipByClientController(req, res, next) {
  try {
    const membership = await getMembresiaActiva(req.params.clientId)
    return successResponse(res, membership, 'Membresía activa obtenida')
  } catch (error) {
    return next(error)
  }
}
