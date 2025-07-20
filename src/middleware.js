// src/middleware.js
import { NextResponse } from 'next/server'
import { verifyToken } from './lib/auth'

export async function middleware(request) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  console.log('TOKEN:', token)

  if (!token) {
    console.log('⚠️ No token, redirecting to login')
    return NextResponse.redirect(new URL('/', request.url))
  }

  const verified = await verifyToken(token)
  console.log('VERIFIED:', verified)

  // Kalau verified kosong/null/false
  if (!verified || !verified.username) {
    console.log('❌ Invalid token, redirecting to login')
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Token valid, lanjutkan
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
