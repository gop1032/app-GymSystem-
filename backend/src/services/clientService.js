import { findClientByDni, findClientsExpiringSoon, getClientById, listClients, softDeleteClient, createClient as createClientRepo, updateClient as updateClientRepo } from '../repositories/clientRepository.js'
import { createEmailTransporter } from '../config/email.js'

function normalizeClientPayload(data) {
  return {
    name: data.name?.trim(),
    email: data.email?.trim() || null,
    phone: data.phone?.trim(),
    dni: data.dni?.trim(),
    photo: data.photo || null,
    status: data.status || 'ACTIVE',
    trainerId: data.trainerId || null
  }
}

export async function getClients(filters = {}) {
  const where = {}

  if (filters.status) {
    where.status = filters.status
  }

  if (filters.trainerId) {
    where.trainerId = filters.trainerId
  }

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { dni: { contains: filters.search, mode: 'insensitive' } },
      { phone: { contains: filters.search, mode: 'insensitive' } }
    ]
  }

  return listClients(where)
}

export const getClientes = getClients

export function getClienteById(id) {
  return getClientById(id)
}

export async function createCliente(data) {
  const existing = await findClientByDni(data.dni)

  if (existing) {
    const error = new Error('Ya existe un cliente con ese DNI')
    error.statusCode = 409
    throw error
  }

  const client = await createClientRepo(normalizeClientPayload(data))

  // Send welcome email via Gmail if they have a valid email address
  if (client.email) {
    try {
      const transporter = createEmailTransporter()
      if (transporter) {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: client.email,
          subject: '¡Bienvenido a GymCity!',
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 12px; margin: 0 auto;">
              <h2 style="color: #10b981; margin-top: 0;">¡Hola, ${client.name}!</h2>
              <p style="font-size: 16px; line-height: 1.5;">Tu registro en GymCity ha sido exitoso.</p>
              <p style="font-size: 16px; line-height: 1.5;">Tu número de DNI es: <strong>${client.dni}</strong></p>
              <br>
              <p style="font-size: 16px; line-height: 1.5; color: #10b981; font-weight: bold;">¡Esperamos verte pronto entrenando con nosotros!</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
              <small style="color: #777; display: block; text-align: center;">GymSystem &copy; 2026 - Gestión de Gimnasios</small>
            </div>
          `
        })
      }
    } catch (emailErr) {
      console.error('Error al enviar correo de bienvenida:', emailErr.message)
    }
  }

  return client
}

export async function updateCliente(id, data) {
  return updateClientRepo(id, normalizeClientPayload(data))
}

export function deleteCliente(id) {
  return softDeleteClient(id)
}

export function searchClientes(query) {
  return getClients({ search: query })
}

export function getClientesConMembresiaVenciendo(dias = 7) {
  const limit = new Date()
  limit.setDate(limit.getDate() + Number(dias))
  return findClientsExpiringSoon(limit)
}

export function uploadFotoCliente(_id, file) {
  return Promise.resolve({ url: file?.path || null })
}
