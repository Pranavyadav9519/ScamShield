'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Clock, Shield, AlertTriangle, CheckCircle, Search } from 'lucide-react'

interface ScanResult {
  id: string
  input: string
  inputType: string
  riskScore: number
  riskLevel: string
  explanation: string
  createdAt: string
}

export default function HistoryPage() {
  const { token } = useAuth()
  const [scans, setScans] = useState<ScanResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    fetch('/api/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setScans(data.recentScans || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [token])

  const riskColor = (level: string) => {
    if (level === 'safe') return '#16a34a'
    if (level === 'suspicious') return '#d97706'
    return '#dc2626'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', padding: '32px 40px', fontFamily: 'Inter, sans-serif' }}>
      
      <div style={{ marginBottom: 32 }}>
        <span style={{ color: '#64748b', fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Analysis Logs</span>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', marginTop: 6 }}>Verification History</h1>
        <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Review historical threat classifications processed securely.</p>
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading records...</div>
        ) : scans.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
            <Search size={40} style={{ margin: '0 auto 16px', color: '#94a3b8' }} />
            <div style={{ fontSize: 15, fontWeight: 600 }}>No records found</div>
            <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Perform your first check in the Scenario Verify section.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Query Details</th>
                <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Context Type</th>
                <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Risk Score</th>
                <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Severity</th>
                <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {scans.map((scan) => (
                <tr key={scan.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '20px 24px', fontSize: 14, color: '#0f172a', fontWeight: 600, maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {scan.input}
                  </td>
                  <td style={{ padding: '20px 24px', fontSize: 13, color: '#475569', textTransform: 'capitalize' }}>
                    {scan.inputType}
                  </td>
                  <td style={{ padding: '20px 24px', fontSize: 14, color: riskColor(scan.riskLevel), fontWeight: 700 }}>
                    {scan.riskScore}/100
                  </td>
                  <td style={{ padding: '20px 24px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      background: `${riskColor(scan.riskLevel)}15`,
                      color: riskColor(scan.riskLevel),
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      {scan.riskLevel === 'safe' ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                      {scan.riskLevel}
                    </span>
                  </td>
                  <td style={{ padding: '20px 24px', fontSize: 13, color: '#64748b' }}>
                    {new Date(scan.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  )
}
