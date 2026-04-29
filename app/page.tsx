'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('scamshield_token')
    if (token) {
      router.push('/dashboard')
    } else {
      router.push('/dashboard') // layout.tsx will show auth page if no user
    }
  }, [router])

  return null
}
