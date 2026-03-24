import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config() // ← add this back

const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    family: 4,        // ← ADD THIS — forces IPv4
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

// Verify connection on startup
const transporter = createTransporter()

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email transporter error:', error.message)
    console.error('EMAIL_USER:', process.env.EMAIL_USER)
    console.error('EMAIL_PASS:', process.env.EMAIL_PASS ? 'loaded' : 'MISSING')
  } else {
    console.log('✅ Email server ready to send messages')
  }
})

export const sendOtpEmail = async (email, otp) => {
  try {
    // Create fresh transporter each time to avoid credential issues
    const freshTransporter = createTransporter()

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Your findSpot OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
          
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 28px; font-weight: 400; color: #0b0b0b; margin: 0;">
              findSpot
            </h1>
            <p style="color: #999; font-size: 13px; margin-top: 4px;">
              Every deal, one spot.
            </p>
          </div>

          <div style="background: #f9f9f9; border-radius: 16px; padding: 32px; text-align: center;">
            <p style="color: #666; font-size: 14px; margin-bottom: 24px;">
              Your OTP for findSpot verification is:
            </p>
            <div style="background: #0b0b0b; border-radius: 12px; padding: 20px 40px; display: inline-block; margin-bottom: 24px;">
              <h2 style="color: #ffffff; font-size: 36px; font-weight: 600; letter-spacing: 8px; margin: 0;">
                ${otp}
              </h2>
            </div>
            <p style="color: #999; font-size: 13px; margin: 0;">
              This OTP is valid for <strong>5 minutes</strong> only.
            </p>
            <p style="color: #999; font-size: 13px; margin-top: 8px;">
              Do not share this OTP with anyone.
            </p>
          </div>

          <div style="text-align: center; margin-top: 32px;">
            <p style="color: #ccc; font-size: 12px;">
              If you didn't request this OTP, please ignore this email.
            </p>
            <p style="color: #ccc; font-size: 12px; margin-top: 4px;">
              © 2026 findSpot. All rights reserved.
            </p>
          </div>

        </div>
      `,
    }

    await freshTransporter.sendMail(mailOptions)
    console.log(`📧 OTP email sent to ${email}`)

  } catch (err) {
    console.error(`❌ Failed to send email to ${email}:`, err.message)
    throw new Error('Failed to send OTP email. Please try again.')
  }
}