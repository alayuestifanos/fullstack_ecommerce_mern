import { Router } from 'express'
import { GetProductReviews } from '../controllers/review.controller'

const router = Router()

router.get('/product/:productId', GetProductReviews)

export default router
