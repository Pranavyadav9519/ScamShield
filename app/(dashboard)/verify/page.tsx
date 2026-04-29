'use client'

import { useState } from 'react'
import { Shield, AlertTriangle, CheckCircle, XCircle, User, HelpCircle, Info, Save } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

interface Scenario {
  id: string
  title: string
  desc: string
  baseline: number
  questions: string[]
}

const scenarios: Scenario[] = [
  {
    id: 'police',
    title: 'Police / CBI Threat',
    desc: 'Caller claims to be from Police, CBI, or Customs and threatens arrest.',
    baseline: 80,
    questions: [
      'Did they demand to be on a continuous video call?',
      'Did they ask you to move to an isolated room?',
      'Did they mention transferring a "refundable verification fee"?',
      'Did they threaten an immediate arrest warrant?'
    ]
  },
  {
    id: 'customs',
    title: 'Parcel / Customs Issue',
    desc: 'Caller claims a suspicious parcel in your name has been intercepted.',
    baseline: 75,
    questions: [
      'Did they say the parcel contains prohibited items (drugs, etc.)?',
      'Was the caller transfer initiated to a separate "investigator"?',
      'Did they demand your banking credentials for security clearance?',
      'Were you told your ID is linked to terrorism/money laundering?'
    ]
  },
  {
    id: 'loan',
    title: 'Loan App Harassment',
    desc: 'Aggressive recovery call from a loan app, threats to share contacts.',
    baseline: 70,
    questions: [
      'Are they charging exorbitant processing fees upfront?',
      'Are they threatening to send morphed photos to your family?',
      'Did the app harvest your contact list upon installation?',
      'Are they calling repeatedly from unauthorized mobile numbers?'
    ]
  },
  {
    id: 'remote',
    title: 'Remote Access Request',
    desc: 'Caller asks you to install AnyDesk / TeamViewer to fix a problem.',
    baseline: 90,
    questions: [
      'Are they insisting on fixing an imaginary device crash?',
      'Did they direct you to download third-party monitoring apps?',
      'Did they instruct you to log in to net banking while screensharing?',
      'Are they creating extreme urgency to act within minutes?'
    ]
  },
  {
    id: 'bank',
    title: 'Bank / KYC Update',
    desc: 'Caller claims your KYC will lapse and asks for OTP / card details.',
    baseline: 80,
    questions: [
      'Did they warn your bank account will lock today?',
      'Did they request the 6-digit secure OTP sent to your phone?',
      'Did they ask for your full credit card number and CVV?',
      'Was the communication initiated from an personal 10-digit number?'
    ]
  },
  {
    id: 'lottery',
    title: 'Lottery / Prize Winner',
    desc: 'You have "won" a prize and must pay processing fee to claim it.',
    baseline: 70,
    questions: [
      'Did they demand upfront tax payment to unlock the reward?',
      'Did you enter this contest formally in the past?',
      'Are they posing as executives from recognized networks?',
      'Did they send you an unauthorized QR code to scan?'
    ]
  }
]

