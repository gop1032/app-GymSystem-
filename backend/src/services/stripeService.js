import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' })

export async function createCheckoutSession({ amount, currency = 'usd', metadata = {}, success_url, cancel_url }) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency,
          product_data: { name: metadata.description || 'Gym Service' },
          unit_amount: Math.round(Number(amount) * 100)
        },
        quantity: 1
      }
    ],
    mode: 'payment',
    metadata,
    success_url,
    cancel_url
  })

  return session
}

export async function constructEvent(payload, sig) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) return null
  try {
    return stripe.webhooks.constructEvent(payload, sig, webhookSecret)
  } catch (err) {
    throw err
  }
}
