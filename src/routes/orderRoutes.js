import { Router } from 'express'

import { getAllOrders } from '../controllers/order.controller'
import { isLoggedIn } from '../middlewares/auth.middleware'

const router = Router()

router.get('/', isLoggedIn, getAllOrders)

export default router
