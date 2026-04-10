'use client'

import { motion } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { Camera, RotateCcw, Check, X, Upload } from 'lucide-react'

interface CameraScreenProps {
  onCapture: (imageData: string) => void
  onBack: () => void
}

export function CameraScreen({ onCapture, onBack }: CameraScreenProps) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cameraReady, setCameraReady] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop())
    }
  }, [stream])

  const startCamera = async () => {
    setCameraReady(false)
    setError(null)
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError('お使いのブラウザはカメラ機能に対応していません')
        return
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280, height: 720 },
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.onloadedmetadata = () => setCameraReady(true)
      }
    } catch (err) {
      console.error('Camera error:', err)
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') setError('カメラへのアクセスが拒否されました。ブラウザの設定でカメラの使用を許可してください。')
        else if (err.name === 'NotFoundError') setError('カメラが見つかりませんでした。')
        else if (err.name === 'NotReadableError') setError('カメラは他のアプリケーションで使用中です。')
        else setError('カメラの起動に失敗しました: ' + err.message)
      }
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (ctx) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0)
        setCapturedImage(canvas.toDataURL('image/jpeg', 0.9))
      }
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result as string
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const max = 1024
        let { width, height } = img
        if (width > max || height > max) {
          if (width > height) { height = Math.round(height * max / width); width = max }
          else { width = Math.round(width * max / height); height = max }
        }
        canvas.width = width; canvas.height = height
        canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
        setCapturedImage(canvas.toDataURL('image/jpeg', 0.9))
      }
      img.src = result
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-50 px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl mb-3 text-gray-900 font-semibold">顔写真を撮影</h2>
          <p className="text-gray-600">お肌の状態を確認するため、お顔の写真を撮影してください</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative bg-white rounded-3xl overflow-hidden shadow-2xl mb-8"
        >
          <div className="relative aspect-[4/3] bg-gray-900">
            {/* 初期状態 */}
            {!stream && !error && !capturedImage && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-900/30 to-purple-900/30">
                <div className="text-center p-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                    <Camera className="w-20 h-20 text-pink-300 mx-auto mb-6" />
                  </motion.div>
                  <h3 className="text-xl text-white mb-4">カメラを起動します</h3>
                  <p className="text-white/70 mb-8 text-sm">
                    ブラウザからカメラの許可を求められたら<br />「許可」をクリックしてください
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startCamera}
                    className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-xl text-lg cursor-pointer mb-4"
                  >
                    カメラを起動
                  </motion.button>
                </div>
              </div>
            )}

            {/* エラー状態 */}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-900/50 to-purple-900/50">
                <div className="text-center p-8 max-w-md">
                  <X className="w-16 h-16 text-pink-300 mx-auto mb-4" />
                  <p className="text-white mb-6 leading-relaxed text-sm">{error}</p>
                  <button
                    onClick={startCamera}
                    className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full mb-3 cursor-pointer"
                  >
                    再試行
                  </button>
                  <button
                    onClick={() => { setError(null); onBack() }}
                    className="w-full px-6 py-3 bg-white/20 text-white rounded-full cursor-pointer"
                  >
                    戻る
                  </button>
                </div>
              </div>
            )}

            {/* 撮影済み画像 */}
            {capturedImage && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], x: [0, (i % 2 ? 1 : -1) * 30], y: [0, -30] }}
                    transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity, repeatDelay: 1 }}
                    className="absolute text-yellow-300 text-2xl pointer-events-none"
                    style={{ left: `${20 + i * 12}%`, top: `${20 + (i % 3) * 20}%` }}
                  >
                    ✨
                  </motion.div>
                ))}
              </>
            )}

            {/* ビデオフィード */}
            {!capturedImage && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover scale-x-[-1] ${!stream ? 'hidden' : ''}`}
              />
            )}

            {/* 顔ガイドオーバーレイ */}
            {!capturedImage && !error && stream && cameraReady && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.02, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-64 h-80 border-4 border-pink-400 rounded-full"
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-pink-500/90 text-white px-4 py-2 rounded-full text-sm whitespace-nowrap">
                    顔を枠内に合わせてください
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </motion.div>

        {/* ボタン群 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4 flex-wrap"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="px-6 py-3 rounded-full bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300 cursor-pointer"
          >
            戻る
          </motion.button>

          {capturedImage ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCapturedImage(null)}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-white border-2 border-pink-500 text-pink-600 hover:bg-pink-50 cursor-pointer"
              >
                <RotateCcw className="w-5 h-5" />
                撮り直す
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCapture(capturedImage)}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-200 cursor-pointer"
              >
                <Check className="w-5 h-5" />
                この写真でOK
              </motion.button>
            </>
          ) : stream && cameraReady ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={capturePhoto}
              className="flex-1 flex items-center justify-center gap-2 py-4 px-8 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 text-white shadow-xl shadow-pink-300 cursor-pointer"
            >
              <Camera className="w-6 h-6" />
              撮影する
            </motion.button>
          ) : (
            <label className="flex-1 cursor-pointer">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="user"
                className="hidden"
                onChange={handleFileUpload}
              />
              <div className="flex items-center justify-center gap-2 py-3 px-6 rounded-full border-2 border-dashed border-pink-300 text-pink-600 hover:bg-pink-50 transition-colors">
                <Upload className="w-5 h-5" />
                写真を選択 / カメラで撮影
              </div>
            </label>
          )}
        </motion.div>
      </div>
    </div>
  )
}
