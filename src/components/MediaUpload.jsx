import React, { useState, useCallback, useRef, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Upload, Eye, Trash2 } from 'lucide-react'
import { showNotification } from '@/components/Notification.jsx'
import { saveMediaFile, saveSessionMedia } from '@/utils/fileSystem.js'
import { validateFile, formatFileSize } from '@/utils/mediaUtils.js'
import Loading from '@/components/ui/loading.jsx'

const MediaUpload = React.memo(({ sessionId, onMediaUpdate, existingMedia = [], isSessionCompleted = false, onOpenViewer }) => {
  const [mediaFiles, setMediaFiles] = useState(existingMedia)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  // Memoize file processing to avoid unnecessary recalculations
  const processedFiles = useMemo(() => {
    return mediaFiles.map(file => ({
      ...file,
      icon: getFileIcon(file.type),
      fileType: getFileType(file.type)
    }))
  }, [mediaFiles])

  // Helper function to get file icon
  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return '📷'
    if (fileType.startsWith('video/')) return '🎥'
    return '📄'
  }

  // Helper function to get file type
  const getFileType = (fileType) => {
    if (fileType.startsWith('image/')) return 'Image'
    if (fileType.startsWith('video/')) return 'Video'
    return 'Document'
  }

  // Optimized file upload handler
  const handleFileUpload = useCallback(async (files) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    const newFiles = []
    const progressUpdates = {}

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileId = `file_${Date.now()}_${i}`
        
        // Validate file
        const validation = validateFile(file)
        if (!validation.valid) {
          showNotification.error(`${file.name}: ${validation.error}`)
          continue
        }
        
        // Initialize progress
        progressUpdates[fileId] = 0
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }))

        // Save file using the existing utility
        const saveResult = await saveMediaFile(file, sessionId, file.name.replace(/\.[^/.]+$/, ''))
        
        if (saveResult.success) {
          const fileData = {
            id: fileId,
            name: file.name,
            type: file.type,
            size: file.size,
            uploadedAt: new Date().toISOString(),
            localPath: saveResult.filePath,
            localFileName: saveResult.fileName
          }
          
          // Update progress
          progressUpdates[fileId] = 100
          setUploadProgress(prev => ({ ...prev, [fileId]: 100 }))
          
          newFiles.push(fileData)
        } else {
          showNotification.error(`Failed to save ${file.name}: ${saveResult.error}`)
        }
      }

      if (newFiles.length > 0) {
        const updatedFiles = [...mediaFiles, ...newFiles]
        setMediaFiles(updatedFiles)
        onMediaUpdate(updatedFiles)
        showNotification.success(`Successfully uploaded ${newFiles.length} file(s)`)
      }
    } catch (error) {
      console.error('Upload error:', error)
      showNotification.error('Failed to upload files')
    } finally {
      setIsUploading(false)
      setUploadProgress({})
    }
  }, [mediaFiles, sessionId, onMediaUpdate])

  // Optimized drag and drop handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(Array.from(e.dataTransfer.files))
    }
  }, [handleFileUpload])

  // Optimized file deletion
  const handleDeleteFile = useCallback((fileId) => {
    const updatedFiles = mediaFiles.filter(file => file.id !== fileId)
    setMediaFiles(updatedFiles)
    onMediaUpdate(updatedFiles)
    showNotification.success('File removed from session')
  }, [mediaFiles, onMediaUpdate])

  // File input change handler
  const handleFileInputChange = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(Array.from(e.target.files))
    }
  }, [handleFileUpload])

  // Open file viewer
  const handleOpenViewer = useCallback((index) => {
    if (onOpenViewer) {
      onOpenViewer(index)
    }
  }, [onOpenViewer])

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Media Evidence
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 dark:border-gray-600'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {isUploading ? (
            <div className="space-y-4">
              <Loading size="lg" text="Uploading files..." />
              <div className="space-y-2">
                {Object.entries(uploadProgress).map(([fileId, progress]) => (
                  <div key={fileId} className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Drag and drop files here
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                or click to select files
              </p>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isSessionCompleted}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                Select Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                onChange={handleFileInputChange}
                className="hidden"
                disabled={isSessionCompleted}
              />
            </>
          )}
        </div>

        {/* File List */}
        {processedFiles.length > 0 && (
          <div className="mt-6 space-y-3">
            <h3 className="text-lg font-medium">Uploaded Files ({processedFiles.length})</h3>
            <div className="grid gap-3">
              {processedFiles.map((file, index) => (
                <div 
                  key={file.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-gray-700 rounded">
                      {file.icon}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {file.fileType} • {formatFileSize(file.size)}
                      </p>
                      {file.localPath && (
                        <p className="text-xs text-green-600 dark:text-green-400">
                          Saved to: {file.localPath}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{file.fileType}</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenViewer(index)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {!isSessionCompleted && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteFile(file.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
})

export default MediaUpload
