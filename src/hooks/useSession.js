import { useState, useEffect, useCallback } from 'react'
import { safeSetItem, cleanupOldSessions } from '@/utils/storageManager'
import { SESSION_TYPES } from '@/utils/constants.js'

export const useSession = () => {
  const [currentSession, setCurrentSession] = useState(null)
  const [sessions, setSessions] = useState([])
  const [sessionData, setSessionData] = useState({
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
    lowCompletionJustification: '',
    media: []
  })

  // Load completed sessions from localStorage
  useEffect(() => {
    const loadCompletedSessions = () => {
      console.log('=== LOADING SESSIONS DEBUG ===')
      const completedSessions = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('session_')) {
          try {
            const sessionData = JSON.parse(localStorage.getItem(key))
            if (sessionData && sessionData.status === 'completed') {
              console.log(`Loading session ${key}:`, {
                id: sessionData.id,
                studentCode: sessionData.sessionInfo?.studentCode,
                advisor: sessionData.sessionInfo?.advisor,
                hasJustification: !!sessionData.lowCompletionJustification,
                justification: sessionData.lowCompletionJustification,
                justificationLength: sessionData.lowCompletionJustification?.length || 0,
                allKeys: Object.keys(sessionData)
              })
              
              // Ensure lowCompletionJustification field exists for backward compatibility
              if (!sessionData.hasOwnProperty('lowCompletionJustification')) {
                sessionData.lowCompletionJustification = ''
                localStorage.setItem(key, JSON.stringify(sessionData))
              }
              completedSessions.push(sessionData)
            }
          } catch (error) {
            console.error('Error loading session:', error)
          }
        }
      }
      console.log('Total completed sessions loaded:', completedSessions.length)
      console.log('=== END LOADING SESSIONS DEBUG ===')
      setSessions(completedSessions.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt)))
    }
    
    loadCompletedSessions()
  }, [])

  // Auto-save effect - only for active sessions, not completed ones
  useEffect(() => {
    if (currentSession && currentSession.status === 'active') {
      const updatedSession = {
        ...currentSession,
        ...sessionData
      }
      const result = safeSetItem(`session_${currentSession.id}`, JSON.stringify(updatedSession))
      
      if (!result.success && result.cleanup) {
        console.log('Auto-save cleanup performed:', result.cleanup)
      }
    }
  }, [sessionData, currentSession])

  // Function to get the next sequential session ID
  const getNextSessionId = useCallback(() => {
    const lastId = localStorage.getItem('lastSessionId')
    const nextId = lastId ? parseInt(lastId) + 1 : 1
    localStorage.setItem('lastSessionId', nextId.toString())
    return nextId
  }, [])



  const startNewSession = useCallback(() => {
    const newSession = {
      id: getNextSessionId(),
      createdAt: new Date().toISOString(),
      status: 'active'
    }
    
    // Create fresh session data with only date and time pre-filled
    const freshSessionData = {
      sessionInfo: {
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0].substring(0, 5),
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
      lowCompletionJustification: '',
      media: []
    }
    
    setCurrentSession(newSession)
    setSessionData(freshSessionData)
  }, [])

  const completeSession = useCallback((duration, justification = '') => {
    if (currentSession) {
      console.log('=== COMPLETE SESSION DEBUG ===')
      console.log('Duration:', duration)
      console.log('Justification passed:', justification)
      console.log('Current sessionData:', sessionData)
      console.log('Justification in sessionData:', sessionData.lowCompletionJustification)
      
      // Use the passed justification if provided, otherwise use the one from sessionData
      const finalJustification = justification || sessionData.lowCompletionJustification || ''
      
      console.log('Final justification to use:', finalJustification)
      
      const completedSession = {
        ...currentSession,
        ...sessionData,
        sessionInfo: {
          ...sessionData.sessionInfo,
          duration
        },
        status: 'completed',
        completedAt: new Date().toISOString(),
        lowCompletionJustification: finalJustification
      }
      
      console.log('Completed session object:', completedSession)
      console.log('Justification in completed session:', completedSession.lowCompletionJustification)
      
      const saveResult = safeSetItem(`session_${currentSession.id}`, JSON.stringify(completedSession))
      
      if (!saveResult.success) {
        console.error('Failed to save completed session:', saveResult.error)
        // If storage is full, try to clean up and save again
        if (saveResult.cleanup) {
          console.log('Storage cleanup performed during session completion:', saveResult.cleanup)
        }
      }
      
      // Verify what was saved
      const savedData = JSON.parse(localStorage.getItem(`session_${currentSession.id}`))
      console.log('Saved data from localStorage:', savedData)
      console.log('Justification in saved data:', savedData.lowCompletionJustification)
      console.log('=== END COMPLETE SESSION DEBUG ===')
      
      setSessions(prev => [...prev.filter(s => s.id !== currentSession.id), completedSession])
      setCurrentSession(null)
    }
  }, [currentSession, sessionData])

  const updateObservation = useCallback((category, field, type, value) => {
    setSessionData(prev => ({
      ...prev,
      observations: {
        ...prev.observations,
        [category]: {
          ...prev.observations[category],
          [field]: {
            ...prev.observations[category][field],
            [type]: value
          }
        }
      }
    }))
  }, [])

  const updateSessionInfo = useCallback((field, value) => {
    setSessionData(prev => ({
      ...prev,
      sessionInfo: {
        ...prev.sessionInfo,
        [field]: value
      }
    }))
  }, [])

  const updateGeneralNotes = useCallback((notes) => {
    setSessionData(prev => ({
      ...prev,
      generalNotes: notes
    }))
  }, [])

  const updateLowCompletionJustification = useCallback((justification) => {
    console.log('=== UPDATE JUSTIFICATION DEBUG ===')
    console.log('Updating justification to:', justification)
    setSessionData(prev => {
      const updated = {
        ...prev,
        lowCompletionJustification: justification
      }
      console.log('Updated sessionData:', updated)
      console.log('Justification in updated sessionData:', updated.lowCompletionJustification)
      console.log('=== END UPDATE JUSTIFICATION DEBUG ===')
      return updated
    })
  }, [])

  const updateMedia = useCallback((media) => {
    setSessionData(prev => ({
      ...prev,
      media: media
    }))
  }, [])

  const editSession = useCallback((session) => {
    setCurrentSession(session)
    setSessionData({
      sessionInfo: session.sessionInfo || {},
      observations: session.observations || {},
      generalNotes: session.generalNotes || '',
      lowCompletionJustification: session.lowCompletionJustification || '',
      media: session.media || []
    })
  }, [])

  const deleteSession = useCallback((session) => {
    // Remove from localStorage
    const key = `session_${session.id}`
    localStorage.removeItem(key)
    
    // Remove from sessions list
    setSessions(prev => prev.filter(s => s.id !== session.id))
  }, [])

  const updateSession = useCallback((updatedSession) => {
    // Update in localStorage
    localStorage.setItem(`session_${updatedSession.id}`, JSON.stringify(updatedSession))
    
    // Update in sessions list
    setSessions(prev => prev.map(s => s.id === updatedSession.id ? updatedSession : s))
    
    // Clear current session
    setCurrentSession(null)
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
       lowCompletionJustification: '',
       media: []
     })
  }, [])

  return {
    currentSession,
    sessions,
    sessionData,
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
  }
}
