// src/app/api/users/[id]/route.js
import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/dbConnect'
import User from '@/models/User'

export async function GET(req, { params }) {
  await dbConnect()

  const { id } = params

  try {
    const user = await User.findById(id).populate('parentId').lean()
    if (!user) return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })

    const downlines = await User.find({ parentId: id }).lean()

    return NextResponse.json({ user, downlines })
  } catch (error) {
    console.error('Error ambil detail user:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan saat mengambil data' }, { status: 500 })
  }
}

export async function PUT(req, { params }) {
  await dbConnect()
  const { id } = params
  const body = await req.json()

  try {
    const user = await User.findByIdAndUpdate(id, body, { new: true })
    if (!user) return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })
    return NextResponse.json({ message: 'User diperbarui', user })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Gagal update user' }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  await dbConnect()
  const { id } = params

  try {
    await User.findByIdAndDelete(id)
    return NextResponse.json({ message: 'User dihapus' })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Gagal hapus user' }, { status: 500 })
  }
}

