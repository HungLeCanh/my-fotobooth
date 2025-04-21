'use client'

import { useRef, useState, useEffect } from 'react'

interface GalleryProps {
  photos: string[]
  isRealtime?: boolean
}

const Gallery = ({ photos, isRealtime = false }: GalleryProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const downloadStrip = (type: 'vertical' | 'square') => {
    const canvas = canvasRef.current
    if (!canvas || photos.length === 0) return

    const imgSize = 400
    const padding = 10

    if (type === 'vertical') {
      canvas.width = imgSize
      canvas.height = (imgSize + padding) * photos.length - padding
    } else if (type === 'square') {
      canvas.width = imgSize * 2 + padding
      canvas.height = imgSize * 2 + padding
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    photos.slice(0, 4).forEach((src, i) => {
      const img = new Image()
      img.src = src
      img.onload = () => {
        if (type === 'vertical') {
          ctx.drawImage(img, 0, i * (imgSize + padding), imgSize, imgSize)
        } else if (type === 'square') {
          const row = Math.floor(i / 2)
          const col = i % 2
          ctx.drawImage(
            img,
            col * (imgSize + padding),
            row * (imgSize + padding),
            imgSize,
            imgSize
          )
        }

        if (i === Math.min(3, photos.length - 1)) {
          const link = document.createElement('a')
          link.download = `photobooth-strip-${type}.png`
          link.href = canvas.toDataURL()
          link.click()
        }
      }
    })
  }

  return (
    <div className={`flex flex-col items-center space-y-4 ${isRealtime ? 'mt-6' : ''}`}>
      {!isRealtime && <h1 className="text-2xl font-bold">📸 Ảnh đã chụp</h1>}

      {photos.length === 0 && <p className="text-gray-500 italic">Chưa có ảnh nào.</p>}

      <div className={`grid ${isRealtime ? 'grid-cols-2 gap-2' : 'grid-cols-2 md:grid-cols-4 gap-4'}`}>
        {photos.map((src, i) => (
          <div key={i} className={`${isRealtime ? 'animate-fade-in' : ''}`}>
            <img
              src={src}
              alt={`Photo ${i + 1}`}
              className={`object-cover border ${isRealtime ? 'w-24 h-24 rounded-lg shadow-sm' : 'w-32 h-32 rounded'}`}
            />
          </div>
        ))}
      </div>

      {!isRealtime && (
        <div className="space-x-4 mt-4">
          <button
            onClick={() => downloadStrip('vertical')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Tải strip dọc
          </button>
          <button
            onClick={() => downloadStrip('square')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Tải strip vuông
          </button>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}

export default Gallery