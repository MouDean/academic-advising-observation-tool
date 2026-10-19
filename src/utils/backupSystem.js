// Backup System for Observation Tool
// Provides automatic data backup, export, import, and restoration

const BACKUP_PREFIX = 'backup_'
const MAX_BACKUPS = 10 // Keep last 10 backups
const BACKUP_INTERVAL = 2 * 60 * 1000 // 2 minutes

// Generate backup ID with timestamp
const generateBackupId = () => {
  const now = new Date()
  return `${BACKUP_PREFIX}${now.getTime()}_${now.toISOString().slice(0, 19).replace(/:/g, '-')}`
}

// Get all session data from localStorage
const getAllSessionData = () => {
  const sessions = []
  const media = []
  
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
  
  return { sessions, media }
}

// Create a new backup
export const createBackup = () => {
  try {
    const backupId = generateBackupId()
    const backupData = {
      id: backupId,
      timestamp: new Date().toISOString(),
      version: '1.0',
      data: getAllSessionData(),
      metadata: {
        totalSessions: 0,
        totalMedia: 0,
        lastSessionId: localStorage.getItem('lastSessionId') || '0',
        theme: localStorage.getItem('theme') || 'light',
        isAuthenticated: localStorage.getItem('isAuthenticated') || 'false'
      }
    }
    
    // Calculate metadata
    backupData.metadata.totalSessions = backupData.data.sessions.length
    backupData.metadata.totalMedia = backupData.data.media.length
    
    // Store backup
    localStorage.setItem(backupId, JSON.stringify(backupData))
    
    // Clean up old backups
    cleanupOldBackups()
    
    console.log(`✅ Backup created: ${backupId} (${backupData.metadata.totalSessions} sessions, ${backupData.metadata.totalMedia} media)`)
    
    return backupId
  } catch (error) {
    console.error('❌ Failed to create backup:', error)
    throw error
  }
}

// Clean up old backups, keeping only the most recent ones
const cleanupOldBackups = () => {
  try {
    const backupKeys = []
    
    // Collect all backup keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(BACKUP_PREFIX)) {
        backupKeys.push(key)
      }
    }
    
    // Sort by timestamp (newest first)
    backupKeys.sort((a, b) => {
      const timestampA = parseInt(a.split('_')[1])
      const timestampB = parseInt(b.split('_')[1])
      return timestampB - timestampA
    })
    
    // Remove old backups beyond MAX_BACKUPS
    if (backupKeys.length > MAX_BACKUPS) {
      const keysToRemove = backupKeys.slice(MAX_BACKUPS)
      keysToRemove.forEach(key => {
        localStorage.removeItem(key)
        console.log(`🗑️ Removed old backup: ${key}`)
      })
    }
  } catch (error) {
    console.error('❌ Failed to cleanup old backups:', error)
  }
}

// Get all available backups
export const getAvailableBackups = () => {
  try {
    const backups = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(BACKUP_PREFIX)) {
        try {
          const backupData = JSON.parse(localStorage.getItem(key))
          backups.push({
            id: backupData.id,
            timestamp: backupData.timestamp,
            version: backupData.version,
            metadata: backupData.metadata
          })
        } catch (error) {
          console.warn(`Failed to parse backup data for key: ${key}`, error)
        }
      }
    }
    
    // Sort by timestamp (newest first)
    backups.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    
    return backups
  } catch (error) {
    console.error('❌ Failed to get available backups:', error)
    return []
  }
}

// Restore data from a specific backup
export const restoreFromBackup = (backupId) => {
  try {
    const backupData = JSON.parse(localStorage.getItem(backupId))
    if (!backupData) {
      throw new Error(`Backup ${backupId} not found`)
    }
    
    console.log(`🔄 Restoring from backup: ${backupId}`)
    
    // Clear current data
    clearCurrentData()
    
    // Restore sessions
    backupData.data.sessions.forEach(session => {
      const key = `session_${session.id}`
      localStorage.setItem(key, JSON.stringify(session))
    })
    
    // Restore media
    backupData.data.media.forEach(media => {
      const key = `media_${media.id}`
      localStorage.setItem(key, JSON.stringify(media))
    })
    
    // Restore metadata
    if (backupData.metadata.lastSessionId) {
      localStorage.setItem('lastSessionId', backupData.metadata.lastSessionId)
    }
    if (backupData.metadata.theme) {
      localStorage.setItem('theme', backupData.metadata.theme)
    }
    if (backupData.metadata.isAuthenticated) {
      localStorage.setItem('isAuthenticated', backupData.metadata.isAuthenticated)
    }
    
    console.log(`✅ Restored ${backupData.metadata.totalSessions} sessions and ${backupData.metadata.totalMedia} media from backup`)
    
    return {
      success: true,
      sessionsRestored: backupData.metadata.totalSessions,
      mediaRestored: backupData.metadata.totalMedia
    }
  } catch (error) {
    console.error('❌ Failed to restore from backup:', error)
    throw error
  }
}

