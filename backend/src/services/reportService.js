import { prisma } from '../config/prisma.js'

function startOfCurrentMonth() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1)
}

function startOfNextMonth() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth() + 1, 1)
}

export async function getDashboardSummary() {
  const currentMonthStart = startOfCurrentMonth()
  const nextMonthStart = startOfNextMonth()

  const [activeClients, activeMemberships, expiredMemberships, monthPayments, todayAttendances] = await Promise.all([
    prisma.client.count({ where: { status: 'ACTIVE' } }),
    prisma.membership.count({ where: { status: 'ACTIVE' } }),
    prisma.membership.count({ where: { status: 'EXPIRED' } }),
    prisma.payment.aggregate({
      where: { date: { gte: currentMonthStart, lt: nextMonthStart } },
      _sum: { amount: true }
    }),
    prisma.attendance.count({ where: { date: { gte: currentMonthStart } } })
  ])

  return {
    activeClients,
    activeMemberships,
    expiredMemberships,
    monthIncome: Number(monthPayments._sum.amount || 0),
    todayAttendances
  }
}

export async function getRevenueReport(filters = {}) {
  const where = {}

  if (filters.from || filters.to) {
    where.date = {}
    if (filters.from) where.date.gte = new Date(filters.from)
    if (filters.to) where.date.lte = new Date(filters.to)
  }

  const payments = await prisma.payment.findMany({
    where,
    orderBy: { date: 'asc' },
    include: { client: true }
  })

  return payments
}

export async function getAttendanceReport(filters = {}) {
  const where = {}

  if (filters.from || filters.to) {
    where.date = {}
    if (filters.from) where.date.gte = new Date(filters.from)
    if (filters.to) where.date.lte = new Date(filters.to)
  }

  const attendances = await prisma.attendance.findMany({
    where,
    orderBy: { date: 'asc' },
    include: { client: true }
  })

  return attendances
}
