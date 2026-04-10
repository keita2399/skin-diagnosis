'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { WelcomeScreen } from '@/components/welcome-screen'
import { CameraScreen } from '@/components/camera-screen'
import { DiagnosisScreen, type DiagnosisAnswers } from '@/components/diagnosis-screen'
import { ResultScreen } from '@/components/result-screen'
import type { DiagnosisResult } from '@/lib/schemas'

type Screen = 'welcome' | 'camera' | 'diagnosis' | 'loading' | 'result'

export default function Home() {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCameraCapture = (imageData: string) => {
    setCapturedImage(imageData)
    setScreen('diagnosis')
  }

  const handleDiagnosisComplete = async (answers: DiagnosisAnswers) => {
    setScreen('loading')
    setError(null)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: capturedImage, answers }),
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error ?? '診断に失敗しました')
      }
      const result: DiagnosisResult = await response.json()
      setDiagnosisResult(result)
      setScreen('result')
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました')
      setScreen('diagnosis')
    }
  }

  const handleRestart = () => {
    setCapturedImage(null)
    setDiagnosisResult(null)
    setError(null)
    setScreen('welcome')
  }

  if (screen === 'welcome') {
    return <WelcomeScreen onStart={() => setScreen('camera')} />
  }

  if (screen === 'camera') {
    return <CameraScreen onCapture={handleCameraCapture} onBack={() => setScreen('welcome')} />
  }

  if (screen === 'diagnosis') {
    return (
      <>
        {error && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded-full shadow">
            {error}
          </div>
        )}
        <DiagnosisScreen
          onComplete={handleDiagnosisComplete}
          onBack={() => setScreen('camera')}
        />
      </>
    )
  }

  if (screen === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-pink-500 flex items-center justify-center shadow-2xl shadow-pink-300"
          >
            <span className="text-3xl">✨</span>
          </motion.div>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-gray-600 text-lg"
          >
            AI診断中...
          </motion.p>
          <p className="text-gray-400 text-sm mt-2">お肌を分析しています</p>
        </div>
      </div>
    )
  }

  if (screen === 'result' && diagnosisResult) {
    return <ResultScreen result={diagnosisResult} onRestart={handleRestart} />
  }

  return null
}
