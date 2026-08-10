import { body } from 'express-validator'

export const createTrainerValidator = [
  body('specialty').trim().notEmpty().withMessage('La especialidad es obligatoria'),
  body('bio').optional({ nullable: true }).trim(),
  body('userId').optional({ nullable: true }).trim(),
  body('isActive').optional().isBoolean().withMessage('Estado inválido').toBoolean()
]

export const updateTrainerValidator = [
  body('specialty').optional().trim().notEmpty(),
  body('bio').optional({ nullable: true }).trim(),
  body('userId').optional({ nullable: true }).trim(),
  body('isActive').optional().isBoolean().withMessage('Estado inválido').toBoolean()
]
