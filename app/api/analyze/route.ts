import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";
import { NextRequest, NextResponse } from 'next/server'
import { DiagnosisResultSchema } from '@/lib/schemas'
import { buildDiagnosisPrompt } from '@/lib/prompt-builder'
import type { DiagnosisAnswers } from '@/components/diagnosis-screen'
import { logUsage } from '@/lib/logUsage'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { image, answers } = body as { image?: string; answers: DiagnosisAnswers }

    if (!answers) {
      return NextResponse.json({ error: '問診情報が必要です' }, { status: 400 })
    }

    const model = new ChatGoogleGenerativeAI({
      model: 'gemini-2.5-flash',
      temperature: 0,
      apiKey: process.env.GEMINI_API_KEY!,
    })

    const prompt = buildDiagnosisPrompt(answers, !!image)

    const messageContent: Array<{ type: string; image_url?: { url: string }; text?: string }> = []

    if (image) {
      const mimeMatch = image.match(/^data:(image\/\w+);base64,/)
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg'
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '')
      messageContent.push({
        type: 'image_url',
        image_url: { url: `data:${mimeType};base64,${base64Data}` },
      })
    }

    messageContent.push({ type: 'text', text: prompt })

    const response = await model.invoke([
      new HumanMessage({ content: messageContent }),
    ])

    logUsage({
      project: 'skin-diagnosis',
      model: 'gemini-2.5-flash',
      inputTokens: response.usage_metadata?.input_tokens ?? 0,
      outputTokens: response.usage_metadata?.output_tokens ?? 0,
    })

    const rawText = typeof response.content === 'string' ? response.content : String(response.content)
    // Gemini がコードブロック(```json ... ```)で囲んで返すケースに対応
    const responseText = rawText.replace(/^```(?:json)?\s*/im, '').replace(/\s*```$/m, '').trim()

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
