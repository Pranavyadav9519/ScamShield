import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await getUserFromToken(token)
    if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const [scanCount, evidenceCount, dangerCount, recentScans] = await Promise.all([
      prisma.scanResult.count({ where: { userId: user.id } }),
      prisma.evidence.count({ where: { userId: user.id } }),
      prisma.scanResult.count({ where: { userId: user.id, riskLevel: 'dangerous' } }),
      prisma.scanResult.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ])

    const recentFormatted = recentScans.map((s) => ({
      ...s,
      indicators: JSON.parse(s.indicators),
    }))

    return NextResponse.json({
      stats: {
        totalScans: scanCount,
        totalEvidence: evidenceCount,
        threatsDetected: dangerCount,
        protectionRate: scanCount > 0 ? Math.round(((scanCount - dangerCount) / scanCount) * 100) : 100,
      },
      recentScans: recentFormatted,
    })
  } catch (err) {
    console.error('Dashboard error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
