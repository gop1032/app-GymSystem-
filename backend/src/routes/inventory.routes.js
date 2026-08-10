import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { rolesMiddleware } from '../middlewares/roles.middleware.js'
import { createProductController, deleteProductController, getProductController, listProductsController, updateProductController, sellProductController } from '../controllers/inventoryController.js'
import { createProductValidator, updateProductValidator } from '../validators/inventory.validator.js'

const router = Router()

router.use(authMiddleware)

router.get('/', listProductsController)
router.get('/:id', getProductController)
router.post('/', rolesMiddleware('ADMIN', 'RECEPTIONIST'), createProductValidator, createProductController)
router.post('/sales', rolesMiddleware('ADMIN', 'RECEPTIONIST', 'CLIENT', 'NUTRITIONIST', 'TRAINER'), sellProductController)
router.put('/:id', rolesMiddleware('ADMIN', 'RECEPTIONIST'), updateProductValidator, updateProductController)
router.delete('/:id', rolesMiddleware('ADMIN', 'RECEPTIONIST'), deleteProductController)

export default router
