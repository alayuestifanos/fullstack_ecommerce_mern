import { Router } from 'express'

import {
  createCollection,
  updateCollection,
  deleteCollection,
  getAllCollection,
} from '../controllers/collection.controller'

const router = Router()

router.get('/', getAllCollection)
router.post('/', createCollection)
router.put('/:id', updateCollection)
router.delete('/:id', deleteCollection)

export default router
