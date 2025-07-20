// src/app/api/auth/logout/route.js
import { NextResponse } from 'next/server'

export async function GET(request) {
  const response = NextResponse.redirect(new URL('/', request.url))
  response.cookies.set('token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  })
  return response
}