// Clear current data before restoration
const clearCurrentData = () => {
  try {
    const keysToRemove = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (key.startsWith('session_') || key.startsWith('media_'))) {
        keysToRemove.push(key)
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key))
    console.log(`🗑️ Cleared ${keysToRemove.length} current data items`)
  } catch (error) {
    console.error('❌ Failed to clear current data:', error)
  }
}

// Export backup to file
export const exportBackup = (backupId) => {
  try {
    const backupData = JSON.parse(localStorage.getItem(backupId))
    if (!backupData) {
      throw new Error(`Backup ${backupId} not found`)
    }
    
    const filename = `observation-tool-backup-${backupId.replace(BACKUP_PREFIX, '')}.json`
    const dataStr = JSON.stringify(backupData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    
    const link = document.createElement('a')
    link.href = URL.createObjectURL(dataBlob)
    link.download = filename
    link.click()
    
    URL.revokeObjectURL(link.href)
    
    console.log(`📁 Backup exported: ${filename}`)
    return filename
  } catch (error) {
    console.error('❌ Failed to export backup:', error)
    throw error
  }
}

// Import backup from file
export const importBackup = (file) => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader()
      
      reader.onload = (event) => {
        try {
          const backupData = JSON.parse(event.target.result)
          
          // Validate backup data structure
          if (!backupData.id || !backupData.timestamp || !backupData.data) {
            throw new Error('Invalid backup file format')
          }
          
          // Generate new backup ID for imported data
          const newBackupId = generateBackupId()
          backupData.id = newBackupId
          backupData.timestamp = new Date().toISOString()
          
          // Store imported backup
          localStorage.setItem(newBackupId, JSON.stringify(backupData))
          
          console.log(`📥 Backup imported: ${newBackupId} (${backupData.metadata?.totalSessions || 0} sessions)`)
          
          resolve({
            success: true,
            backupId: newBackupId,
            sessionsImported: backupData.metadata?.totalSessions || 0,
            mediaImported: backupData.metadata?.totalMedia || 0
          })
        } catch (error) {
          reject(new Error(`Failed to parse backup file: ${error.message}`))
        }
      }
      
      reader.onerror = () => {
        reject(new Error('Failed to read backup file'))
      }
      
      reader.readAsText(file)
    } catch (error) {
      reject(error)
    }
  })
}

// Delete a specific backup
export const deleteBackup = (backupId) => {
  try {
    const backupData = JSON.parse(localStorage.getItem(backupId))
    if (!backupData) {
      throw new Error(`Backup ${backupId} not found`)
    }
    
    localStorage.removeItem(backupId)
    
    console.log(`🗑️ Backup deleted: ${backupId}`)
    return true
  } catch (error) {
    console.error('❌ Failed to delete backup:', error)
    throw error
  }
}

// Get backup statistics
export const getBackupStats = () => {
  try {
    const backups = getAvailableBackups()
    const totalBackups = backups.length
    const totalSize = backups.reduce((size, backup) => {
      const backupData = localStorage.getItem(backup.id)
      return size + (backupData ? backupData.length : 0)
    }, 0)
    
    const oldestBackup = backups.length > 0 ? backups[backups.length - 1] : null
    const newestBackup = backups.length > 0 ? backups[0] : null
    
    return {
      totalBackups,
      totalSize: `${(totalSize / 1024).toFixed(2)} KB`,
      oldestBackup: oldestBackup?.timestamp || null,
      newestBackup: newestBackup?.timestamp || null,
      lastBackup: newestBackup?.timestamp || null
    }
  } catch (error) {
    console.error('❌ Failed to get backup stats:', error)
    return {
      totalBackups: 0,
      totalSize: '0 KB',
      oldestBackup: null,
      newestBackup: null,
      lastBackup: null
    }
  }
}

// Start automatic backup system
export const startAutoBackup = () => {
  try {
    // Create initial backup
    createBackup()
    
    // Set up interval for automatic backups
    const backupInterval = setInterval(() => {
      try {
        createBackup()
      } catch (error) {
        console.error('❌ Auto-backup failed:', error)
      }
    }, BACKUP_INTERVAL)
    
    console.log(`🔄 Auto-backup started (every ${BACKUP_INTERVAL / 60000} minutes)`)
    
    // Return interval ID for cleanup
    return backupInterval
  } catch (error) {
    console.error('❌ Failed to start auto-backup:', error)
    return null
  }
}

// Stop automatic backup system
export const stopAutoBackup = (intervalId) => {
  try {
    if (intervalId) {
      clearInterval(intervalId)
      console.log('⏹️ Auto-backup stopped')
    }
  } catch (error) {
    console.error('❌ Failed to stop auto-backup:', error)
  }
}

// Manual backup trigger
export const triggerManualBackup = () => {
  try {
    const backupId = createBackup()
    return {
      success: true,
      backupId,
      message: 'Manual backup created successfully'
    }
  } catch (error) {
    console.error('❌ Manual backup failed:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
