// src/app/api/reports/route.js
import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/dbConnect'
import FinancialReport from '@/models/FinancialReport'
import User from '@/models/User' // tambahkan ini jika belum

export async function GET() {
  await dbConnect()
  const reports = await FinancialReport.find().populate('userId').lean()
  return NextResponse.json(reports)
}

export async function POST(req) {
  await dbConnect()
  try {
    const body = await req.json()
    console.log('[POST BODY]', body);

    const { userId, month, amount, description } = body

    const report = await FinancialReport.create({
      userId,
      month,
      amount,
      description
    })

    console.log('[NEW REPORT]', report);
    
    await User.findByIdAndUpdate(userId, { $inc: { total_income: amount } })

    return Response.json(report)
  } catch (err) {
    console.error(err)
    return Response.json({ error: 'Gagal tambah laporan' }, { status: 500 })
  }
}
