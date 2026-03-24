<<<<<<< HEAD
import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`✅ MongoDB connected: ${conn.connection.host}`)
  } catch (err) {
    console.error(`❌ MongoDB error: ${err.message}`)
    process.exit(1)
  }
=======
import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`✅ MongoDB connected: ${conn.connection.host}`)
  } catch (err) {
    console.error(`❌ MongoDB error: ${err.message}`)
    process.exit(1)
  }
>>>>>>> e49221474f114a779c286c41770d1ac46fa7ad76
}