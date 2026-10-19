// Auto-save utility for observation sessions
class AutoSaveManager {
  constructor() {
    this.autoSaveInterval = null
    this.lastSaveTime = null
    this.isEnabled = true
    this.saveInterval = 2 * 60 * 1000 // 2 minutes in milliseconds
    this.maxRetries = 3
    this.retryDelay = 1000 // 1 second
  }

  // Start auto-save functionality
  startAutoSave() {
    if (this.autoSaveInterval) {
      this.stopAutoSave()
    }

    this.autoSaveInterval = setInterval(() => {
      this.performAutoSave()
    }, this.saveInterval)

    console.log('Auto-save started - saving every 2 minutes')
  }

  // Stop auto-save functionality
  stopAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval)
      this.autoSaveInterval = null
      console.log('Auto-save stopped')
    }
  }

  // Perform the actual auto-save operation
  async performAutoSave() {
    if (!this.isEnabled) return

    try {
      // Get current session data from localStorage
      const currentSessions = this.getCurrentSessions()
      const currentSession = this.getCurrentActiveSession()

      if (currentSession) {
        // Save the current active session
        await this.saveSession(currentSession)
        this.lastSaveTime = new Date()
        
        console.log('Auto-save completed successfully', {
          sessionId: currentSession.id,
          timestamp: this.lastSaveTime.toISOString()
        })

        // Show a subtle notification
        this.showAutoSaveNotification('Progress saved automatically')
      }
    } catch (error) {
      console.error('Auto-save failed:', error)
      this.handleAutoSaveError(error)
    }
  }

  // Get current sessions from localStorage
  getCurrentSessions() {
    try {
      const sessionsData = localStorage.getItem('observationSessions')
      return sessionsData ? JSON.parse(sessionsData) : []
    } catch (error) {
      console.error('Error reading sessions from localStorage:', error)
      return []
    }
  }

  // Get the currently active session (being edited)
  getCurrentActiveSession() {
    try {
      const activeSessionData = localStorage.getItem('currentActiveSession')
      return activeSessionData ? JSON.parse(activeSessionData) : null
    } catch (error) {
      console.error('Error reading active session from localStorage:', error)
      return null
    }
  }

  // Save a session with retry logic
  async saveSession(sessionData, retryCount = 0) {
    try {
      // Save to localStorage
      const sessions = this.getCurrentSessions()
      const existingIndex = sessions.findIndex(s => s.id === sessionData.id)
      
      if (existingIndex >= 0) {
        sessions[existingIndex] = { ...sessions[existingIndex], ...sessionData }
      } else {
        sessions.push(sessionData)
      }

      localStorage.setItem('observationSessions', JSON.stringify(sessions))
      
      // Also save as current active session if it's being edited
      if (sessionData.isActive) {
        localStorage.setItem('currentActiveSession', JSON.stringify(sessionData))
      }

      return true
    } catch (error) {
      if (retryCount < this.maxRetries) {
        console.warn(`Auto-save retry ${retryCount + 1}/${this.maxRetries}`)
        await this.delay(this.retryDelay * (retryCount + 1))
        return this.saveSession(sessionData, retryCount + 1)
      }
      throw error
    }
  }

  // Handle auto-save errors
  handleAutoSaveError(error) {
    console.error('Auto-save error:', error)
    
    // Show error notification
    this.showAutoSaveNotification('Auto-save failed - please save manually', 'error')
    
    // Optionally disable auto-save temporarily
    if (error.message.includes('QuotaExceededError')) {
      this.isEnabled = false
      this.showAutoSaveNotification('Storage full - auto-save disabled', 'warning')
    }
  }

  // Show auto-save notification
  showAutoSaveNotification(message, type = 'success') {
    // Create a subtle notification element
    const notification = document.createElement('div')
    notification.className = `auto-save-notification auto-save-${type}`
    notification.innerHTML = `
      <div class="auto-save-content">
        <span class="auto-save-icon">${type === 'success' ? '💾' : type === 'error' ? '⚠️' : '⚠️'}</span>
        <span class="auto-save-message">${message}</span>
      </div>
    `

    // Add styles
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#f59e0b'};
      color: white;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 14px;
      z-index: 10000;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `

    // Add to page
    document.body.appendChild(notification)

    // Animate in
    setTimeout(() => {
      notification.style.opacity = '1'
      notification.style.transform = 'translateY(0)'
    }, 100)

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0'
      notification.style.transform = 'translateY(20px)'
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 300)
    }, 3000)
  }

  // Manual save trigger
  async manualSave(sessionData) {
    try {
      await this.saveSession(sessionData)
      this.lastSaveTime = new Date()
      this.showAutoSaveNotification('Progress saved successfully')
      return true
    } catch (error) {
      console.error('Manual save failed:', error)
      this.showAutoSaveNotification('Save failed - please try again', 'error')
      return false
    }
  }

  // Get last save time
  getLastSaveTime() {
    return this.lastSaveTime
  }

  // Check if auto-save is enabled
  isAutoSaveEnabled() {
    return this.isEnabled
  }

  // Enable/disable auto-save
  setAutoSaveEnabled(enabled) {
    this.isEnabled = enabled
    if (enabled && !this.autoSaveInterval) {
      this.startAutoSave()
    } else if (!enabled && this.autoSaveInterval) {
      this.stopAutoSave()
    }
  }

  // Change save interval
  setSaveInterval(intervalMs) {
    this.saveInterval = intervalMs
    if (this.autoSaveInterval) {
      this.stopAutoSave()
      this.startAutoSave()
    }
  }

  // Utility function for delays
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Cleanup
  destroy() {
    this.stopAutoSave()
    this.isEnabled = false
  }
}

// Create singleton instance
const autoSaveManager = new AutoSaveManager()

// Export functions for easy use
export const startAutoSave = () => autoSaveManager.startAutoSave()
export const stopAutoSave = () => autoSaveManager.stopAutoSave()
export const manualSave = (sessionData) => autoSaveManager.manualSave(sessionData)
export const getLastSaveTime = () => autoSaveManager.getLastSaveTime()
export const isAutoSaveEnabled = () => autoSaveManager.isAutoSaveEnabled()
export const setAutoSaveEnabled = (enabled) => autoSaveManager.setAutoSaveEnabled(enabled)
export const setSaveInterval = (intervalMs) => autoSaveManager.setSaveInterval(intervalMs)

// Export the manager instance for advanced usage
export default autoSaveManager
