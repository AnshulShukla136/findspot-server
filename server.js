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
app.set('trust proxy', 1)

// Connect to MongoDB
connectDB()

// Rate limiters
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many auth attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

const otpLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  message: { message: 'Too many OTP requests. Please wait a minute.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Middleware
app.use(helmet())

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'https://findspot-black.vercel.app',
  ],
  credentials: true,
}))

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())

// Global rate limit
app.use('/api', globalLimiter)

// ✅ OTP limiter BEFORE auth limiter
app.use('/api/auth/send-otp', otpLimiter)
app.use('/api/auth', authLimiter, authRoutes)

// Routes
app.use('/api/search', searchRoutes)
app.use('/api/products', productRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK'
  })
})

// Error handler
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 findSpot server running on port ${PORT}`)
  console.log(`📡 API: http://localhost:${PORT}/api`)
  console.log(`🌐 Client: ${process.env.CLIENT_URL}`)
})