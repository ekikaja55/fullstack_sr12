// app/api/auth/me/route.js
import { verifyToken } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const token = request.cookies.get('token')?.value
  if (!token) return NextResponse.json({ error: 'No token' }, { status: 401 })

  const payload = await verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 403 })

  return NextResponse.json({ username: payload.username })
}
