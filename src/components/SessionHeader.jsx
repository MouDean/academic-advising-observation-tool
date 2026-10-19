import React from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { FileSpreadsheet, FileText, FileDown, CheckCircle, Save, ArrowLeft } from 'lucide-react'
import Loading from '@/components/ui/loading.jsx'

const SessionHeader = ({ 
  sessionId, 
  timer, 
  onExportExcel, 
  onExportJSON, 
  onExportPDF, 
  onCompleteSession, 
  onSaveChanges, 
  isEditing,
  isLoading = false 
}) => {
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Session #{sessionId}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Observation Session
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-lg px-3 py-1">
              {formatTime(timer)}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button 
                onClick={onSaveChanges} 
                variant="outline" 
                className="gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loading size="sm" text="" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button 
                onClick={onExportExcel} 
                variant="outline" 
                className="gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loading size="sm" text="" />
                ) : (
                  <FileSpreadsheet className="w-4 h-4" />
                )}
                Export Excel
              </Button>
              
              <Button 
                onClick={onExportJSON} 
                variant="outline" 
                className="gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loading size="sm" text="" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
                Export JSON
              </Button>
              
              <Button 
                onClick={onExportPDF} 
                variant="outline" 
                className="gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loading size="sm" text="" />
                ) : (
                  <FileDown className="w-4 h-4" />
                )}
                Export PDF
              </Button>
              
              <Button 
                onClick={onCompleteSession} 
                className="gap-2 bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loading size="sm" text="" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                Complete Session
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default SessionHeader
