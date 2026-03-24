<<<<<<< HEAD
import express from 'express'
import {
  register, login, sendOtp,
  verifyOtp, getMe, googleLogin
} from '../controllers/auth.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/send-otp', sendOtp)
router.post('/verify-otp', verifyOtp)
router.get('/me', protect, getMe)

router.post('/google', googleLogin)

=======
import express from 'express'
import {
  register, login, sendOtp,
  verifyOtp, getMe, googleLogin
} from '../controllers/auth.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/send-otp', sendOtp)
router.post('/verify-otp', verifyOtp)
router.get('/me', protect, getMe)

router.post('/google', googleLogin)

>>>>>>> e49221474f114a779c286c41770d1ac46fa7ad76
export default router