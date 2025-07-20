// src/app/dashboard/master-keanggotaan/[id]/reports/page.js
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function FinancialReports() {
    const { id } = useParams()

    const [user, setUser] = useState(null)
    const [month, setMonth] = useState('')
    const [amount, setAmount] = useState('')
    const [description, setDescription] = useState('')
    const [reports, setReports] = useState([])
    const [editing, setEditing] = useState(null)
    const [editMonth, setEditMonth] = useState('')
    const [editAmount, setEditAmount] = useState('')
    const [editDescription, setEditDescription] = useState('')
    const [sortBy, setSortBy] = useState('')
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [updating, setUpdating] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const [userRes, reportsRes] = await Promise.all([
                    fetch(`/api/users/${id}`),
                    fetch(`/api/reports/${id}`)
                ])

                const userData = await userRes.json()
                const reportsData = await reportsRes.json()

                setUser(userData)
                setReports(reportsData)
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)

        const fullMonth = `${month}-01`

        // ✅ Cek apakah bulan sudah ada
        const alreadyExists = reports.some(r => r.month === fullMonth)
        if (alreadyExists) {
            const readable = new Date(fullMonth).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
            alert(`Bulan ${readable} sudah diinput!`)
            setSubmitting(false)
            return
        }

        if (!confirm('Yakin Tambah laporan?')) {
            setSubmitting(false)
            return
        }

        try {
            const res = await fetch('/api/reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: id, month: fullMonth, amount: parseFloat(amount), description }),
            })

            const data = await res.json()
            setReports([...reports, data])
            setMonth('')
            setAmount('')
            setDescription('')
        } catch (error) {
            console.error('Error adding report:', error)
        } finally {
            setSubmitting(false)
        }
    }

    const handleEdit = (report) => {
        setEditing(report._id)
        setEditMonth(report.month.slice(0, 7))
        setEditAmount(report.amount.toString())
        setEditDescription(report.description || '')
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        setUpdating(true)

        const updatedMonth = `${editMonth}-01`

        // ✅ Cek apakah bulan sudah diinput oleh laporan lain
        const alreadyExists = reports.some(r =>
            r.month === updatedMonth && r._id !== editing
        )
        if (alreadyExists) {
            const readable = new Date(updatedMonth).toLocaleDateString('id-ID', {
                month: 'long',
                year: 'numeric'
            })
            alert(`Bulan ${readable} sudah diinput!`)
            setUpdating(false)
            return
        }

        if (!confirm('Yakin Update laporan?')) {
            setUpdating(false)
            return
        }

        try {
            const res = await fetch(`/api/reports/${editing}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    month: updatedMonth,
                    amount: parseFloat(editAmount),
                    description: editDescription
                }),
            })

            const { report } = await res.json()

            setReports(prev => prev.map(r => r._id === editing ? report : r))
            setEditing(null)
            setEditMonth('')
            setEditAmount('')
            setEditDescription('')
        } catch (error) {
            console.error('Error updating report:', error)
        } finally {
            setUpdating(false)
        }
    }

    const handleDelete = async (reportId) => {
        if (!confirm('Yakin Hapus laporan?')) return

        try {
            await fetch(`/api/reports/${reportId}`, { method: 'DELETE' })
            setReports(prev => prev.filter(r => r._id !== reportId))
        } catch (error) {
            console.error('Error deleting report:', error)
        }
    }

    const sortedReports = [...reports].sort((a, b) => {
        if (sortBy === 'amount-asc') return a.amount - b.amount
        if (sortBy === 'amount-desc') return b.amount - a.amount
        if (sortBy === 'updated') return new Date(b.updatedAt) - new Date(a.updatedAt)

        // 🗓 Default sort berdasarkan bulan ASCENDING
        return new Date(a.month) - new Date(b.month)
    })

    const totalAmount = sortedReports.reduce((acc, curr) => acc + curr.amount, 0)
    const totalFormatted = totalAmount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted">Memuat data laporan...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container-fluid p-0">
            {/* Header Section */}
            <div className="row g-0 mb-4">
                <div className="col-12">
                    <div className="edit-header-card">
                        <div className="row align-items-center">
                            <div className="col-auto">
                                <div className="edit-icon-container">
                                    <i className="bi bi-graph-up-arrow"></i>
                                </div>
                            </div>
                            <div className="col">
                                <div className="d-flex justify-content-between align-items-start flex-wrap">
                                    <div>
                                        <h1 className="edit-title mb-1">Laporan Keuangan Pribadi</h1>
                                        <p className="edit-subtitle mb-0">
                                            <i className="bi bi-person-circle me-2"></i>
                                            {user?.user.name}
                                        </p>
                                    </div>
                                    <Link
                                        href={`/dashboard/master-keanggotaan/${user?.user._id}`}
                                        className="btn btn-outline-primary d-flex align-items-center gap-2 mt-2 mt-md-0"
                                        style={{ borderRadius: 'var(--border-radius)' }}
                                    >
                                        <i className="bi bi-arrow-left"></i>
                                        <span className="d-none d-sm-inline">Kembali ke Detail</span>
                                        <span className="d-sm-none">Kembali</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <div className="row g-5 mb-4">
                <div className="col-lg-8">
                    <div className="edit-form-card">
                        <div className="d-flex align-items-center gap-2 mb-4">
                            <i className="bi bi-plus-circle-fill text-primary fs-5"></i>
                            <h3 className="h5 mb-0 fw-bold text-dark">Tambah Laporan Baru</h3>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="form-group-enhanced">
                                        <label className="form-label-enhanced">
                                            <i className="bi bi-calendar-month form-label-icon"></i>
                                            Bulan
                                        </label>
                                        <div className="input-wrapper">
                                            <input
                                                type="month"
                                                className="form-control-enhanced"
                                                value={month}
                                                onChange={(e) => setMonth(e.target.value)}
                                                required
                                                disabled={submitting}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group-enhanced">
                                        <label className="form-label-enhanced">
                                            <i className="bi bi-currency-dollar form-label-icon"></i>
                                            Jumlah (Rp)
                                        </label>
                                        <div className="input-wrapper">
                                            <input
                                                type="number"
                                                className="form-control-enhanced"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                placeholder="Masukkan jumlah"
                                                min="0"
                                                step="1000"
                                                required
                                                disabled={submitting}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="form-group-enhanced">
                                        <label className="form-label-enhanced">
                                            <i className="bi bi-chat-text form-label-icon"></i>
                                            Deskripsi
                                        </label>
                                        <div className="input-wrapper">
                                            <input
                                                type="text"
                                                className="form-control-enhanced"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="Tambahkan deskripsi (opsional)"
                                                disabled={submitting}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="btn-save"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <div className="spinner-border spinner-border-sm me-2" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-plus-lg"></i>
                                            Tambah Laporan
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Summary Card */}
                <div className="col-lg-4">
                    <div className="card h-100 border-0 shadow-sm" style={{ background: 'var(--success-gradient)', borderRadius: 'var(--border-radius)' }}>
                        <div className="card-body text-white d-flex flex-column justify-content-center">
                            <div className="text-center">
                                <i className="bi bi-wallet2 display-4 mb-3 opacity-75"></i>
                                <h6 className="text-white-50 text-uppercase small mb-2">Total Laporan</h6>
                                <h3 className="fw-bold mb-2">{totalFormatted}</h3>
                                <p className="mb-0 opacity-75">
                                    <i className="bi bi-file-earmark-text me-1"></i>
                                    {reports.length} laporan tercatat
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="row g-0">
                <div className="col-12">
                    <div className="edit-form-card">
                        {/* Table Header */}
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div className="d-flex align-items-center gap-2">
                                <i className="bi bi-table text-primary fs-5"></i>
                                <h3 className="h5 mb-0 fw-bold text-dark">Data Laporan</h3>
                            </div>

                            {/* Sort Filter */}
                            <div className="d-flex align-items-center gap-2">
                                <label className="form-label-enhanced mb-0 small">
                                    <i className="bi bi-funnel form-label-icon"></i>
                                    Urutkan:
                                </label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="form-select-enhanced"
                                    style={{ width: 'auto', minWidth: '180px' }}
                                >
                                    <option value="">Bulan (Default)</option>
                                    <option value="amount-desc">Jumlah Terbesar</option>
                                    <option value="amount-asc">Jumlah Terkecil</option>
                                    <option value="updated">Terakhir Diedit</option>
                                </select>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead>
                                    <tr style={{ background: 'linear-gradient(135deg, #f8f9ff 0%, #e5e7eb 100%)' }}>
                                        <th className="fw-bold text-dark border-0 py-3 px-4">
                                            <i className="bi bi-calendar3 me-2"></i>Bulan
                                        </th>
                                        <th className="fw-bold text-dark border-0 py-3 px-4">
                                            <i className="bi bi-cash-coin me-2"></i>Jumlah
                                        </th>
                                        <th className="fw-bold text-dark border-0 py-3 px-4 d-none d-md-table-cell">
                                            <i className="bi bi-chat-square-text me-2"></i>Deskripsi
                                        </th>
                                        <th className="fw-bold text-dark border-0 py-3 px-4 d-none d-lg-table-cell">
                                            <i className="bi bi-clock me-2"></i>Dibuat
                                        </th>
                                        <th className="fw-bold text-dark border-0 py-3 px-4 d-none d-lg-table-cell">
                                            <i className="bi bi-clock-history me-2"></i>Diperbarui
                                        </th>
                                        <th className="fw-bold text-dark border-0 py-3 px-4 text-center">
                                            <i className="bi bi-gear me-2"></i>Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedReports.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center py-5">
                                                <div className="text-muted">
                                                    <i className="bi bi-inbox display-4 d-block mb-3 opacity-25"></i>
                                                    <p className="mb-0">Belum ada laporan yang ditambahkan</p>
                                                    <small>Mulai tambahkan laporan keuangan pertama Anda</small>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        sortedReports.map((r) => (
                                            <tr key={r._id} className="border-bottom" style={{ borderColor: '#f0f0f0 !important' }}>
                                                <td className="py-3 px-4">
                                                    {editing === r._id ? (
                                                        <input
                                                            type="month"
                                                            value={editMonth}
                                                            onChange={(e) => setEditMonth(e.target.value)}
                                                            className="form-control-enhanced"
                                                            disabled={updating}
                                                        />
                                                    ) : (
                                                        <div className="d-flex align-items-center gap-2">
                                                            <i className="bi bi-calendar-check text-primary"></i>
                                                            <span className="fw-medium">
                                                                {new Date(r.month).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                                                            </span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {editing === r._id ? (
                                                        <input
                                                            type="number"
                                                            value={editAmount}
                                                            onChange={(e) => setEditAmount(e.target.value)}
                                                            className="form-control-enhanced"
                                                            min="0"
                                                            step="1000"
                                                            disabled={updating}
                                                        />
                                                    ) : (
                                                        <span className="badge bg-success fs-6 px-3 py-2">
                                                            Rp {r.amount.toLocaleString('id-ID')}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 d-none d-md-table-cell">
                                                    {editing === r._id ? (
                                                        <input
                                                            type="text"
                                                            value={editDescription}
                                                            onChange={(e) => setEditDescription(e.target.value)}
                                                            className="form-control-enhanced"
                                                            placeholder="Deskripsi"
                                                            disabled={updating}
                                                        />
                                                    ) : (
                                                        <span className="text-muted">
                                                            {r.description || (
                                                                <em className="opacity-50">
                                                                    <i className="bi bi-dash-lg"></i> Tidak ada deskripsi
                                                                </em>
                                                            )}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 d-none d-lg-table-cell">
                                                    <small className="text-muted">
                                                        <i className="bi bi-calendar-plus me-1"></i>
                                                        {new Date(r.createdAt).toLocaleString('id-ID', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </small>
                                                </td>
                                                <td className="py-3 px-4 d-none d-lg-table-cell">
                                                    <small className="text-muted">
                                                        <i className="bi bi-pencil-square me-1"></i>
                                                        {new Date(r.updatedAt).toLocaleString('id-ID', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </small>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="d-flex gap-2 justify-content-center">
                                                        {editing === r._id ? (
                                                            <>
                                                                <button
                                                                    className="btn btn-success btn-sm d-flex align-items-center gap-1"
                                                                    onClick={handleUpdate}
                                                                    disabled={updating}
                                                                    style={{ borderRadius: 'var(--border-radius)' }}
                                                                >
                                                                    {updating ? (
                                                                        <div className="spinner-border spinner-border-sm" role="status">
                                                                            <span className="visually-hidden">Loading...</span>
                                                                        </div>
                                                                    ) : (
                                                                        <i className="bi bi-check-lg"></i>
                                                                    )}
                                                                    <span className="d-none d-sm-inline">Simpan</span>
                                                                </button>
                                                                <button
                                                                    className="btn btn-secondary btn-sm d-flex align-items-center gap-1"
                                                                    onClick={() => setEditing(null)}
                                                                    disabled={updating}
                                                                    style={{ borderRadius: 'var(--border-radius)' }}
                                                                >
                                                                    <i className="bi bi-x-lg"></i>
                                                                    <span className="d-none d-sm-inline">Batal</span>
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    className="btn btn-warning btn-sm d-flex align-items-center gap-1"
                                                                    onClick={() => handleEdit(r)}
                                                                    style={{ borderRadius: 'var(--border-radius)' }}
                                                                >
                                                                    <i className="bi bi-pencil"></i>
                                                                    <span className="d-none d-sm-inline">Edit</span>
                                                                </button>
                                                                <button
                                                                    className="btn btn-danger btn-sm d-flex align-items-center gap-1"
                                                                    onClick={() => handleDelete(r._id)}
                                                                    style={{ borderRadius: 'var(--border-radius)' }}
                                                                >
                                                                    <i className="bi bi-trash"></i>
                                                                    <span className="d-none d-sm-inline">Hapus</span>
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}