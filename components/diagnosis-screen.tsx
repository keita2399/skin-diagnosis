'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Question {
  id: string
  question: string
  options: string[]
  multi: boolean
}

const questions: Question[] = [
  {
    id: 'skin-trouble',
    question: '肌に関する悩みを教えてください',
    options: ['ニキビができる', '乾燥が気になる', '毛穴が目立つ', 'シミ・そばかす', '肌のくすみ', '赤みが出やすい', '混合肌', '肌荒れしやすい', '目元の小じわ', 'たるみが気になる', '敏感肌', '特になし'],
    multi: true,
  },
  {
    id: 'skin-condition',
    question: '肌の状態を選んでください',
    options: ['脂性肌', '普通肌', '乾燥肌', '混合肌', '敏感肌'],
    multi: false,
  },
  {
    id: 'concerns-area',
    question: '特に気になる部分はどこですか？',
    options: ['Tゾーン（額・鼻）', 'Uゾーン（頬・顎）', '目元', '口元', '顔全体', '特になし'],
    multi: true,
  },
  {
    id: 'age-range',
    question: '年齢レンジを教えてください',
    options: ['20代前半', '20代後半', '30代前半', '30代後半', '40代前半', '40代後半', '50代以上'],
    multi: false,
  },
  {
    id: 'downtime',
    question: 'ダウンタイムの許容はどのくらいですか？',
    options: ['当日のみ（ほぼなし）', '1〜3日程度', '1週間程度', '2週間以上でもOK'],
    multi: false,
  },
]

export type DiagnosisAnswers = Record<string, string[]>

interface DiagnosisScreenProps {
  onComplete: (answers: DiagnosisAnswers) => void
  onBack: () => void
}

export function DiagnosisScreen({ onComplete, onBack }: DiagnosisScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<DiagnosisAnswers>({})

  const current = questions[currentStep]
  const currentAnswers = answers[current.id] ?? []

  const toggleAnswer = (option: string) => {
    if (current.multi) {
      const next = currentAnswers.includes(option)
        ? currentAnswers.filter(a => a !== option)
        : [...currentAnswers, option]
      setAnswers({ ...answers, [current.id]: next })
    } else {
      setAnswers({ ...answers, [current.id]: [option] })
    }
  }

  const goNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(s => s + 1)
    } else {
      onComplete(answers)
    }
  }

  const goBack = () => {
    if (currentStep > 0) setCurrentStep(s => s - 1)
    else onBack()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-50 px-6 py-12 relative overflow-hidden">
      {/* Floating emojis */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3], y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
          className="absolute text-3xl pointer-events-none"
          style={{ left: `${15 + i * 18}%`, top: `${10 + i * 15}%` }}
        >
          {i % 2 === 0 ? '✨' : '💖'}
        </motion.div>
      ))}

      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            {questions.map((_, index) => (
              <div key={index} className="flex items-center">
                <motion.div
                  animate={{
                    scale: currentStep === index ? 1.2 : 1,
                    backgroundColor: index <= currentStep ? '#EC4899' : '#E5E7EB',
                  }}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-medium relative"
                >
                  {index < currentStep ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 bg-pink-500 rounded-full flex items-center justify-center"
                    >
                      ✓
                    </motion.div>
                  ) : (
                    index + 1
                  )}
                </motion.div>
                {index < questions.length - 1 && (
                  <motion.div
                    animate={{ backgroundColor: index < currentStep ? '#EC4899' : '#E5E7EB' }}
                    className="w-10 h-1 mx-1"
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500">
            ステップ {currentStep + 1} / {questions.length}
          </p>
        </div>

        {/* Question */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl text-center mb-2 text-gray-900 font-semibold">
            {current.question}
          </h2>
          {current.multi && (
            <p className="text-center text-sm text-gray-400 mb-6">（複数選択可）</p>
          )}
          {!current.multi && <div className="mb-6" />}

          <div className="grid grid-cols-2 gap-3 mb-10">
            {current.options.map(option => {
              const isSelected = currentAnswers.includes(option)
              return (
                <motion.button
                  key={option}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleAnswer(option)}
                  className={`py-4 px-4 rounded-2xl border-2 transition-all text-sm cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-br from-pink-500 to-purple-500 border-pink-500 text-white shadow-xl shadow-pink-200'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-pink-300 hover:shadow-md'
                  }`}
                >
                  {option}
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={goBack}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
            戻る
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={goNext}
            disabled={currentAnswers.length === 0}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {currentStep === questions.length - 1 ? '診断結果を見る' : '次へ'}
            {currentStep < questions.length - 1 && <ChevronRight className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
