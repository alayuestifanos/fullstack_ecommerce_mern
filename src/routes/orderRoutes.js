import { Router } from 'express'

import {
  createOrder,
  getAllOrders,
  getOrder,
  getOrderStats,
} from '../controllers/order.controller'
import { isLoggedIn } from '../middlewares/auth.middleware'

const router = Router()

router.get('/', isLoggedIn, getAllOrders)
router.get('/:id', isLoggedIn, getOrder)
router.post('/', createOrder)
router.get('/stats', isLoggedIn, getOrderStats)
export default router
