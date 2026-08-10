import { createCheckoutSession, constructEvent } from '../services/stripeService.js'
import { successResponse, errorResponse } from '../utils/response.js'
import { prisma } from '../config/prisma.js'

export async function createSessionController(req, res, next) {
  try {
    const { amount, currency, description } = req.body

    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
    const session = await createCheckoutSession({
      amount,
      currency,
      metadata: { description, clientId: req.body.clientId },
      success_url: `${baseUrl}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/payments/cancel`
    })

    return successResponse(res, { url: session.url, id: session.id }, 'Checkout creado')
  } catch (error) {
    return next(error)
  }
}

export async function webhookController(req, res, next) {
  try {
    const sig = req.headers['stripe-signature']
    const event = await constructEvent(req.rawBody || req.body, sig)

    if (!event) return errorResponse(res, 'Evento no verificado', 400)

    const type = event.type

    if (type === 'checkout.session.completed' || type === 'payment_intent.succeeded') {
      const obj = event.data.object
      const metadata = obj.metadata || {}
      const amount = (obj.amount_total || obj.amount || 0) / 100
      const clientId = metadata.clientId || null

      if (clientId) {
        // crear pago y registro de historial
        const payment = await prisma.payment.create({
          data: {
            clientId,
            amount,
            method: 'CARD',
            receiptNumber: `STRIPE-${obj.id}`,
            notes: metadata.description || 'Pago vía Stripe'
          }
        })

        await prisma.paymentHistory.create({
          data: {
            paymentId: payment.id,
            action: 'created',
            provider: 'stripe',
            providerRef: obj.id,
            status: 'succeeded',
            metadata: JSON.stringify(obj)
          }
        })
      }
    }

    return res.json({ received: true })
  } catch (error) {
    console.error('Stripe webhook error', error)
    return errorResponse(res, 'Webhook error', 400, error.message)
  }
}
