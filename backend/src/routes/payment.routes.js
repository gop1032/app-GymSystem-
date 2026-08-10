import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { rolesMiddleware } from '../middlewares/roles.middleware.js'
import { cancelPaymentController, createPaymentController, getPaymentController, getPaymentsByClientController, listPaymentsController, receiptPaymentController } from '../controllers/paymentController.js'
import { createPaymentValidator } from '../validators/payment.validator.js'

const router = Router()

router.use(authMiddleware)

router.get('/', listPaymentsController)
router.get('/client/:clientId', getPaymentsByClientController)
router.get('/:id', getPaymentController)
router.post('/', rolesMiddleware('ADMIN', 'RECEPTIONIST'), createPaymentValidator, createPaymentController)
router.patch('/:id/cancel', rolesMiddleware('ADMIN'), cancelPaymentController)
router.get('/:id/receipt', receiptPaymentController)

export default router
