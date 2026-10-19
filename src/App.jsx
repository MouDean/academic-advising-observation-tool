/**
 * Academic Advising Observation Tool
 * Copyright (c) 2025-2026 Mousa Alhatti. MIT License; see LICENSE.
 */

import React, { useEffect, useState, Suspense, lazy } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Button } from '@/components/ui/button.jsx'
import { FileText, Wifi, WifiOff, Save } from 'lucide-react'
import { useSession } from '@/hooks/useSession.js'
import { useTimer } from '@/hooks/useTimer.js'
import { exportSessionToJSON, exportSessionToExcel, exportAllSessionsToExcel } from '@/utils/exportUtils.js'
import { validateSessionData, validateObservationData } from '@/utils/validation.js'
import { SESSION_TYPES } from '@/utils/constants.js'

// Import PDF export with error handling
let exportSessionToPDF
import { showNotification } from '@/components/Notification.jsx'
import SessionForm from '@/components/SessionForm.jsx'
import SessionHeader from '@/components/SessionHeader.jsx'
import HomePage from '@/components/HomePage.jsx'
import ObservationField from '@/components/ObservationField.jsx'
import ConfirmDialog from '@/components/ConfirmDialog.jsx'
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog.jsx'
import JustificationDialog from '@/components/JustificationDialog.jsx'
import ProgressIndicator from '@/components/ProgressIndicator.jsx'
import LockPage from '@/components/LockPage.jsx'
import MediaUpload from '@/components/MediaUpload.jsx'
import MediaViewer from '@/components/MediaViewer.jsx'
import StorageManager from '@/components/StorageManager.jsx'
import AnalyticsDashboardSkeleton from '@/components/AnalyticsDashboardSkeleton.jsx'
import Logo from '@/assets/Logo Mousa.png'
import DarkLogo from '@/assets/Dark.svg'
import { startAutoSave, stopAutoSave, manualSave, getLastSaveTime } from '@/utils/autoSave.js'
import { isOnline, addConnectionListener, getConnectionInfo } from '@/utils/offlineManager.js'

// Lazy load heavy components
const AnalyticsDashboard = lazy(() => import('@/components/AnalyticsDashboard.jsx'))
const AIInsights = lazy(() => import('@/components/AIInsights.jsx'))
const BackupManager = lazy(() => import('@/components/BackupManager.jsx'))
const PredictiveAnalyticsDashboard = lazy(() => import('@/components/PredictiveAnalyticsDashboard.jsx'))

