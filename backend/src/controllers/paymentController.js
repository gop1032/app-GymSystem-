import { validationResult } from 'express-validator'
import { errorResponse, successResponse } from '../utils/response.js'
import { anularPago, createPago, generarComprobantePDF, getPagoById, getPagos, getPagosByCliente } from '../services/paymentService.js'

function handleValidation(req, res) {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    return errorResponse(res, 'Validación fallida', 422, result.array())
  }
  return null
}

export async function listPaymentsController(req, res, next) {
  try {
    const payments = await getPagos(req.query)
    return successResponse(res, payments, 'Pagos obtenidos')
  } catch (error) {
    return next(error)
  }
}

export async function getPaymentController(req, res, next) {
  try {
    const payment = await getPagoById(req.params.id)
    if (!payment) return errorResponse(res, 'Pago no encontrado', 404)
    return successResponse(res, payment, 'Pago obtenido')
  } catch (error) {
    return next(error)
  }
}

export async function getPaymentsByClientController(req, res, next) {
  try {
    const payments = await getPagosByCliente(req.params.clientId)
    return successResponse(res, payments, 'Pagos por cliente obtenidos')
  } catch (error) {
    return next(error)
  }
}

export async function createPaymentController(req, res, next) {
  try {
    const validation = handleValidation(req, res)
    if (validation) return validation
    const payment = await createPago(req.body)
    return successResponse(res, payment, 'Pago registrado', 201)
  } catch (error) {
    return next(error)
  }
}

export async function cancelPaymentController(req, res, next) {
  try {
    const payment = await anularPago(req.params.id)
    return successResponse(res, payment, 'Pago anulado')
  } catch (error) {
    return next(error)
  }
}

export async function receiptPaymentController(req, res, next) {
  try {
    const payment = await generarComprobantePDF(req.params.id)
    return successResponse(res, payment, 'Comprobante generado')
  } catch (error) {
    return next(error)
  }
}
