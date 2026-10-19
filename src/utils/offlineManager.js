// Offline Manager for Observation Tool
class OfflineManager {
  constructor() {
    this.isOnline = navigator.onLine
    this.offlineQueue = []
    this.syncInProgress = false
    this.connectionListeners = []
    this.syncListeners = []
    
    this.initialize()
  }

  // Initialize offline manager
  initialize() {
    // Listen for online/offline events
    window.addEventListener('online', () => this.handleOnline())
    window.addEventListener('offline', () => this.handleOffline())
    
    // Check initial connection status
    this.updateConnectionStatus()
    
    // Start periodic connection check
    setInterval(() => this.updateConnectionStatus(), 10000)
    
    console.log('Offline Manager initialized')
  }

  // Handle online event
  handleOnline() {
    this.isOnline = true
    this.updateConnectionStatus()
    this.notifyConnectionListeners('online')
    
    // Attempt to sync offline data
    this.syncOfflineData()
    
    console.log('Connection restored - syncing offline data')
  }

  // Handle offline event
  handleOffline() {
    this.isOnline = false
    this.updateConnectionStatus()
    this.notifyConnectionListeners('offline')
    
    console.log('Connection lost - switching to offline mode')
  }

  // Update connection status
  updateConnectionStatus() {
    const wasOnline = this.isOnline
    this.isOnline = navigator.onLine
    
    if (wasOnline !== this.isOnline) {
      this.notifyConnectionListeners(this.isOnline ? 'online' : 'offline')
    }
  }

  // Check if currently online
  isCurrentlyOnline() {
    return this.isOnline
  }

  // Add item to offline queue
  addToOfflineQueue(action, data) {
    const queueItem = {
      id: this.generateId(),
      action,
      data,
      timestamp: new Date().toISOString(),
      retryCount: 0
    }
    
    this.offlineQueue.push(queueItem)
    this.saveOfflineQueue()
    
    console.log('Added to offline queue:', queueItem)
    
    // If online, try to process immediately
    if (this.isOnline) {
      this.processOfflineQueue()
    }
  }

  // Process offline queue
  async processOfflineQueue() {
    if (this.syncInProgress || this.offlineQueue.length === 0) {
      return
    }
    
    this.syncInProgress = true
    
    try {
      const itemsToProcess = [...this.offlineQueue]
      
      for (const item of itemsToProcess) {
        try {
          await this.processQueueItem(item)
          this.removeFromOfflineQueue(item.id)
        } catch (error) {
          console.error('Failed to process queue item:', item.id, error)
          item.retryCount++
          
          // Remove item if it has been retried too many times
          if (item.retryCount >= 3) {
            this.removeFromOfflineQueue(item.id)
            console.warn('Removed queue item after max retries:', item.id)
          }
        }
      }
    } finally {
      this.syncInProgress = false
    }
  }

  // Process a single queue item
  async processQueueItem(item) {
    switch (item.action) {
      case 'saveSession':
        await this.saveSessionToServer(item.data)
        break
      case 'updateSession':
        await this.updateSessionOnServer(item.data)
        break
      case 'deleteSession':
        await this.deleteSessionFromServer(item.data)
        break
      default:
        console.warn('Unknown queue action:', item.action)
    }
  }

  // Save session to server (placeholder)
  async saveSessionToServer(sessionData) {
    // This would be implemented to save to actual server
    console.log('Saving session to server:', sessionData.id)
    
    // Simulate server request
    await this.delay(1000)
    
    // For now, just log the action
    return Promise.resolve()
  }

  // Update session on server (placeholder)
  async updateSessionOnServer(sessionData) {
    console.log('Updating session on server:', sessionData.id)
    
    // Simulate server request
    await this.delay(1000)
    
    return Promise.resolve()
  }

  // Delete session from server (placeholder)
  async deleteSessionFromServer(sessionId) {
    console.log('Deleting session from server:', sessionId)
    
    // Simulate server request
    await this.delay(1000)
    
    return Promise.resolve()
  }

