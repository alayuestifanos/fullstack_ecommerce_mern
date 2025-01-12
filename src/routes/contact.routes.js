import { Router } from 'express'
import {
  createContact,
  deleteContact,
  getAllContact,
  updateContact,
} from '../controllers/contact.controller'
import { isLoggedIn } from '../middlewares/auth.middleware'

const router = Router()

router.post('/', createContact)
router.get('/', isLoggedIn, getAllContact)
router.put('/:id', isLoggedIn, updateContact)
router.delete('/:id', isLoggedIn, deleteContact)

export default router
