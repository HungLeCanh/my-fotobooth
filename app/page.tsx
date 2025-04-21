'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import CameraView from './components/CameraView'
import Gallery from './components/Gallery'

const countdownOptions = [3, 5, 7]
const photoCountOptions = [2, 4, 6]

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const router = useRouter()

  const [stream, setStream] = useState<MediaStream | null>(null)
  const [countdown, setCountdown] = useState<number>(3)
  const [photoCount, setPhotoCount] = useState<number>(2)
  const [isShooting, setIsShooting] = useState(false)
  const [currentCountdown, setCurrentCountdown] = useState<number | null>(null)
  const [realtimePhotos, setRealtimePhotos] = useState<string[]>([])

  // Yêu cầu quyền camera và tải ảnh nếu có
  useEffect(() => {
    async function initCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
        setStream(mediaStream)
      } catch (err) {
        console.error('Không thể truy cập camera:', err)
      }
    }

    // Tải ảnh đã lưu
    const stored = localStorage.getItem('photos')
    if (stored) {
      setRealtimePhotos(JSON.parse(stored))
    }

    initCamera()

    return () => {
      stream?.getTracks().forEach(track => track.stop())
    }
  }, [])

  // Hàm chụp ảnh từ video stream
  const capturePhoto = () => {
    if (!canvasRef.current || !videoRef.current) return
    const canvas = canvasRef.current
    const video = videoRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.scale(-1, 1)
      ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height)
      ctx.scale(-1, 1)
      const imageData = canvas.toDataURL('image/png')
  
      // Cập nhật realtimePhotos
      setRealtimePhotos(prevPhotos => {
        const updatedPhotos = [...prevPhotos, imageData]
        localStorage.setItem('photos', JSON.stringify(updatedPhotos))
        return updatedPhotos
      })
    }
  }
  

  const handleShoot = async () => {
    if (!videoRef.current) return
    setIsShooting(true)
    
    // Không xóa ảnh cũ nữa, chỉ chụp thêm

    for (let i = 0; i < photoCount; i++) {
      setCurrentCountdown(countdown)
      await new Promise(resolve => {
        let timeLeft = countdown
        const interval = setInterval(() => {
          timeLeft--
          setCurrentCountdown(timeLeft)
          if (timeLeft <= 0) {
            clearInterval(interval)
            resolve(true)
          }
        }, 1000)
      })
      capturePhoto()
    }

    setCurrentCountdown(null)
    setIsShooting(false)
  }

  // Thêm hàm reset ảnh
  const handleReset = () => {
    localStorage.removeItem('photos')
    setRealtimePhotos([])
  }

  const handleGoToGallery = () => {
    router.push('/gallery')
  }

  return (
    <main className="flex flex-col items-center min-h-screen p-4 bg-gradient-to-br from-purple-50 to-blue-50">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-500 mt-4 mb-8">
        📸 Fotobooth
      </h1>
  
      <div className="flex flex-col md:flex-row w-full max-w-6xl gap-6 h-full">
        {/* Left spacer for centering - takes up space on larger screens */}
        <div className="hidden md:block md:w-1/4"></div>
        
        {/* Center content - camera view and controls */}
        <div className="flex flex-col items-center space-y-6 md:w-2/4">
          {/* Dropdowns */}
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="bg-white p-3 rounded-lg shadow-md">
              <label className="block text-sm font-medium text-gray-700">Thời gian đếm ngược</label>
              <select
                className="mt-1 rounded-md p-2 border border-gray-300 focus:ring focus:ring-blue-200 focus:border-blue-500"
                value={countdown}
                onChange={e => setCountdown(Number(e.target.value))}
              >
                {countdownOptions.map(opt => (
                  <option key={opt} value={opt}>
                    {opt} giây
                  </option>
                ))}
              </select>
            </div>
  
            <div className="bg-white p-3 rounded-lg shadow-md">
              <label className="block text-sm font-medium text-gray-700">Số ảnh chụp</label>
              <select
                className="mt-1 rounded-md p-2 border border-gray-300 focus:ring focus:ring-blue-200 focus:border-blue-500"
                value={photoCount}
                onChange={e => setPhotoCount(Number(e.target.value))}
              >
                {photoCountOptions.map(opt => (
                  <option key={opt} value={opt}>
                    {opt} ảnh
                  </option>
                ))}
              </select>
            </div>
          </div>
  
          {/* Camera View - moved to center and positioned slightly higher */}
          <div className="transform -translate-y-4">
            <CameraView 
              videoRef={videoRef}
              currentCountdown={currentCountdown}
              isShooting={isShooting}
            />
          </div>
  
          {/* Các nút chức năng */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={handleShoot}
              disabled={isShooting}
              className="bg-gradient-to-r from-blue-600 to-pink-500 hover:from-blue-700 hover:to-pink-600 text-white px-6 py-2 rounded-full font-medium shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isShooting ? 'Đang chụp...' : 'Bắt đầu chụp'}
            </button>
  
            {realtimePhotos.length > 0 && (
              <>
                <button
                  onClick={handleReset}
                  className="bg-white border border-red-500 text-red-600 hover:bg-red-50 px-6 py-2 rounded-full font-medium shadow transition-all"
                >
                  Chụp lại (Xóa tất cả)
                </button>
  
                <button
                  onClick={handleGoToGallery}
                  className="bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-full font-medium shadow transition-all"
                >
                  Xem tất cả ảnh
                </button>
              </>
            )}
          </div>
        </div>
  
        {/* Gallery bên phải */}
        <div className="md:w-1/4">
          {realtimePhotos.length > 0 ? (
            <div className="bg-white p-4 rounded-lg shadow-md h-full">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Ảnh đã chụp ({realtimePhotos.length})</h2>
              <Gallery photos={realtimePhotos} isRealtime={true} />
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-500 flex items-center justify-center h-full">
              <p>Chưa có ảnh nào. Hãy chụp một vài ảnh!</p>
            </div>
          )}
        </div>
      </div>
  
      <canvas ref={canvasRef} className="hidden" />
    </main>
  )
}