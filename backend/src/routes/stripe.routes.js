import { Router } from 'express'
import { createSessionController, webhookController } from '../controllers/stripeController.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const router = Router()

// crear session (cliente autenticado)
router.post('/session', authMiddleware, createSessionController)

// webhook (stripe calls, no auth)
router.post('/webhook', webhookController)

export default router
