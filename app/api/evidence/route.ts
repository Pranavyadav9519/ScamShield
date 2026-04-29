import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await getUserFromToken(token)
    if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const evidences = await prisma.evidence.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ evidences })
  } catch (err) {
    console.error('Evidence GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await getUserFromToken(token)
    if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const { title, description, type, content, riskLevel, tags } = await req.json()

    if (!title || !type || !content) {
      return NextResponse.json({ error: 'title, type, and content are required' }, { status: 400 })
    }

    const evidence = await prisma.evidence.create({
      data: {
        userId: user.id,
        title,
        description: description || '',
        type,
        content,
        riskLevel: riskLevel || 'unknown',
        tags: Array.isArray(tags) ? tags.join(',') : (tags || ''),
      },
    })

    return NextResponse.json({ evidence }, { status: 201 })
  } catch (err) {
    console.error('Evidence POST error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
