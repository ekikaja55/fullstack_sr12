// src/app/dashboard/master-keanggotaan/[id]/edit/page.js
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function EditUserPage() {
  const { id } = useParams()
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    nohp: '',
    role: '',
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${id}`)
        const data = await res.json()
        setForm({
          name: data.user.name,
          nohp: data.user.nohp || '',
          role: data.user.role,
        })
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [id])

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (res.ok) {
        // Add success feedback before redirect
        setTimeout(() => {
          router.push(`/dashboard/master-keanggotaan/${id}`)
        }, 500)
      } else {
        alert('Gagal update data.')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Terjadi kesalahan saat menyimpan data.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push(`/dashboard/master-keanggotaan/${id}`)
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted fs-5">Memuat data anggota...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid py-4">
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="edit-header-card glass-effect">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div className="d-flex align-items-center gap-3">
                <div className="edit-icon-container">
                  <i className="bi bi-person-gear"></i>
                </div>
                <div>
                  <h1 className="edit-title mb-1">Edit Anggota</h1>
                  <p className="edit-subtitle mb-0">Perbarui informasi anggota</p>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button 
                  type="button" 
                  onClick={handleCancel}
                  className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
                >
                  <i className="bi bi-arrow-left"></i>
                  <span className="d-none d-sm-inline">Kembali</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-6">
          <div className="edit-form-card">
            <form onSubmit={handleSubmit} className="edit-form">
              {/* Form Fields */}
              <div className="row g-4">
                {/* Name Field */}
                <div className="col-12">
                  <div className="form-group-enhanced">
                    <label className="form-label-enhanced">
                      <i className="bi bi-person-fill form-label-icon"></i>
                      Nama Lengkap
                      <span className="text-danger">*</span>
                    </label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="form-control-enhanced"
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                  </div>
                </div>

                {/* Phone Field */}
                <div className="col-12">
                  <div className="form-group-enhanced">
                    <label className="form-label-enhanced">
                      <i className="bi bi-phone-fill form-label-icon"></i>
                      Nomor Telepon
                    </label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        name="nohp"
                        value={form.nohp}
                        onChange={handleChange}
                        className="form-control-enhanced"
                        placeholder="Contoh: 081234567890"
                      />
                    </div>
                  </div>
                </div>

                {/* Role Field */}
                <div className="col-12">
                  <div className="form-group-enhanced">
                    <label className="form-label-enhanced">
                      <i className="bi bi-award-fill form-label-icon"></i>
                      Role/Posisi
                      <span className="text-danger">*</span>
                    </label>
                    <div className="select-wrapper">
                      <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        required
                        className="form-select-enhanced"
                      >
                        <option value="">Pilih Role</option>
                        <option value="Distributor">🏢 Distributor</option>
                        <option value="Agen">👤 Agen</option>
                        <option value="Sub Agen">👥 Sub Agen</option>
                        <option value="Reseller">🛍️ Reseller</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="form-actions">
                <div className="d-flex gap-3 justify-content-end flex-wrap">
                  <button 
                    type="button" 
                    onClick={handleCancel}
                    className="btn-cancel"
                    disabled={submitting}
                  >
                    <i className="bi bi-x-circle"></i>
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    className="btn-save"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle"></i>
                        Simpan Perubahan
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}