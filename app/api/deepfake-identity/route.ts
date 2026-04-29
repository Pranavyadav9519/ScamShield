import { NextRequest, NextResponse } from 'next/server'
import { evaluateDeepfakeAndIdentity } from '@/lib/gemini'
import { getUserFromToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await req.json()
    const { personName, videoDescription, context } = body

    if (!personName && !videoDescription) {
      return NextResponse.json({ error: 'Metadata attributes required for AI profiling.' }, { status: 400 })
    }

    const assessment = await evaluateDeepfakeAndIdentity({
      personName: personName || 'Unknown',
      videoDescription: videoDescription || 'Standard visual relay',
      context
    })

    return NextResponse.json(assessment)
  } catch (err) {
    console.error('Deepfake evaluation error:', err)
    return NextResponse.json({ error: 'Forensic analysis failed to initialize' }, { status: 500 })
  }
}
