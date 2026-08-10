import { prisma } from '../config/prisma.js'

export function listClients(where = {}) {
  return prisma.client.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      trainer: true,
      memberships: { orderBy: { createdAt: 'desc' }, take: 1 }
    }
  })
}

export function getClientById(id) {
  return prisma.client.findUnique({
    where: { id },
    include: {
      trainer: true,
      memberships: { orderBy: { createdAt: 'desc' }, take: 5 },
      payments: { orderBy: { date: 'desc' }, take: 10 },
      attendances: { orderBy: { date: 'desc' }, take: 10 },
      routines: { orderBy: { createdAt: 'desc' } }
    }
  })
}

export function createClient(data) {
  return prisma.client.create({ data })
}

export function updateClient(id, data) {
  return prisma.client.update({ where: { id }, data })
}

export function softDeleteClient(id) {
  return prisma.client.update({
    where: { id },
    data: { status: 'INACTIVE' }
  })
}

export function findClientByDni(dni) {
  return prisma.client.findUnique({ where: { dni } })
}

export function findClientsExpiringSoon(dateLimit) {
  return prisma.client.findMany({
    where: {
      memberships: {
        some: {
          status: 'ACTIVE',
          endDate: { lte: dateLimit }
        }
      }
    },
    include: {
      memberships: { where: { status: 'ACTIVE' }, orderBy: { endDate: 'asc' }, take: 1 }
    },
    orderBy: { createdAt: 'desc' }
  })
}
