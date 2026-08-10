import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { rolesMiddleware } from '../middlewares/roles.middleware.js'
import { attendanceReportController, dashboardReportController, excelReportController, pdfReportController, revenueReportController } from '../controllers/reportController.js'

const router = Router()

router.use(authMiddleware)

router.get('/dashboard', dashboardReportController)
router.get('/revenue', revenueReportController)
router.get('/attendance', attendanceReportController)
router.get('/pdf', rolesMiddleware('ADMIN', 'ACCOUNTANT', 'RECEPTIONIST'), pdfReportController)
router.get('/excel', rolesMiddleware('ADMIN', 'ACCOUNTANT', 'RECEPTIONIST'), excelReportController)

export default router
