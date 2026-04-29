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
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', padding: '24px 40px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Active Threats Horizontal Ticker */}
      <div style={{
        background: '#fef2f2',
        border: '1px solid #fee2e2',
        borderRadius: 8,
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginBottom: 32,
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: '1px', color: '#991b1b', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          <AlertTriangle size={14} />
          Active Threats In India
        </div>
        <div style={{ height: 14, width: 1, background: '#fca5a5' }} />
        
        <div style={{
          display: 'flex',
          gap: 32,
          fontSize: 13,
          fontWeight: 500,
          color: '#7f1d1d',
          animation: 'marquee 30s linear infinite',
          whiteSpace: 'nowrap',
        }}>
          <span>• Digital arrest scam — fake CBI on video calls</span>
          <span>• FedEx parcel scam — drugs allegation</span>
          <span>• Loan app harassment — morphed photo threats</span>
          <span>• AnyDesk remote access — OTP stealing tactics</span>
          <span>• KYC verification update frauds</span>
        </div>
        <style>{`
          @keyframes marquee {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-50%, 0, 0); }
          }
        `}</style>
      </div>

      {/* Main Header & Metrics Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, marginBottom: 32 }}>
        
        {/* Big Dark Blue Callout Banner */}
        <div style={{
          background: '#0a1128',
          borderRadius: 16,
          padding: '48px 40px',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
        }}>
          <span style={{ color: '#3b82f6', fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            Real-time fraud verdict
          </span>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: '48px', marginTop: 12, marginBottom: 16 }}>
            Suspicious call right now?<br />
            Verify in 30 seconds.
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 15, marginBottom: 32, maxWidth: 480, lineHeight: '24px' }}>
            Pick a scenario, answer a few yes/no questions, and get an instant scam verdict with the exact action to take.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => router.push('/verify')}
              style={{
                background: '#ffffff', color: '#0f172a', border: 'none',
                padding: '14px 24px', borderRadius: 8, fontSize: 14, fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8
              }}
            >
              Verify Now →
            </button>
            <button
              onClick={() => router.push('/panic')}
              style={{
                background: 'rgba(255,255,255,0.05)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.1)',
                padding: '14px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8
              }}
            >
              <AlertTriangle size={16} /> Panic Mode
            </button>
          </div>
        </div>

        {/* "YOUR SHIELD" Card Grid */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '32px 24px' }}>
          <span style={{ color: '#64748b', fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: 24 }}>
            Your Shield
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <Shield size={20} color="#3b82f6" />
              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8, color: '#0f172a' }}>{stats?.totalScans ?? 0}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginTop: 2 }}>Verifications</div>
            </div>
            <div>
              <AlertTriangle size={20} color="#ef4444" />
              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8, color: '#0f172a' }}>{stats?.threatsDetected ?? 0}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginTop: 2 }}>High Risk Caught</div>
            </div>
            <div>
              <Phone size={20} color="#22c55e" />
              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8, color: '#0f172a' }}>4</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginTop: 2 }}>Trusted Contacts</div>
            </div>
            <div>
              <Archive size={20} color="#8b5cf6" />
              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8, color: '#0f172a' }}>{stats?.totalEvidence ?? 0}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginTop: 2 }}>Evidence Items</div>
            </div>
          </div>
        </div>

      </div>

      {/* Quick Actions Section */}
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>Quick actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          
          <div onClick={() => router.push('/verify')} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '24px', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}>
            <Shield size={24} color="#3b82f6" />
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginTop: 16, marginBottom: 4 }}>Scenario Verify</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>Police, parcel, KYC, more</div>
          </div>

          <div onClick={() => router.push('/caller-lookup')} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '24px', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}>
            <Phone size={24} color="#3b82f6" />
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginTop: 16, marginBottom: 4 }}>Caller Lookup</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>Check spam reports</div>
          </div>

          <div onClick={() => router.push('/video-assist')} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '24px', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}>
            <Video size={24} color="#3b82f6" />
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginTop: 16, marginBottom: 4 }}>Video Call Assist</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>Live overlay tips</div>
          </div>

          <div onClick={() => router.push('/library')} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '24px', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}>
            <BookOpen size={24} color="#3b82f6" />
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginTop: 16, marginBottom: 4 }}>Scam Library</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>Know the patterns</div>
          </div>

        </div>
      </div>
      
      {/* Emergent Badge */}
      <div style={{
        position: 'fixed', bottom: 24, right: 24,
        display: 'flex', alignItems: 'center', gap: 6,
        background: '#000000', color: '#ffffff', padding: '8px 16px',
        borderRadius: 30, fontSize: 11, fontWeight: 600,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 100
      }}>
        <span style={{ width: 14, height: 14, background: '#ffffff', borderRadius: '50%', display: 'inline-block' }} />
        Made with Emergent
      </div>

    </div>
  )
}
