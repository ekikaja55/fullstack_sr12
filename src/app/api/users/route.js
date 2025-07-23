// src/app/api/users/route.js
import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/dbConnect'
import User from '@/models/User'

export async function GET() {
  await dbConnect()
  const users = await User.find().populate('parentId').lean()

  const formattedUsers = users.map(u => ({
    _id: u._id.toString(),
    name: u.name,
    nohp: u.nohp,
    role: u.role,
    total_income: u.total_income,
    parentId: u.parentId?._id?.toString() || null,
    parentName: u.parentId?.name || null,
    tgl: u.tgl,
    createdAt: u.createdAt
    }))

  return NextResponse.json(formattedUsers)
}

export async function POST(req) {
  await dbConnect()

  try {
    const body = await req.json()
    const { name, nohp, role, parentId, tgl } = body

    const existing = await User.findOne({ name })
    if (existing) {
      return NextResponse.json({ error: 'Nama sudah terdaftar' }, { status: 400 })
    }

    const newUser = await User.create({ name, nohp, role, parentId, tgl })
    return NextResponse.json(newUser, { status: 201 })
  } catch (err) {
    console.error('Error:', err)
    return NextResponse.json({ error: 'Terjadi kesalahan saat membuat user' }, { status: 500 })
  }
}

