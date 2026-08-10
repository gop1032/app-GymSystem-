import { body } from 'express-validator'

export const createRoutineValidator = [
  body('name').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('clientId').trim().notEmpty().withMessage('El cliente es obligatorio'),
  body('trainerId').trim().notEmpty().withMessage('El entrenador es obligatorio'),
  body('description').optional({ nullable: true }).trim(),
  body('exercises').optional().isArray().withMessage('Las rutinas deben enviarse como lista')
]

export const updateRoutineValidator = [
  body('name').optional().trim().notEmpty(),
  body('clientId').optional().trim().notEmpty(),
  body('trainerId').optional().trim().notEmpty(),
  body('description').optional({ nullable: true }).trim(),
  body('exercises').optional().isArray().withMessage('Las rutinas deben enviarse como lista')
]
