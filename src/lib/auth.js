// lib/auth.js
import { jwtVerify } from 'jose'

export async function verifyToken(token) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)

    const { payload } = await jwtVerify(token, secret)
    console.log('✅ Decoded payload:', payload)
    return payload
  } catch (err) {
    console.log('❌ Invalid token:', err.message)
    return null
  }
}
