import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Trash2, Download, AlertTriangle, CheckCircle } from 'lucide-react'
import { 
  getStorageUsage, 
  getStorageRecommendations, 
  cleanupOldSessions,
  checkStorageQuota 
} from '@/utils/storageManager'
import { showNotification } from '@/components/Notification.jsx'

const StorageManager = React.memo(({ onStorageChange }) => {
  const [storageInfo, setStorageInfo] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [isCleaning, setIsCleaning] = useState(false)

  useEffect(() => {
    updateStorageInfo()
  }, [])

  const updateStorageInfo = () => {
    const usage = getStorageUsage()
    const recommendations = getStorageRecommendations()
    
    setStorageInfo(usage)
    setRecommendations(recommendations.recommendations)
  }

  const handleCleanup = async () => {
    setIsCleaning(true)
    
    try {
      const result = cleanupOldSessions(15) // Keep 15 most recent sessions
      
      if (result.success) {
        if (result.removedCount > 0) {
          showNotification.success(`Cleaned up ${result.removedCount} old sessions. Freed ${result.freedSpaceMB}MB`)
        } else {
          showNotification.info('No cleanup needed - storage is already optimized')
        }
      } else {
        showNotification.error(`Cleanup failed: ${result.error}`)
      }
      
      updateStorageInfo()
      if (onStorageChange) {
        onStorageChange()
      }
    } catch (error) {
      showNotification.error('Error during cleanup: ' + error.message)
    } finally {
      setIsCleaning(false)
    }
  }

  const getStoragePercentage = () => {
    if (!storageInfo) return 0
    // Estimate localStorage limit at ~50MB
    const estimatedLimit = 50 * 1024 * 1024 // 50MB in bytes
    return Math.min((storageInfo.totalSize / estimatedLimit) * 100, 100)
  }

  const getStorageColor = (percentage) => {
    if (percentage > 90) return 'bg-red-500'
    if (percentage > 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  if (!storageInfo) {
    return <div>Loading storage information...</div>
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Storage Management
        </CardTitle>
        <CardDescription>
          Manage your local storage and free up space
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Storage Usage */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Storage Usage</span>
            <span>{storageInfo.totalSizeMB}MB / ~50MB</span>
          </div>
          <Progress 
            value={getStoragePercentage()} 
            className="h-2"
          />
          <div className="text-xs text-gray-500">
            {storageInfo.itemCount} items stored
          </div>
        </div>

        {/* Storage Status */}
        <Alert className={getStoragePercentage() > 90 ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'}>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            {getStoragePercentage() > 90 
              ? 'Storage is nearly full. Consider cleaning up old sessions.'
              : 'Storage usage is normal.'
            }
          </AlertDescription>
        </Alert>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Recommendations:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-yellow-500">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            onClick={handleCleanup} 
            disabled={isCleaning}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            {isCleaning ? 'Cleaning...' : 'Clean Old Sessions'}
          </Button>
          
          <Button 
            onClick={updateStorageInfo}
            variant="outline"
            size="sm"
          >
            Refresh
          </Button>
        </div>

        {/* Storage Details */}
        <details className="text-sm">
          <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
            Storage Details
          </summary>
          <div className="mt-2 space-y-1 text-xs text-gray-500">
            <div>Total Size: {storageInfo.totalSizeMB}MB</div>
            <div>Item Count: {storageInfo.itemCount}</div>
            <div>Usage Percentage: {getStoragePercentage().toFixed(1)}%</div>
          </div>
        </details>
      </CardContent>
    </Card>
  )
})

export default StorageManager
