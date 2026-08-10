import { createPayment as createPaymentRepo, getPaymentById, getPaymentsByClientId, listPayments } from '../repositories/paymentRepository.js'
import { getMembresiaActiva } from './membershipService.js'

function normalizePaymentPayload(data) {
  return {
    clientId: data.clientId,
    membershipId: data.membershipId || null,
    amount: Number(data.amount),
    method: String(data.method || 'CASH').toUpperCase(),
    notes: data.notes || null,
    receiptNumber: data.receiptNumber || `GC-${Date.now()}`,
    date: data.date ? new Date(data.date) : new Date()
  }
}

export function getPagos(filters = {}) {
  const where = {}

  if (filters.clientId) {
    where.clientId = filters.clientId
  }

  if (filters.method) {
    where.method = String(filters.method).toUpperCase()
  }

  if (filters.from || filters.to) {
    where.date = {}
    if (filters.from) where.date.gte = new Date(filters.from)
    if (filters.to) where.date.lte = new Date(filters.to)
  }

  return listPayments(where)
}

export function getPagoById(id) {
  return getPaymentById(id)
}

export function getPagosByCliente(clienteId) {
  return getPaymentsByClientId(clienteId)
}

export async function createPago(data) {
  const payload = normalizePaymentPayload(data)

  if (!payload.membershipId) {
    const activeMembership = await getMembresiaActiva(payload.clientId)
    if (activeMembership) {
      payload.membershipId = activeMembership.id
    }
  }

  return createPaymentRepo(payload)
}

export function generarComprobantePDF(pagoId) {
  return getPaymentById(pagoId)
}

export function anularPago(pagoId) {
  return getPaymentById(pagoId)
}

export function getTotalIngresosMes(year, month) {
  const from = new Date(year, month - 1, 1)
  const to = new Date(year, month, 0, 23, 59, 59)
  return listPayments({ date: { gte: from, lte: to } })
}

export function getIngresosPorMetodo(year, month) {
  return getTotalIngresosMes(year, month)
}
