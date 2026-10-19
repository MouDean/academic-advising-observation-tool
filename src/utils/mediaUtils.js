// Media utilities for observation sessions

// Compress image for storage
export const compressImage = (file, maxWidth = 1920, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      
      canvas.width = width
      canvas.height = height
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height)
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
      
      resolve(compressedDataUrl)
    }
    
    img.src = file.data
  })
}

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Get file type icon
export const getFileTypeIcon = (fileType) => {
  if (fileType.startsWith('image/')) return '📷'
  if (fileType.startsWith('video/')) return '🎥'
  return '📄'
}

// Validate file
export const validateFile = (file, maxSize = 50 * 1024 * 1024) => {
  const supportedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  const supportedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File too large' }
  }
  
  if (!supportedImageTypes.includes(file.type) && !supportedVideoTypes.includes(file.type)) {
    return { valid: false, error: 'Unsupported file type' }
  }
  
  return { valid: true }
}

// Create media summary for exports
export const createMediaSummary = (media) => {
  if (!media || media.length === 0) {
    return 'No media files attached'
  }
  
  const imageCount = media.filter(m => m.isImage).length
  const videoCount = media.filter(m => m.isVideo).length
  const totalSize = media.reduce((sum, m) => sum + m.size, 0)
  
  let summary = `${media.length} file(s) attached: `
  if (imageCount > 0) summary += `${imageCount} image(s), `
  if (videoCount > 0) summary += `${videoCount} video(s), `
  summary += `Total size: ${formatFileSize(totalSize)}`
  
  return summary
}

// Generate media list for exports
export const generateMediaList = (media) => {
  if (!media || media.length === 0) return []
  
  return media.map((file, index) => ({
    index: index + 1,
    name: file.name,
    type: file.isImage ? 'Image' : 'Video',
    size: formatFileSize(file.size),
    description: file.description || 'No description',
    uploadedAt: new Date(file.uploadedAt).toLocaleString()
  }))
}

// Save media to localStorage with compression
export const saveMediaToStorage = async (media, sessionId) => {
  try {
    const compressedMedia = []
    
    for (const file of media) {
      let compressedFile = { ...file }
      
      // Compress images if they're large
      if (file.isImage && file.size > 5 * 1024 * 1024) { // 5MB
        compressedFile.data = await compressImage(file, 1920, 0.8)
        compressedFile.compressed = true
      }
      
      compressedMedia.push(compressedFile)
    }
    
    const key = `session_media_${sessionId}`
    localStorage.setItem(key, JSON.stringify(compressedMedia))
    
    return true
  } catch (error) {
    console.error('Error saving media to storage:', error)
    return false
  }
}

// Load media from localStorage
export const loadMediaFromStorage = (sessionId) => {
  try {
    const key = `session_media_${sessionId}`
    const mediaData = localStorage.getItem(key)
    return mediaData ? JSON.parse(mediaData) : []
  } catch (error) {
    console.error('Error loading media from storage:', error)
    return []
  }
}

// Remove media from localStorage
export const removeMediaFromStorage = (sessionId) => {
  try {
    const key = `session_media_${sessionId}`
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error('Error removing media from storage:', error)
    return false
  }
}

// Calculate total media size
export const calculateTotalMediaSize = (media) => {
  return media.reduce((total, file) => total + file.size, 0)
}

// Check if media exceeds storage limit
export const checkMediaStorageLimit = (media, limit = 100 * 1024 * 1024) => { // 100MB
  const totalSize = calculateTotalMediaSize(media)
  return {
    withinLimit: totalSize <= limit,
    totalSize,
    limit,
    remaining: limit - totalSize
  }
}

// Generate media export data
export const generateMediaExportData = (media) => {
  return {
    summary: createMediaSummary(media),
    files: generateMediaList(media),
    totalFiles: media.length,
    totalSize: calculateTotalMediaSize(media),
    imageCount: media.filter(m => m.isImage).length,
    videoCount: media.filter(m => m.isVideo).length
  }
}
