import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import { connectDB } from './config/db.js'
import authRoutes from './routes/auth.routes.js'
import searchRoutes from './routes/search.routes.js'
import productRoutes from './routes/product.routes.js'
import { errorHandler } from './middleware/error.middleware.js'

dotenv.config()

const app = express()

// Connect to MongoDB
connectDB()

// Rate limiters
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 min
  message: { message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 auth requests per 15 min
  message: { message: 'Too many auth attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

const otpLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // 3 OTP requests per minute
  message: { message: 'Too many OTP requests. Please wait a minute.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Middleware
app.use(helmet())

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'],
  credentials: true,
}))

app.use(morgan('dev'))
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())

// Apply global rate limit
app.use('/api', globalLimiter)

// Routes
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/auth/send-otp', otpLimiter)
app.use('/api/search', searchRoutes)
app.use('/api/products', productRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'findSpot API is running 🚀',
    environment: process.env.NODE_ENV,
  })
})

// Error handler
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 findSpot server running on port ${PORT}`)
  console.log(`📡 API: http://localhost:${PORT}/api`)
  console.log(`🌐 Client: http://localhost:5173`)
})