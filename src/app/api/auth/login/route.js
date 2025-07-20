// src/app/api/auth/login/route.js
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function POST(request) {
    const { username, password } = await request.json()

    const adminUsername = process.env.ADMIN_USERNAME
    const adminPassword = process.env.ADMIN_PASSWORD

    if (username !== adminUsername) {
        return NextResponse.json({ message: 'Invalid username' }, { status: 401 })
    }

    if (password !== adminPassword) {
        return NextResponse.json({ message: 'Invalid password' }, { status: 401 })
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    })

    const response = NextResponse.json({ message: 'Login success', username });

    response.cookies.set('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 86400,
    })

    return response
}
