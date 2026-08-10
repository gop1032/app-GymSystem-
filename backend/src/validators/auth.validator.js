import { body } from 'express-validator'

export const registerValidator = [
  body('name').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('email').isEmail().withMessage('El email debe ser válido').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('role').isIn(['ADMIN', 'RECEPTIONIST', 'TRAINER']).withMessage('Rol inválido')
]

export const loginValidator = [
  body('email').isEmail().withMessage('El email debe ser válido').normalizeEmail(),
  body('password').notEmpty().withMessage('La contraseña es obligatoria')
]

export const forgotPasswordValidator = [
  body('email').isEmail().withMessage('El email debe ser válido').normalizeEmail()
]

export const resetPasswordValidator = [
  body('token').notEmpty().withMessage('El token es obligatorio'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
]
