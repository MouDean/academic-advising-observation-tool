// Storage Management Utility for Observation Tool

// Check available storage space
export const checkStorageQuota = () => {
  try {
    const testKey = 'storage_test'
    const testData = 'x'.repeat(1024 * 1024) // 1MB test data
    
    // Try to store test data
    localStorage.setItem(testKey, testData)
    localStorage.removeItem(testKey)
    
    return { available: true, message: 'Storage available' }
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      return { available: false, message: 'Storage quota exceeded' }
    }
    return { available: false, message: 'Storage error: ' + error.message }
  }
}

// Get storage usage information
export const getStorageUsage = () => {
  try {
    let totalSize = 0
    const items = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      const value = localStorage.getItem(key)
      const size = new Blob([value]).size
      
      totalSize += size
      items.push({ key, size, value })
    }
    
    return {
      totalSize,
      totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
      itemCount: items.length,
      items
    }
  } catch (error) {
    console.error('Error getting storage usage:', error)
    return { totalSize: 0, totalSizeMB: '0', itemCount: 0, items: [] }
  }
}

// Clean up old sessions to free space
export const cleanupOldSessions = (keepCount = 20) => {
  try {
    const sessions = []
    
    // Collect all session keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('session_')) {
        try {
          const sessionData = JSON.parse(localStorage.getItem(key))
          if (sessionData && sessionData.completedAt) {
            sessions.push({
              key,
              completedAt: new Date(sessionData.completedAt),
              size: new Blob([localStorage.getItem(key)]).size
            })
          }
        } catch (error) {
          console.warn('Error parsing session data:', error)
        }
      }
    }
    
    // Sort by completion date (oldest first)
    sessions.sort((a, b) => a.completedAt - b.completedAt)
    
    // Remove oldest sessions if we have more than keepCount
    if (sessions.length > keepCount) {
      const toRemove = sessions.slice(0, sessions.length - keepCount)
      let freedSpace = 0
      
      toRemove.forEach(session => {
        freedSpace += session.size
        localStorage.removeItem(session.key)
      })
      
      return {
        success: true,
        removedCount: toRemove.length,
        freedSpaceMB: (freedSpace / (1024 * 1024)).toFixed(2)
      }
    }
    
    return {
      success: true,
      removedCount: 0,
      freedSpaceMB: '0',
      message: 'No cleanup needed'
    }
  } catch (error) {
    console.error('Error during cleanup:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Safe storage setter with quota handling
export const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, value)
    return { success: true }
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      // Try to free space by cleaning up old sessions
      const cleanup = cleanupOldSessions(15) // Keep only 15 most recent sessions
      
      if (cleanup.success) {
        // Try again after cleanup
        try {
          localStorage.setItem(key, value)
          return { 
            success: true, 
            cleanup: cleanup,
            message: 'Storage cleaned up and data saved'
          }
        } catch (retryError) {
          return { 
            success: false, 
            error: 'Storage full even after cleanup',
            cleanup: cleanup
          }
        }
      } else {
        return { 
          success: false, 
          error: 'Storage full and cleanup failed',
          cleanup: cleanup
        }
      }
    }
    
    return { success: false, error: error.message }
  }
}

// Get storage recommendations
export const getStorageRecommendations = () => {
  const usage = getStorageUsage()
  const quota = checkStorageQuota()
  
  const recommendations = []
  
  if (!quota.available) {
    recommendations.push('Storage quota exceeded. Consider cleaning up old sessions.')
  }
  
  if (usage.totalSizeMB > 45) { // Warning at 45MB
    recommendations.push('Storage usage is high. Consider exporting and deleting old sessions.')
  }
  
  if (usage.itemCount > 50) {
    recommendations.push('Many sessions stored. Consider archiving old data.')
  }
  
  return {
    usage,
    quota,
    recommendations
  }
}
