import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await getUserFromToken(token)
    if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const evidence = await prisma.evidence.findFirst({
      where: { id, userId: user.id },
    })

    if (!evidence) {
      return NextResponse.json({ error: 'Evidence not found' }, { status: 404 })
    }

    await prisma.evidence.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Evidence DELETE error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await getUserFromToken(token)
    if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const body = await req.json()
    const evidence = await prisma.evidence.findFirst({
      where: { id, userId: user.id },
    })

    if (!evidence) {
      return NextResponse.json({ error: 'Evidence not found' }, { status: 404 })
    }

    const updated = await prisma.evidence.update({
      where: { id },
      data: body,
    })

    return NextResponse.json({ evidence: updated })
  } catch (err) {
    console.error('Evidence PATCH error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
