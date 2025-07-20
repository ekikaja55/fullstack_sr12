// src/app/dashboard/page.js
import { dbConnect } from '@/lib/dbConnect'
import User from '@/models/User'
import '../../styles/dashboard.css'

export default async function DashboardPage() {
  await dbConnect()

  const totalUsers = await User.countDocuments()
  const roles = await User.aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ])

  // Calculate some additional stats
  const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5)
  
  return (
    <div className="dashboard-home">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">
            <span className="title-icon">📊</span>
            Dashboard Overview
          </h1>
          <p className="dashboard-subtitle">
            Welcome back! Here's what's happening with your SR12 community today.
          </p>
        </div>
        <div className="header-decoration">
          <div className="decoration-circle"></div>
          <div className="decoration-circle"></div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <span>👥</span>
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{totalUsers.toLocaleString()}</h3>
            <p className="stat-label">Total Anggota Terdaftar</p>
          </div>
          <div className="stat-trend positive">
            <span>📈</span>
            <small>Active members</small>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">
            <span>🏆</span>
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{roles.length}</h3>
            <p className="stat-label">Jenis Role Aktif</p>
          </div>
          <div className="stat-trend">
            <span>⭐</span>
            <small>Role types</small>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">
            <span>📅</span>
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{recentUsers.length}</h3>
            <p className="stat-label">Anggota Terbaru</p>
          </div>
          <div className="stat-trend">
            <span>🔥</span>
            <small>This week</small>
          </div>
        </div>
      </div>

      {/* Role Statistics */}
      <div className="content-grid">
        <div className="chart-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="title-icon">📈</span>
              Statistik Role
            </h3>
            <div className="card-actions">
              <button className="action-btn">
                <span>📊</span>
              </button>
            </div>
          </div>
          
          <div className="role-stats">
            {roles.map((role, index) => {
              const percentage = ((role.count / totalUsers) * 100).toFixed(1)
              const colors = ['primary', 'success', 'warning', 'info']
              const colorClass = colors[index % colors.length]
              
              return (
                <div key={role._id} className="role-item">
                  <div className="role-info">
                    <div className="role-header">
                      <span className="role-name">{role._id}</span>
                      <span className="role-count">{role.count} akun</span>
                    </div>
                    <div className="role-percentage">{percentage}%</div>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className={`progress-fill ${colorClass}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Members */}
        <div className="activity-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="title-icon">👋</span>
              Anggota Terbaru
            </h3>
            <div className="card-actions">
              <button className="action-btn">
                <span>👁️</span>
              </button>
            </div>
          </div>
          
          <div className="recent-members">
            {recentUsers.map((user, index) => (
              <div key={user._id} className="member-item">
                <div className="member-avatar">
                  <span>{user.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="member-info">
                  <p className="member-name">{user.name}</p>
                  <p className="member-role">{user.role}</p>
                </div>
                <div className="member-date">
                  <span className="date-badge">
                    {new Date(user.createdAt).toLocaleDateString('id-ID', { 
                      day: 'numeric', 
                      month: 'short' 
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3 className="section-title">
          <span className="title-icon">⚡</span>
          Quick Actions
        </h3>
        <div className="actions-grid">
          
          <a href="/dashboard/master-keanggotaan" className="action-card success">
            <div className="action-icon">
              <span>📋</span>
            </div>
            <div className="action-content">
              <h4>Kelola Anggota</h4>
              <p>Lihat semua anggota</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}