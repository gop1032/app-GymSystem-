import { prisma } from '../config/prisma.js'

export function listAttendances(where = {}) {
  return prisma.attendance.findMany({
    where,
    orderBy: { date: 'desc' },
    include: { client: true, registeredBy: true }
  })
}

export function getAttendanceById(id) {
  return prisma.attendance.findUnique({
    where: { id },
    include: { client: true, registeredBy: true }
  })
}

export function getTodayAttendances(startOfDay) {
  return prisma.attendance.findMany({
    where: { date: { gte: startOfDay } },
    orderBy: { date: 'desc' },
    include: { client: true, registeredBy: true }
  })
}

export function getAttendancesByClientId(clientId) {
  return prisma.attendance.findMany({
    where: { clientId },
    orderBy: { date: 'desc' },
    include: { registeredBy: true }
  })
}

export function createAttendance(data) {
  return prisma.attendance.create({ data })
}
