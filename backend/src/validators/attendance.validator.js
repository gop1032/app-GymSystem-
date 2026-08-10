import { body } from 'express-validator'

export const checkInValidator = [
  body('clientId').trim().notEmpty().withMessage('El cliente es obligatorio'),
  body('checkIn').optional().isISO8601().toDate(),
  body('checkOut').optional({ nullable: true }).isISO8601().toDate(),
  body('source').optional().customSanitizer((value) => String(value || '').toUpperCase()).isIn(['MANUAL', 'QR']).withMessage('Origen inválido')
]