  // Sync offline data
  async syncOfflineData() {
    if (!this.isOnline || this.offlineQueue.length === 0) {
      return
    }
    
    console.log('Starting offline data sync...')
    this.notifySyncListeners('start')
    
    try {
      await this.processOfflineQueue()
      this.notifySyncListeners('complete')
      console.log('Offline data sync completed')
    } catch (error) {
      console.error('Offline data sync failed:', error)
      this.notifySyncListeners('error', error)
    }
  }

  // Remove item from offline queue
  removeFromOfflineQueue(itemId) {
    this.offlineQueue = this.offlineQueue.filter(item => item.id !== itemId)
    this.saveOfflineQueue()
  }

  // Save offline queue to localStorage
  saveOfflineQueue() {
    try {
      localStorage.setItem('offlineQueue', JSON.stringify(this.offlineQueue))
    } catch (error) {
      console.error('Failed to save offline queue:', error)
    }
  }

  // Load offline queue from localStorage
  loadOfflineQueue() {
    try {
      const queueData = localStorage.getItem('offlineQueue')
      this.offlineQueue = queueData ? JSON.parse(queueData) : []
    } catch (error) {
      console.error('Failed to load offline queue:', error)
      this.offlineQueue = []
    }
  }

  // Get offline queue
  getOfflineQueue() {
    return [...this.offlineQueue]
  }

  // Clear offline queue
  clearOfflineQueue() {
    this.offlineQueue = []
    this.saveOfflineQueue()
  }

  // Add connection status listener
  addConnectionListener(callback) {
    this.connectionListeners.push(callback)
  }

  // Remove connection status listener
  removeConnectionListener(callback) {
    this.connectionListeners = this.connectionListeners.filter(listener => listener !== callback)
  }

  // Add sync status listener
  addSyncListener(callback) {
    this.syncListeners.push(callback)
  }

  // Remove sync status listener
  removeSyncListener(callback) {
    this.syncListeners = this.syncListeners.filter(listener => listener !== callback)
  }

  // Notify connection listeners
  notifyConnectionListeners(status) {
    this.connectionListeners.forEach(listener => {
      try {
        listener(status)
      } catch (error) {
        console.error('Error in connection listener:', error)
      }
    })
  }

  // Notify sync listeners
  notifySyncListeners(status, error = null) {
    this.syncListeners.forEach(listener => {
      try {
        listener(status, error)
      } catch (error) {
        console.error('Error in sync listener:', error)
      }
    })
  }

  // Generate unique ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // Utility function for delays
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Get connection status info
  getConnectionInfo() {
    return {
      isOnline: this.isOnline,
      queueLength: this.offlineQueue.length,
      lastSync: this.lastSyncTime,
      syncInProgress: this.syncInProgress
    }
  }

  // Force sync
  async forceSync() {
    if (this.isOnline) {
      await this.syncOfflineData()
    } else {
      throw new Error('Cannot sync while offline')
    }
  }

  // Cleanup
  destroy() {
    window.removeEventListener('online', this.handleOnline)
    window.removeEventListener('offline', this.handleOffline)
    this.connectionListeners = []
    this.syncListeners = []
  }
}

// Create singleton instance
const offlineManager = new OfflineManager()

// Export functions for easy use
export const isOnline = () => offlineManager.isCurrentlyOnline()
export const addToOfflineQueue = (action, data) => offlineManager.addToOfflineQueue(action, data)
export const getOfflineQueue = () => offlineManager.getOfflineQueue()
export const clearOfflineQueue = () => offlineManager.clearOfflineQueue()
export const forceSync = () => offlineManager.forceSync()
export const getConnectionInfo = () => offlineManager.getConnectionInfo()
export const addConnectionListener = (callback) => offlineManager.addConnectionListener(callback)
export const addSyncListener = (callback) => offlineManager.addSyncListener(callback)

// Export the manager instance for advanced usage
export default offlineManager
