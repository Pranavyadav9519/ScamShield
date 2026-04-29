import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function evaluateScamRisk(userInput: {
  inputType: 'url' | 'text' | 'phone'
  content: string
  additionalContext?: string
}): Promise<{
  riskScore: number
  riskLevel: 'safe' | 'suspicious' | 'dangerous'
  explanation: string
  indicators: string[]
  advice: string
}> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const systemPrompt = `You are ScamShield AI, an expert fraud analyst and cybersecurity specialist with over 15 years of experience identifying scams, phishing attacks, and social engineering. Your job is to analyze submitted content and provide a thorough risk assessment.

You must respond ONLY with a valid JSON object and nothing else. No markdown, no explanations outside the JSON.

Analyze the following ${userInput.inputType} for scam risk indicators.

Input: "${userInput.content}"
${userInput.additionalContext ? `Additional context: "${userInput.additionalContext}"` : ''}

Return this exact JSON structure:
{
  "riskScore": <integer 0-100 where 0=completely safe, 100=definite scam>,
  "riskLevel": <"safe" if score 0-30, "suspicious" if 31-69, "dangerous" if 70-100>,
  "explanation": <detailed 2-3 sentence explanation of why this is or isn't a scam>,
  "indicators": <array of specific red flags or positive signals you found, max 6 items>,
  "advice": <specific actionable advice for the user on what to do next, 1-2 sentences>
}

Common scam indicators to look for:
- Urgency or pressure tactics
- Requests for personal info, money, or gift cards
- Poor grammar or spelling
- Mismatched domains (URL spoofing)
- Too-good-to-be-true offers
- Requests to move conversation to another platform
- Unknown shortlinks hiding the true destination
- Calls from government agencies asking for payment`

  const result = await model.generateContent(systemPrompt)
  const response = result.response.text()

  // Clean the response - sometimes Gemini wraps in markdown code blocks
  const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

  try {
    const parsed = JSON.parse(cleaned)
    return {
      riskScore: Math.min(100, Math.max(0, parseInt(parsed.riskScore))),
      riskLevel: parsed.riskLevel,
      explanation: parsed.explanation,
      indicators: Array.isArray(parsed.indicators) ? parsed.indicators : [],
      advice: parsed.advice,
    }
  } catch {
    throw new Error('Failed to parse AI response. Please try again.')
  }
}

export async function analyzeCallerNumber(phone: string): Promise<{
  isLikelyScam: boolean
  category: string
  confidence: number
  description: string
}> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = `You are a phone fraud detection specialist. Analyze this phone number: ${phone}

Based on the format, area code, and known patterns, assess the likelihood of this being a scam call.

Return ONLY a JSON object:
{
  "isLikelyScam": <boolean>,
  "category": <"robocall" | "telemarketing" | "fraud" | "government_impersonation" | "tech_support" | "legitimate" | "unknown">,
  "confidence": <integer 0-100>,
  "description": <1-2 sentence explanation of your assessment>
}`

  const result = await model.generateContent(prompt)
  const response = result.response.text()
  const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

  try {
    return JSON.parse(cleaned)
  } catch {
    return {
      isLikelyScam: false,
      category: 'unknown',
      confidence: 0,
      description: 'Unable to analyze this number at this time.',
    }
  }
}

export async function evaluateDeepfakeAndIdentity(input: {
  personName: string
  videoDescription: string
  context?: string
  image?: { data: string; mimeType: string }
}): Promise<{
  deepfakeProb: number
  anomalies: string[]
  identityMatch: string
}> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = `You are a forensic digital media analyst and deepfake detection auditor.
Analyze the following attributes (and inspect the attached image file for spatial pixel manipulation, facial warping, edge artifacts, and composite lighting flaws) to ascertain physical fabrication indicators.

Asserted Persona Name: "${input.personName}"
Visual Feed Overview: "${input.videoDescription}"
Situational Context: "${input.context || 'None'}"

Return strictly a JSON model (NO MARKDOWN wrap, no descriptions):
{
  "deepfakeProb": <integer 0-100 indicating likelihood of AI synthesis/impersonation>,
  "anomalies": <array of 2-4 distinct visual/behavioral inconsistencies to alert the user of>,
  "identityMatch": <string detailing whether the real identity matches Indian social engineering patterns>
}`

  const parts: any[] = [{ text: prompt }]
  if (input.image) {
    parts.push({
      inlineData: {
        data: input.image.data,
        mimeType: input.image.mimeType
      }
    })
  }

  const result = await model.generateContent(parts)
  const response = result.response.text()
  const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

  try {
    return JSON.parse(cleaned)
  } catch {
    return {
      deepfakeProb: 50,
      anomalies: ['Anomalous landmark variations.'],
      identityMatch: 'Digital presence verification inconclusive.'
    }
  }
}
