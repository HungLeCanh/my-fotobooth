'use client'

import { useEffect, useState } from 'react'
import Gallery from '../components/Gallery'
import Link from 'next/link'

export default function GalleryPage() {
  const [photos, setPhotos] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('photos')
    if (stored) {
      setPhotos(JSON.parse(stored))
    }
    
    // Xóa ảnh khi người dùng rời khỏi trang gallery (khi đóng trang này)
    return () => {
      // Không xóa tại đây, vì chúng ta muốn ảnh vẫn hiển thị trên trang chính
      // localStorage.removeItem('photos')
    }
  }, [])

  return (
    <main className="min-h-screen p-6 bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col items-center space-y-4">
      <div className="w-full max-w-4xl">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Quay lại chụp ảnh
        </Link>
        
        {photos.length > 0 ? (
          <Gallery photos={photos} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Không có ảnh nào được lưu.</p>
            <Link href="/" className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
              Chụp ảnh ngay
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}