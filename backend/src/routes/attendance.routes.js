import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { rolesMiddleware } from '../middlewares/roles.middleware.js'
import { attendanceByClientController, checkInController, listAttendanceController, todayAttendanceController } from '../controllers/attendanceController.js'
import { checkInValidator } from '../validators/attendance.validator.js'

const router = Router()

router.use(authMiddleware)

router.get('/', listAttendanceController)
router.get('/today', todayAttendanceController)
router.get('/client/:clientId', attendanceByClientController)
router.post('/checkin', rolesMiddleware('ADMIN', 'RECEPTIONIST'), checkInValidator, checkInController)

export default router
