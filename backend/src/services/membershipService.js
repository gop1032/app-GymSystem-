import { createMembership as createMembershipRepo, findActiveMembershipByClientId, findExpiringMemberships, getMembershipById, listMemberships, updateMembership as updateMembershipRepo } from '../repositories/membershipRepository.js'
import { updateClient as updateClientRepo } from '../repositories/clientRepository.js'

const PLAN_DAYS = {
  MONTHLY: 30,
  WEEKLY: 7,
  ANNUAL: 365
}

function normalizePlan(plan) {
  return String(plan || '').toUpperCase()
}

function normalizeMembershipPayload(data) {
  const plan = normalizePlan(data.plan)
  const startDate = data.startDate ? new Date(data.startDate) : new Date()
  const days = PLAN_DAYS[plan] || Number(data.durationDays || 30)
  const endDate = data.endDate ? new Date(data.endDate) : new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000)

  return {
    clientId: data.clientId,
    plan,
    startDate,
    endDate,
    price: Number(data.price),
    status: data.status ? String(data.status).toUpperCase() : 'ACTIVE'
  }
}

export function getMemberships(filters = {}) {
  const where = {}

  if (filters.status) {
    where.status = String(filters.status).toUpperCase()
  }

  if (filters.clientId) {
    where.clientId = filters.clientId
  }

  return listMemberships(where)
}

export const getMembresias = getMemberships

export function getMembresiaById(id) {
  return getMembershipById(id)
}

export async function createMembresia(data) {
  const payload = normalizeMembershipPayload(data)
  const membership = await createMembershipRepo(payload)

  await updateClientRepo(payload.clientId, { status: 'ACTIVE' })

  return membership
}

export async function updateMembresia(id, data) {
  return updateMembershipRepo(id, normalizeMembershipPayload(data))
}

export async function renovarMembresia(membresiaId) {
  const current = await getMembershipById(membresiaId)

  if (!current) {
    const error = new Error('Membresía no encontrada')
    error.statusCode = 404
    throw error
  }

  const startDate = new Date(current.endDate)
  const days = PLAN_DAYS[String(current.plan).toUpperCase()] || 30
  const endDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000)

  return updateMembershipRepo(membresiaId, {
    startDate,
    endDate,
    status: 'ACTIVE'
  })
}

export function getMembresiasVenciendo(dias = 7) {
  const limit = new Date()
  limit.setDate(limit.getDate() + Number(dias))
  return findExpiringMemberships(limit)
}

export function getMembresiaActiva(clienteId) {
  return findActiveMembershipByClientId(clienteId)
}
