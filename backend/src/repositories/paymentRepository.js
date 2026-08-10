import { prisma } from '../config/prisma.js'

export function listPayments(where = {}) {
  return prisma.payment.findMany({
    where,
    orderBy: { date: 'desc' },
    include: { client: true, membership: true }
  })
}

export function getPaymentById(id) {
  return prisma.payment.findUnique({
    where: { id },
    include: { client: true, membership: true }
  })
}

export function getPaymentsByClientId(clientId) {
  return prisma.payment.findMany({
    where: { clientId },
    orderBy: { date: 'desc' },
    include: { membership: true }
  })
}

export function createPayment(data) {
  return prisma.payment.create({ data })
}
