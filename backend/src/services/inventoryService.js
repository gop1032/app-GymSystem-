import { createProduct as createProductRepo, getProductById, listProducts, updateProduct as updateProductRepo } from '../repositories/inventoryRepository.js'
import { prisma } from '../config/prisma.js'

function normalizeProductPayload(data) {
  return {
    name: String(data.name || '').trim(),
    category: String(data.category || '').trim(),
    stock: Number(data.stock || 0),
    price: Number(data.price || 0),
    isActive: data.isActive === undefined ? true : data.isActive === true || data.isActive === 'true',
    imageUrl: data.imageUrl || null
  }
}

export function getProducts(filters = {}) {
  const where = {}

  if (filters.isActive !== undefined) {
    where.isActive = String(filters.isActive) === 'false' ? false : Boolean(filters.isActive)
  }

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { category: { contains: filters.search, mode: 'insensitive' } }
    ]
  }

  return listProducts(where)
}

export function getProduct(id) {
  return getProductById(id)
}

export function createProduct(data) {
  const payload = normalizeProductPayload(data)

  if (!payload.name || !payload.category) {
    const error = new Error('El nombre y la categoría son obligatorios')
    error.statusCode = 400
    throw error
  }

  return createProductRepo(payload)
}

export function updateProduct(id, data) {
  return updateProductRepo(id, normalizeProductPayload(data))
}

export function deactivateProduct(id) {
  return updateProductRepo(id, { isActive: false })
}

export async function sellProduct(productId, quantity, soldById) {
  const product = await getProductById(productId)
  if (!product) {
    const error = new Error('Producto no encontrado')
    error.statusCode = 404
    throw error
  }
  if (product.stock < quantity) {
    const error = new Error('Stock insuficiente')
    error.statusCode = 400
    throw error
  }

  return prisma.$transaction(async (tx) => {
    const updatedProduct = await tx.product.update({
      where: { id: productId },
      data: { stock: product.stock - quantity }
    })

    const sale = await tx.sale.create({
      data: {
        productId,
        quantity,
        unitPrice: product.price,
        total: Number(product.price) * quantity,
        soldById
      }
    })

    return { sale, product: updatedProduct }
  })
}
