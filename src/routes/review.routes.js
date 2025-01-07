import { Router } from 'express'
import {
  GetProductReviews,
  CreateReview,
} from '../controllers/review.controller'

const router = Router()

router.get('/product/:productId', GetProductReviews)
router.post('/product/:productId', CreateReview)

export default router
