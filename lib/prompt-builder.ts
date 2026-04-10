import type { DiagnosisAnswers } from '@/components/diagnosis-screen'

export function buildDiagnosisPrompt(answers: DiagnosisAnswers, imageProvided: boolean): string {
  const troubles = answers['skin-trouble']?.join('、') ?? '未回答'
  const condition = answers['skin-condition']?.[0] ?? '未回答'
  const areas = answers['concerns-area']?.join('、') ?? '未回答'
  const age = answers['age-range']?.[0] ?? '未回答'
  const downtime = answers['downtime']?.[0] ?? '未回答'

  return `あなたは美容クリニックの経験豊富なカウンセラーです。
${imageProvided ? '患者から提供された顔写真と問診情報' : '問診情報'}をもとに、肌状態の診断と施術提案を行ってください。

【問診情報】
- 肌の悩み: ${troubles}
- 肌の状態: ${condition}
- 気になる部位: ${areas}
- 年齢レンジ: ${age}
- ダウンタイム許容: ${downtime}

${imageProvided ? '【診断指示】\n1. 顔写真を詳しく分析してください（肌のキメ、色むら、しわ、たるみ、毛穴、シミなど）\n2. 写真分析と問診情報を総合して診断を行ってください\n' : '【診断指示】\n1. 問診情報をもとに診断を行ってください\n'}
必ず以下のJSON形式のみで回答してください。説明文や前置きは不要です。

{
  "skinAge": <推定肌年齢（数値）>,
  "concerns": [
    {
      "rank": 1,
      "name": "<悩み名>",
      "severity": "<high|medium|low>",
      "reason": "<判断した理由（30文字以内）>"
    }
  ],
  "treatments": [
    {
      "rank": 1,
      "name": "<施術名>",
      "description": "<施術の説明（40文字以内）>",
      "downtimeDays": <ダウンタイム日数（数値）>,
      "suitabilityReason": "<この患者に適している理由（30文字以内）>"
    }
  ],
  "overallComment": "<患者向けの総評（60文字以内、ポジティブで励ましを含む内容）>"
}

【注意事項】
- concernsは最大5件
- treatmentsは最大3件、ダウンタイム許容（${downtime}）に合ったものを優先
- 医療行為の断定的な表現は避け、提案として記述`
}
