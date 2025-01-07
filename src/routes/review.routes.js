import { Router } from 'express'
import {
  getProductReviews,
  createReview,
  updateReview,
} from '../controllers/review.controller'
import { isLoggedIn } from '../middlewares/auth.middleware'

const router = Router()

router.get('/product/:productId', getProductReviews)
router.post('/product/:productId', isLoggedIn, createReview)
router.put('/id', isLoggedIn, updateReview)

export default router
