import { body } from 'express-validator'

export const createPaymentValidator = [
  body('clientId').trim().notEmpty().withMessage('El cliente es obligatorio'),
  body('amount').isNumeric().withMessage('El monto debe ser numérico'),
  body('method').customSanitizer((value) => String(value || '').toUpperCase()).isIn(['CASH', 'TRANSFER', 'CARD']).withMessage('Método inválido'),
  body('membershipId').optional({ nullable: true }).isString(),
  body('receiptNumber').optional().isString(),
  body('date').optional().isISO8601().toDate()
]
