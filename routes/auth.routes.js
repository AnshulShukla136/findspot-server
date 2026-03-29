import express from 'express'
import {
  register, login, sendOtp,
  verifyOtp, getMe, googleLogin,updateProfile 
} from '../controllers/auth.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/send-otp', sendOtp)
router.post('/verify-otp', verifyOtp)
router.get('/me', protect, getMe)

router.put('/update-profile', protect, updateProfile)

router.post('/google', googleLogin)
export default router