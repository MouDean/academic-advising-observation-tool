// Backup and Restore Utility Functions
// Handles exporting and importing session data with validation

// Export all data to JSON file
export const exportAllData = () => {
  try {
    // Collect all session data from localStorage
    const sessions = []
    const media = []
    const metadata = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      toolName: 'Academic Advising Observation Tool',
      totalSessions: 0,
      totalMedia: 0
    }

    // Get all sessions
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('session_')) {
        try {
          const sessionData = JSON.parse(localStorage.getItem(key))
          sessions.push(sessionData)
        } catch (error) {
          console.warn(`Failed to parse session data for key: ${key}`, error)
        }
      } else if (key && key.startsWith('media_')) {
        try {
          const mediaData = JSON.parse(localStorage.getItem(key))
          media.push(mediaData)
        } catch (error) {
          console.warn(`Failed to parse media data for key: ${key}`, error)
        }
      }
    }

    // Get additional metadata
    metadata.lastSessionId = localStorage.getItem('lastSessionId') || '0'
    metadata.theme = localStorage.getItem('theme') || 'light'
    metadata.isAuthenticated = localStorage.getItem('isAuthenticated') || 'false'
    metadata.totalSessions = sessions.length
    metadata.totalMedia = media.length

    // Create backup object
    const backupData = {
      metadata,
      sessions,
      media
    }

    // Create and download file
    const dataStr = JSON.stringify(backupData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    const filename = `advising-observation-backup-${timestamp}.json`
    
    const link = document.createElement('a')
    link.href = URL.createObjectURL(dataBlob)
    link.download = filename
    link.click()
    
    URL.revokeObjectURL(link.href)
    
    return {
      success: true,
      filename,
      sessionsCount: sessions.length,
      mediaCount: media.length
    }
  } catch (error) {
    console.error('Export failed:', error)
    throw new Error('Failed to export data: ' + error.message)
  }
}

// Validate imported JSON structure
const validateBackupData = (data) => {
  const errors = []
  
  // Check if data is an object
  if (!data || typeof data !== 'object') {
    errors.push('Invalid file format: data must be a JSON object')
    return errors
  }
  
  // Check metadata
  if (!data.metadata) {
    errors.push('Missing metadata section')
  } else {
    if (!data.metadata.exportDate) {
      errors.push('Missing export date in metadata')
    }
    if (!data.metadata.version) {
      errors.push('Missing version in metadata')
    }
  }
  
  // Check sessions
  if (!Array.isArray(data.sessions)) {
    errors.push('Sessions must be an array')
  } else {
    // Validate each session
    data.sessions.forEach((session, index) => {
      if (!session.id) {
        errors.push(`Session at index ${index} is missing ID`)
      }
      if (!session.sessionInfo) {
        errors.push(`Session ${session.id} is missing sessionInfo`)
      }
      if (!session.observations) {
        errors.push(`Session ${session.id} is missing observations`)
      }
    })
  }
  
  // Check media (optional)
  if (data.media && !Array.isArray(data.media)) {
    errors.push('Media must be an array')
  }
  
  return errors
}

// Import and restore data from JSON file
export const importAndRestoreData = async (file) => {
  try {
    // Read file content
    const text = await file.text()
    let data
    
    try {
      data = JSON.parse(text)
    } catch (parseError) {
      throw new Error('Invalid JSON file: ' + parseError.message)
    }
    
    // Validate data structure
    const validationErrors = validateBackupData(data)
    if (validationErrors.length > 0) {
      throw new Error('Invalid backup file:\n' + validationErrors.join('\n'))
    }
    
    // Check for duplicates and merge data
    const existingSessions = new Set()
    const existingMedia = new Set()
    
    // Get existing session IDs
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('session_')) {
        try {
          const sessionData = JSON.parse(localStorage.getItem(key))
          existingSessions.add(sessionData.id)
        } catch (error) {
          console.warn(`Failed to parse existing session: ${key}`, error)
        }
      } else if (key && key.startsWith('media_')) {
        try {
          const mediaData = JSON.parse(localStorage.getItem(key))
          existingMedia.add(mediaData.id)
        } catch (error) {
          console.warn(`Failed to parse existing media: ${key}`, error)
        }
      }
    }
    
    // Import sessions
    let sessionsImported = 0
    let sessionsSkipped = 0
    
    data.sessions.forEach(session => {
      if (existingSessions.has(session.id)) {
        sessionsSkipped++
        console.log(`Skipping duplicate session: ${session.id}`)
      } else {
        const key = `session_${session.id}`
        localStorage.setItem(key, JSON.stringify(session))
        sessionsImported++
        existingSessions.add(session.id)
      }
    })
    
    // Import media
    let mediaImported = 0
    let mediaSkipped = 0
    
    if (data.media && Array.isArray(data.media)) {
      data.media.forEach(media => {
        if (existingMedia.has(media.id)) {
          mediaSkipped++
          console.log(`Skipping duplicate media: ${media.id}`)
        } else {
          const key = `media_${media.id}`
          localStorage.setItem(key, JSON.stringify(media))
          mediaImported++
          existingMedia.add(media.id)
        }
      })
    }
    
    // Update metadata if needed
    if (data.metadata.lastSessionId) {
      const currentLastId = parseInt(localStorage.getItem('lastSessionId') || '0')
      const importedLastId = parseInt(data.metadata.lastSessionId)
      if (importedLastId > currentLastId) {
        localStorage.setItem('lastSessionId', importedLastId.toString())
      }
    }
    
    return {
      success: true,
      sessionsImported,
      sessionsSkipped,
      mediaImported,
      mediaSkipped,
      totalSessions: data.sessions.length,
      totalMedia: data.media ? data.media.length : 0,
      exportDate: data.metadata.exportDate
    }
    
  } catch (error) {
    console.error('Import failed:', error)
    throw error
  }
}

// Get backup statistics
export const getBackupStats = () => {
  try {
    const sessions = []
    const media = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('session_')) {
        try {
          const sessionData = JSON.parse(localStorage.getItem(key))
          sessions.push(sessionData)
        } catch (error) {
          console.warn(`Failed to parse session: ${key}`, error)
        }
      } else if (key && key.startsWith('media_')) {
        try {
          const mediaData = JSON.parse(localStorage.getItem(key))
          media.push(mediaData)
        } catch (error) {
          console.warn(`Failed to parse media: ${key}`, error)
        }
      }
    }
    
    return {
      totalSessions: sessions.length,
      totalMedia: media.length,
      lastSessionId: localStorage.getItem('lastSessionId') || '0',
      theme: localStorage.getItem('theme') || 'light'
    }
  } catch (error) {
    console.error('Failed to get backup stats:', error)
    return {
      totalSessions: 0,
      totalMedia: 0,
      lastSessionId: '0',
      theme: 'light'
    }
  }
}
