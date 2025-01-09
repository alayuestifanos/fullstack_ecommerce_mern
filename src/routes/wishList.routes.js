import { Router } from 'express'
import { addToWishList, getWishList } from '../controllers/wishList.controller'
import { isLoggedIn } from '../middlewares/auth.middleware'

const router = Router()

router.get('/', isLoggedIn, getWishList)
router.post('/:productId', addToWishList)

export default router
