import { prisma } from '../config/prisma.js'

export function listProducts(where = {}) {
  return prisma.product.findMany({
    where,
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { sales: true } }
    }
  })
}

export function getProductById(id) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      _count: { select: { sales: true } }
    }
  })
}

export function createProduct(data) {
  return prisma.product.create({ data })
}

export function updateProduct(id, data) {
  return prisma.product.update({ where: { id }, data })
}
