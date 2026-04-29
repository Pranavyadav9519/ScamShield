import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePasswords, signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const valid = await comparePasswords(password, user.password)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = signToken(user.id, user.email)
    const { password: _, ...safeUser } = user

    return NextResponse.json({ user: safeUser, token }, { status: 200 })
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
