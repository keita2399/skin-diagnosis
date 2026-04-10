'use client'

import { useForm, Controller, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { QuestionnaireSchema, QuestionnaireInput, CONCERN_OPTIONS, TREATMENT_HISTORY_OPTIONS, AGE_RANGE_OPTIONS, DOWNTIME_OPTIONS } from '@/lib/schemas'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'

interface QuestionnaireFormProps {
  onSubmit: (data: QuestionnaireInput) => void
  isLoading: boolean
}

export function QuestionnaireForm({ onSubmit, isLoading }: QuestionnaireFormProps) {
  const { control, handleSubmit, setValue, formState: { errors } } = useForm<QuestionnaireInput>({
    resolver: zodResolver(QuestionnaireSchema),
    defaultValues: {
      concerns: [],
      severity: 3,
      ageRange: '',
      treatmentHistory: [],
      downtimeTolerance: '',
    },
  })

  const selectedConcerns = useWatch({ control, name: 'concerns' })
  const selectedTreatments = useWatch({ control, name: 'treatmentHistory' })
  const severity = useWatch({ control, name: 'severity' })

  const toggleConcern = (concern: string) => {
    const current = selectedConcerns
    if (current.includes(concern)) {
      setValue('concerns', current.filter(c => c !== concern))
    } else {
      setValue('concerns', [...current, concern])
    }
  }

  const toggleTreatment = (treatment: string) => {
    const current = selectedTreatments
    if (current.includes(treatment)) {
      setValue('treatmentHistory', current.filter(t => t !== treatment))
    } else {
      setValue('treatmentHistory', [...current, treatment])
    }
  }

  const severityLabels = ['', '気になる程度', 'やや気になる', '気になる', 'かなり気になる', '非常に気になる']

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 主訴 */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          気になる悩み <span className="text-pink-500">*</span>
          <span className="ml-1 text-xs text-gray-400">（複数選択可）</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {CONCERN_OPTIONS.map(concern => (
            <button
              key={concern}
              type="button"
              onClick={() => toggleConcern(concern)}
              className={`cursor-pointer rounded-full border px-3 py-1 text-sm transition-colors ${
                selectedConcerns.includes(concern)
                  ? 'border-pink-400 bg-pink-50 text-pink-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-pink-200'
              }`}
            >
              {concern}
            </button>
          ))}
        </div>
        {errors.concerns && (
          <p className="mt-1 text-xs text-red-500">{errors.concerns.message}</p>
        )}
      </div>

      {/* 悩みの強さ */}
      <div>
        <label className="mb-3 block text-sm font-medium text-gray-700">
          悩みの強さ: <span className="text-pink-600">{severityLabels[severity]}</span>
        </label>
        <Controller
          name="severity"
          control={control}
          render={({ field }) => (
            <Slider
              min={1}
              max={5}
              step={1}
              value={[field.value]}
              onValueChange={(val) => {
                const num = Array.isArray(val) ? val[0] : val
                field.onChange(num)
              }}
              className="w-full"
            />
          )}
        />
        <div className="mt-1 flex justify-between text-xs text-gray-400">
          <span>少し気になる</span>
          <span>非常に気になる</span>
        </div>
      </div>

      {/* 年齢レンジ */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          年齢レンジ <span className="text-pink-500">*</span>
        </label>
        <Controller
          name="ageRange"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent className="min-w-[280px]">
                {AGE_RANGE_OPTIONS.map(age => (
                  <SelectItem key={age} value={age}>{age}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.ageRange && (
          <p className="mt-1 text-xs text-red-500">{errors.ageRange.message}</p>
        )}
      </div>

      {/* 施術歴 */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          施術歴
          <span className="ml-1 text-xs text-gray-400">（複数選択可）</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {TREATMENT_HISTORY_OPTIONS.map(treatment => (
            <button
              key={treatment}
              type="button"
              onClick={() => toggleTreatment(treatment)}
              className={`cursor-pointer rounded-full border px-3 py-1 text-sm transition-colors ${
                selectedTreatments.includes(treatment)
                  ? 'border-purple-400 bg-purple-50 text-purple-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-purple-200'
              }`}
            >
              {treatment}
            </button>
          ))}
        </div>
      </div>

      {/* ダウンタイム許容 */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          ダウンタイム許容 <span className="text-pink-500">*</span>
        </label>
        <Controller
          name="downtimeTolerance"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent className="min-w-[320px]">
                {DOWNTIME_OPTIONS.map(opt => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.downtimeTolerance && (
          <p className="mt-1 text-xs text-red-500">{errors.downtimeTolerance.message}</p>
        )}
      </div>

      {/* 選択中の悩みサマリー */}
      {selectedConcerns.length > 0 && (
        <div className="rounded-lg bg-pink-50 p-3">
          <p className="mb-2 text-xs font-medium text-pink-700">選択中の悩み:</p>
          <div className="flex flex-wrap gap-1">
            {selectedConcerns.map(c => (
              <Badge key={c} variant="secondary" className="bg-pink-100 text-pink-700">
                {c}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-pink-500 hover:bg-pink-600 disabled:opacity-60"
        size="lg"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            AI診断中...
          </span>
        ) : 'AI肌診断を開始する'}
      </Button>
    </form>
  )
}
