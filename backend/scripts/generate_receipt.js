import fs from 'fs'
import path from 'path'
import PDFDocument from 'pdfkit'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

dotenv.config()
const prisma = new PrismaClient()

async function generateReceipt(paymentId) {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { client: true, membership: true }
  })

  if (!payment) throw new Error('Pago no encontrado: ' + paymentId)

  const outDir = path.resolve(process.cwd(), 'tmp')
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

  const filename = path.join(outDir, `receipt-${paymentId}.pdf`)
  const doc = new PDFDocument({ size: 'A4', margin: 50 })
  const stream = fs.createWriteStream(filename)
  doc.pipe(stream)

  doc.fontSize(20).text('GymCity - Comprobante de Pago', { align: 'center' })
  doc.moveDown()

  doc.fontSize(12).text(`N° Recibo: ${payment.receiptNumber}`)
  doc.text(`Fecha: ${payment.date.toISOString()}`)
  doc.text(`Método: ${payment.method}`)
  doc.moveDown()

  doc.text('Cliente:', { underline: true })
  doc.text(`${payment.client?.name || 'N/A'} (${payment.client?.email || ''})`)
  doc.text(`DNI: ${payment.client?.dni || ''}`)
  doc.moveDown()

  if (payment.membership) {
    doc.text('Membresía:', { underline: true })
    doc.text(`Plan: ${payment.membership.plan}`)
    doc.text(`Periodo: ${new Date(payment.membership.startDate).toLocaleDateString()} - ${new Date(payment.membership.endDate).toLocaleDateString()}`)
    doc.moveDown()
  }

  doc.text('Detalles de pago:', { underline: true })
  doc.text(`Monto: S/ ${payment.amount}`)
  doc.text(`Notas: ${payment.notes || ''}`)

  doc.moveDown(2)
  doc.text('Gracias por su pago.', { align: 'center' })

  doc.end()

  await new Promise((resolve, reject) => {
    stream.on('finish', resolve)
    stream.on('error', reject)
  })

  return filename
}

// Ejecutar desde CLI: node scripts/generate_receipt.js <paymentId>
const paymentId = process.argv[2]
if (!paymentId) {
  console.error('Usage: node scripts/generate_receipt.js <paymentId>')
  process.exit(1)
}

generateReceipt(paymentId)
  .then((file) => {
    console.log('Receipt generated:', file)
    process.exit(0)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
