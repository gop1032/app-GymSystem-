import { body } from 'express-validator'

export const createProductValidator = [
  body('name').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('category').trim().notEmpty().withMessage('La categoría es obligatoria'),
  body('stock').isInt({ min: 0 }).withMessage('El stock debe ser un número entero mayor o igual a 0').toInt(),
  body('price').isFloat({ min: 0 }).withMessage('El precio debe ser válido').toFloat(),
  body('isActive').optional().isBoolean().withMessage('Estado inválido').toBoolean()
]

export const updateProductValidator = [
  body('name').optional().trim().notEmpty(),
  body('category').optional().trim().notEmpty(),
  body('stock').optional().isInt({ min: 0 }).withMessage('El stock debe ser un número entero mayor o igual a 0').toInt(),
  body('price').optional().isFloat({ min: 0 }).withMessage('El precio debe ser válido').toFloat(),
  body('isActive').optional().isBoolean().withMessage('Estado inválido').toBoolean()
]
