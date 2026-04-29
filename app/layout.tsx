import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ScamShield — AI-Powered Fraud Protection',
  description: 'Protect yourself from scams, phishing, and fraud with AI-powered real-time threat detection and risk analysis.',
  keywords: ['scam detection', 'fraud protection', 'phishing', 'AI security', 'scam shield'],
  authors: [{ name: 'ScamShield' }],
  openGraph: {
    title: 'ScamShield — AI-Powered Fraud Protection',
    description: 'Protect yourself from scams and fraud with real-time AI analysis.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
