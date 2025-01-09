import { Router } from 'express'
import {
  addToWishList,
  checkProductInWhishList,
  getWishList,
  removeFromWishList,
} from '../controllers/wishList.controller'
import { isLoggedIn } from '../middlewares/auth.middleware'

const router = Router()

router.get('/', isLoggedIn, getWishList)
router.post('/:productId', addToWishList)
router.delete('/:productId', removeFromWishList)
router.get('/:productId', checkProductInWhishList)

export default router
