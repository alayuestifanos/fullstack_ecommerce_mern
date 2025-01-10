import { Router } from 'express'
import { createContact, getAllContact } from '../controllers/contact.controller'
import { isLoggedIn } from '../middlewares/auth.middleware'

const router = Router()

router.post('/', createContact)
router.get('/', isLoggedIn, getAllContact)

export default router
