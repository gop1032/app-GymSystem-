import { prisma } from '../config/prisma.js'

export async function findUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } })
}

export async function findUserById(id) {
  return prisma.user.findUnique({ where: { id } })
}

export async function createUser(data) {
  return prisma.user.create({ data })
}

export async function updateUserPassword(id, password) {
  return prisma.user.update({ where: { id }, data: { password } })
}
