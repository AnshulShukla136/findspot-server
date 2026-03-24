<<<<<<< HEAD
import jwt from 'jsonwebtoken'

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  })
=======
import jwt from 'jsonwebtoken'

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  })
>>>>>>> e49221474f114a779c286c41770d1ac46fa7ad76
}