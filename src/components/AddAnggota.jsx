// src/components/AddAggota.jsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddAnggota({ onSuccess }) {
  const [name, setName] = useState('')
  const [nohp, setNohp] = useState('')
  const [role, setRole] = useState('')
  const [tgl, setTgl] = useState('')
  const [parentId, setParentId] = useState('')
  const [allUsers, setAllUsers] = useState([])


  const roleHierarchy = ['Distributor', 'Agen', 'Sub Agen', 'Reseller']

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users')
        const data = await res.json()
        setAllUsers(data)
      } catch (error) {
        console.error('Gagal ambil user:', error)
      }
    }

    fetchUsers()
  }, [])

  const getAllowedUplineRoles = (selectedRole) => {
    const index = roleHierarchy.indexOf(selectedRole)
    return roleHierarchy.slice(0, index)
  }

  const allowedUplines = allUsers.filter((user) =>
    getAllowedUplineRoles(role).includes(user.role)
  )

  const handleSubmit = async (e) => {
    e.preventDefault()

    const body = {
      name,
      nohp,
      role,
      parentId: parentId || null,
      tgl,
    }

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const error = await res.json()
        alert(`Gagal: ${error.error}`)
        return
      }

      const newUser = await res.json()
      alert('User berhasil ditambahkan!')

      // ⛳️ Kirim ke parent
      onSuccess?.(newUser)

      // Reset form
      setName('')
      setNohp('')
      setRole('')
      setParentId('')
    } catch (err) {
      console.error('Gagal menambahkan user:', err)
      alert('Terjadi kesalahan saat menyimpan data.')
    }
  }

  return (
    <div className="max-w-xl mx-auto ">

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nama"
          className="w-full border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="No HP"
          className="w-full border p-2 rounded"
          value={nohp}
          onChange={(e) => setNohp(e.target.value)}
        />

        <select
          className="w-full border p-2 rounded"
          value={role}
          onChange={(e) => {
            setRole(e.target.value)
            setParentId('')
          }}
          required
        >
          <option value="">-- Pilih Role --</option>
          {roleHierarchy.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        <input
          type="date"
          className="w-full border p-2 rounded"
          value={tgl}
          onChange={(e) => setTgl(e.target.value)}
          required
        />

        {role && role !== 'Distributor' && (
          <select
            className="w-full border p-2 rounded"
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            required
          >
            <option value="">-- Pilih Upline --</option>
            {allowedUplines.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-danger px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </form>
    </div>
  )
}