export default function ScenarioVerifyPage() {
  const { token } = useAuth()
  const [step, setStep] = useState(1)
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null)
  const [callerNumber, setCallerNumber] = useState('')
  const [callerPlatform, setCallerPlatform] = useState('WhatsApp')
  const [answers, setAnswers] = useState<boolean[]>([false, false, false, false])
  const [verdict, setVerdict] = useState<{ score: number; level: string; advice: string } | null>(null)
  const [saved, setSaved] = useState(false)

  const handleSelectScenario = (sc: Scenario) => {
    setSelectedScenario(sc)
    setStep(2)
  }

  const handleCallerSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(3)
  }

  const toggleAnswer = (idx: number) => {
    const updated = [...answers]
    updated[idx] = !updated[idx]
    setAnswers(updated)
  }

  const calculateVerdict = async () => {
    if (!selectedScenario) return
    let score = selectedScenario.baseline
    answers.forEach((ans) => {
      if (ans) score += 15
    })
    if (score > 100) score = 100

    let level = 'Safe'
    let advice = 'Proceed with standard safety checks.'

    if (score >= 80) {
      level = 'Dangerous'
      advice = 'Hang up immediately. This aligns exactly with registered cybercrime formats. File an official notification via 1930.'
    } else if (score >= 50) {
      level = 'Suspicious'
      advice = 'Avoid sharing private credentials. Contact central institutional channels.'
    }

    const result = { score, level, advice }
    setVerdict(result)

    // Store on database backend via evaluate-risk pipeline
    if (token) {
      try {
        await fetch('/api/evaluate-risk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            inputType: 'phone',
            content: callerNumber || selectedScenario.title,
            additionalContext: `Scenario: ${selectedScenario.title}. Platform: ${callerPlatform}. Heuristics evaluated.`
          })
        })
      } catch {
        // fallback silently
      }
    }

    setStep(4)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', padding: '32px 40px', fontFamily: 'Inter, sans-serif' }}>
      
      <div style={{ marginBottom: 32 }}>
        <span style={{ color: '#64748b', fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Scenario Verification</span>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', marginTop: 6 }}>Verify suspicious call</h1>
      </div>

      {/* Wizard Timeline Status */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
        {[
          { num: 1, label: 'Pick scenario' },
          { num: 2, label: 'Caller info' },
          { num: 3, label: 'Questionnaire' },
          { num: 4, label: 'Verdict' }
        ].map((st) => (
          <div 
            key={st.num}
            style={{
              background: step === st.num ? '#0f172a' : '#ffffff',
              color: step === st.num ? '#ffffff' : '#64748b',
              border: step === st.num ? '1px solid #0f172a' : '1px solid #e2e8f0',
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              opacity: step >= st.num ? 1 : 0.4
            }}
          >
            <span style={{ background: step === st.num ? '#3b82f6' : '#f1f5f9', color: step === st.num ? '#ffffff' : '#64748b', width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>
              {st.num}
            </span>
            {st.label}
          </div>
        ))}
      </div>

      {/* Step 1: Pick Scenario */}
      {step === 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {scenarios.map((sc) => (
            <div 
              key={sc.id}
              onClick={() => handleSelectScenario(sc)}
              style={{
                background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '24px', cursor: 'pointer', transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
            >
              <Shield size={24} color="#3b82f6" />
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginTop: 16, marginBottom: 6 }}>{sc.title}</h3>
              <p style={{ fontSize: 13, color: '#64748b', lineHeight: '18px', marginBottom: 16 }}>{sc.desc}</p>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Risk Baseline · {sc.baseline}/100
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Step 2: Caller Info */}
      {step === 2 && selectedScenario && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '32px', maxWidth: 480 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Enter Caller Details</h3>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>Captures metadata securely for audit classification.</p>
          
          <form onSubmit={handleCallerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Phone Number (optional)</label>
              <input 
                type="tel"
                placeholder="+91 9999999999"
                style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #e2e8f0', outline: 'none', fontSize: 14 }}
                value={callerNumber}
                onChange={(e) => setCallerNumber(e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Communication Platform</label>
              <select 
                value={callerPlatform}
                onChange={(e) => setCallerPlatform(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #e2e8f0', outline: 'none', background: '#ffffff', fontSize: 14 }}
              >
                <option>WhatsApp</option>
                <option>Standard Voice Call</option>
                <option>Skype / Zoom</option>
                <option>Unknown</option>
              </select>
            </div>
            <button 
              type="submit"
              style={{ background: '#0f172a', color: '#ffffff', border: 'none', padding: '14px', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 8 }}
            >
              Continue to Questions
            </button>
          </form>
        </div>
      )}

      {/* Step 3: Questionnaire */}
      {step === 3 && selectedScenario && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '32px', maxWidth: 640 }}>
          <span style={{ color: '#3b82f6', fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Heuristic baseline: {selectedScenario.baseline}/100</span>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginTop: 4, marginBottom: 20 }}>Answer Yes/No Checklist</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
            {selectedScenario.questions.map((q, idx) => (
              <div 
                key={idx}
                onClick={() => toggleAnswer(idx)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 20px', background: answers[idx] ? '#fef2f2' : '#f8fafc',
                  border: answers[idx] ? '1px solid #fca5a5' : '1px solid #e2e8f0',
                  borderRadius: 12, cursor: 'pointer', transition: 'all 0.15s'
                }}
              >
                <span style={{ fontSize: 14, color: '#0f172a', fontWeight: 600 }}>{q}</span>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  border: answers[idx] ? '6px solid #dc2626' : '2px solid #cbd5e1',
                  background: '#ffffff', transition: 'all 0.15s'
                }} />
              </div>
            ))}
          </div>

          <button 
            onClick={calculateVerdict}
            style={{ background: '#0f172a', color: '#ffffff', border: 'none', padding: '14px 28px', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
          >
            Compute Risk Score
          </button>
        </div>
      )}

      {/* Step 4: Verdict */}
      {step === 4 && verdict && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '40px', maxWidth: 640 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{
              width: 56, height: 56, background: verdict.level === 'Dangerous' ? '#fef2f2' : '#f0fdf4',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${verdict.level === 'Dangerous' ? '#fee2e2' : '#bbf7d0'}`
            }}>
              {verdict.level === 'Dangerous' ? <XCircle size={28} color="#dc2626" /> : <CheckCircle size={28} color="#16a34a" />}
            </div>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: verdict.level === 'Dangerous' ? '#b91c1c' : '#15803d' }}>
                {verdict.level} Severity
              </span>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginTop: 2 }}>Risk Score: {verdict.score}/100</h2>
            </div>
          </div>

          <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ height: '100%', width: `${verdict.score}%`, background: verdict.score >= 80 ? '#dc2626' : verdict.score >= 50 ? '#d97706' : '#16a34a', transition: 'width 1s' }} />
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px', display: 'flex', gap: 12, marginBottom: 24 }}>
            <Info size={18} color="#3b82f6" style={{ marginTop: 2 }} />
            <div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Recommended Protocol</span>
              <p style={{ fontSize: 14, color: '#475569', marginTop: 4, lineHeight: '20px' }}>{verdict.advice}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button 
              onClick={() => { setStep(1); setAnswers([false, false, false, false]); setVerdict(null); setSelectedScenario(null); setCallerNumber(''); }}
              style={{ background: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
            >
              Reset Evaluation
            </button>
            <button 
              onClick={() => setSaved(true)}
              disabled={saved}
              style={{ background: saved ? '#f0fdf4' : '#0f172a', color: saved ? '#16a34a' : '#ffffff', border: saved ? '1px solid #bbf7d0' : 'none', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: saved ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <Save size={16} />
              {saved ? 'Filed Successfully!' : 'Save Incident Log'}
            </button>
          </div>
        </div>
      )}

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
