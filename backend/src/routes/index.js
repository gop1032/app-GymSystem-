import { Router } from 'express'
import authRoutes from './auth.routes.js'
import clientRoutes from './client.routes.js'
import inventoryRoutes from './inventory.routes.js'
import membershipRoutes from './membership.routes.js'
import paymentRoutes from './payment.routes.js'
import stripeRoutes from './stripe.routes.js'
import routineRoutes from './routine.routes.js'
import attendanceRoutes from './attendance.routes.js'
import trainerRoutes from './trainer.routes.js'
import reportRoutes from './report.routes.js'

const router = Router()

router.get('/', (_req, res) => {
  res.json({ ok: true, module: 'api' })
})

router.use('/auth', authRoutes)
router.use('/clients', clientRoutes)
router.use('/trainers', trainerRoutes)
router.use('/routines', routineRoutes)
router.use('/inventory', inventoryRoutes)
router.use('/memberships', membershipRoutes)
router.use('/payments', paymentRoutes)
router.use('/payments/stripe', stripeRoutes)
router.use('/attendance', attendanceRoutes)
router.use('/reports', reportRoutes)

export default router

