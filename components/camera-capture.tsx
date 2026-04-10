'use client'

import { useRef, useState, useCallback } from 'react'
import Webcam from 'react-webcam'
import { Button } from '@/components/ui/button'
import { Camera, Upload, RotateCcw } from 'lucide-react'

interface CameraCaptureProps {
  onCapture: (imageBase64: string) => void
}

export function CameraCapture({ onCapture }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [cameraError, setCameraError] = useState(false)

  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      setCapturedImage(imageSrc)
      onCapture(imageSrc)
    }
  }, [onCapture])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      // Canvas でリサイズ（最大1024px）
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const maxSize = 1024
        let { width, height } = img
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = Math.round((height * maxSize) / width)
            width = maxSize
          } else {
            width = Math.round((width * maxSize) / height)
            height = maxSize
          }
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, width, height)
        const resized = canvas.toDataURL('image/jpeg', 0.85)
        setCapturedImage(resized)
        onCapture(resized)
      }
      img.src = result
    }
    reader.readAsDataURL(file)
  }

  const handleReset = () => {
    setCapturedImage(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  if (capturedImage) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-full max-w-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={capturedImage}
            alt="撮影した顔写真"
            className="w-full rounded-xl object-cover shadow-md"
          />
          <div className="absolute inset-0 rounded-xl ring-2 ring-pink-300" />
        </div>
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          撮り直す
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {!cameraError ? (
        <>
          <div className="w-full max-w-sm overflow-hidden rounded-xl shadow-md">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              screenshotQuality={0.85}
              videoConstraints={{ facingMode: 'user', width: 720, height: 720 }}
              onUserMediaError={() => setCameraError(true)}
              className="w-full"
            />
          </div>
          <Button onClick={handleCapture} className="bg-pink-500 hover:bg-pink-600">
            <Camera className="mr-2 h-4 w-4" />
            撮影する
          </Button>
          <p className="text-xs text-gray-400">または</p>
        </>
      ) : (
        <div className="flex w-full max-w-sm items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-sm text-gray-500">カメラを使用できません</p>
        </div>
      )}

      {/* iOS/Android フォールバック */}
      <label className="cursor-pointer">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={handleFileUpload}
        />
        <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
          <Upload className="h-4 w-4" />
          写真を選択 / カメラで撮影
        </div>
      </label>

      <p className="max-w-xs text-center text-xs text-gray-400">
        正面から明るい場所で撮影してください。顔全体が写るようにお願いします。
      </p>
    </div>
  )
}
