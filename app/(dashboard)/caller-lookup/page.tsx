'use client'

import { useState } from 'react'
import { Phone } from 'lucide-react'

interface LookupResult {
  phone: string
  communityReports: number
  category: string
  description: string
  isReported: boolean
  aiAnalysis: {
    isLikelyScam: boolean
    category: string
    confidence: number
    description: string
  }
}

const categoryLabels: Record<string, { label: string; color: string }> = {
  robocall: { label: 'Robocall', color: '#d97706' },
  fraud: { label: 'Fraud', color: '#dc2626' },
  telemarketing: { label: 'Telemarketing', color: '#ea580c' },
  government_impersonation: { label: 'Gov. Impersonation', color: '#dc2626' },
  tech_support: { label: 'Tech Support Scam', color: '#dc2626' },
  legitimate: { label: 'Legitimate', color: '#16a34a' },
  unknown: { label: 'Unknown', color: '#64748b' },
}

export default function CallerLookupPage() {
  const [phone, setPhone] = useState('')
  const [result, setResult] = useState<LookupResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone.trim()) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch(`/api/caller-lookup?phone=${encodeURIComponent(phone)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Lookup failed')
      setResult(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lookup failed')
    } finally {
      setLoading(false)
    }
  }

  const cat = result ? (categoryLabels[result.aiAnalysis.category] || categoryLabels.unknown) : null
  const isDangerous = result?.aiAnalysis.isLikelyScam

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', padding: '32px 40px', fontFamily: 'Inter, sans-serif' }}>
      
      <div style={{ marginBottom: 32 }}>
        <span style={{ color: '#64748b', fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Caller Reputation</span>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', marginTop: 6 }}>Lookup a number</h1>
        <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Check community-reported spam, fraud, and harassment for any phone number.</p>
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '32px', maxWidth: 640, marginBottom: 24 }}>
        <form onSubmit={handleLookup} style={{ display: 'flex', gap: 12 }}>
          <input
            type="tel"
            placeholder="+91 9999999999"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{
              flex: 1, padding: '14px 16px', borderRadius: 8,
              border: '1px solid #e2e8f0', outline: 'none', fontSize: 14
            }}
          />
          <button
            type="submit"
            disabled={loading || !phone.trim()}
            style={{
              background: '#0f172a', color: '#ffffff', border: 'none',
              padding: '14px 24px', borderRadius: 8, fontSize: 14, fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8
            }}
          >
            {loading ? 'Checking...' : 'Check'}
          </button>
        </form>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
          <span style={{ fontSize: 12, color: '#64748b' }}>Try:</span>
          {['+919999000001', '+919999000002', '+919999000004', '+918888800001'].map((ex) => (
            <button 
              key={ex}
              onClick={() => setPhone(ex)}
              style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 6, padding: '4px 10px', fontSize: 12, color: '#475569', cursor: 'pointer' }}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: 12, padding: '16px 20px', color: '#dc2626', fontSize: 13, maxWidth: 640, marginBottom: 24 }}>
          {error}
        </div>
      )}

      {result && cat && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '32px', maxWidth: 640 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, color: isDangerous ? '#dc2626' : '#16a34a', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                {isDangerous ? 'Warning: High Risk' : 'Verified Safe'}
              </span>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>{result.phone}</h2>
            </div>
            <span style={{ background: `${cat.color}15`, color: cat.color, fontSize: 12, fontWeight: 700, padding: '6px 16px', borderRadius: 30, border: `1px solid ${cat.color}30` }}>
              {cat.label}
            </span>
          </div>

          <p style={{ fontSize: 14, color: '#475569', lineHeight: '22px', marginBottom: 24 }}>
            {result.aiAnalysis.description}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, borderTop: '1px solid #f1f5f9', paddingTop: 24 }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Community Reports</span>
              <div style={{ fontSize: 28, fontWeight: 800, color: result.communityReports > 0 ? '#dc2626' : '#16a34a', marginTop: 4 }}>{result.communityReports}</div>
            </div>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>AI Confidence</span>
              <div style={{ fontSize: 28, fontWeight: 800, color: isDangerous ? '#dc2626' : '#16a34a', marginTop: 4 }}>{result.aiAnalysis.confidence}%</div>
            </div>
          </div>
        </div>
      )}



    </div>
  )
}
