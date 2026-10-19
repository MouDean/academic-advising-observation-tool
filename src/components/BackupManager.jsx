import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Download, 
  Upload, 
  RotateCcw, 
  Trash2, 
  Database, 
  Clock, 
  HardDrive,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react'
import { 
  getAvailableBackups, 
  restoreFromBackup, 
  exportBackup, 
  importBackup, 
  deleteBackup, 
  getBackupStats,
  triggerManualBackup
} from '@/utils/backupSystem.js'
import { showNotification } from '@/components/Notification.jsx'

const BackupManager = React.memo(({ onClose, onDataRestored }) => {
  const [backups, setBackups] = useState([])
  const [stats, setStats] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [restoringBackup, setRestoringBackup] = useState(null)
  const [deletingBackup, setDeletingBackup] = useState(null)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const fileInputRef = useRef(null)

  // Load backups on component mount
  useEffect(() => {
    loadBackups()
  }, [])

  const loadBackups = () => {
    try {
      const availableBackups = getAvailableBackups()
      const backupStats = getBackupStats()
      setBackups(availableBackups)
      setStats(backupStats)
    } catch (error) {
      console.error('Failed to load backups:', error)
      showNotification.error('Failed to load backup information')
    }
  }

  const handleManualBackup = async () => {
    try {
      setIsLoading(true)
      const result = await triggerManualBackup()
      if (result.success) {
        showNotification.success('Manual backup created successfully!')
        loadBackups() // Refresh the list
      } else {
        showNotification.error('Failed to create manual backup')
      }
    } catch (error) {
      console.error('Manual backup failed:', error)
      showNotification.error('Failed to create manual backup')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestoreBackup = async (backupId) => {
    if (!window.confirm('Are you sure you want to restore this backup? This will replace all current data.')) {
      return
    }

    try {
      setRestoringBackup(backupId)
      const result = await restoreFromBackup(backupId)
      
      if (result.success) {
        showNotification.success(`Successfully restored ${result.sessionsRestored} sessions and ${result.mediaRestored} media files!`)
        
        // Notify parent component that data was restored
        if (onDataRestored) {
          onDataRestored()
        }
        
        // Close the backup manager
        onClose()
      } else {
        showNotification.error('Failed to restore backup')
      }
    } catch (error) {
      console.error('Restore failed:', error)
      showNotification.error(`Failed to restore backup: ${error.message}`)
    } finally {
      setRestoringBackup(null)
    }
  }

  const handleExportBackup = async (backupId) => {
    try {
      const filename = await exportBackup(backupId)
      showNotification.success(`Backup exported successfully: ${filename}`)
    } catch (error) {
      console.error('Export failed:', error)
      showNotification.error('Failed to export backup')
    }
  }

  const handleDeleteBackup = async (backupId) => {
    if (!window.confirm('Are you sure you want to delete this backup? This action cannot be undone.')) {
      return
    }

    try {
      setDeletingBackup(backupId)
      await deleteBackup(backupId)
      showNotification.success('Backup deleted successfully')
      loadBackups() // Refresh the list
    } catch (error) {
      console.error('Delete failed:', error)
      showNotification.error('Failed to delete backup')
    } finally {
      setDeletingBackup(null)
    }
  }

  const handleImportBackup = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    try {
      setIsLoading(true)
      const result = await importBackup(file)
      
      if (result.success) {
        showNotification.success(`Backup imported successfully! ${result.sessionsImported} sessions and ${result.mediaImported} media files.`)
        loadBackups() // Refresh the list
        setShowImportDialog(false)
      } else {
        showNotification.error('Failed to import backup')
      }
    } catch (error) {
      console.error('Import failed:', error)
      showNotification.error(`Failed to import backup: ${error.message}`)
    } finally {
      setIsLoading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp)
      return date.toLocaleString()
    } catch (error) {
      return 'Invalid date'
    }
  }

  const formatBackupId = (backupId) => {
    return backupId.replace('backup_', '').slice(0, 20) + '...'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999] p-4" style={{ zIndex: 99999 }}>
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden" style={{ zIndex: 100000 }}>
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-6 h-6" />
                Backup Management System
              </CardTitle>
              <CardDescription className="text-blue-100">
                Manage your data backups and restore points
              </CardDescription>
            </div>
            <Button onClick={onClose} variant="ghost" size="sm" className="text-white hover:bg-white hover:bg-opacity-20">
              <XCircle className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Backup Statistics */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.totalBackups || 0}</div>
                  <div className="text-sm text-gray-600">Total Backups</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-blue-600">{stats.totalSize || '0 KB'}</div>
                  <div className="text-sm text-gray-600">Total Size</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">
                    {stats.lastBackup ? formatTimestamp(stats.lastBackup) : 'Never'}
                  </div>
                  <div className="text-sm text-gray-600">Last Backup</div>
                </div>
                <div>
                  <Button 
                    onClick={handleManualBackup} 
                    disabled={isLoading}
                    className="w-full"
                    variant="outline"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Database className="w-4 h-4" />
                    )}
                    Create Backup
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Import/Export Section */}
          <div className="flex gap-4">
            <Button 
              onClick={() => setShowImportDialog(true)} 
              variant="outline" 
              className="flex-1"
              disabled={isLoading}
            >
              <Upload className="w-4 h-4 mr-2" />
              Import Backup
            </Button>
            
            {showImportDialog && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999999]" style={{ zIndex: 999999 }}>
                <Card className="w-96" style={{ zIndex: 1000000 }}>
                  <CardHeader>
                    <CardTitle>Import Backup File</CardTitle>
                    <CardDescription>Select a backup file to import</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleImportBackup}
                      className="w-full"
                    />
                    <div className="flex gap-2">
                      <Button onClick={() => setShowImportDialog(false)} variant="outline" className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Backups List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <HardDrive className="w-5 h-5" />
              Available Backups ({backups.length})
            </h3>
            
            {backups.length === 0 ? (
              <Card className="p-8 text-center text-gray-500">
                <Database className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>No backups available</p>
                <p className="text-sm">Create your first backup to get started</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {backups.map((backup) => (
                  <Card key={backup.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {backup.version}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {formatBackupId(backup.id)}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Sessions:</span> {backup.metadata?.totalSessions || 0}
                            </div>
                            <div>
                              <span className="font-medium">Media:</span> {backup.metadata?.totalMedia || 0}
                            </div>
                            <div className="col-span-2">
                              <span className="font-medium">Created:</span> {formatTimestamp(backup.timestamp)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleExportBackup(backup.id)}
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="Export Backup"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            onClick={() => handleRestoreBackup(backup.id)}
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="Restore Backup"
                            disabled={restoringBackup === backup.id}
                          >
                            {restoringBackup === backup.id ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <RotateCcw className="w-4 h-4" />
                            )}
                          </Button>
                          
                          <Button
                            onClick={() => handleDeleteBackup(backup.id)}
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            title="Delete Backup"
                            disabled={deletingBackup === backup.id}
                          >
                            {deletingBackup === backup.id ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Backup Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Backup Information:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Backups are automatically created every 2 minutes</li>
                    <li>• Only the last 10 backups are kept to save storage space</li>
                    <li>• Each backup includes all sessions, media, and settings</li>
                    <li>• You can export backups to external files for safekeeping</li>
                    <li>• Restoring a backup will replace all current data</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
})

export default BackupManager
