import { body } from 'express-validator'

export const createClientValidator = [
  body('name').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('phone').trim().notEmpty().withMessage('El celular es obligatorio'),
  body('dni').trim().isLength({ min: 8 }).withMessage('El DNI debe tener al menos 8 caracteres'),
  body('email').optional({ nullable: true }).isEmail().withMessage('El email debe ser válido').normalizeEmail(),
  body('status').optional().isIn(['ACTIVE', 'INACTIVE', 'SUSPENDED']).withMessage('Estado inválido')
]

export const updateClientValidator = [
  body('name').optional().trim().notEmpty(),
  body('phone').optional().trim().notEmpty(),
  body('dni').optional().trim().isLength({ min: 8 }),
  body('email').optional({ nullable: true }).isEmail().withMessage('El email debe ser válido').normalizeEmail(),
  body('status').optional().isIn(['ACTIVE', 'INACTIVE', 'SUSPENDED']).withMessage('Estado inválido')
]
