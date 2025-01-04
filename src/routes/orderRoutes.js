import { Router } from 'express'

import {
  getAllOrders,
  getOrder,
  getOrderStats,
} from '../controllers/order.controller'
import { isLoggedIn } from '../middlewares/auth.middleware'

const router = Router()

router.get('/', isLoggedIn, getAllOrders)
router.get('/', isLoggedIn, getOrder)
router.get('/stats', isLoggedIn, getOrderStats)
export default router
