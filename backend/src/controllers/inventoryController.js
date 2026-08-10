import { validationResult } from 'express-validator'
import { errorResponse, successResponse } from '../utils/response.js'
import { createProduct, deactivateProduct, getProduct, getProducts, updateProduct, sellProduct } from '../services/inventoryService.js'

function handleValidation(req, res) {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    return errorResponse(res, 'Validación fallida', 422, result.array())
  }
  return null
}

export async function listProductsController(req, res, next) {
  try {
    const products = await getProducts(req.query)
    return successResponse(res, products, 'Productos obtenidos')
  } catch (error) {
    return next(error)
  }
}

export async function getProductController(req, res, next) {
  try {
    const product = await getProduct(req.params.id)
    if (!product) return errorResponse(res, 'Producto no encontrado', 404)
    return successResponse(res, product, 'Producto obtenido')
  } catch (error) {
    return next(error)
  }
}

export async function createProductController(req, res, next) {
  try {
    const validation = handleValidation(req, res)
    if (validation) return validation
    const product = await createProduct(req.body)
    return successResponse(res, product, 'Producto creado', 201)
  } catch (error) {
    return next(error)
  }
}

export async function updateProductController(req, res, next) {
  try {
    const validation = handleValidation(req, res)
    if (validation) return validation
    const product = await updateProduct(req.params.id, req.body)
    return successResponse(res, product, 'Producto actualizado')
  } catch (error) {
    return next(error)
  }
}

export async function deleteProductController(req, res, next) {
  try {
    const product = await deactivateProduct(req.params.id)
    return successResponse(res, product, 'Producto desactivado')
  } catch (error) {
    return next(error)
  }
}

export async function sellProductController(req, res, next) {
  try {
    const { productId, quantity } = req.body
    const result = await sellProduct(productId, Number(quantity), req.user.id)
    return successResponse(res, result, 'Venta registrada con éxito', 201)
  } catch (error) {
    return next(error)
  }
}
