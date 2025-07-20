// src/app/api/reports/[id]/route.js
import { dbConnect } from '@/lib/dbConnect'
import FinancialReport from '@/models/FinancialReport'
import User from '@/models/User'

export async function GET(req, { params }) {
    await dbConnect()
    const { id } = params
    const reports = await FinancialReport.find({ userId: id }).sort({ createdAt: -1 }).lean()
    return Response.json(reports)
}

export async function DELETE(req, { params }) {
    await dbConnect()
    try {
        const report = await FinancialReport.findById(params.id)
        if (!report) return Response.json({ error: 'Tidak ditemukan' }, { status: 404 })

        await User.findByIdAndUpdate(report.userId, { $inc: { total_income: -report.amount } })
        await report.deleteOne()

        return Response.json({ success: true })
    } catch (err) {
        console.error(err)
        return Response.json({ error: 'Gagal hapus laporan' }, { status: 500 })
    }
}

export async function PUT(req, { params }) {
    await dbConnect()
    try {

        const { id } = params
        const body = await req.json()
        console.log('[PUT BODY]', body);

        const report = await FinancialReport.findById(id)
        if (!report) return Response.json({ error: 'Laporan tidak ditemukan' }, { status: 404 })

        const oldAmount = report.amount
        const newAmount = body.amount

        // Update total_income user jika jumlah berubah
        if (oldAmount !== newAmount) {
            const diff = newAmount - oldAmount
            await User.findByIdAndUpdate(report.userId, { $inc: { total_income: diff } })
        }

        // Update laporan
        report.description = body.description || report.description
        report.amount = newAmount
        report.month = body.month || report.month
        await report.save()

        return Response.json({ success: true, report })
    } catch (err) {
        console.error(err)
        return Response.json({ error: 'Gagal update laporan' }, { status: 500 })
    }
}
