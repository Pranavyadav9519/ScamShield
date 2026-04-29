'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Archive, Plus, Trash2, X, Loader2, FileText, Link, Phone, Image, Tag, AlertTriangle, CheckCircle } from 'lucide-react'

interface Evidence {
  id: string
  title: string
  description: string
  type: string
  content: string
  riskLevel: string
  tags: string
  createdAt: string
}

const typeIcons: Record<string, React.ElementType> = {
  text: FileText, url: Link, phone: Phone, screenshot: Image, call: Phone,
}

const riskStyle: Record<string, { color: string; bg: string; border: string }> = {
  safe: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)' },
  suspicious: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' },
  dangerous: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' },
  unknown: { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.3)' },
}

export default function EvidencePage() {
  const { token } = useAuth()
  const [evidences, setEvidences] = useState<Evidence[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '', description: '', type: 'text', content: '', riskLevel: 'unknown', tags: '',
  })

  const fetchEvidences = async () => {
    if (!token) return
    try {
      const res = await fetch('/api/evidence', { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setEvidences(data.evidences || [])
    } catch {
      //
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEvidences() }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.content || !token) return
    setSubmitting(true)
    try {
      await fetch('/api/evidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean) }),
      })
      setShowForm(false)
      setForm({ title: '', description: '', type: 'text', content: '', riskLevel: 'unknown', tags: '' })
      fetchEvidences()
    } catch {
      //
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!token) return
    setDeletingId(id)
    try {
      await fetch(`/api/evidence/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      setEvidences((prev) => prev.filter((e) => e.id !== id))
    } catch {
      //
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, background: 'rgba(245,158,11,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Archive size={18} color="#f59e0b" />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>Evidence Vault</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginLeft: 46 }}>
            Securely store screenshots, messages, and notes about suspicious activity.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={16} /> Add Evidence
        </button>
      </div>

      {/* Add Evidence Modal */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        }}>
          <div className="glass" style={{ borderRadius: 20, padding: 32, width: '100%', maxWidth: 560 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Add Evidence</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Title *</label>
                <input className="input-field" placeholder="Brief title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Type</label>
                  <select className="input-field" value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}>
                    <option value="text">Text/Message</option>
                    <option value="url">URL/Link</option>
                    <option value="phone">Phone Number</option>
                    <option value="call">Call Record</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Risk Level</label>
                  <select className="input-field" value={form.riskLevel} onChange={(e) => setForm((p) => ({ ...p, riskLevel: e.target.value }))}>
                    <option value="unknown">Unknown</option>
                    <option value="safe">Safe</option>
                    <option value="suspicious">Suspicious</option>
                    <option value="dangerous">Dangerous</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Content *</label>
                <textarea className="input-field" rows={4} placeholder="Paste the suspicious content here" style={{ resize: 'none' }} value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} required />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Description</label>
                <input className="input-field" placeholder="Any additional notes" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Tags (comma separated)</label>
                <input className="input-field" placeholder="phishing, bank, urgent" value={form.tags} onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={submitting} style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  {submitting ? <Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Plus size={16} />}
                  {submitting ? 'Saving...' : 'Save Evidence'}
                </button>
              </div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </form>
          </div>
        </div>
      )}

      {/* Evidence Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton" style={{ height: 160, borderRadius: 16 }} />)}
        </div>
      ) : evidences.length === 0 ? (
        <div className="glass" style={{ borderRadius: 20, padding: 60, textAlign: 'center' }}>
          <Archive size={48} style={{ margin: '0 auto 16px', opacity: 0.2, display: 'block' }} color="var(--text-muted)" />
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Vault is empty</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>Start saving suspicious content to build your evidence record.</p>
          <button className="btn-primary" onClick={() => setShowForm(true)}>Add Your First Item</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: 16 }}>
          {evidences.map((ev) => {
            const TypeIcon = typeIcons[ev.type] || FileText
            const risk = riskStyle[ev.riskLevel] || riskStyle.unknown
            const tags = ev.tags ? ev.tags.split(',').filter(Boolean) : []
            return (
              <div key={ev.id} className="glass" style={{ borderRadius: 16, padding: 22, border: `1px solid ${risk.border}`, transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, background: risk.bg, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 36 }}>
                      <TypeIcon size={16} color={risk.color} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{ev.title}</div>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 3 }}>
                        {ev.riskLevel === 'dangerous' ? <AlertTriangle size={11} color={risk.color} /> : <CheckCircle size={11} color={risk.color} />}
                        <span style={{ fontSize: 11, color: risk.color, fontWeight: 600, textTransform: 'capitalize' }}>{ev.riskLevel}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>· {ev.type}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(ev.id)}
                    disabled={deletingId === ev.id}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, transition: 'color 0.2s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    {deletingId === ev.id ? <Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Trash2 size={16} />}
                  </button>
                </div>

                <div style={{ fontSize: 12, color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: '8px 12px', fontFamily: 'monospace', marginBottom: 12, wordBreak: 'break-all', maxHeight: 60, overflow: 'hidden' }}>
                  {ev.content}
                </div>

                {ev.description && (
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>{ev.description}</p>
                )}

                {tags.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {tags.map((tag) => (
                      <span key={tag} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, padding: '3px 10px', background: 'rgba(59,130,246,0.1)', color: 'var(--accent-blue)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 20 }}>
                        <Tag size={9} />{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 12 }}>
                  Saved {new Date(ev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            )
          })}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
