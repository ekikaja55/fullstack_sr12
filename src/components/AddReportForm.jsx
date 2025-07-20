// src/components/AddReportForm.jsx
'use client'
import { useState } from 'react'

export default function AddReportForm({ userId }) {
  const [month, setMonth] = useState('')
  const [amount, setAmount] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, month, amount: Number(amount) })
    })

    if (res.ok) {
      alert('Laporan berhasil ditambahkan!')
      setMonth('')
      setAmount('')
    } else {
      alert('Gagal menambahkan laporan')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 border p-4 rounded-xl">
      <h3 className="font-bold">Tambah Laporan</h3>
      <input type="text" placeholder="Juli 2025" value={month} onChange={(e) => setMonth(e.target.value)} className="border w-full p-2 rounded" />
      <input type="number" placeholder="Jumlah (Rp)" value={amount} onChange={(e) => setAmount(e.target.value)} className="border w-full p-2 rounded" />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Simpan</button>
    </form>
  )
}

