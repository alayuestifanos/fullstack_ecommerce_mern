import { Router } from 'express'
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  getAllReviews,
} from '../controllers/review.controller'
import { isLoggedIn } from '../middlewares/auth.middleware'

const router = Router()

router.get('/product/:productId', getProductReviews)
router.post('/product/:productId', isLoggedIn, createReview)
router.put('/:id', isLoggedIn, updateReview)
router.delete('/:id', isLoggedIn, deleteReview)
router.get('/all', getAllReviews)

export default router
