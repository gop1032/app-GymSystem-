import { prisma } from '../config/prisma.js'

export function listMemberships(where = {}) {
  return prisma.membership.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { client: true, payments: true }
  })
}

export function getMembershipById(id) {
  return prisma.membership.findUnique({
    where: { id },
    include: { client: true, payments: true }
  })
}

export function createMembership(data) {
  return prisma.membership.create({ data })
}

export function updateMembership(id, data) {
  return prisma.membership.update({ where: { id }, data })
}

export function findActiveMembershipByClientId(clientId) {
  return prisma.membership.findFirst({
    where: { clientId, status: 'ACTIVE' },
    orderBy: { endDate: 'desc' }
  })
}

export function findExpiringMemberships(limitDate) {
  return prisma.membership.findMany({
    where: {
      status: 'ACTIVE',
      endDate: { lte: limitDate }
    },
    include: { client: true },
    orderBy: { endDate: 'asc' }
  })
}
