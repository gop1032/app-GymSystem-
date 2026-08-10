import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { rolesMiddleware } from '../middlewares/roles.middleware.js'
import { createTrainerController, deleteTrainerController, getTrainerController, listTrainersController, updateTrainerController } from '../controllers/trainerController.js'
import { createTrainerValidator, updateTrainerValidator } from '../validators/trainer.validator.js'

const router = Router()

router.use(authMiddleware)

router.get('/', listTrainersController)
router.get('/:id', getTrainerController)
router.post('/', rolesMiddleware('ADMIN'), createTrainerValidator, createTrainerController)
router.put('/:id', rolesMiddleware('ADMIN'), updateTrainerValidator, updateTrainerController)
router.delete('/:id', rolesMiddleware('ADMIN'), deleteTrainerController)

export default router
