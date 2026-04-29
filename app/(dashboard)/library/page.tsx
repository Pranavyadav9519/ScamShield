'use client'

import { useState } from 'react'
import { BookOpen, AlertCircle, CheckCircle, ChevronDown } from 'lucide-react'

const libraryData = [
  {
    title: 'Digital Arrest Scam',
    desc: 'Fraudsters pose as CBI, ED, or Police officials over WhatsApp/Skype video call, claiming your identity was used for illegal shipments and fake an arrest warrant.',
    how: 'They force you into a continuous video call, display forged documents, and insist on a "refundable verification deposit" to avoid immediate detention.',
    flags: ['Strict mandate to stay on the call', 'Demanding financial settlement via digital gateways', 'Forged clearance forms'],
    todo: 'Hang up immediately. Law enforcement agencies never contact citizens via video conferencing channels or ask for capital.'
  },
  {
    title: 'FedEx / Customs Issue',
    desc: 'Victims receive a call asserting that a parcel sent in their name to Taiwan/Cambodia contains prohibited substances like narcotics.',
    how: 'To resolve the imaginary problem, the caller transfers you to a partner posing as a police investigator requesting banking credentials.',
    flags: ['Threats of impending legal incarceration', 'Coerced transfer to external officials'],
    todo: 'Disconnect the line. Verify shipment tracking stats directly via actual logistics accounts.'
  },
  {
    title: 'KYC Fraud',
    desc: 'Spammers warn that linked utility connections or SIM cards will deactivate within hours due to pending documentation updates.',
    how: 'A deceptive hyperlink prompts victims to download an unauthorized administrative portal to submit identity parameters.',
    flags: ['Short timeline ultimatums', 'Instructions to download .apk installers'],
    todo: 'Contact valid telecommunication support centers directly without pressing third-party buttons.'
  },
  {
    title: 'Remote Access Scam',
    desc: 'Perpetrators pretend to be customer care technicians fixing backend banking glitches.',
    how: 'They direct the download of applications like AnyDesk to view device screens covertly.',
    flags: ['Pushy technical jargon', 'Asks to enter transactional passwords live'],
    todo: 'Close screensharing sessions instantly if prompted by unknown individuals.'
  },
  {
    title: 'Loan App Harassment',
    desc: 'Unregistered microlenders leverage predatory tactics to enforce extortionate interest thresholds.',
    how: 'They harvest contact lists upon installation to threaten public exposure.',
    flags: ['Demands for money upfront', 'Abusive verbal threats'],
    todo: 'File cybercrime reports safely and restrict peripheral address permissions.'
  },
  {
    title: 'Lottery Scam',
    desc: 'Congratulations messages promise bumper rewards tied to commercial sweepstakes.',
    how: 'Payment of processing tariffs must be issued prior to releasing prize packages.',
    flags: ['Requests for advance processing fees'],
    todo: 'Ignore claims relating to contests never formally entered.'
  }
]

export default function ScamLibraryPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', padding: '32px 40px', fontFamily: 'Inter, sans-serif' }}>
      
      <div style={{ marginBottom: 32 }}>
        <span style={{ color: '#64748b', fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Static Knowledge Base</span>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', marginTop: 6 }}>Scam Library</h1>
        <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Understand mechanics deployed by cybercriminals operating modern fraud pipelines.</p>
      </div>

      <div style={{ maxWidth: 800, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {libraryData.map((scam, idx) => {
          const isOpen = openIdx === idx
          return (
            <div 
              key={scam.title}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                overflow: 'hidden',
                transition: 'all 0.2s',
              }}
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                style={{
                  width: '100%',
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{scam.title}</span>
                <ChevronDown 
                  size={20} 
                  color="#64748b" 
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} 
                />
              </button>

              {isOpen && (
                <div style={{ padding: '0 24px 24px', borderTop: '1px solid #f1f5f9' }}>
                  <p style={{ fontSize: 14, color: '#334155', marginTop: 16, lineHeight: '22px' }}>
                    {scam.desc}
                  </p>
                  
                  <div style={{ marginTop: 20 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                      How it works
                    </span>
                    <p style={{ fontSize: 13, color: '#475569', lineHeight: '20px' }}>{scam.how}</p>
                  </div>

                  <div style={{ marginTop: 20 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                      Red Flags
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {scam.flags.map((flag, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#b91c1c' }}>
                          <AlertCircle size={14} style={{ minWidth: 14 }} />
                          <span>{flag}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginTop: 24, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '16px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <CheckCircle size={18} color="#16a34a" style={{ marginTop: 2 }} />
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#14532d' }}>What to do</span>
                      <p style={{ fontSize: 13, color: '#166534', marginTop: 4, lineHeight: '18px' }}>{scam.todo}</p>
                    </div>
                  </div>

                </div>
              )}
            </div>
          )
        })}
      </div>

    </div>
  )
}
