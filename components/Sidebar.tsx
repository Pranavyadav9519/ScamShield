'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import {
  Shield, LayoutDashboard, Phone, Video,
  AlertTriangle, Archive, BookOpen, Clock, LogOut
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/verify', label: 'Verify Now', icon: Shield },
  { href: '/caller-lookup', label: 'Caller Lookup', icon: Phone },
  { href: '/video-assist', label: 'Video Call Assist', icon: Video },
  { href: '/panic', label: 'Panic Mode', icon: AlertTriangle },
  { href: '/evidence', label: 'Evidence Vault', icon: Archive },
  { href: '/library', label: 'Scam Library', icon: BookOpen },
  { href: '/history', label: 'History', icon: Clock },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <aside
      style={{
        width: 240,
        minHeight: '100vh',
        background: '#ffffff',
        borderRight: '1px solid #f1f5f9',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '24px 20px',
      }}>
        <Shield size={24} color="#3b82f6" />
        <span style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', letterSpacing: '0.5px' }}>
          ScamShield <span style={{ color: '#94a3b8', fontSize: 11, fontWeight: 600 }}>VERIFY</span>
        </span>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <button
              key={href}
              onClick={() => router.push(href)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px',
                borderRadius: 8, border: 'none', cursor: 'pointer',
                background: active ? '#0f172a' : 'transparent',
                color: active ? '#ffffff' : '#64748b',
                fontFamily: 'Inter, sans-serif',
                fontSize: 14, fontWeight: 600,
                transition: 'all 0.15s',
                width: '100%', textAlign: 'left',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLButtonElement).style.background = '#f8fafc'
                  ;(e.currentTarget as HTMLButtonElement).style.color = '#0f172a'
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                  ;(e.currentTarget as HTMLButtonElement).style.color = '#64748b'
                }
              }}
            >
              <Icon size={18} style={{ color: active ? '#ffffff' : undefined }} />
              <span>{label}</span>
            </button>
          )
        })}
      </nav>

      {/* User metadata footer */}
      <div style={{ padding: '20px', borderTop: '1px solid #f1f5f9' }}>
        {user && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>Signed in as</div>
            <div style={{ fontSize: 13, color: '#0f172a', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.email}
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            width: '100%', padding: '10px 16px',
            borderRadius: 8, border: '1px solid #e2e8f0', cursor: 'pointer',
            background: '#ffffff', color: '#0f172a',
            fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 600,
            transition: 'all 0.2s', textAlign: 'left',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.background = '#f8fafc'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.background = '#ffffff'
          }}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  )
}
