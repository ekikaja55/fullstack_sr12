'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AddAnggota from '@/components/AddAnggota'
import '../../../styles/master-anggota.css'

export default function MasterKeanggotaanPage() {
  const [users, setUsers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [upline, setUpline] = useState('')
  const [last30Days, setLast30Days] = useState(false)
  const [loading, setLoading] = useState(true)

  const roleList = ['Distributor', 'Agen', 'Sub Agen', 'Reseller']

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users')
        const data = await res.json()
        setUsers(data)
        setFiltered(data)
        setLoading(false)
      } catch (err) {
        console.error('Gagal fetch users:', err)
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  useEffect(() => {
    let temp = [...users]

    if (role) {
      temp = temp.filter((u) => u.role === role)
    }

    if (upline) {
      temp = temp.filter((u) => u.parentId === upline)
    }

    if (last30Days) {
      const now = new Date()
      const date30DaysAgo = new Date(now.setDate(now.getDate() - 30))
      temp = temp.filter((u) => new Date(u.createdAt) >= date30DaysAgo)
    }

    if (search) {
      temp = temp.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    setFiltered(temp)
  }, [role, upline, last30Days, search, users])

  const resetFilter = () => {
    setRole('')
    setUpline('')
    setLast30Days(false)
    setSearch('')
  }

  const allUplines = users.map((u) => ({ id: u._id, name: u.name }))

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Memuat data anggota...</p>
      </div>
    )
  }

  return (
    <div className="master-keanggotaan">
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="title-icon">👥</span>
            Master Keanggotaan
          </h1>
          <p className="page-subtitle">
            Kelola semua data anggota SR12 dengan mudah dan efisien
          </p>
        </div>
        <div className="header-stats">
          <div className="stat-chip">
            <span className="stat-number">{filtered.length}</span>
            <span className="stat-label text-white text-bold ">Anggota Tampil</span>
          </div>
          <div className="stat-chip">
            <span className="stat-number">{users.length}</span>
            <span className="stat-label text-white text-bold">Total Anggota</span>
          </div>
        </div>
      </div>

      {/* Add Member Section */}
      <div className="add-member-section">
        <AddAnggota onSuccess={(newUser) => {
          setUsers(prev => [...prev, newUser])
        }} />
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-header">
          <h3 className="filter-title">
            <span className="filter-icon">🔍</span>
            Filter & Pencarian
          </h3>
          <button 
            onClick={resetFilter} 
            className="reset-btn"
          >
            <span>🔄</span>
            Reset Filter
          </button>
        </div>

        <div className="filter-grid">
          <div className="filter-group">
            <label className="filter-label">Role</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)} 
              className="filter-select"
            >
              <option value="">Semua Role</option>
              {roleList.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Upline</label>
            <select 
              value={upline} 
              onChange={(e) => setUpline(e.target.value)} 
              className="filter-select"
            >
              <option value="">Semua Upline</option>
              {allUplines.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Cari Nama</label>
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Ketik nama anggota..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Periode</label>
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                id="last30days"
                checked={last30Days}
                onChange={(e) => setLast30Days(e.target.checked)}
                className="filter-checkbox"
              />
              <label htmlFor="last30days" className="checkbox-label">
                <span className="checkbox-custom"></span>
                30 Hari Terakhir
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="members-section">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3 className="empty-title">Tidak Ada Data</h3>
            <p className="empty-message">
              {users.length === 0 
                ? 'Belum ada anggota yang terdaftar. Tambahkan anggota pertama Anda!'
                : 'Tidak ada anggota yang sesuai dengan filter yang dipilih.'
              }
            </p>
            {users.length === 0 && (
              <button 
                onClick={() => document.querySelector('.add-member-section').scrollIntoView({ behavior: 'smooth' })}
                className="empty-action-btn"
              >
                Tambah Anggota Pertama
              </button>
            )}
          </div>
        ) : (
          <div className="members-grid">
            {filtered.map((user) => (
              <div key={user._id} className="member-card">
                <div className="card-header">
                  <div className="member-avatar">
                    <span>{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="member-info">
                    <h3 className="member-name">{user.name}</h3>
                    <p className="member-phone">{user.nohp || 'No. HP tidak tersedia'}</p>
                  </div>
                </div>

                <div className="card-content">
                  <div className="info-row">
                    <span className="info-label">Role:</span>
                    <span className={`role-badge ${user.role.toLowerCase().replace(' ', '-')}`}>
                      {user.role}
                    </span>
                  </div>
                  
                  <div className="info-row">
                    <span className="info-label">Upline:</span>
                    <span className="info-value">{user.parentName || 'Tidak ada'}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="info-label">Bergabung:</span>
                    <span className="info-date">
                      {new Date(user.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                <div className="card-actions">
                  <Link
                    href={`/dashboard/master-keanggotaan/${user._id}`}
                    className="detail-btn"
                  >
                    <span>👁️</span>
                    Lihat Detail
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}