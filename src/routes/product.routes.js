import { Router } from 'express'
import {
  getAllProducts,
  createProduct,
} from '../controllers/product.controller'

import { isLoggedIn } from '../middlewares/auth.middleware'

const router = Router()

router.get('/', getAllProducts)
router.post('/', isLoggedIn, createProduct)

export default router
