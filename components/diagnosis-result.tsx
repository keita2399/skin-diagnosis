'use client'

import type { DiagnosisResult } from '@/lib/schemas'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'

interface DiagnosisResultProps {
  result: DiagnosisResult
  onReset: () => void
}

const severityColors = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  low: 'bg-green-100 text-green-700 border-green-200',
}

const severityLabels = {
  high: '高',
  medium: '中',
  low: '低',
}

const rankColors = ['bg-yellow-400', 'bg-gray-300', 'bg-amber-600']

export function DiagnosisResultView({ result, onReset }: DiagnosisResultProps) {
  return (
    <div className="space-y-5">
      {/* 総評 */}
      <div className="rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 p-4 text-center">
        <p className="text-sm text-gray-600">{result.overallComment}</p>
      </div>

      {/* 推定肌年齢 */}
      <Card className="border-pink-100">
        <CardContent className="flex items-center justify-between p-5">
          <div>
            <p className="text-sm text-gray-500">推定肌年齢</p>
            <p className="text-xs text-gray-400">（AI分析による参考値）</p>
          </div>
          <div className="text-right">
            <span className="text-5xl font-bold text-pink-500">{result.skinAge}</span>
            <span className="text-xl text-pink-400">歳</span>
          </div>
        </CardContent>
      </Card>

      {/* 悩みランキング */}
      <Card className="border-purple-100">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base text-gray-700">お肌の悩みランキング</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pb-4">
          {result.concerns.map(concern => (
            <div key={concern.rank} className="flex items-start gap-3">
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${rankColors[concern.rank - 1] ?? 'bg-gray-400'}`}>
                {concern.rank}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800">{concern.name}</span>
                  <span className={`rounded border px-1.5 py-0.5 text-xs ${severityColors[concern.severity]}`}>
                    {severityLabels[concern.severity]}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-gray-500">{concern.reason}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 施術提案 */}
      <Card className="border-rose-100">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base text-gray-700">おすすめ施術</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-4">
          {result.treatments.map(treatment => (
            <div key={treatment.rank} className="rounded-lg border border-gray-100 p-3">
              <div className="flex items-center gap-2">
                <Badge className={`shrink-0 text-white ${rankColors[treatment.rank - 1] ?? 'bg-gray-400'}`}>
                  第{treatment.rank}候補
                </Badge>
                <span className="font-semibold text-gray-800">{treatment.name}</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">{treatment.description}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">
                  ダウンタイム {treatment.downtimeDays === 0 ? 'ほぼなし' : `約${treatment.downtimeDays}日`}
                </span>
              </div>
              <p className="mt-1.5 text-xs text-gray-400">{treatment.suitabilityReason}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 免責事項 */}
      <p className="text-center text-xs text-gray-400">
        ※この診断はAIによる参考情報です。医師の診断に代わるものではありません。
      </p>

      {/* リセットボタン */}
      <Button variant="outline" onClick={onReset} className="w-full">
        <RotateCcw className="mr-2 h-4 w-4" />
        もう一度診断する
      </Button>
    </div>
  )
}
