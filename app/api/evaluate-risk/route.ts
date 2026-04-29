import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { evaluateScamRisk } from '@/lib/gemini'
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
    const { inputType, content, additionalContext } = body

    if (!inputType || !content) {
      return NextResponse.json({ error: 'inputType and content are required' }, { status: 400 })
    }

    // Call the real Gemini AI to evaluate risk
    const evaluation = await evaluateScamRisk({ inputType, content, additionalContext })

    // Save result to database
    const scanResult = await prisma.scanResult.create({
      data: {
        userId: user.id,
        input: content,
        inputType,
        riskScore: evaluation.riskScore,
        riskLevel: evaluation.riskLevel,
        explanation: evaluation.explanation,
        indicators: JSON.stringify(evaluation.indicators),
      },
    })

    return NextResponse.json({
      id: scanResult.id,
      ...evaluation,
    })
  } catch (err) {
    console.error('Evaluate risk error:', err)
    return NextResponse.json({ error: 'Failed to evaluate risk' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await getUserFromToken(token)
    if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const results = await prisma.scanResult.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    const formatted = results.map((r) => ({
      ...r,
      indicators: JSON.parse(r.indicators),
    }))

    return NextResponse.json({ results: formatted })
  } catch (err) {
    console.error('Get scan results error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
