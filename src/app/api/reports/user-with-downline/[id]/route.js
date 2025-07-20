// src/app/api/reports/user-with-downline/[id]/route.js
import { dbConnect } from '@/lib/dbConnect'
import FinancialReport from '@/models/FinancialReport'
import User from '@/models/User'

export async function GET(req, { params }) {
  await dbConnect()
  const { id } = params

  // Ambil user + semua downline langsung
  const mainUser = await User.findById(id).lean()
  const downlines = await User.find({ parentId: id }).lean()
  const userIds = [id, ...downlines.map(dl => dl._id.toString())]

  // Ambil semua report user & downline
  const reports = await FinancialReport.find({ userId: { $in: userIds } })
    .populate('userId')
    .lean()

  return Response.json(reports)
}
