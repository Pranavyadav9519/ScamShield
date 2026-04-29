'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import {
  Search, Shield, AlertTriangle, CheckCircle, XCircle,
  Loader2, ChevronRight, Link, MessageSquare, Phone, Info, Save
} from 'lucide-react'

type InputType = 'text' | 'url' | 'phone'
type RiskLevel = 'safe' | 'suspicious' | 'dangerous'

interface RiskResult {
  id: string
  riskScore: number
  riskLevel: RiskLevel
  explanation: string
  indicators: string[]
  advice: string
}

const inputTypeOptions: { value: InputType; label: string; icon: React.ElementType; placeholder: string }[] = [
  { value: 'text', label: 'Message / Text', icon: MessageSquare, placeholder: "Paste suspicious text here — e.g. 'You've won a prize! Click here to claim...'" },
  { value: 'url', label: 'URL / Link', icon: Link, placeholder: 'e.g. https://suspicious-site.com/claim-prize' },
  { value: 'phone', label: 'Phone Number', icon: Phone, placeholder: 'e.g. +1 (555) 123-4567' },
]

export default function VerifyPage() {
  const { token } = useAuth()
  const [inputType, setInputType] = useState<InputType>('text')
  const [content, setContent] = useState('')
  const [context, setContext] = useState('')
  const [result, setResult] = useState<RiskResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const activeOption = inputTypeOptions.find((o) => o.value === inputType)!

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)
    setError('')
    setResult(null)
    setSaved(false)

    try {
      const res = await fetch('/api/evaluate-risk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ inputType, content, additionalContext: context }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Evaluation failed')
      setResult(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const saveToVault = async () => {
    if (!result || !token) return
    try {
      await fetch('/api/evidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: content.slice(0, 60),
          description: result.explanation,
          type: inputType,
          content,
          riskLevel: result.riskLevel,
          tags: result.indicators.slice(0, 3),
        }),
      })
      setSaved(true)
    } catch {
      // silently fail
    }
  }

  const riskConfig = {
    safe: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)', icon: CheckCircle, label: 'SAFE' },
    suspicious: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', icon: AlertTriangle, label: 'SUSPICIOUS' },
    dangerous: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', icon: XCircle, label: 'DANGEROUS' },
  }

  return (
    <div style={{ padding: '32px 36px', maxWidth: 860, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, background: 'rgba(59,130,246,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Search size={18} color="var(--accent-blue)" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>Verify Now</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginLeft: 46 }}>
          Paste any suspicious message, URL, or phone number and get an instant AI-powered risk analysis.
        </p>
      </div>

      <div className="glass" style={{ borderRadius: 20, padding: 32, marginBottom: 24 }}>
        {/* Input type selector */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {inputTypeOptions.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => { setInputType(value); setContent(''); setResult(null) }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 18px', borderRadius: 10,
                border: `1px solid ${inputType === value ? 'var(--accent-blue)' : 'var(--border)'}`,
                background: inputType === value ? 'rgba(59,130,246,0.12)' : 'transparent',
                color: inputType === value ? 'var(--accent-blue)' : 'var(--text-secondary)',
                fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
              {activeOption.label}
            </label>
            <textarea
              className="input-field"
              rows={inputType === 'text' ? 5 : 2}
              placeholder={activeOption.placeholder}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ resize: 'none', fontFamily: 'Inter, monospace', fontSize: 13 }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
              Additional Context <span style={{ color: 'var(--text-muted)' }}>(optional)</span>
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. received via WhatsApp, caller claimed to be from IRS..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !content.trim()}
            style={{ width: '100%', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
          >
            {loading ? (
              <><Loader2 size={18} style={{ animation: 'spin 0.8s linear infinite' }} /> Analyzing with AI...</>
            ) : (
              <><Shield size={18} /> Analyze Risk</>
            )}
          </button>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </form>
      </div>

      {error && (
        <div className="glass" style={{ borderRadius: 16, padding: 20, marginBottom: 24, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)' }}>
          <div style={{ display: 'flex', gap: 10, color: '#ef4444' }}>
            <XCircle size={18} style={{ minWidth: 18 }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Analysis Failed</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>{error}</div>
            </div>
          </div>
        </div>
      )}

      {result && (() => {
        const cfg = riskConfig[result.riskLevel]
        const RiskIcon = cfg.icon
        return (
          <div className="fade-in glass" style={{ borderRadius: 20, padding: 32, border: `1px solid ${cfg.border}` }}>
            {/* Risk Score Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 56, height: 56, background: cfg.bg, border: `2px solid ${cfg.border}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <RiskIcon size={28} color={cfg.color} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: cfg.color, letterSpacing: 2, textTransform: 'uppercase' }}>
                    {cfg.label}
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: cfg.color }}>
                    Risk Score: {result.riskScore}/100
                  </div>
                </div>
              </div>
              <button
                onClick={saveToVault}
                disabled={saved}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 18px', borderRadius: 10, border: '1px solid var(--border)',
                  background: saved ? 'rgba(34,197,94,0.1)' : 'transparent',
                  color: saved ? '#22c55e' : 'var(--text-secondary)',
                  cursor: saved ? 'default' : 'pointer',
                  fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.2s',
                }}
              >
                <Save size={15} />
                {saved ? 'Saved!' : 'Save Evidence'}
              </button>
            </div>

            {/* Risk bar */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${result.riskScore}%`,
                  background: result.riskScore > 69 ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : result.riskScore > 30 ? 'linear-gradient(90deg, #22c55e, #f59e0b)' : '#22c55e',
                  borderRadius: 4, transition: 'width 1s ease',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <span style={{ fontSize: 11, color: '#22c55e' }}>Safe (0)</span>
                <span style={{ fontSize: 11, color: '#f59e0b' }}>Suspicious (50)</span>
                <span style={{ fontSize: 11, color: '#ef4444' }}>Dangerous (100)</span>
              </div>
            </div>

            {/* Explanation */}
            <div style={{ marginBottom: 24, padding: 18, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 12 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <Info size={16} color="var(--accent-blue)" style={{ minWidth: 16, marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-blue)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>AI Analysis</div>
                  <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.7 }}>{result.explanation}</p>
                </div>
              </div>
            </div>

            {/* Indicators */}
            {result.indicators.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                  Risk Indicators
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {result.indicators.map((indicator, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <ChevronRight size={14} color={cfg.color} style={{ minWidth: 14, marginTop: 2 }} />
                      <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{indicator}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Advice */}
            <div style={{
              padding: 16, borderRadius: 12,
              background: result.riskLevel === 'safe' ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
              border: `1px solid ${cfg.border}`,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: cfg.color, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                Recommended Action
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6 }}>{result.advice}</p>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
