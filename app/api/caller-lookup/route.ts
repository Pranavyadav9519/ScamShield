import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { analyzeCallerNumber } from '@/lib/gemini'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const phone = searchParams.get('phone')

    if (!phone) {
      return NextResponse.json({ error: 'phone parameter is required' }, { status: 400 })
    }

    // Clean the phone number
    const cleaned = phone.replace(/[^0-9+]/g, '')

    // Check our community database first
    const reported = await prisma.reportedNumber.findUnique({
      where: { phone: cleaned },
    })

    // Use Gemini to analyze the number
    const aiAnalysis = await analyzeCallerNumber(cleaned)

    return NextResponse.json({
      phone: cleaned,
      communityReports: reported?.reportCount || 0,
      category: reported?.category || aiAnalysis.category,
      description: reported?.description || aiAnalysis.description,
      aiAnalysis,
      isReported: !!reported,
    })
  } catch (err) {
    console.error('Caller lookup error:', err)
    return NextResponse.json({ error: 'Failed to look up caller' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { phone, category, description } = await req.json()

    if (!phone) {
      return NextResponse.json({ error: 'phone is required' }, { status: 400 })
    }

    const cleaned = phone.replace(/[^0-9+]/g, '')

    const reported = await prisma.reportedNumber.upsert({
      where: { phone: cleaned },
      update: {
        reportCount: { increment: 1 },
        category: category || 'unknown',
        description: description || '',
      },
      create: {
        phone: cleaned,
        category: category || 'unknown',
        description: description || '',
      },
    })

    return NextResponse.json({ reported }, { status: 201 })
  } catch (err) {
    console.error('Report number error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
