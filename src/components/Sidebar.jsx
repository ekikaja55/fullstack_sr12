// src/components/Sidebar.jsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function Sidebar() {
  const [username, setUsername] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUsername(data.username)
      }
    }

    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768)
    }

    fetchUser()
    checkScreen()
    window.addEventListener('resize', checkScreen)
    return () => window.removeEventListener('resize', checkScreen)
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'GET' })
    router.push('/')
  }

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: "🏠" },
    { label: "Master Keanggotaan", path: "/dashboard/master-keanggotaan", icon: "👥" }
  ]

  const MenuButton = ({ label, path, icon }) => {
    const isActive = pathname === path
    return (
      <button
        className={`menu-item ${isActive ? 'active' : ''}`}
        onClick={() => {
          setIsOpen(false)
          router.push(path)
        }}
      >
        <span className="menu-icon">{icon}</span>
        <span className="menu-label">{label}</span>
        {isActive && <div className="active-indicator"></div>}
      </button>
    )
  }

  const sidebarContent = (
    <div className="sidebar-content">
      <div className="sidebar-header">
        <div className="brand-container">
          <div className="brand-logo">
            <span className="brand-text">SR12</span>
          </div>
          <h5 className="brand-title">Admin Panel</h5>
        </div>
      </div>
      
      <div className="user-info">
        <div className="user-avatar">
          <span>{username ? username.charAt(0).toUpperCase() : '?'}</span>
        </div>
        <div className="user-details">
          <p className="user-greeting">Welcome back,</p>
          <p className="user-name">{username || 'Loading...'}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <h6 className="nav-title">NAVIGATION</h6>
          {menuItems.map((item) => (
            <MenuButton
              key={item.path}
              label={item.label}
              path={item.path}
              icon={item.icon}
            />
          ))}
        </div>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <span className="logout-icon">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <>
        {/* Mobile menu trigger */}
        <div className="mobile-menu-trigger">
          <button 
            className="menu-toggle-btn" 
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile sidebar overlay */}
        <div className={`mobile-sidebar ${isOpen ? 'open' : ''}`}>
          <div className="mobile-sidebar-header">
            <h5>Menu</h5>
            <button 
              className="close-btn" 
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              ×
            </button>
          </div>
          <div className="mobile-sidebar-body">
            {sidebarContent}
          </div>
        </div>

        {/* Backdrop */}
        {isOpen && (
          <div
            className="sidebar-backdrop"
            onClick={() => setIsOpen(false)}
          />
        )}
      </>
    )
  }

  return (
    <div className="sidebar-desktop">
      {sidebarContent}
    </div>
  )
}