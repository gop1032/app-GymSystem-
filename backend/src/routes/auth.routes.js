import { Router } from 'express'
import { forgotPassword, login, me, register, resetPasswordController, googleLogin } from '../controllers/authController.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { forgotPasswordValidator, loginValidator, registerValidator, resetPasswordValidator } from '../validators/auth.validator.js'

const router = Router()

router.post('/register', registerValidator, register)
router.post('/login', loginValidator, login)
router.post('/google-login', googleLogin)
router.post('/forgot-password', forgotPasswordValidator, forgotPassword)
router.post('/reset-password', resetPasswordValidator, resetPasswordController)
router.get('/me', authMiddleware, me)

export default router
