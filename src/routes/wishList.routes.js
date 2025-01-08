import { Router } from 'express'
import { getWishList } from '../controllers/wishList.controller'
import { isLoggedIn } from '../middlewares/auth.middleware'

const router = Router()

router.get('/', isLoggedIn, getWishList)

export default router
