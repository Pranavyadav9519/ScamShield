'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Shield, Eye, EyeOff, Lock, Mail, User, Phone, AlertCircle } from 'lucide-react'

type Mode = 'login' | 'register'

export default function AuthPage() {
  const { login, register } = useAuth()
  const [mode, setMode] = useState<Mode>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (mode === 'login') {
        await login(form.email, form.password)
      } else {
        if (!form.name || !form.email || !form.password) {
          setError('Please fill in all required fields')
          return
        }
        if (form.password.length < 8) {
          setError('Password must be at least 8 characters')
          return
        }
        await register(form.name, form.email, form.password, form.phone)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'row', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Left Split: Dark Cybersecurity Aesthetic */}
      <div style={{
        flex: 1,
        background: '#0a0f1d',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '40px 60px',
        position: 'relative',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Shield size={28} color="#3b82f6" />
            <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '0.5px' }}>ScamShield <span style={{ color: '#94a3b8', fontSize: 14, fontWeight: 500 }}>VERIFY</span></span>
          </div>
        </div>

        <div style={{ maxWidth: 480 }}>
          <span style={{ color: '#3b82f6', fontSize: 13, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Context-aware fraud detection</span>
          <h1 style={{ fontSize: 44, fontWeight: 800, lineHeight: '52px', marginTop: 16, marginBottom: 24, color: '#f8fafc' }}>
            Not detecting numbers.<br />
            <span style={{ color: '#3b82f6' }}>Detecting situations.</span>
          </h1>
          <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: '24px' }}>
            Verify suspicious calls, video threats, and pressure tactics in real-time with scenario-based analysis trained on Indian cybercrime patterns.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: 12 }}>
          <Lock size={14} />
          <span>Privacy-first. We never record calls. Verification is user-triggered.</span>
        </div>
      </div>

      {/* Right Split: Clean Login Form */}
      <div style={{
        width: '500px',
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 60px',
        boxShadow: '-10px 0 30px rgba(0,0,0,0.02)',
      }}>
        <div style={{ maxWidth: 380, width: '100%', margin: '0 auto' }}>
          <span style={{ color: '#64748b', fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
            {mode === 'login' ? 'Sign In' : 'Get Started'}
          </span>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginTop: 4, marginBottom: 24 }}>
            {mode === 'login' ? 'Welcome back' : 'Create an account'}
          </h2>

          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px', background: '#fef2f2',
              border: '1px solid #fee2e2', borderRadius: 8,
              color: '#ef4444', fontSize: 13, marginBottom: 20,
            }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {mode === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 8,
                    border: '1px solid #e2e8f0', color: '#0f172a', outline: 'none', fontSize: 14
                  }}
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  required
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                Email
              </label>
              <input
                type="email"
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: 8,
                  border: '1px solid #e2e8f0', color: '#0f172a', outline: 'none', fontSize: 14
                }}
                placeholder="test@scamshield.in"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password"
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: 8,
                  border: '1px solid #e2e8f0', color: '#0f172a', outline: 'none', fontSize: 14
                }}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                required
              />
            </div>

            {mode === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 8,
                    border: '1px solid #e2e8f0', color: '#0f172a', outline: 'none', fontSize: 14
                  }}
                  placeholder="+91 9999999999"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                background: '#0f172a', color: '#ffffff', border: 'none',
                padding: '14px', borderRadius: 8, fontSize: 14, fontWeight: 600,
                cursor: 'pointer', marginTop: 8, transition: 'background 0.2s'
              }}
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#64748b' }}>
            {mode === 'login' ? (
              <>New here? <span onClick={() => setMode('register')} style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: 600 }}>Create an account</span></>
            ) : (
              <>Already have an account? <span onClick={() => setMode('login')} style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: 600 }}>Sign in</span></>
            )}
          </p>
        </div>
        
        {/* Emergent Badge */}
        <div style={{
          position: 'absolute', bottom: 24, right: 24,
          display: 'flex', alignItems: 'center', gap: 6,
          background: '#000000', color: '#ffffff', padding: '8px 16px',
          borderRadius: 30, fontSize: 11, fontWeight: 600,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <span style={{ width: 14, height: 14, background: '#ffffff', borderRadius: '50%', display: 'inline-block' }} />
          Made with Emergent
        </div>

      </div>
    </div>
  )
}
  )
}
