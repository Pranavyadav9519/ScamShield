import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await getUserFromToken(token)
    if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const contacts = await prisma.trustedContact.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json({ contacts })
  } catch (err) {
    console.error('Contacts GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await getUserFromToken(token)
    if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const { name, phone, relation } = await req.json()

    if (!name || !phone || !relation) {
      return NextResponse.json({ error: 'name, phone, and relation are required' }, { status: 400 })
    }

    const contact = await prisma.trustedContact.create({
      data: { userId: user.id, name, phone, relation },
    })

    return NextResponse.json({ contact }, { status: 201 })
  } catch (err) {
    console.error('Contacts POST error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await getUserFromToken(token)
    if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    await prisma.trustedContact.deleteMany({ where: { id, userId: user.id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contacts DELETE error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
