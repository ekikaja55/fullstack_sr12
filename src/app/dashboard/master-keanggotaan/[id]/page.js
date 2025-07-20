// src/app/dashboard/master-keanggotaan/[id]/page.js
'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ReportTable from '@/components/ReportTable'
import '../../../../styles/detail-anggota.css'

export default function DetailAnggotaPage() {
  const { id } = useParams()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [downlines, setDownlines] = useState([])
  const [loading, setLoading] = useState(true)
  const [reports, setReports] = useState([])
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchDetail = async () => {
    try {
      const res = await fetch(`/api/users/${id}`)
      const data = await res.json()

      setUser(data.user)
      setDownlines(data.downlines)
      setLoading(false)
    } catch (err) {
      console.error('Gagal ambil data detail:', err)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDetail()

    fetch(`/api/reports/user-with-downline/${id}`)
      .then(res => res.json())
      .then(reports => {
        const grouped = {}

        reports.forEach(item => {
          const name = item.userId?.name || 'Unknown'
          const role = item.userId?.role || 'Unknown'
          const month = new Date(item.month).toLocaleString('id-ID', { month: 'long' }).toLowerCase()
          const amount = item.amount || 0
          const key = name + '-' + role

          if (!grouped[key]) {
            grouped[key] = { name, role }
          }

          grouped[key][month] = (grouped[key][month] || 0) + amount
        })

        const result = Object.values(grouped)
        setReports(result)
      })
      .catch(err => {
        console.error('Gagal ambil laporan:', err)
      })
  }, [id])

  const handleDelete = async () => {
    if (!confirm('⚠️ Yakin ingin menghapus anggota ini?\n\nTindakan ini tidak dapat dibatalkan dan akan menghapus semua data terkait.')) return

    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' })
      if (res.ok) {
        router.push('/dashboard/master-keanggotaan')
      } else {
        alert('Gagal menghapus user.')
      }
    } catch (err) {
      console.error('Error saat hapus:', err)
      alert('Terjadi kesalahan saat menghapus.')
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Memuat detail anggota...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="error-container">
        <div className="error-icon">😞</div>
        <h2>User Tidak Ditemukan</h2>
        <p>Anggota yang Anda cari tidak ditemukan atau telah dihapus.</p>
        <Link href="/dashboard/master-keanggotaan" className="back-btn">
          ← Kembali ke Daftar Anggota
        </Link>
      </div>
    )
  }

  return (
    <div className="detail-anggota">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link href="/dashboard/master-keanggotaan" className="breadcrumb-link">
          Master Keanggotaan
        </Link>
        <span className="breadcrumb-separator">→</span>
        <span className="breadcrumb-current">Detail Anggota</span>
      </nav>

      {/* Header */}
      <div className="detail-header">
        <div className="header-main">
          <div className="member-avatar-large">
            <span>{user.name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="header-info">
            <h1 className="member-title">{user.name}</h1>
            <p className="member-subtitle">
              <span className={`role-badge-large ${user.role.toLowerCase().replace(' ', '-')}`}>
                {user.role}
              </span>
            </p>
            <p className="member-id">ID: {user._id}</p>
          </div>
        </div>
        
        <div className="header-actions">
          <Link 
            href={`/dashboard/master-keanggotaan/${id}/edit`} 
            className="action-btn edit-btn"
          >
            <span>✏️</span>
            Edit
          </Link>
          <button 
            onClick={handleDelete}
            disabled={deleteLoading}
            className="action-btn delete-btn"
          >
            {deleteLoading ? (
              <>
                <span className="spinner-sm"></span>
                Menghapus...
              </>
            ) : (
              <>
                <span>🗑️</span>
                Hapus
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="detail-content">
        {/* Member Information */}
        <div className="info-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="title-icon">ℹ️</span>
              Informasi Anggota
            </h3>
          </div>
          <div className="card-content">
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Nama Lengkap</span>
                <span className="info-value">{user.name}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Nomor HP</span>
                <span className="info-value phone-number">
                  {user.nohp ? (
                    <a href={`tel:${user.nohp}`}>{user.nohp}</a>
                  ) : (
                    <span className="no-data">Tidak tersedia</span>
                  )}
                </span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Role</span>
                <span className={`role-badge ${user.role.toLowerCase().replace(' ', '-')}`}>
                  {user.role}
                </span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Upline</span>
                <span className="info-value">
                  {user.parentId?.name ? (
                    <Link 
                      href={`/dashboard/master-keanggotaan/${user.parentId._id}`}
                      className="upline-link"
                    >
                      {user.parentId.name}
                    </Link>
                  ) : (
                    <span className="no-data">Tidak ada upline</span>
                  )}
                </span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Total Income Pribadi</span>
                <span className="info-value income">
                  Rp {user.total_income.toLocaleString('id-ID')}
                </span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Tanggal Bergabung</span>
                <span className="info-value">
                  {new Date(user.createdAt).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Downlines Section */}
        <div className="downlines-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="title-icon">👥</span>
              Downline ({downlines.length})
            </h3>
            <div className="card-actions">
              <span className="count-badge">{downlines.length} anggota</span>
            </div>
          </div>
          
          <div className="card-content">
            {downlines.length === 0 ? (
              <div className="empty-downlines">
                <div className="empty-icon">👤</div>
                <p>Belum ada downline terdaftar</p>
              </div>
            ) : (
              <div className="downlines-grid">
                {downlines.map(dl => (
                  <div key={dl._id} className="downline-item">
                    <div className="downline-avatar">
                      <span>{dl.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="downline-info">
                      <h4 className="downline-name">{dl.name}</h4>
                      <p className={`downline-role role-badge-sm ${dl.role.toLowerCase().replace(' ', '-')}`}>
                        {dl.role}
                      </p>
                    </div>
                    <div className="downline-actions">
                      <Link 
                        href={`/dashboard/master-keanggotaan/${dl._id}`} 
                        className="view-btn"
                      >
                        <span>👁️</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reports Section */}
      <div className="reports-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="title-icon">📊</span>
            Laporan Keuangan
          </h2>
          <Link 
            href={`/dashboard/master-keanggotaan/${id}/reports`}
            className="view-full-btn"
          >
            <span>📈</span>
            Lihat Laporan Pribadi
          </Link>
        </div>
        
        <div className="reports-container">
          <ReportTable data={reports} />
        </div>
      </div>
    </div>
  )
}