import { Router } from 'express'
import {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  productSummary,
} from '../controllers/product.controller'

import { isLoggedIn } from '../middlewares/auth.middleware'

const router = Router()

router.get('/', getAllProducts)
router.post('/', isLoggedIn, createProduct)
router.get('/', getProduct)
router.get('/stats/summary', isLoggedIn, productSummary)
router.put('/:id', isLoggedIn, updateProduct)
router.delete('/:id', isLoggedIn, deleteProduct)

export default router
