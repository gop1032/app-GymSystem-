import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { rolesMiddleware } from '../middlewares/roles.middleware.js'
import { activeMembershipByClientController, createMembershipController, expiringMembershipsController, getMembershipController, listMembershipsController, renewMembershipController, updateMembershipController } from '../controllers/membershipController.js'
import { createMembershipValidator, updateMembershipValidator } from '../validators/membership.validator.js'

const router = Router()

router.use(authMiddleware)

router.get('/', listMembershipsController)
router.get('/expiring', expiringMembershipsController)
router.get('/client/:clientId/active', activeMembershipByClientController)
router.get('/:id', getMembershipController)
router.post('/', rolesMiddleware('ADMIN', 'RECEPTIONIST'), createMembershipValidator, createMembershipController)
router.put('/:id', rolesMiddleware('ADMIN', 'RECEPTIONIST'), updateMembershipValidator, updateMembershipController)
router.patch('/:id/renew', rolesMiddleware('ADMIN', 'RECEPTIONIST'), renewMembershipController)

export default router