import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showJustificationDialog, setShowJustificationDialog] = useState(false)
  const [showBackDialog, setShowBackDialog] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState(null)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('online')
  const [lastSaveTime, setLastSaveTime] = useState(null)
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)

  const [mediaViewerOpen, setMediaViewerOpen] = useState(false)
  const [mediaViewerIndex, setMediaViewerIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isDark, setIsDark] = useState(() => {
    // Load initial theme from localStorage
    const savedTheme = localStorage.getItem('theme')
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
  })

  const {
    currentSession,
    setCurrentSession,
    sessions,
    sessionData,
    setSessionData,
    startNewSession,
    completeSession,
    updateObservation,
    updateSessionInfo,
    updateGeneralNotes,
    updateLowCompletionJustification,
    updateMedia,
    editSession,
    deleteSession,
    updateSession
  } = useSession()

  const {
    timer,
    isTimerRunning,
    startTimer,
    stopTimer,
    resetTimer
  } = useTimer()

  // Check authentication status on component mount
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
    
    // Initialize PDF export
    const initPDFExport = async () => {
      try {
        const pdfModule = await import('@/utils/pdfExport.js')
        exportSessionToPDF = pdfModule.exportSessionToPDF
      } catch (error) {
        console.error('Failed to import PDF export:', error)
        exportSessionToPDF = () => {
          console.error('PDF export not available')
          showNotification.error('PDF export is currently unavailable')
        }
      }
    }
    
    initPDFExport()
  }, [])

  // Listen for theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      const savedTheme = localStorage.getItem('theme')
      setIsDark(savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches))
    }

    // Listen for storage changes (when theme is updated in other components)
    window.addEventListener('storage', handleThemeChange)
    
    // Listen for custom theme change events
    window.addEventListener('themeChanged', handleThemeChange)
    
    // Also listen for theme changes via CSS media query
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', handleThemeChange)

    return () => {
      window.removeEventListener('storage', handleThemeChange)
      window.removeEventListener('themeChanged', handleThemeChange)
      mediaQuery.removeEventListener('change', handleThemeChange)
    }
  }, [])

  // Initialize auto-save and offline functionality
  useEffect(() => {
    if (isAuthenticated) {
      // Start auto-save
      startAutoSave()
      
      // Set up connection status listener
      const handleConnectionChange = (status) => {
        setConnectionStatus(status)
        if (status === 'online') {
          showNotification.success('Connection restored - syncing data')
        } else {
          showNotification.warning('Connection lost - working offline')
        }
      }
      
      addConnectionListener(handleConnectionChange)
      
      // Set initial connection status
      setConnectionStatus(isOnline() ? 'online' : 'offline')
      
      // Update last save time
      const lastSave = getLastSaveTime()
      if (lastSave) {
        setLastSaveTime(lastSave)
      }
      
      return () => {
        stopAutoSave()
      }
    }
  }, [isAuthenticated])

  // Start timer when session starts
  useEffect(() => {
    if (currentSession && !isTimerRunning) {
      startTimer()
    }
  }, [currentSession, isTimerRunning, startTimer])

  // Handle session completion
  const handleCompleteSession = () => {
    setShowCompleteDialog(true)
  }

  // Manual save function
  const handleManualSave = async () => {
    if (currentSession && sessionData) {
      const saveData = {
        ...sessionData,
        id: currentSession.id,
        isActive: true,
        lastModified: new Date().toISOString(),
        media: sessionData.media || []
      }
      
      const success = await manualSave(saveData)
      if (success) {
        setLastSaveTime(new Date())
        showNotification.success('Session saved manually')
      }
    }
  }

  // Handle media update
  const handleMediaUpdate = (media) => {
    updateMedia(media)
  }

  // Handle media viewer for completed sessions
  const handleOpenMediaViewer = (index) => {
    if (sessionData.media && sessionData.media.length > 0 && index >= 0 && index < sessionData.media.length) {
      setMediaViewerIndex(index)
      setMediaViewerOpen(true)
    }
  }

  const handleCloseMediaViewer = () => {
    setMediaViewerOpen(false)
  }

  const confirmCompleteSession = () => {
    // Validate data before completing
    const sessionValidation = validateSessionData(sessionData)
    const observationValidation = validateObservationData(sessionData.observations)
    
    if (!sessionValidation.isValid) {
      showNotification.error(`Session data errors: ${sessionValidation.errors.join(', ')}`)
      setShowCompleteDialog(false)
      return
    }
    
    // Check if justification is needed for low completion rate
    if (observationValidation.requiresJustification) {
      setShowCompleteDialog(false)
      setShowJustificationDialog(true)
      return
    }
    
    stopTimer()
    completeSession(timer)
    resetTimer()
    setShowCompleteDialog(false)
    showNotification.success('Session completed successfully!')
  }

  const handleJustificationConfirm = (justification) => {
    // Update the justification first
    updateLowCompletionJustification(justification)
    setShowJustificationDialog(false)

    // Now complete the session with the justification passed directly
    stopTimer()
    completeSession(timer, justification)
    resetTimer()
    showNotification.success('Session completed successfully with justification!')
  }

  // Handle export functions
  const handleExportExcel = async () => {
    if (currentSession) {
      setIsLoading(true)
      try {
        await exportSessionToExcel(currentSession, sessionData, timer, sessionData.media || [])
        showNotification.success('Session exported to Excel successfully!')
      } catch (error) {
        showNotification.error('Error occurred during export')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleExportJSON = async () => {
    if (currentSession) {
      setIsLoading(true)
      try {
        await exportSessionToJSON(currentSession, sessionData, timer, sessionData.media || [])
        showNotification.success('Session exported to JSON successfully!')
      } catch (error) {
        showNotification.error('Error occurred during export')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleExportPDF = async () => {
    if (currentSession) {
      setIsLoading(true)
      try {
        const sessionWithData = {
          ...currentSession,
          observations: sessionData.observations,
          generalNotes: sessionData.generalNotes,
          media: sessionData.media || [],
          completionRate: validateObservationData(sessionData.observations).completionRate
        }
        await exportSessionToPDF(sessionWithData)
        showNotification.success('Session exported to PDF successfully!')
      } catch (error) {
        console.error('PDF export error:', error)
        showNotification.error('Error occurred during PDF export')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleExportAllSessions = async () => {
    setIsLoading(true)
    try {
      await exportAllSessionsToExcel(sessions)
      showNotification.success('All sessions exported successfully!')
    } catch (error) {
      showNotification.error('Error occurred during export')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnlock = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    setIsAuthenticated(false)
    setShowAnalytics(false)
    showNotification.info('Logged out successfully')
  }

  const handleShowAnalytics = () => {
    setShowAnalytics(true)
  }

  const handleBackToHome = () => {
    setShowAnalytics(false)
  }

  const handleRefreshSessions = () => {
    // Force a reload of sessions from localStorage
    window.location.reload()
  }

  const handleStartNewSession = () => {
    startNewSession()
    showNotification.info('New observation session started')
  }

  const handleEditSession = (session) => {
    editSession(session)
    showNotification.info('Session loaded for editing')
  }

  const handleDeleteSession = (session) => {
    // Close any other open dialogs first
    setShowCompleteDialog(false)
    setShowJustificationDialog(false)
    setShowBackDialog(false)
    
    setSessionToDelete(session)
    setShowDeleteDialog(true)
  }

  const confirmDeleteSession = () => {
    if (sessionToDelete) {
      deleteSession(sessionToDelete)
      showNotification.success('Session deleted successfully')
      
      // Close all dialogs
      setShowDeleteDialog(false)
      setShowCompleteDialog(false)
      setShowJustificationDialog(false)
      setShowBackDialog(false)
      setSessionToDelete(null)
    }
  }

  const handleSaveEditedSession = () => {
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        ...sessionData,
        updatedAt: new Date().toISOString()
      }
      updateSession(updatedSession)
      showNotification.success('Session updated successfully')
    }
  }

  const handleBackClick = () => {
    // Close any other open dialogs first
    setShowCompleteDialog(false)
    setShowJustificationDialog(false)
    setShowDeleteDialog(false)
    
    setShowBackDialog(true)
  }

  const confirmBack = () => {
    // Stop the timer first
    stopTimer()
    
    // Clear the current session to return to homepage
    setCurrentSession(null)
    
    // Reset session data to empty state
    setSessionData({
      sessionInfo: {
        date: '',
        time: '',
        advisor: '',
        studentCode: '',
        sessionType: SESSION_TYPES.INITIAL_ADVISING.value,
        duration: 0
      },
      observations: {
        advisingProcess: {
          degreeRequirements: { rating: '', notes: '' },
          aiToolsUsage: { rating: '', notes: '' },
          referralServices: { rating: '', notes: '' }
        },
        studentEngagement: {
          questionsProactive: { rating: '', notes: '' },
          aiInteraction: { rating: '', notes: '' },
          understandingAdvice: { rating: '', notes: '' }
        },
        aiEnhancedTools: {
          accurateInfo: { rating: '', notes: '' },
          enhancesEfficiency: { rating: '', notes: '' },
          technicalIssues: { rating: '', notes: '' }
        },
        communicationInteraction: {
          activeListening: { rating: '', notes: '' },
          aiOutputIntegration: { rating: '', notes: '' },
          studentSatisfaction: { rating: '', notes: '' }
        },
        leadershipAlignment: {
          retentionStrategies: { rating: '', notes: '' },
          systemsThinking: { rating: '', notes: '' }
        }
      },
      generalNotes: '',
      lowCompletionJustification: ''
    })
    
    // Close all dialogs
    setShowBackDialog(false)
    setShowCompleteDialog(false)
    setShowJustificationDialog(false)
    setShowDeleteDialog(false)
    setSessionToDelete(null)
    
    // Reset timer
    resetTimer()
    
    showNotification.info('Session cancelled and returned to homepage')
  }

  // Show LockPage if not authenticated
  if (!isAuthenticated) {
    return <LockPage onUnlock={handleUnlock} />
  }

  if (!currentSession) {
    if (showAnalytics) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img src={Logo} alt="Logo" className="w-auto" style={{ height: '62px' }} />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Analytics Dashboard
                </h1>
              </div>
              <Button onClick={handleBackToHome} variant="outline">
                Back to Home
              </Button>
            </div>
          </div>
          <Tabs defaultValue="analytics" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="analytics">Analytics Dashboard</TabsTrigger>
              <TabsTrigger value="predictive">Predictive Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="analytics">
              <Suspense fallback={<AnalyticsDashboardSkeleton />}>
                <AnalyticsDashboard sessions={sessions} />
              </Suspense>
            </TabsContent>
            
            <TabsContent value="predictive">
              <Suspense fallback={<AnalyticsDashboardSkeleton />}>
                <PredictiveAnalyticsDashboard sessions={sessions} />
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
      )
    }

    return (
      <HomePage
        sessions={sessions}
        onStartNewSession={handleStartNewSession}
        onExportAllSessions={handleExportAllSessions}
        onEditSession={handleEditSession}
        onDeleteSession={handleDeleteSession}
        onLogout={handleLogout}
        onShowAnalytics={handleShowAnalytics}
        onRefreshSessions={handleRefreshSessions}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <SessionHeader 
          sessionId={currentSession.id}
          timer={timer}
          onExportExcel={handleExportExcel}
          onExportJSON={handleExportJSON}
          onExportPDF={handleExportPDF}
          onCompleteSession={handleCompleteSession}
          onSaveChanges={handleSaveEditedSession}
          isEditing={currentSession.status === 'completed'}
          isLoading={isLoading}
        />

        {/* Status Bar */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              {/* Connection Status */}
              <div className="flex items-center gap-2">
                {connectionStatus === 'online' ? (
                  <Wifi className="w-4 h-4 text-green-500" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-500" />
                )}
                <span className={connectionStatus === 'online' ? 'text-green-600' : 'text-red-600'}>
                  {connectionStatus === 'online' ? 'Online' : 'Offline'}
                </span>
              </div>

              {/* Auto-save Status */}
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4 text-blue-500" />
                <span className="text-gray-600 dark:text-gray-300">
                  Auto-save: {autoSaveEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>

              {/* Last Save Time */}
              {lastSaveTime && (
                <div className="text-gray-500 dark:text-gray-400">
                  Last saved: {lastSaveTime.toLocaleTimeString()}
                </div>
              )}
            </div>

            {/* Manual Save Button */}
            <Button 
              onClick={handleManualSave}
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Now
            </Button>
          </div>
        </div>

        {/* Session Information */}
        <SessionForm 
          sessionInfo={sessionData.sessionInfo}
          onUpdate={updateSessionInfo}
        />

        {/* Progress Indicator */}
        <ProgressIndicator observations={sessionData.observations} />

        {/* Observation Categories */}
        <Tabs defaultValue="advising" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="advising">Advising Process</TabsTrigger>
            <TabsTrigger value="engagement">Student Engagement</TabsTrigger>
            <TabsTrigger value="ai-tools">AI Tools</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="leadership">Leadership</TabsTrigger>
          </TabsList>

          <TabsContent value="advising">
            <Card>
              <CardHeader>
                <CardTitle>Advising Process</CardTitle>
                <CardDescription>Observe the core advising interaction and process</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ObservationField
                  category="advisingProcess"
                  field="degreeRequirements"
                  label="Advisor explains degree requirements clearly"
                  options={['Always', 'Sometimes', 'Never']}
                  currentValue={sessionData.observations.advisingProcess.degreeRequirements}
                  onUpdate={updateObservation}
                />
                <ObservationField
                  category="advisingProcess"
                  field="aiToolsUsage"
                  label="Use of AI tools during advising (e.g., chatbot, system dashboard)"
                  options={['Observed', 'Not Observed']}
                  currentValue={sessionData.observations.advisingProcess.aiToolsUsage}
                  onUpdate={updateObservation}
                />
                <ObservationField
                  category="advisingProcess"
                  field="referralServices"
                  label="Advisor refers student to additional support services"
                  options={['Yes', 'No']}
                  currentValue={sessionData.observations.advisingProcess.referralServices}
                  onUpdate={updateObservation}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement">
            <Card>
              <CardHeader>
                <CardTitle>Student Engagement</CardTitle>
                <CardDescription>Assess student participation and interaction</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ObservationField
                  category="studentEngagement"
                  field="questionsProactive"
                  label="Student asks questions proactively"
                  options={['High', 'Medium', 'Low']}
                  currentValue={sessionData.observations.studentEngagement.questionsProactive}
                  onUpdate={updateObservation}
                />
                <ObservationField
                  category="studentEngagement"
                  field="aiInteraction"
                  label="Student interacts with AI system independently"
                  options={['Yes', 'No']}
                  currentValue={sessionData.observations.studentEngagement.aiInteraction}
                  onUpdate={updateObservation}
                />
                <ObservationField
                  category="studentEngagement"
                  field="understandingAdvice"
                  label="Student shows understanding of advice given"
                  options={['Yes', 'No', 'Unclear']}
                  currentValue={sessionData.observations.studentEngagement.understandingAdvice}
                  onUpdate={updateObservation}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-tools">
            <Card>
              <CardHeader>
                <CardTitle>Use of AI-Enhanced Tools</CardTitle>
                <CardDescription>Evaluate the integration and effectiveness of AI tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ObservationField
                  category="aiEnhancedTools"
                  field="accurateInfo"
                  label="AI system provides accurate information"
                  options={['Accurate', 'Partially Accurate', 'Inaccurate']}
                  currentValue={sessionData.observations.aiEnhancedTools.accurateInfo}
                  onUpdate={updateObservation}
                />
                <ObservationField
                  category="aiEnhancedTools"
                  field="enhancesEfficiency"
                  label="AI tool enhances efficiency of advising session"
                  options={['Yes', 'No']}
                  currentValue={sessionData.observations.aiEnhancedTools.enhancesEfficiency}
                  onUpdate={updateObservation}
                />
                <ObservationField
                  category="aiEnhancedTools"
                  field="technicalIssues"
                  label="Technical issues encountered during session"
                  options={['Yes', 'No (describe)']}
                  currentValue={sessionData.observations.aiEnhancedTools.technicalIssues}
                  onUpdate={updateObservation}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communication">
            <Card>
              <CardHeader>
                <CardTitle>Communication & Interaction</CardTitle>
                <CardDescription>Capture the quality of communication between advisor and student</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ObservationField
                  category="communicationInteraction"
                  field="activeListening"
                  label="Advisor demonstrates active listening"
                  options={['Strong', 'Moderate', 'Weak']}
                  currentValue={sessionData.observations.communicationInteraction.activeListening}
                  onUpdate={updateObservation}
                />
                <ObservationField
                  category="communicationInteraction"
                  field="aiOutputIntegration"
                  label="Advisor integrates AI output into discussion"
                  options={['Effective', 'Limited', 'Not used']}
                  currentValue={sessionData.observations.communicationInteraction.aiOutputIntegration}
                  onUpdate={updateObservation}
                />
                <ObservationField
                  category="communicationInteraction"
                  field="studentSatisfaction"
                  label="Student satisfaction cues (body language, tone, feedback)"
                  options={['Positive', 'Neutral', 'Negative']}
                  currentValue={sessionData.observations.communicationInteraction.studentSatisfaction}
                  onUpdate={updateObservation}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leadership">
            <Card>
              <CardHeader>
                <CardTitle>Leadership & Institutional Alignment</CardTitle>
                <CardDescription>Assess broader institutional aspects observed during sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ObservationField
                  category="leadershipAlignment"
                  field="retentionStrategies"
                  label="Session aligns with ADU's retention and enrollment strategies"
                  options={['Yes', 'No']}
                  currentValue={sessionData.observations.leadershipAlignment.retentionStrategies}
                  onUpdate={updateObservation}
                />
                <ObservationField
                  category="leadershipAlignment"
                  field="systemsThinking"
                  label="Evidence of systems thinking (coordination across services)"
                  options={['Observed', 'Not Observed']}
                  currentValue={sessionData.observations.leadershipAlignment.systemsThinking}
                  onUpdate={updateObservation}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Media Evidence */}
        <MediaUpload
          sessionId={currentSession.id}
          onMediaUpdate={handleMediaUpdate}
          existingMedia={sessionData.media || []}
          isSessionCompleted={currentSession.status === 'completed'}
          onOpenViewer={handleOpenMediaViewer}
        />

        {/* General Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              General Notes
            </CardTitle>
            <CardDescription>
              Free space for detailed descriptions, reflections, or contextual factors observed during the session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="Enter detailed observations, contextual factors, reflections, or any additional notes about the session..."
              value={sessionData.generalNotes}
              onChange={(e) => updateGeneralNotes(e.target.value)}
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showCompleteDialog}
        onClose={() => setShowCompleteDialog(false)}
        onConfirm={confirmCompleteSession}
        title="Complete Session"
        description="Are you sure you want to complete this session? This action cannot be undone."
        confirmText="Complete Session"
        cancelText="Cancel"
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDeleteSession}
        session={sessionToDelete}
      />

      {/* Justification Dialog */}
      <JustificationDialog
        isOpen={showJustificationDialog}
        onClose={() => setShowJustificationDialog(false)}
        onConfirm={handleJustificationConfirm}
        completionRate={validateObservationData(sessionData.observations).completionRate}
      />

      {/* Back Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showBackDialog}
        onClose={() => setShowBackDialog(false)}
        onConfirm={confirmBack}
        title="Cancel Session"
        description="Are you sure you want to cancel this session? All unsaved data will be lost."
        confirmText="Cancel Session"
        cancelText="Continue Session"
      />

      {/* Media Viewer for Completed Sessions */}
              {mediaViewerOpen && sessionData.media && sessionData.media.length > 0 && (
        <MediaViewer
          media={sessionData.media || []}
          initialIndex={mediaViewerIndex}
          onClose={handleCloseMediaViewer}
        />
      )}
    </div>
  )
}

export default App

