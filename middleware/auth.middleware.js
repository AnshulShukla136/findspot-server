<<<<<<< HEAD
import jwt from 'jsonwebtoken'
import User from '../models/User.model.js'
import { generateToken } from '../utils/generateToken.js'

export const protect = async (req, res, next) => {
  try {
    let token
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password')

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' })
    }

    // Auto refresh token if less than 15 minutes remaining
    const tokenExp = decoded.exp * 1000
    const now = Date.now()
    const timeLeft = tokenExp - now
    const fifteenMinutes = 15 * 60 * 1000

    if (timeLeft < fifteenMinutes) {
      const newToken = generateToken(req.user._id)
      res.setHeader('x-new-token', newToken)
    }

    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired. Please login again.' })
    }
    res.status(401).json({ message: 'Not authorized, token failed' })
  }
=======
import jwt from 'jsonwebtoken'
import User from '../models/User.model.js'
import { generateToken } from '../utils/generateToken.js'

export const protect = async (req, res, next) => {
  try {
    let token
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password')

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' })
    }

    // Auto refresh token if less than 15 minutes remaining
    const tokenExp = decoded.exp * 1000
    const now = Date.now()
    const timeLeft = tokenExp - now
    const fifteenMinutes = 15 * 60 * 1000

    if (timeLeft < fifteenMinutes) {
      const newToken = generateToken(req.user._id)
      res.setHeader('x-new-token', newToken)
    }

    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired. Please login again.' })
    }
    res.status(401).json({ message: 'Not authorized, token failed' })
  }
>>>>>>> e49221474f114a779c286c41770d1ac46fa7ad76
}