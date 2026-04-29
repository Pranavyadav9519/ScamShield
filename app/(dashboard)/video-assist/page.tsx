'use client'

import { useState, useEffect } from 'react'
import { Video, Shield, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react'

const alerts = [
  { title: 'No agency arrests via video call', desc: 'Police, CBI, Customs, ED — none of these conduct arrests or interrogations through WhatsApp/Skype/Zoom calls.' },
  { title: "Don't stay isolated", desc: 'Scammers insist you stay on the call. Disconnect immediately and reach out to a family member or call 1930.' },
  { title: "Never pay a 'verification' amount", desc: 'Real legal proceedings never require transferring funds to a personal account for clearing.' },
  { title: 'Look at the background', desc: 'Fake station backdrops, mismatched uniforms, generic badges, and distorted audio are critical red flags.' },
  { title: 'Don\'t share Aadhaar/PAN', desc: 'Avoid providing identification vectors or OTPs. Verify identifiers strictly through institutional portals.' },
  { title: 'Record the verdict, hang up, report', desc: 'Preserve ongoing call streams via screenshot tools to capture identity details securely.' }
]

export default function VideoAssistPage() {
  const [activeAlertIndex, setActiveAlertIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAlertIndex((prev) => (prev + 1) % alerts.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', padding: '32px 40px', fontFamily: 'Inter, sans-serif' }}>
      
      <div style={{ marginBottom: 32 }}>
        <span style={{ color: '#64748b', fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Video Call Assist</span>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', marginTop: 6 }}>Live overlay safety tips</h1>
        <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Keep this open in a small window during the call. The simulated overlay shows what to watch for.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
        
        {/* Video Monitor Area */}
        <div style={{ background: '#0a1128', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 480, position: 'relative' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, background: '#ef4444', borderRadius: '50%', animation: 'pulse 1.5s infinite' }} />
            <span style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, letterSpacing: '1px' }}>ASSIST ACTIVE</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: 0.1 }}>
            <Video size={120} color="#ffffff" />
          </div>

          {/* Overlay Warning Banner */}
          <div style={{
            background: '#dc2626',
            borderRadius: 12,
            padding: '20px 24px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 16,
            animation: 'shake 0.5s ease-in-out',
          }}>
            <AlertTriangle size={24} style={{ marginTop: 2 }} />
            <div>
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
                Live Alert · {activeAlertIndex + 1}/{alerts.length}
              </span>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginTop: 2 }}>{alerts[activeAlertIndex].title}</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 4, lineHeight: '18px' }}>{alerts[activeAlertIndex].desc}</p>
            </div>
          </div>
          
        </div>

        {/* Safety Checklist */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '24px' }}>
          <span style={{ color: '#64748b', fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: 16 }}>
            Safety Checklist
          </span>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {alerts.map((alert, idx) => (
              <div 
                key={idx}
                onClick={() => setActiveAlertIndex(idx)}
                style={{
                  background: activeAlertIndex === idx ? '#fef2f2' : '#ffffff',
                  border: activeAlertIndex === idx ? '1px solid #fca5a5' : '1px solid #e2e8f0',
                  borderRadius: 8,
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <h4 style={{ fontSize: 13, fontWeight: 700, color: activeAlertIndex === idx ? '#991b1b' : '#0f172a' }}>{alert.title}</h4>
                {activeAlertIndex === idx && (
                  <p style={{ fontSize: 12, color: '#7f1d1d', marginTop: 6, lineHeight: '16px' }}>{alert.desc}</p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Keyframe Styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-4px); }
          40%, 80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  )
}
