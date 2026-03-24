import User from '../models/User.model.js'
import { generateToken } from '../utils/generateToken.js'
import { sendOtpEmail } from '../utils/email.js'
import axios from 'axios'

const otpStore = new Map()

// @POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body

    if (!firstName || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all required fields' })
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered. Please login instead.' })
    }

    const user = await User.create({
      firstName, lastName, email, password, phone
    })

    const token = generateToken(user._id)

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone,
      }
    })
  } catch (err) {
    console.error('Register error:', err.message)
    res.status(500).json({ message: err.message })
  }
}

// @POST /api/auth/login
// @POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: 'Email is required' })
    }

    // Just find user and return token
    // OTP already verified by /verify-otp endpoint
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'No account found with this email' })
    }

    const token = generateToken(user._id)

    res.json({
      token,
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone,
      }
    })
  } catch (err) {
    console.error('Login error:', err.message)
    res.status(500).json({ message: err.message })
  }
}

// @POST /api/auth/google
export const googleLogin = async (req, res) => {
  try {
    const { accessToken } = req.body

    if (!accessToken) {
      return res.status(400).json({ message: 'Access token is required' })
    }

    let data
    try {
      const response = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      data = response.data
    } catch (googleErr) {
      return res.status(401).json({ message: 'Invalid or expired Google token' })
    }

    const { email, given_name, family_name, picture } = data

    if (!email) {
      return res.status(400).json({ message: 'Could not get email from Google' })
    }

    let user = await User.findOne({ email })

    if (!user) {
      user = await User.create({
        firstName: given_name || 'Google',
        lastName: family_name || 'User',
        email,
        password: Math.random().toString(36).slice(-8) + 'Aa1!',
        avatar: picture,
        isVerified: true,
      })
    }

    const token = generateToken(user._id)

    res.json({
      token,
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        avatar: user.avatar,
      }
    })
  } catch (err) {
    console.error('Google auth error:', err.message)
    res.status(500).json({ message: 'Google authentication failed' })
  }
}

// @POST /api/auth/send-otp
export const sendOtp = async (req, res) => {
  try {
    const { email, isLogin } = req.body

    if (!email) {
      return res.status(400).json({ message: 'Email is required' })
    }

    // Prevent OTP spam — 30 second cooldown
    const existing = otpStore.get(email)
    if (existing) {
      const timeLeft = Math.ceil((existing.expiry - Date.now()) / 1000)
      const sentRecently = timeLeft > 270
      if (sentRecently) {
        return res.status(429).json({
          message: `Please wait ${300 - timeLeft} seconds before requesting a new OTP.`
        })
      }
    }

    if (isLogin) {
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(404).json({
          message: 'No account found with this email. Please register first.'
        })
      }
    }

    if (!isLogin) {
      const user = await User.findOne({ email })
      if (user) {
        return res.status(400).json({
          message: 'Email already registered. Please login instead.'
        })
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiry = Date.now() + 5 * 60 * 1000
    otpStore.set(email, { otp, expiry: otpExpiry })

    await sendOtpEmail(email, otp)

    res.json({ message: 'OTP sent successfully to your email' })

  } catch (err) {
    console.error('Send OTP error:', err.message)
    res.status(500).json({ message: 'Failed to send OTP' })
  }
}

// @POST /api/auth/verify-otp
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' })
    }

    const stored = otpStore.get(email)

    if (!stored) {
      return res.status(400).json({ message: 'OTP not found. Please request a new one.' })
    }

    if (Date.now() > stored.expiry) {
      otpStore.delete(email)
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' })
    }

    if (stored.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' })
    }

    otpStore.delete(email)

    res.json({ message: 'OTP verified successfully', verified: true })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// @GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json({ user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
