import { Router } from 'express'

import {
  createOrder,
  getAllOrders,
  getOrder,
  getOrderStats,
  updateOrderStatus,
} from '../controllers/order.controller'
import { isLoggedIn } from '../middlewares/auth.middleware'

const router = Router()

router.get('/', isLoggedIn, getAllOrders)
router.get('/:id', isLoggedIn, getOrder)
router.post('/', createOrder)
router.put('/:id/status', updateOrderStatus)
router.get('/stats', isLoggedIn, getOrderStats)
export default router
