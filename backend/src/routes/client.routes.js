import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { rolesMiddleware } from '../middlewares/roles.middleware.js'
import { checkInController, attendanceByClientController, listAttendanceController, todayAttendanceController } from '../controllers/attendanceController.js'
import { checkInValidator } from '../validators/attendance.validator.js'
import { createClientController, deleteClientController, expiringClientsController, getClientController, listClientsController, searchClientsController, updateClientController, uploadPhotoController } from '../controllers/clientController.js'
import { createClientValidator, updateClientValidator } from '../validators/client.validator.js'

const router = Router()

router.use(authMiddleware)

router.get('/', listClientsController)
router.get('/search', searchClientsController)
router.get('/expiring', expiringClientsController)
router.get('/:id', getClientController)
router.post('/', rolesMiddleware('ADMIN', 'RECEPTIONIST'), createClientValidator, createClientController)
router.put('/:id', rolesMiddleware('ADMIN', 'RECEPTIONIST'), updateClientValidator, updateClientController)
router.delete('/:id', rolesMiddleware('ADMIN'), deleteClientController)
router.post('/:id/photo', rolesMiddleware('ADMIN', 'RECEPTIONIST'), uploadPhotoController)

router.get('/:clientId/attendance', attendanceByClientController)

export default router
