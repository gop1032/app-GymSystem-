import { body } from 'express-validator'

export const createMembershipValidator = [
  body('clientId').trim().notEmpty().withMessage('El cliente es obligatorio'),
  body('plan').customSanitizer((value) => String(value || '').toUpperCase()).isIn(['MONTHLY', 'WEEKLY', 'ANNUAL']).withMessage('Plan inválido'),
  body('price').isNumeric().withMessage('El precio debe ser numérico'),
  body('startDate').optional().isISO8601().toDate(),
  body('endDate').optional().isISO8601().toDate(),
  body('status').optional().customSanitizer((value) => String(value || '').toUpperCase()).isIn(['ACTIVE', 'EXPIRED', 'CANCELLED']).withMessage('Estado inválido')
]

export const updateMembershipValidator = [
  body('plan').optional().customSanitizer((value) => String(value || '').toUpperCase()).isIn(['MONTHLY', 'WEEKLY', 'ANNUAL']).withMessage('Plan inválido'),
  body('price').optional().isNumeric().withMessage('El precio debe ser numérico'),
  body('startDate').optional().isISO8601().toDate(),
  body('endDate').optional().isISO8601().toDate(),
  body('status').optional().customSanitizer((value) => String(value || '').toUpperCase()).isIn(['ACTIVE', 'EXPIRED', 'CANCELLED']).withMessage('Estado inválido')
]
