'use client'

import { useState } from 'react'
import { Phone, Search, AlertTriangle, CheckCircle, Flag, Loader2, Users, Brain } from 'lucide-react'

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
  robocall: { label: 'Robocall', color: '#f59e0b' },
  fraud: { label: 'Fraud', color: '#ef4444' },
  telemarketing: { label: 'Telemarketing', color: '#f97316' },
  government_impersonation: { label: 'Gov. Impersonation', color: '#ef4444' },
  tech_support: { label: 'Tech Support Scam', color: '#ef4444' },
  legitimate: { label: 'Legitimate', color: '#22c55e' },
  unknown: { label: 'Unknown', color: '#94a3b8' },
}

export default function CallerLookupPage() {
  const [phone, setPhone] = useState('')
  const [result, setResult] = useState<LookupResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [reporting, setReporting] = useState(false)
  const [reportForm, setReportForm] = useState({ category: 'fraud', description: '' })
  const [reported, setReported] = useState(false)

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    setReported(false)

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

  const handleReport = async () => {
    if (!phone.trim()) return
    setReporting(true)
    try {
      await fetch('/api/caller-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, ...reportForm }),
      })
      setReported(true)
      // refresh
      const res = await fetch(`/api/caller-lookup?phone=${encodeURIComponent(phone)}`)
      const data = await res.json()
      if (res.ok) setResult(data)
    } catch {
      //
    } finally {
      setReporting(false)
    }
  }

  const cat = result ? (categoryLabels[result.aiAnalysis.category] || categoryLabels.unknown) : null
  const isDangerous = result?.aiAnalysis.isLikelyScam

  return (
    <div style={{ padding: '32px 36px', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, background: 'rgba(139,92,246,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Phone size={18} color="#8b5cf6" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>Caller Lookup</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginLeft: 46 }}>
          Enter any phone number to check if it's a known scam, telemarketer, or robocall.
        </p>
      </div>

      <div className="glass" style={{ borderRadius: 20, padding: 32, marginBottom: 24 }}>
        <form onSubmit={handleLookup} style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Phone size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="tel"
              className="input-field"
              style={{ paddingLeft: 42 }}
              placeholder="+1 (555) 000-0000 or any number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !phone.trim()}
            style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}
          >
            {loading ? <Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Search size={16} />}
            {loading ? 'Looking up...' : 'Lookup'}
          </button>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </form>
      </div>

      {error && (
        <div className="glass" style={{ borderRadius: 16, padding: 20, marginBottom: 24, border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontSize: 14 }}>
          {error}
        </div>
      )}

      {result && cat && (
        <div className="fade-in">
          {/* Main result card */}
          <div className="glass" style={{
            borderRadius: 20, padding: 28, marginBottom: 16,
            border: `1px solid ${isDangerous ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 52, height: 52,
                  background: isDangerous ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
                  border: `2px solid ${isDangerous ? 'rgba(239,68,68,0.4)' : 'rgba(34,197,94,0.4)'}`,
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {isDangerous ? <AlertTriangle size={24} color="#ef4444" /> : <CheckCircle size={24} color="#22c55e" />}
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'monospace' }}>{result.phone}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '3px 10px',
                      borderRadius: 20, textTransform: 'uppercase', letterSpacing: 1,
                      background: `${cat.color}18`, color: cat.color, border: `1px solid ${cat.color}40`,
                    }}>
                      {cat.label}
                    </span>
                    {result.isReported && (
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>• Reported by community</span>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: isDangerous ? '#ef4444' : '#22c55e' }}>
                  {result.aiAnalysis.confidence}%
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>AI Confidence</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              {/* AI Analysis */}
              <div style={{ padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <Brain size={14} color="var(--accent-blue)" />
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: 1 }}>AI Assessment</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6 }}>{result.aiAnalysis.description}</p>
              </div>
              {/* Community */}
              <div style={{ padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <Users size={14} color="#8b5cf6" />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: 1 }}>Community Reports</span>
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: result.communityReports > 0 ? '#ef4444' : '#22c55e' }}>
                  {result.communityReports}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {result.communityReports === 0 ? 'No reports found' : `${result.communityReports} user report${result.communityReports !== 1 ? 's' : ''}`}
                </div>
                {result.description && <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8 }}>{result.description}</p>}
              </div>
            </div>
          </div>

          {/* Report section */}
          {!reported ? (
            <div className="glass" style={{ borderRadius: 16, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Flag size={16} color="var(--accent-blue)" />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Report This Number</h3>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Category</label>
                  <select
                    className="input-field"
                    style={{ width: 'auto', minWidth: 180 }}
                    value={reportForm.category}
                    onChange={(e) => setReportForm((p) => ({ ...p, category: e.target.value }))}
                  >
                    {Object.entries(categoryLabels).filter(([k]) => k !== 'legitimate' && k !== 'unknown').map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Description (optional)</label>
                  <input
                    className="input-field"
                    placeholder="What did they say?"
                    value={reportForm.description}
                    onChange={(e) => setReportForm((p) => ({ ...p, description: e.target.value }))}
                  />
                </div>
                <button
                  onClick={handleReport}
                  className="btn-danger"
                  disabled={reporting}
                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  {reporting ? <Loader2 size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Flag size={15} />}
                  Report
                </button>
              </div>
            </div>
          ) : (
            <div className="glass" style={{ borderRadius: 16, padding: 20, border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', fontSize: 14 }}>
              <CheckCircle size={16} style={{ display: 'inline', marginRight: 8 }} />
              Thank you for reporting! Your contribution helps protect others.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
