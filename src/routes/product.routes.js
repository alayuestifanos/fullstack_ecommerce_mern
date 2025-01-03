import { Router } from 'express'
import {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller'

import { isLoggedIn } from '../middlewares/auth.middleware'

const router = Router()

router.get('/', getAllProducts)
router.post('/', isLoggedIn, createProduct)
router.get('/', getProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

export default router
