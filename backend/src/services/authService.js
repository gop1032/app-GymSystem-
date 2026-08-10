import bcrypt from 'bcryptjs'
import { createUser, findUserByEmail, findUserById, updateUserPassword } from '../repositories/authRepository.js'
import { buildResetPasswordEmail } from '../utils/emailTemplates.js'
import { createEmailTransporter } from '../config/email.js'
import { signToken, verifyToken } from '../utils/jwt.js'

function sanitizeUser(user) {
  if (!user) {
    return null
  }

  const { password, ...safeUser } = user
  return safeUser
}

export async function registerUser(input) {
  const existingUser = await findUserByEmail(input.email)

  if (existingUser) {
    const error = new Error('Ya existe un usuario con ese correo')
    error.statusCode = 409
    throw error
  }

  const password = await bcrypt.hash(input.password, 10)
  const user = await createUser({
    name: input.name,
    email: input.email,
    password,
    role: input.role || 'CLIENT',
    isActive: true
  })

  // Si es CLIENT, creamos su registro en la tabla Client
  if (user.role === 'CLIENT') {
    const { prisma } = await import('../config/prisma.js')
    await prisma.client.create({
      data: {
        name: user.name,
        email: user.email,
        phone: 'Por actualizar',
        dni: `DNI-${Date.now()}` // placeholder required for unique DNI
      }
    })
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name })

  return {
    user: sanitizeUser(user),
    token
  }
}

export async function loginUser(input) {
  const user = await findUserByEmail(input.email)

  if (!user || !user.isActive) {
    const error = new Error('Credenciales inválidas')
    error.statusCode = 401
    throw error
  }

  const validPassword = await bcrypt.compare(input.password, user.password)

  if (!validPassword) {
    const error = new Error('Credenciales inválidas')
    error.statusCode = 401
    throw error
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name })

  return {
    user: sanitizeUser(user),
    token
  }
}

export async function getCurrentUser(userId) {
  const user = await findUserById(userId)

  if (!user) {
    const error = new Error('Usuario no encontrado')
    error.statusCode = 404
    throw error
  }

  return sanitizeUser(user)
}

export async function requestPasswordReset(email) {
  const user = await findUserByEmail(email)

  if (!user) {
    return { message: 'Si el correo existe, se enviará un enlace de recuperación' }
  }

  const resetToken = signToken({ id: user.id, type: 'reset-password' }, '1h')
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`
  const transporter = createEmailTransporter()

  if (transporter) {
    const template = buildResetPasswordEmail(user.name, resetUrl)
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: template.subject,
      html: template.html
    })
  }

  return {
    message: 'Si el correo existe, se enviará un enlace de recuperación',
    resetToken
  }
}

export async function resetPassword(token, password) {
  let payload

  try {
    payload = verifyToken(token)
  } catch (error) {
    const tokenError = new Error('Token inválido o expirado')
    tokenError.statusCode = 400
    throw tokenError
  }

  if (payload.type !== 'reset-password') {
    const tokenError = new Error('Token inválido')
    tokenError.statusCode = 400
    throw tokenError
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  await updateUserPassword(payload.id, hashedPassword)

  return { message: 'Contraseña actualizada correctamente' }
}

export async function loginOrRegisterWithGoogle(input) {
  const email = input.email
  const name = input.name
  let user = await findUserByEmail(email)

  if (!user) {
    const password = await bcrypt.hash(Math.random().toString(36), 10)
    user = await createUser({
      name: name || 'Usuario Google',
      email,
      password,
      role: input.role || 'CLIENT',
      isActive: true
    })
    
    // Si es CLIENT, creamos su registro en la tabla Client
    if (user.role === 'CLIENT') {
      const { prisma } = await import('../config/prisma.js')
      await prisma.client.create({
        data: {
          name: user.name,
          email: user.email,
          phone: 'Por actualizar',
          dni: `DNI-${Date.now()}` // placeholder required for unique DNI
        }
      })
    }
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name })

  return {
    user: sanitizeUser(user),
    token
  }
}

