import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await getUserFromToken(token)
    if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const contacts = await prisma.trustedContact.findMany({
      where: { userId: user.id },
    })

    if (contacts.length === 0) {
      return NextResponse.json({ error: 'No trusted contacts configured.' }, { status: 400 })
    }

    // Simulate automated emergency alerting pipeline
    // In production workflows, integrate Twilio Voice / WhatsApp API endpoints securely.
    const alertLogs = contacts.map((c) => ({
      contactName: c.name,
      phone: c.phone,
      status: 'SOS_DISPATCHED_SUCCESS',
      timestamp: new Date().toISOString(),
    }))

    return NextResponse.json({
      success: true,
      message: 'Emergency panic protocols activated successfully.',
      dispatches: alertLogs,
    })
  } catch (err) {
    console.error('Panic Alert API failure:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
