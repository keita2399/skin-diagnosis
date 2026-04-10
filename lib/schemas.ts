import { z } from 'zod'

// 問診フォームの入力スキーマ
export const QuestionnaireSchema = z.object({
  concerns: z.array(z.string()).min(1, '悩みを1つ以上選択してください'),
  severity: z.number().min(1).max(5),
  ageRange: z.string().min(1, '年齢レンジを選択してください'),
  treatmentHistory: z.array(z.string()),
  downtimeTolerance: z.string().min(1, 'ダウンタイム許容を選択してください'),
})

export type QuestionnaireInput = z.infer<typeof QuestionnaireSchema>

// AI診断結果のスキーマ
export const ConcernSchema = z.object({
  rank: z.number(),
  name: z.string(),
  severity: z.enum(['high', 'medium', 'low']),
  reason: z.string(),
})

export const TreatmentSchema = z.object({
  rank: z.number(),
  name: z.string(),
  description: z.string(),
  downtimeDays: z.number(),
  suitabilityReason: z.string(),
})

export const DiagnosisResultSchema = z.object({
  skinAge: z.number(),
  concerns: z.array(ConcernSchema).max(5),
  treatments: z.array(TreatmentSchema).max(3),
  overallComment: z.string(),
})

export type DiagnosisResult = z.infer<typeof DiagnosisResultSchema>

// 主訴の選択肢
export const CONCERN_OPTIONS = [
  'シミ・そばかす',
  'しわ・たるみ',
  '毛穴の開き',
  'ニキビ・吹き出物',
  '肌の赤み・敏感肌',
  '乾燥・ハリ不足',
  'くすみ・透明感',
  'ほうれい線',
  '目元のクマ・たるみ',
  '首・デコルテのしわ',
]

// 施術歴の選択肢
export const TREATMENT_HISTORY_OPTIONS = [
  '未経験（初めて）',
  'ヒアルロン酸注射',
  'ボトックス注射',
  'レーザー治療',
  'フォトフェイシャル',
  '美容点滴',
  'ピーリング',
  'RF（ラジオ波）',
]

export const AGE_RANGE_OPTIONS = [
  '20代前半（20〜24歳）',
  '20代後半（25〜29歳）',
  '30代前半（30〜34歳）',
  '30代後半（35〜39歳）',
  '40代前半（40〜44歳）',
  '40代後半（45〜49歳）',
  '50代以上',
]

export const DOWNTIME_OPTIONS = [
  '当日のみOK（ほぼダウンタイムなし）',
  '1〜3日程度OK',
  '1週間程度OK',
  '2週間以上でもOK',
]
