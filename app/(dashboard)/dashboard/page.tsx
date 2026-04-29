'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { Shield, Search, TrendingUp, AlertTriangle, Archive, Phone, ChevronRight, Clock, CheckCircle, XCircle } from 'lucide-react'

interface Stats {
  totalScans: number
  totalEvidence: number
  threatsDetected: number
  protectionRate: number
}

interface ScanResult {
  id: string
  input: string
  inputType: string
  riskScore: number
  riskLevel: string
  explanation: string
  createdAt: string
}

export default function DashboardPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentScans, setRecentScans] = useState<ScanResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    fetch('/api/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setStats(data.stats)
        setRecentScans(data.recentScans || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [token])

  const riskColor = (level: string) => {
    if (level === 'safe') return '#22c55e'
    if (level === 'suspicious') return '#f59e0b'
    return '#ef4444'
  }

  const riskIcon = (level: string) => {
    if (level === 'safe') return <CheckCircle size={14} color="#22c55e" />
    if (level === 'suspicious') return <AlertTriangle size={14} color="#f59e0b" />
    return <XCircle size={14} color="#ef4444" />
  }

  const statCards = [
    {
      label: 'Total Scans', value: stats?.totalScans ?? 0,
      icon: Search, color: '#3b82f6',
      bg: 'rgba(59,130,246,0.1)', description: 'Items analyzed',
    },
    {
      label: 'Threats Detected', value: stats?.threatsDetected ?? 0,
      icon: AlertTriangle, color: '#ef4444',
      bg: 'rgba(239,68,68,0.1)', description: 'High-risk detections',
    },
    {
      label: 'Evidence Saved', value: stats?.totalEvidence ?? 0,
      icon: Archive, color: '#8b5cf6',
      bg: 'rgba(139,92,246,0.1)', description: 'Items in vault',
    },
    {
      label: 'Protection Rate', value: `${stats?.protectionRate ?? 100}%`,
      icon: Shield, color: '#22c55e',
      bg: 'rgba(34,197,94,0.1)', description: 'Safe scan ratio',
    },
  ]

  const quickActions = [
    { label: 'Verify a Message', desc: 'Check text or URL for scams', href: '/verify', icon: Search, color: '#3b82f6' },
    { label: 'Lookup a Caller', desc: 'Check if a number is safe', href: '/caller-lookup', icon: Phone, color: '#8b5cf6' },
    { label: 'Evidence Vault', desc: 'Manage saved evidence', href: '/evidence', icon: Archive, color: '#f59e0b' },
    { label: 'Panic Mode', desc: 'Alert your trusted contacts', href: '/panic', icon: AlertTriangle, color: '#ef4444' },
  ]

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},{' '}
          <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
          Here's an overview of your fraud protection activity.
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 36 }}>
        {statCards.map(({ label, value, icon: Icon, color, bg, description }) => (
          <div key={label} className="glass card-glow-blue" style={{
            borderRadius: 16, padding: 24, transition: 'all 0.25s',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, background: bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={22} color={color} />
              </div>
              <TrendingUp size={14} color="var(--text-muted)" />
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{loading ? '—' : value}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{description}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
        {/* Recent Activity */}
        <div className="glass" style={{ borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Clock size={18} color="var(--accent-blue)" />
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Recent Scans</h2>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 64 }} />)}
            </div>
          ) : recentScans.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <Search size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p>No scans yet. Start by verifying a message or URL.</p>
              <button className="btn-primary" onClick={() => router.push('/verify')} style={{ marginTop: 16 }}>
                Verify Now
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recentScans.map((scan) => (
                <div key={scan.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                }}>
                  <div style={{
                    width: 8, height: 8, minWidth: 8,
                    borderRadius: '50%',
                    background: riskColor(scan.riskLevel),
                    boxShadow: `0 0 8px ${riskColor(scan.riskLevel)}`,
                  }} />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {scan.input}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                      {scan.inputType} · {new Date(scan.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {riskIcon(scan.riskLevel)}
                    <span style={{ fontSize: 12, fontWeight: 700, color: riskColor(scan.riskLevel), textTransform: 'capitalize' }}>
                      {scan.riskLevel}
                    </span>
                  </div>
                  <div style={{
                    fontSize: 13, fontWeight: 700,
                    color: riskColor(scan.riskLevel),
                    minWidth: 36, textAlign: 'right',
                  }}>
                    {scan.riskScore}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="glass" style={{ borderRadius: 16, padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>Quick Actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {quickActions.map(({ label, desc, href, icon: Icon, color }) => (
              <button
                key={href}
                onClick={() => router.push(href)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px', width: '100%',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border)',
                  borderRadius: 12, cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif', transition: 'all 0.2s', textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(59,130,246,0.3)'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)'
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'
                }}
              >
                <div style={{ width: 38, height: 38, background: `${color}18`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 38 }}>
                  <Icon size={18} color={color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{desc}</div>
                </div>
                <ChevronRight size={16} color="var(--text-muted)" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
