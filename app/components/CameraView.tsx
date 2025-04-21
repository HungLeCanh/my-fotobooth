'use client'

import { RefObject } from 'react'

interface CameraViewProps {
  videoRef: RefObject<HTMLVideoElement | null>
  currentCountdown: number | null
  isShooting: boolean
}

const CameraView = ({ videoRef, currentCountdown, isShooting }: CameraViewProps) => {
  return (
    <div className="relative w-full max-w-md aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
      {/* Lật ảnh từ trái sang phải bằng transform scaleX(-1) */}
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        className="w-full h-full object-cover transform scale-x-[-1]" 
      />
      
      {/* Hiển thị đếm ngược ở giữa mà không che toàn bộ màn hình */}
      {currentCountdown !== null && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="flex items-center justify-center w-24 h-24 bg-pink-500 bg-opacity-70 backdrop-blur-sm rounded-full text-white text-6xl font-bold animate-pulse">
            {currentCountdown}
          </div>
        </div>
      )}

      {/* Trạng thái chụp */}
      {isShooting && currentCountdown === null && (
        <div className="absolute bottom-4 right-4">
          <div className="flex items-center bg-black bg-opacity-60 backdrop-blur-sm rounded-full px-3 py-1">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2 animate-pulse"></div>
            <span className="text-white text-sm">Đang chụp...</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default CameraView