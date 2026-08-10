import { validationResult } from 'express-validator'
import { errorResponse, successResponse } from '../utils/response.js'
import { createCliente, deleteCliente, getClienteById, getClientes, getClientesConMembresiaVenciendo, searchClientes, updateCliente, uploadFotoCliente } from '../services/clientService.js'

function handleValidation(req, res) {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    return errorResponse(res, 'Validación fallida', 422, result.array())
  }
  return null
}

export async function listClientsController(req, res, next) {
  try {
    const clients = await getClientes(req.query)
    return successResponse(res, clients, 'Clientes obtenidos')
  } catch (error) {
    return next(error)
  }
}

export async function getClientController(req, res, next) {
  try {
    const client = await getClienteById(req.params.id)
    if (!client) return errorResponse(res, 'Cliente no encontrado', 404)
    return successResponse(res, client, 'Cliente obtenido')
  } catch (error) {
    return next(error)
  }
}

export async function createClientController(req, res, next) {
  try {
    const validation = handleValidation(req, res)
    if (validation) return validation
    const client = await createCliente(req.body)
    return successResponse(res, client, 'Cliente creado', 201)
  } catch (error) {
    return next(error)
  }
}

export async function updateClientController(req, res, next) {
  try {
    const client = await updateCliente(req.params.id, req.body)
    return successResponse(res, client, 'Cliente actualizado')
  } catch (error) {
    return next(error)
  }
}

export async function deleteClientController(req, res, next) {
  try {
    const client = await deleteCliente(req.params.id)
    return successResponse(res, client, 'Cliente desactivado')
  } catch (error) {
    return next(error)
  }
}

export async function searchClientsController(req, res, next) {
  try {
    const clients = await searchClientes(req.query.q || '')
    return successResponse(res, clients, 'Búsqueda realizada')
  } catch (error) {
    return next(error)
  }
}

export async function expiringClientsController(req, res, next) {
  try {
    const days = req.query.days || 7
    const clients = await getClientesConMembresiaVenciendo(days)
    return successResponse(res, clients, 'Clientes próximos a vencer')
  } catch (error) {
    return next(error)
  }
}

export async function uploadPhotoController(req, res, next) {
  try {
    const result = await uploadFotoCliente(req.params.id, req.file)
    return successResponse(res, result, 'Foto actualizada')
  } catch (error) {
    return next(error)
  }
}
