import { createAttendance as createAttendanceRepo, getAttendancesByClientId, getTodayAttendances, listAttendances } from '../repositories/attendanceRepository.js'
import { getMembresiaActiva } from './membershipService.js'

function startOfToday() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

function normalizeAttendancePayload(data) {
  return {
    clientId: data.clientId,
    checkIn: data.checkIn ? new Date(data.checkIn) : new Date(),
    checkOut: data.checkOut ? new Date(data.checkOut) : null,
    date: data.date ? new Date(data.date) : new Date(),
    source: data.source ? String(data.source).toUpperCase() : 'MANUAL',
    registeredById: data.registeredById
  }
}

export function getAttendances(filters = {}) {
  const where = {}

  if (filters.clientId) {
    where.clientId = filters.clientId
  }

  if (filters.from || filters.to) {
    where.date = {}
    if (filters.from) where.date.gte = new Date(filters.from)
    if (filters.to) where.date.lte = new Date(filters.to)
  }

  return listAttendances(where)
}

export function getAttendanceByClientId(clientId) {
  return getAttendancesByClientId(clientId)
}

export function getTodayAttendanceList() {
  return getTodayAttendances(startOfToday())
}

export async function checkInAttendance(data) {
  const membership = await getMembresiaActiva(data.clientId)

  if (!membership) {
    const error = new Error('El cliente no tiene una membresía activa')
    error.statusCode = 400
    throw error
  }

  return createAttendanceRepo(normalizeAttendancePayload(data))
}
