import React, { useState, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Plus, FileSpreadsheet, Edit, AlertTriangle, LogOut, BarChart3, Database, HardDrive, Download, Upload, Mail, Linkedin } from 'lucide-react'
import Logo from '@/assets/Logoo.svg'
import DarkLogo from '@/assets/Dark.svg'
import SimpleThemeToggle from '@/components/SimpleThemeToggle.jsx'
import CopyrightProtection from '@/components/CopyrightProtection.jsx'

import { addSampleDataToStorage } from '@/utils/sampleData.js'
import { showNotification } from '@/components/Notification.jsx'
import { exportAllData, importAndRestoreData } from '@/utils/backupRestore.js'
import Loading from '@/components/ui/loading.jsx'

const HomePage = React.memo(({ sessions, onStartNewSession, onExportAllSessions, onEditSession, onDeleteSession, onLogout, onShowAnalytics, onRefreshSessions }) => {
  const [isDark, setIsDark] = useState(() => {
    // Load initial theme from localStorage
    const savedTheme = localStorage.getItem('theme')
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
  })
  const [isGeneratingData, setIsGeneratingData] = useState(false)
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)

  // Memoize sessions data to avoid unnecessary re-renders
  const processedSessions = useMemo(() => {
    return sessions.map(session => {
      const hasJustification = session.lowCompletionJustification && session.lowCompletionJustification.trim() !== ''
      const totalFields = 13
      let completedFields = 0
      
      if (session.observations) {
        Object.values(session.observations).forEach(category => {
          Object.values(category).forEach(field => {
            if (field.rating && field.rating.trim() !== '') {
              completedFields++
            }
          })
        })
      }
      
      const completionRate = (completedFields / totalFields) * 100
      const shouldHaveJustification = completionRate < 50
      
      return {
        ...session,
        hasJustification,
        shouldHaveJustification,
        completionRate
      }
    })
  }, [sessions])

  const handleThemeChange = useCallback((dark) => {
    setIsDark(dark)
  }, [])

  const handleGenerateSampleData = useCallback(async () => {
    setIsGeneratingData(true)
    try {
      await addSampleDataToStorage(50) // Generate 50 sample sessions
      showNotification.success('Sample data generated successfully! Please refresh the page to see the new sessions.')
      if (onRefreshSessions) {
        onRefreshSessions()
      }
    } catch (error) {
      showNotification.error('Error generating sample data')
    } finally {
      setIsGeneratingData(false)
    }
  }, [onRefreshSessions])

  const handleBackup = useCallback(async () => {
    setIsBackingUp(true)
    try {
      const result = await exportAllData()
      showNotification.success(`Backup created! File: ${result.filename}`)
    } catch (error) {
      showNotification.error(`Backup failed: ${error.message}`)
    } finally {
      setIsBackingUp(false)
    }
  }, [])

  const handleRestore = useCallback(() => {
    // Create a hidden file input
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json,application/json'
    input.onchange = async (event) => {
      const file = event.target.files[0]
      if (!file) return
      
      setIsRestoring(true)
      try {
        const result = await importAndRestoreData(file)
        showNotification.success(`Restored ${result.sessionsImported} sessions!`)
        if (onRefreshSessions) {
          onRefreshSessions()
        }
      } catch (error) {
        showNotification.error(`Restore failed: ${error.message}`)
      } finally {
        setIsRestoring(false)
      }
    }
    input.click()
  }, [onRefreshSessions])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12 relative">
          {/* Logout and Theme toggle buttons positioned in top-right corner */}
          <div className="absolute top-4 right-4 flex gap-2 z-10 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
            <SimpleThemeToggle onThemeChange={handleThemeChange} />
            <Button onClick={onLogout} variant="outline" size="sm" className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
            <Button 
              onClick={() => window.open('mailto:maintainer@example.org', '_blank')} 
              variant="outline" 
              size="sm" 
              className="gap-2"
            >
              <Mail className="w-4 h-4" />
              Email
            </Button>
            <Button 
              onClick={() => window.open('https://www.linkedin.com/in/mousa-alhatti', '_blank')} 
              variant="outline" 
              size="sm" 
              className="gap-2"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </Button>
          </div>
          
          <div className="flex justify-center mb-6">
            <img src={isDark ? DarkLogo : Logo} alt="Logo" className="h-64 w-auto" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Academic Advising Observation Tool
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Structured observation tool for AI-supported academic advising sessions at Abu Dhabi University
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button onClick={onStartNewSession} size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Start New Observation Session
            </Button>
            <Button onClick={onShowAnalytics} variant="outline" size="lg" className="gap-2">
              <BarChart3 className="w-5 h-5" />
              View Analytics
            </Button>
            <Button 
              onClick={handleGenerateSampleData} 
              variant="outline" 
              size="lg" 
              className="gap-2"
              disabled={isGeneratingData}
            >
              {isGeneratingData ? (
                <Loading size="sm" text="" />
              ) : (
                <Database className="w-5 h-5" />
              )}
              {isGeneratingData ? 'Generating...' : 'Generate Sample Data'}
            </Button>
            <Button 
              onClick={handleBackup} 
              variant="outline" 
              size="lg" 
              className="gap-2"
              disabled={isBackingUp}
            >
              {isBackingUp ? (
                <Loading size="sm" text="" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              {isBackingUp ? 'Creating...' : 'Download Backup'}
            </Button>
            <Button 
              onClick={handleRestore} 
              variant="outline" 
              size="lg" 
              className="gap-2"
              disabled={isRestoring}
            >
              {isRestoring ? (
                <Loading size="sm" text="" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
              {isRestoring ? 'Restoring...' : 'Restore Backup'}
            </Button>
          </div>
          
          {processedSessions.length > 0 && (
            <Card className="mt-8 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-gray-900 dark:text-white">Previous Sessions</CardTitle>
                <div className="flex items-center gap-2">
                  <Button onClick={onExportAllSessions} variant="outline" size="sm" className="gap-2">
                    <FileSpreadsheet className="w-4 h-4" />
                    Export All Sessions
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {processedSessions.map(session => (
                    <div 
                      key={session.id} 
                      className={`flex items-center justify-between p-3 border rounded transition-colors ${
                        (session.hasJustification || session.shouldHaveJustification)
                          ? 'bg-amber-100 border-amber-300 shadow-sm dark:bg-amber-900 dark:border-amber-600' 
                          : 'bg-white border-gray-200 dark:bg-gray-700 dark:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {session.sessionInfo?.studentCode || 'No Student ID'} - {session.sessionInfo?.advisor || 'No Advisor'}
                          </span>
                          <span className="text-sm text-gray-600 ml-2 dark:text-gray-300">
                            {new Date(session.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {(session.hasJustification || session.shouldHaveJustification) && (
                          <Badge variant="outline" className="text-amber-800 border-amber-400 bg-amber-200 font-medium dark:text-amber-200 dark:border-amber-500 dark:bg-amber-900">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {session.hasJustification ? 'Low Completion' : 'Low Completion (No Justification)'}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-gray-700 dark:text-gray-300">{session.status}</Badge>
                        <Button 
                          onClick={() => onEditSession(session)} 
                          variant="outline" 
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Copyright Protection Notice */}
        <div className="mt-8">
          <CopyrightProtection />
        </div>

      </div>
    </div>
  )
})

export default HomePage
