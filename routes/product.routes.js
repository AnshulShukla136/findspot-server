<<<<<<< HEAD
import express from 'express'
import { getProduct } from '../controllers/product.controller.js'

const router = express.Router()

router.get('/:id', getProduct)

=======
import express from 'express'
import { getProduct } from '../controllers/product.controller.js'

const router = express.Router()

router.get('/:id', getProduct)

>>>>>>> e49221474f114a779c286c41770d1ac46fa7ad76
export default router