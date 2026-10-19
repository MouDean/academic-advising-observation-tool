// File System Utility for saving media files locally

// Save a media file to the Media Evidence folder
export const saveMediaFile = async (file, sessionId, fileName) => {
  try {
    // Check if File System Access API is supported
    if ('showDirectoryPicker' in window) {
      try {
        // Evidence is downloaded through the browser; no machine-specific path is required.
        
        // Create simple filename with session ID and original filename
        const fileExtension = file.name.split('.').pop()
        const uniqueFileName = `Session_${sessionId}_${fileName}.${fileExtension}`
        
        // Create a download link
        const url = URL.createObjectURL(file)
        const link = document.createElement('a')
        link.href = url
        link.download = uniqueFileName
        link.style.display = 'none'
        
        // Trigger download
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // Clean up the URL
        URL.revokeObjectURL(url)
        
        return {
          success: true,
          filePath: `Media Evidence/${uniqueFileName}`,
          fileName: uniqueFileName,
          message: `File downloaded. Please move to: Media Evidence/${uniqueFileName}`
        }
      } catch (error) {
        console.error('Error with file system access:', error)
        // Fallback to regular download
        return await fallbackDownload(file, sessionId, fileName)
      }
    } else {
      // Fallback to regular download
      return await fallbackDownload(file, sessionId, fileName)
    }
  } catch (error) {
    console.error('Error saving media file:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Fallback download function
const fallbackDownload = async (file, sessionId, fileName) => {
  const fileExtension = file.name.split('.').pop()
  const uniqueFileName = `Session_${sessionId}_${fileName}.${fileExtension}`
  
  const url = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.download = uniqueFileName
  link.style.display = 'none'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
  
  return {
    success: true,
    filePath: `Downloads/${uniqueFileName}`,
    fileName: uniqueFileName,
    message: `File downloaded to Downloads. Please move to Media Evidence folder.`
  }
}

// Save multiple media files for a session
export const saveSessionMedia = async (files, sessionId) => {
  const results = []
  
  for (const file of files) {
    const result = await saveMediaFile(file, sessionId, file.name.replace(/\.[^/.]+$/, ''))
    results.push({
      originalFile: file,
      ...result
    })
  }

  return results
}

// Get the local file path for a media file
export const getLocalFilePath = (sessionId, fileName) => {
  return `Downloads/Session_${sessionId}_${fileName}`
}

// Check if file system is supported (always true for download approach)
export const isFileSystemSupported = () => {
  return true
}

// Get file system status
export const getFileSystemStatus = () => {
  return {
    isSupported: true,
    hasPermission: true,
    message: 'Files will be downloaded and should be moved to Media Evidence folder'
  }
}

// Request permission (not needed for download approach)
export const requestFileSystemPermission = async () => {
  return {
    success: true,
    message: 'Download system ready - files will be saved to Media Evidence folder'
  }
}

