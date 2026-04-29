'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { AlertTriangle, UserPlus, Trash2, Phone, X, Loader2, Users, Shield } from 'lucide-react'

interface Contact {
  id: string
  name: string
  phone: string
  relation: string
}

const relationOptions = ['Family', 'Friend', 'Partner', 'Colleague', 'Other']

export default function PanicPage() {
  const { token } = useAuth()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [panicActive, setPanicActive] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', phone: '', relation: 'Family' })

  const fetchContacts = async () => {
    if (!token) return
    try {
      const res = await fetch('/api/contacts', { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setContacts(data.contacts || [])
    } catch {
      //
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchContacts() }, [token])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone || !token) return
    setSubmitting(true)
    try {
      await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      })
      setShowForm(false)
      setForm({ name: '', phone: '', relation: 'Family' })
      fetchContacts()
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
      await fetch(`/api/contacts?id=${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      setContacts((prev) => prev.filter((c) => c.id !== id))
    } catch {
      //
    } finally {
      setDeletingId(null)
    }
  }

  const triggerPanic = async () => {
    if (!token) return
    setPanicActive(true)
    try {
      await fetch('/api/panic', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      // Still trigger a manual call if they click the individual contacts below
    } catch (err) {
      console.error('Panic trigger error:', err)
    } finally {
      setTimeout(() => setPanicActive(false), 8000)
    }
  }

  return (
    <div style={{ padding: '32px 36px', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, background: 'rgba(239,68,68,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={18} color="#ef4444" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>Panic Mode</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginLeft: 46 }}>
          Add trusted contacts who will be alerted when you activate panic mode.
        </p>
      </div>

      {/* Panic Button */}
      <div className="glass" style={{
        borderRadius: 20, padding: 32, marginBottom: 24, textAlign: 'center',
        border: panicActive ? '2px solid rgba(239,68,68,0.5)' : '1px solid var(--border)',
        background: panicActive ? 'rgba(239,68,68,0.05)' : undefined,
        transition: 'all 0.4s',
      }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{
            width: 80, height: 80, margin: '0 auto 16px',
            background: panicActive ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.1)',
            border: `3px solid ${panicActive ? '#ef4444' : 'rgba(239,68,68,0.4)'}`,
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.4s',
            animation: panicActive ? 'pulse 1s ease-in-out infinite' : 'none',
          }}>
            <AlertTriangle size={36} color="#ef4444" />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
            {panicActive ? '🚨 Alerts Sent!' : 'Emergency Panic Button'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 400, margin: '0 auto' }}>
            {panicActive
              ? `Initiating contact with ${contacts.length} trusted contact${contacts.length !== 1 ? 's' : ''}...`
              : 'Press to immediately alert all your trusted contacts that you may be in a scam situation.'}
          </p>
        </div>

        <button
          onClick={triggerPanic}
          disabled={contacts.length === 0 || panicActive}
          className="btn-danger"
          style={{ padding: '16px 40px', fontSize: 16, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 10 }}
        >
          <Shield size={20} />
          {panicActive ? 'Alerting...' : 'Activate Panic Mode'}
        </button>

        {contacts.length === 0 && (
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>
            Add at least one trusted contact to use panic mode.
          </p>
        )}
        <style>{`@keyframes pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); } 50% { box-shadow: 0 0 0 15px rgba(239,68,68,0); } }`}</style>
      </div>

      {/* Contacts list */}
      <div className="glass" style={{ borderRadius: 20, padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={18} color="var(--accent-blue)" />
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
              Trusted Contacts ({contacts.length})
            </h2>
          </div>
          <button className="btn-primary" onClick={() => setShowForm(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px' }}>
            <UserPlus size={15} /> Add Contact
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1, 2].map((i) => <div key={i} className="skeleton" style={{ height: 72, borderRadius: 12 }} />)}
          </div>
        ) : contacts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
            <Users size={36} style={{ margin: '0 auto 12px', opacity: 0.2, display: 'block' }} />
            <p>No trusted contacts yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {contacts.map((contact) => (
              <div key={contact.id} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 12,
              }}>
                <div style={{ width: 42, height: 42, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 42 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>{contact.name[0]}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{contact.name}</div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 3, alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Phone size={11} />{contact.phone}
                    </span>
                    <span style={{ fontSize: 11, padding: '2px 8px', background: 'rgba(59,130,246,0.1)', color: 'var(--accent-blue)', borderRadius: 20 }}>
                      {contact.relation}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(contact.id)}
                  disabled={deletingId === contact.id}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 6, transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  {deletingId === contact.id ? <Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Trash2 size={16} />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Contact Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div className="glass" style={{ borderRadius: 20, padding: 32, width: '100%', maxWidth: 440 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Add Trusted Contact</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Full Name *</label>
                <input className="input-field" placeholder="John Doe" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Phone Number *</label>
                <input className="input-field" type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} required />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Relation</label>
                <select className="input-field" value={form.relation} onChange={(e) => setForm((p) => ({ ...p, relation: e.target.value }))}>
                  {relationOptions.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={submitting} style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  {submitting ? <Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> : <UserPlus size={16} />}
                  {submitting ? 'Saving...' : 'Add Contact'}
                </button>
              </div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
