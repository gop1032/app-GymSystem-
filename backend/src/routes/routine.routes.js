import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { rolesMiddleware } from '../middlewares/roles.middleware.js'
import { createRoutineController, deleteRoutineController, getRoutineController, listRoutinesController, updateRoutineController } from '../controllers/routineController.js'
import { createRoutineValidator, updateRoutineValidator } from '../validators/routine.validator.js'

const router = Router()

router.use(authMiddleware)

router.get('/', listRoutinesController)
router.get('/:id', getRoutineController)
router.post('/', rolesMiddleware('ADMIN', 'TRAINER'), createRoutineValidator, createRoutineController)
router.put('/:id', rolesMiddleware('ADMIN', 'TRAINER'), updateRoutineValidator, updateRoutineController)
router.delete('/:id', rolesMiddleware('ADMIN', 'TRAINER'), deleteRoutineController)

export default router
