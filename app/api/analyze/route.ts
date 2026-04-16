import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import { DiagnosisResultSchema } from '@/lib/schemas'
import { buildDiagnosisPrompt } from '@/lib/prompt-builder'
import type { DiagnosisAnswers } from '@/components/diagnosis-screen'
import { logUsage } from '@/lib/logUsage'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { image, answers } = body as { image?: string; answers: DiagnosisAnswers }

    if (!answers) {
      return NextResponse.json({ error: '問診情報が必要です' }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: 'application/json' },
    })

    const prompt = buildDiagnosisPrompt(answers, !!image)
    const parts: Parameters<typeof model.generateContent>[0] = []

    if (image) {
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '')
      const mimeType = (image.match(/^data:(image\/\w+);base64,/)?.[1] ?? 'image/jpeg') as 'image/jpeg' | 'image/png' | 'image/webp'
      parts.push({ inlineData: { data: base64Data, mimeType } })
    }

    parts.push({ text: prompt })

    const result = await model.generateContent(parts)
    const responseText = result.response.text()

    logUsage({
      project: 'skin-diagnosis',
      model: 'gemini-2.5-flash',
      inputTokens: result.response.usageMetadata?.promptTokenCount ?? 0,
      outputTokens: result.response.usageMetadata?.candidatesTokenCount ?? 0,
    })

    let parsed: unknown
    try {
      parsed = JSON.parse(responseText)
    } catch {
      console.error('JSON parse error:', responseText)
      return NextResponse.json({ error: 'AI応答の解析に失敗しました' }, { status: 500 })
    }

    const validated = DiagnosisResultSchema.safeParse(parsed)
    if (!validated.success) {
      console.error('Validation error:', validated.error)
      return NextResponse.json({ error: '診断結果の形式が不正です' }, { status: 500 })
    }

    return NextResponse.json(validated.data)
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json({ error: '診断処理中にエラーが発生しました' }, { status: 500 })
  }
}
