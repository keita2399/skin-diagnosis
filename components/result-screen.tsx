'use client'

import { motion } from 'framer-motion'
import { Sparkles, Star, Heart, Zap, Award } from 'lucide-react'
import type { DiagnosisResult } from '@/lib/schemas'

interface ResultScreenProps {
  result: DiagnosisResult
  onRestart: () => void
}

const severityColors = {
  high: 'from-red-100 to-red-50 border-red-200',
  medium: 'from-yellow-100 to-yellow-50 border-yellow-200',
  low: 'from-green-100 to-green-50 border-green-200',
}
const severityLabels = { high: '高', medium: '中', low: '低' }
const severityDotColors = { high: 'from-red-500 to-red-600', medium: 'from-yellow-500 to-yellow-600', low: 'from-green-500 to-green-600' }
const rankGradients = ['from-yellow-400 to-yellow-500', 'from-gray-300 to-gray-400', 'from-amber-500 to-amber-600']

export function ResultScreen({ result, onRestart }: ResultScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-50 px-6 py-12 relative overflow-hidden">
      {/* アニメーション背景シェイプ */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`bg-${i}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 10 + i * 2, repeat: Infinity, delay: i * 0.5 }}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${150 + i * 50}px`, height: `${150 + i * 50}px`,
            left: `${i * 20}%`, top: `${i * 15}%`,
            background: `linear-gradient(135deg, ${i % 3 === 0 ? '#ec4899' : i % 3 === 1 ? '#a855f7' : '#3b82f6'}20, transparent)`,
          }}
        />
      ))}

      {/* 祝福スパークル */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0], y: [0, -150 - i * 10], x: [(i % 2 ? 1 : -1) * (30 + i * 8)], rotate: [0, 360] }}
          transition={{ duration: 2.5, delay: i * 0.15, repeat: Infinity, repeatDelay: 1.5 }}
          className="absolute text-4xl pointer-events-none"
          style={{ left: `${5 + i * 4.5}%`, bottom: '5%' }}
        >
          {['✨', '💖', '⭐', '🌟', '💫', '🎀', '🌸', '💝'][i % 8]}
        </motion.div>
      ))}

      {/* 浮遊ハート */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`heart-${i}`}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: [0, 0.6, 0], y: [100, -100], x: [0, (i % 2 ? 1 : -1) * 50] }}
          transition={{ duration: 4, delay: i * 0.5, repeat: Infinity, repeatDelay: 2 }}
          className="absolute text-pink-300 text-2xl pointer-events-none"
          style={{ left: `${15 + i * 11}%`, bottom: 0 }}
        >
          💕
        </motion.div>
      ))}

      <div className="max-w-3xl mx-auto relative z-10">
        {/* 紙吹雪 */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`confetti-${i}`}
            initial={{ opacity: 0, y: -50, rotate: 0 }}
            animate={{ opacity: [0, 1, 1, 0], y: [0, 200], rotate: [0, 360 * (i % 2 ? 1 : -1)], x: [(i % 2 ? 1 : -1) * (20 + i * 5)] }}
            transition={{ duration: 2, delay: i * 0.05, ease: 'easeOut' }}
            className="absolute text-3xl pointer-events-none"
            style={{ left: `${30 + i * 3}%`, top: '-50px' }}
          >
            {['🎊', '🎉', '✨', '💝', '🌸'][i % 5]}
          </motion.div>
        ))}

        {/* ヘッダー */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          {/* バッジ */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="relative w-40 h-40 mx-auto mb-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 rounded-full opacity-40 blur-2xl scale-150"
            />
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 border-4 border-pink-300 rounded-full"
            />
            <div className="relative w-40 h-40 bg-gradient-to-br from-pink-400 via-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-pink-400">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <Sparkles className="w-14 h-14" />
              </motion.div>
              {/* 周回する星 */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0"
              >
                {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    className="absolute"
                    style={{
                      left: `${50 + 55 * Math.cos((angle * Math.PI) / 180)}%`,
                      top: `${50 + 55 * Math.sin((angle * Math.PI) / 180)}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-6 h-6 text-pink-500" />
              <h1 className="text-4xl bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent font-bold">
                診断完了！
              </h1>
              <Sparkles className="w-6 h-6 text-pink-500" />
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center justify-center gap-2 text-sm text-purple-600"
            >
              <Award className="w-4 h-4" />
              <span>あなたにぴったりのケアプランをご提案します</span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* 推定肌年齢 + 総評 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="relative bg-gradient-to-br from-white via-pink-50 to-purple-50 rounded-3xl p-7 mb-6 shadow-xl shadow-pink-200/50 border border-pink-100 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-200 to-transparent rounded-full blur-3xl opacity-50" />
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">推定肌年齢</p>
              <p className="text-xs text-gray-400">（AI分析による参考値）</p>
            </div>
            <div>
              <span className="text-5xl font-bold text-pink-500">{result.skinAge}</span>
              <span className="text-xl text-pink-400">歳</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
              <Heart className="w-5 h-5 text-pink-500 fill-pink-500 flex-shrink-0 mt-0.5" />
            </motion.div>
            <p className="text-gray-700 leading-relaxed">{result.overallComment}</p>
          </div>
        </motion.div>

        {/* 悩みランキング */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="relative bg-gradient-to-br from-white via-pink-50 to-purple-50 rounded-3xl p-7 mb-6 shadow-xl shadow-pink-200/50 border border-pink-100 overflow-hidden"
        >
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-200 to-transparent rounded-full blur-3xl opacity-50" />
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent font-semibold">
              お肌の悩みランキング
            </h3>
          </div>
          <div className="grid gap-3">
            {result.concerns.map((concern, index) => (
              <motion.div
                key={concern.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className={`relative bg-gradient-to-r ${severityColors[concern.severity]} rounded-2xl p-5 border shadow-md hover:shadow-lg transition-all cursor-pointer group`}
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    className={`w-8 h-8 bg-gradient-to-br ${rankGradients[concern.rank - 1] ?? 'from-gray-400 to-gray-500'} rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-lg text-xs font-bold`}
                  >
                    {concern.rank}
                  </motion.div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">{concern.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${severityDotColors[concern.severity]} text-white`}>
                        {severityLabels[concern.severity]}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{concern.reason}</p>
                  </div>
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 施術提案 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="relative bg-gradient-to-br from-white via-purple-50 to-blue-50 rounded-3xl p-7 mb-6 shadow-xl shadow-purple-200/50 border border-purple-100 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-200 to-transparent rounded-full blur-3xl opacity-50" />
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-semibold">
              おすすめ施術
            </h3>
          </div>
          <div className="grid gap-3">
            {result.treatments.map((treatment, index) => (
              <motion.div
                key={treatment.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 + index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="relative bg-gradient-to-r from-purple-100 via-purple-50 to-blue-50 rounded-2xl p-5 border border-purple-200 shadow-md hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-xs font-bold text-white px-2 py-1 rounded-full bg-gradient-to-r ${rankGradients[treatment.rank - 1] ?? 'from-gray-400 to-gray-500'}`}>
                    第{treatment.rank}候補
                  </span>
                  <span className="font-semibold text-gray-800">{treatment.name}</span>
                  <Heart className="w-4 h-4 text-pink-500 fill-pink-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-sm text-gray-600 mb-2">{treatment.description}</p>
                <div className="flex gap-2">
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-600">
                    ダウンタイム {treatment.downtimeDays === 0 ? 'ほぼなし' : `約${treatment.downtimeDays}日`}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-400">{treatment.suitabilityReason}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <p className="text-center text-xs text-gray-400 mb-6">
          ※この診断はAIによる参考情報です。医師の診断に代わるものではありません。
        </p>

        {/* リスタートボタン */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(236, 72, 153, 0.3)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onRestart}
          className="w-full relative bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 text-white py-5 px-8 rounded-full shadow-xl shadow-pink-300 overflow-hidden cursor-pointer"
        >
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
          <span className="relative flex items-center justify-center gap-2 text-lg font-medium">
            <Sparkles className="w-5 h-5" />
            もう一度診断する
            <Sparkles className="w-5 h-5" />
          </span>
        </motion.button>
      </div>
    </div>
  )
}
