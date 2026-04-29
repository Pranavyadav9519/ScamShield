'use client'

import { useState } from 'react'
import { Shield, Eye, Video, UserCheck, AlertTriangle, Search } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function DeepfakeDetectorPage() {
  const { token } = useAuth()
  const [scanning, setScanning] = useState(false)
  const [personName, setPersonName] = useState('')
  const [videoDescription, setVideoDescription] = useState('')
  const [verdict, setVerdict] = useState<{ deepfakeProb: number; anomalies: string[]; identityMatch: string } | null>(null)
  const [error, setError] = useState('')

  const runForensicScan = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setVerdict(null)

    if (!personName && !videoDescription) {
      setError('Please input an identity name or video feed description parameters.')
      return
    }

    setScanning(true)

    try {
      const res = await fetch('/api/deepfake-identity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ personName, videoDescription })
      })

      if (!res.ok) {
        throw new Error('Forensic scanner timed out. Try again.')
      }

      const data = await res.json()
      setVerdict(data)
    } catch (err: any) {
      setError(err.message || 'Analysis error.')
    } finally {
      setScanning(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', padding: '32px 40px', fontFamily: 'Inter, sans-serif' }}>
      
      <div style={{ marginBottom: 32 }}>
        <span style={{ color: '#64748b', fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Biometric Analysis</span>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', marginTop: 6 }}>Deepfake & Identity Shield</h1>
        <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Examine live streams for algorithmic facial manipulation and verify digital personas.</p>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', padding: '12px 16px', borderRadius: 8, fontSize: 13, marginBottom: 24 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
        
        {/* Analysis Module */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '32px' }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 20 }}>Video Stream Telemetry</h3>
          
          {!scanning && !verdict && (
            <div style={{ border: '2px dashed #cbd5e1', borderRadius: 12, padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
              <Video size={48} style={{ margin: '0 auto 16px', color: '#94a3b8' }} />
              <p style={{ fontSize: 14, fontWeight: 600 }}>Ready to analyze incoming media vectors.</p>
            </div>
          )}

          {scanning && (
            <div style={{ padding: '20px 0', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, fontSize: 16, fontWeight: 700, color: '#3b82f6' }}>
                <div style={{ width: 20, height: 20, border: '3px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                Isolating physical landmarks...
              </div>
              <style>{`
                @keyframes spin { 100% { transform: rotate(360deg); } }
              `}</style>
            </div>
          )}

          {verdict && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div style={{
                  width: 64, height: 64, background: verdict.deepfakeProb > 60 ? '#fef2f2' : '#fffbeb',
                  border: `2px solid ${verdict.deepfakeProb > 60 ? '#fca5a5' : '#fef08a'}`,
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <AlertTriangle size={28} color={verdict.deepfakeProb > 60 ? '#dc2626' : '#d97706'} />
                </div>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#b91c1c', letterSpacing: '1px', textTransform: 'uppercase' }}>Anomaly Verdict</span>
                  <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>Deepfake Probability: {verdict.deepfakeProb}%</h2>
                </div>
              </div>

              <div style={{ marginTop: 20 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 8 }}>
                  Identified Vectors
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {verdict.anomalies && verdict.anomalies.length > 0 ? (
                    verdict.anomalies.map((anom, i) => (
                      <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px 16px', borderRadius: 8, fontSize: 13, color: '#475569', display: 'flex', gap: 8, alignItems: 'center' }}>
                        <Eye size={16} color="#ef4444" style={{ minWidth: 16 }} />
                        {anom}
                      </div>
                    ))
                  ) : (
                    <div style={{ color: '#64748b', fontSize: 13 }}>No visual anomalies identified.</div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Identity Web Lookup */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <UserCheck size={18} color="#3b82f6" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Persona Profiling
            </span>
          </div>

          <form onSubmit={runForensicScan} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontSize: 12, color: '#64748b', lineHeight: '18px' }}>
              Provide asserted credentials or situational descriptions.
            </p>
            
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Asserted Name</label>
              <input 
                type="text"
                placeholder="e.g. Inspector Rakesh Kumar"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, outline: 'none', marginTop: 4 }}
              />
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Physical Observations</label>
              <textarea 
                placeholder="Describe facial traits (e.g., glitching, unnatural skin glow, audio mismatch)"
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                rows={3}
                style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, outline: 'none', marginTop: 4, resize: 'none' }}
              />
            </div>

            <button 
              type="submit"
              disabled={scanning}
              style={{ background: '#0f172a', color: '#ffffff', border: 'none', padding: '12px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 8 }}
            >
              <Search size={16} />
              Evaluate Metadata
            </button>
          </form>

          {verdict && (
            <div style={{ marginTop: 24, background: '#fffbeb', border: '1px solid #fef08a', padding: '16px', borderRadius: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#854d0e', textTransform: 'uppercase' }}>Intelligence Logs</span>
              <p style={{ fontSize: 13, color: '#713f12', marginTop: 4, lineHeight: '18px' }}>{verdict.identityMatch}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
