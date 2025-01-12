import { Router } from 'express'
import { getAnalytics } from '../controllers/analaytice.controller'
import { isLoggedIn } from '../middlewares/auth.middleware'

const router = Router()

router.get('/', isLoggedIn, getAnalytics)

export default router
