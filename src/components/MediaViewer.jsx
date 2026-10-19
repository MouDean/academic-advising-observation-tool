import React, { useState, useEffect } from 'react'
import { X, Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'

const MediaViewer = ({ media, initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const currentMedia = media[currentIndex]

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          navigatePrevious()
          break
        case 'ArrowRight':
          navigateNext()
          break
        case '+':
        case '=':
          e.preventDefault()
          setZoom(prev => Math.min(prev + 0.25, 3))
          break
        case '-':
          e.preventDefault()
          setZoom(prev => Math.max(prev - 0.25, 0.25))
          break
        case '0':
          resetView()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Reset view when media changes
  useEffect(() => {
    resetView()
  }, [currentIndex])

  const navigatePrevious = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : media.length - 1))
  }

  const navigateNext = () => {
    setCurrentIndex(prev => (prev < media.length - 1 ? prev + 1 : 0))
  }

  const resetView = () => {
    setZoom(1)
    setRotation(0)
    setPosition({ x: 0, y: 0 })
  }

  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }
  }

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const downloadCurrent = () => {
    const link = document.createElement('a')
    link.href = currentMedia.data
    link.download = currentMedia.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const rotateImage = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  if (!currentMedia || !media || media.length === 0) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-[9999] flex items-center justify-center">
      {/* Close Button */}
      <Button
        onClick={onClose}
        variant="ghost"
        size="sm"
        className="absolute top-4 right-4 text-white hover:bg-white hover:text-black z-10"
      >
        <X className="w-6 h-6" />
      </Button>

      {/* Navigation Controls */}
      {media.length > 1 && (
        <>
          <Button
            onClick={navigatePrevious}
            variant="ghost"
            size="sm"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white hover:text-black z-10"
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>
          
          <Button
            onClick={navigateNext}
            variant="ghost"
            size="sm"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white hover:text-black z-10"
          >
            <ChevronRight className="w-8 h-8" />
          </Button>
        </>
      )}

      {/* Media Container */}
      <div 
        className="relative max-w-full max-h-full overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {currentMedia.isImage ? (
          <img
            src={currentMedia.data}
            alt={currentMedia.name}
            className="max-w-full max-h-full object-contain"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg) translate(${position.x}px, ${position.y}px)`,
              transition: isDragging ? 'none' : 'transform 0.2s ease'
            }}
            draggable={false}
          />
        ) : (
          <video
            src={currentMedia.data}
            controls
            className="max-w-full max-h-full"
            style={{
              transform: `scale(${zoom})`,
              transition: 'transform 0.2s ease'
            }}
          />
        )}
      </div>

      {/* Controls Panel */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 rounded-lg p-2 flex items-center gap-2">
        {/* Zoom Controls */}
        <Button
          onClick={() => setZoom(prev => Math.max(prev - 0.25, 0.25))}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white hover:text-black"
          disabled={zoom <= 0.25}
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        
        <span className="text-white text-sm min-w-[3rem] text-center">
          {Math.round(zoom * 100)}%
        </span>
        
        <Button
          onClick={() => setZoom(prev => Math.min(prev + 0.25, 3))}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white hover:text-black"
          disabled={zoom >= 3}
        >
          <ZoomIn className="w-4 h-4" />
        </Button>

        {/* Reset View */}
        <Button
          onClick={resetView}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white hover:text-black"
        >
          Reset
        </Button>

        {/* Rotate (Images only) */}
        {currentMedia.isImage && (
          <Button
            onClick={rotateImage}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white hover:text-black"
          >
            <RotateCw className="w-4 h-4" />
          </Button>
        )}

        {/* Download */}
        <Button
          onClick={downloadCurrent}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white hover:text-black"
        >
          <Download className="w-4 h-4" />
        </Button>
      </div>

      {/* Media Info */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 rounded-lg p-3 text-white">
        <h3 className="font-medium">{currentMedia.name}</h3>
        <p className="text-sm opacity-75">
          {currentMedia.description || 'No description'}
        </p>
        <p className="text-xs opacity-50">
          {currentIndex + 1} of {media.length} • {new Date(currentMedia.uploadedAt).toLocaleString()}
        </p>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 rounded-lg p-2 text-white text-xs">
        <div>← → Navigate</div>
        <div>+ - Zoom</div>
        <div>0 Reset</div>
        <div>ESC Close</div>
      </div>
    </div>
  )
}

export default MediaViewer
