import { Router } from 'express'
import {
  signUp,
  login,
  logout,
  getProfile,
} from '../controllers/auth.controller'

const router = Router()

router.post('/signup', signUp)
router.post('/login', login)
router.post('/logout', logout)
router.get('/me', getProfile)

export default router
