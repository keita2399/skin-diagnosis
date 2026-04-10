'use client'

import { motion } from 'framer-motion'
import { Sparkles, Heart, Star } from 'lucide-react'

interface WelcomeScreenProps {
  onStart: () => void
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-50 to-blue-50 px-6 relative overflow-hidden">
      {/* Floating Elements */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scale: [0.8, 1.2, 0.8],
            y: [0, -30, 0],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
          className="absolute text-4xl pointer-events-none"
          style={{ left: `${10 + i * 12}%`, top: `${15 + (i % 4) * 20}%` }}
        >
          {i % 3 === 0 ? '✨' : i % 3 === 1 ? '💫' : '🌸'}
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full text-center relative z-10"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="relative w-32 h-32 mx-auto mb-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 rounded-full opacity-50 blur-xl"
          />
          <div className="relative w-32 h-32 bg-gradient-to-br from-pink-400 via-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-2xl shadow-pink-300">
            <Sparkles className="w-16 h-16 text-white" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-2"
            >
              <Heart className="w-8 h-8 text-pink-300 fill-pink-300" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="absolute -bottom-2 -left-2"
            >
              <Star className="w-8 h-8 text-yellow-300 fill-yellow-300" />
            </motion.div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-5xl mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent font-bold"
        >
          AI肌診断
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-700 mb-12 leading-relaxed text-lg"
        >
          あなたの肌質を診断して<br />
          最適なスキンケアをご提案します✨
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(236, 72, 153, 0.4)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 text-white py-5 px-8 rounded-full shadow-2xl shadow-pink-300 relative overflow-hidden cursor-pointer"
        >
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
          <span className="relative text-lg font-medium">診断を始める</span>
        </motion.button>
      </motion.div>
    </div>
  )
}
