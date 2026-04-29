'use client'

import { useState, useEffect } from 'react'
import { Shield, Eye, Video, UserCheck, AlertTriangle, HelpCircle, Search } from 'lucide-react'

export default function DeepfakeDetectorPage() {
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [verdict, setVerdict] = useState<{ deepfakeProb: number; anomalies: string[]; identityMatch: string } | null>(null)
  const [personName, setPersonName] = useState('')

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (scanning && progress < 100) {
      timer = setTimeout(() => setProgress((p) => p + 5), 150)
    } else if (progress >= 100) {
      setScanning(false)
      setVerdict({
        deepfakeProb: Math.floor(Math.random() * 40) + 55, // High risk simulation
        anomalies: [
          'Unnatural eye-blinking frequency detected (< 2 per minute)',
          'Mismatched lighting vectors between face and backdrop',
          'Micro-stuttering on facial edge boundaries'
        ],
        identityMatch: 'No public institutional footprint located for this identifier.'
      })
    }
    return () => clearTimeout(timer)
  }, [scanning, progress])

  const startScan = (e: React.FormEvent) => {
    e.preventDefault()
    setScanning(true)
    setProgress(0)
    setVerdict(null)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', padding: '32px 40px', fontFamily: 'Inter, sans-serif' }}>
      
      <div style={{ marginBottom: 32 }}>
        <span style={{ color: '#64748b', fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Biometric Analysis</span>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', marginTop: 6 }}>Deepfake & Identity Shield</h1>
        <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Examine live streams for algorithmic facial manipulation and verify digital personas.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
        
        {/* Analysis Module */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '32px' }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 20 }}>Video Stream Telemetry</h3>
          
          {!scanning && !verdict && (
            <div style={{ border: '2px dashed #cbd5e1', borderRadius: 12, padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
              <Video size={48} style={{ margin: '0 auto 16px', color: '#94a3b8' }} />
              <p style={{ fontSize: 14, fontWeight: 600 }}>Ready to analyze incoming media packets.</p>
              <button 
                onClick={() => { setScanning(true); setProgress(0); }}
                style={{ marginTop: 16, background: '#0f172a', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
              >
                Initialize Scan
              </button>
            </div>
          )}

          {scanning && (
            <div style={{ padding: '20px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700, marginBottom: 8 }}>
                <span>Scanning facial landmarks...</span>
                <span>{progress}%</span>
              </div>
              <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progress}%`, background: '#3b82f6', transition: 'width 0.15s' }} />
              </div>
            </div>
          )}

          {verdict && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div style={{
                  width: 64, height: 64, background: verdict.deepfakeProb > 70 ? '#fef2f2' : '#fffbeb',
                  border: `2px solid ${verdict.deepfakeProb > 70 ? '#fca5a5' : '#fef08a'}`,
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <AlertTriangle size={28} color={verdict.deepfakeProb > 70 ? '#dc2626' : '#d97706'} />
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
                  {verdict.anomalies.map((anom, i) => (
                    <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px 16px', borderRadius: 8, fontSize: 13, color: '#475569', display: 'flex', gap: 8, alignItems: 'center' }}>
                      <Eye size={16} color="#ef4444" style={{ minWidth: 16 }} />
                      {anom}
                    </div>
                  ))}
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
              Real Name Lookup
            </span>
          </div>

          <form onSubmit={startScan} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontSize: 12, color: '#64748b', lineHeight: '18px' }}>
              Enter the caller's asserted name to cross-reference intelligence metadata.
            </p>
            <input 
              type="text"
              placeholder="e.g. Rakesh Kumar"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, outline: 'none' }}
            />
            <button 
              type="submit"
              disabled={scanning}
              style={{ background: '#0f172a', color: '#ffffff', border: 'none', padding: '12px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}
            >
              <Search size={16} />
              Verify Identity
            </button>
          </form>

          {verdict && (
            <div style={{ marginTop: 24, background: '#fffbeb', border: '1px solid #fef08a', padding: '16px', borderRadius: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#854d0e', textTransform: 'uppercase' }}>Search Findings</span>
              <p style={{ fontSize: 13, color: '#713f12', marginTop: 4, lineHeight: '18px' }}>{verdict.identityMatch}</p>
            </div>
          )}
        </div>

      </div>

    </div>
  )
}
