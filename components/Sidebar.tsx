'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import {
  Shield, LayoutDashboard, Search, Phone, Archive,
  AlertTriangle, LogOut, ChevronLeft, ChevronRight, User
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/verify', label: 'Verify Now', icon: Search },
  { href: '/caller-lookup', label: 'Caller Lookup', icon: Phone },
  { href: '/evidence', label: 'Evidence Vault', icon: Archive },
  { href: '/panic', label: 'Panic Mode', icon: AlertTriangle },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <aside
      style={{
        width: collapsed ? 72 : 240,
        minHeight: '100vh',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 50,
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '24px 16px 20px',
        borderBottom: '1px solid var(--border)',
        minHeight: 72,
      }}>
        <div style={{
          width: 40, height: 40, minWidth: 40,
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
        }}>
          <Shield size={20} color="white" />
        </div>
        {!collapsed && (
          <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
            Scam<span style={{ color: 'var(--accent-blue)' }}>Shield</span>
          </span>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '16px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <button
              key={href}
              onClick={() => router.push(href)}
              title={collapsed ? label : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px',
                borderRadius: 10, border: 'none', cursor: 'pointer',
                background: active ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                color: active ? 'var(--accent-blue)' : 'var(--text-secondary)',
                fontFamily: 'Inter, sans-serif',
                fontSize: 14, fontWeight: active ? 600 : 400,
                transition: 'all 0.2s',
                width: '100%', textAlign: 'left',
                borderLeft: active ? '3px solid var(--accent-blue)' : '3px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'
                  ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                  ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'
                }
              }}
            >
              <Icon size={18} style={{ minWidth: 18 }} />
              {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{label}</span>}
            </button>
          )
        })}
      </nav>

      {/* User + logout */}
      <div style={{ padding: '12px 8px 16px', borderTop: '1px solid var(--border)' }}>
        {!collapsed && user && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', marginBottom: 8,
            background: 'rgba(255,255,255,0.03)', borderRadius: 10,
          }}>
            <div style={{
              width: 32, height: 32, minWidth: 32,
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <User size={14} color="white" />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user.name}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user.email}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          title={collapsed ? 'Sign Out' : undefined}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            width: '100%', padding: '10px 12px',
            borderRadius: 10, border: 'none', cursor: 'pointer',
            background: 'transparent', color: 'var(--text-muted)',
            fontFamily: 'Inter, sans-serif', fontSize: 14,
            transition: 'all 0.2s', textAlign: 'left',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(239, 68, 68, 0.1)'
            ;(e.currentTarget as HTMLButtonElement).style.color = '#ef4444'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
            ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'
          }}
        >
          <LogOut size={18} style={{ minWidth: 18 }} />
          {!collapsed && 'Sign Out'}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start',
            gap: 12, width: '100%', padding: '10px 12px', marginTop: 4,
            borderRadius: 10, border: 'none', cursor: 'pointer',
            background: 'transparent', color: 'var(--text-muted)',
            fontFamily: 'Inter, sans-serif', fontSize: 14, transition: 'all 0.2s',
          }}
        >
          {collapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  )
}
