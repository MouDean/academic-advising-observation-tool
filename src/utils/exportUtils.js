import * as XLSX from 'xlsx'
import { generateMediaExportData, formatFileSize } from './mediaUtils.js'
import { getSessionTypeLabel } from './sessionTypeUtils.js'

export const exportSessionToJSON = (session, sessionData, timer, media = []) => {
  const mediaData = generateMediaExportData(media)
  
  const dataStr = JSON.stringify({
    ...session,
    ...sessionData,
    sessionInfo: {
      ...sessionData.sessionInfo,
      duration: timer
    },
    media: mediaData
  }, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `observation_session_${session.id}.json`
  link.click()
}

export const exportSessionToExcel = (session, sessionData, timer, media = []) => {
  const sessionInfo = {
    ...sessionData.sessionInfo,
    duration: formatTime(timer)
  }

  // Create session info worksheet
  const sessionInfoData = [
    ['Session Information', ''],
    ['Session ID', session.id],
    ['Date', sessionInfo.date],
    ['Time', sessionInfo.time],
    ['Duration', sessionInfo.duration],
    ['Advisor', sessionInfo.advisor],
    ['Student Code', sessionInfo.studentCode],
    ['Session Type', getSessionTypeLabel(sessionInfo.sessionType)],
    ['Low Completion Justification', sessionData.lowCompletionJustification || 'N/A'],
    ['', '']
  ]

  // Create observations worksheet
  const observationsData = [
    ['Category', 'Indicator/Item', 'Rating/Frequency', 'Observation Notes'],
    ['', '', '', ''],
    // Advising Process
    ['Advising Process', 'Advisor explains degree requirements clearly', 
     sessionData.observations.advisingProcess.degreeRequirements.rating,
     sessionData.observations.advisingProcess.degreeRequirements.notes],
    ['', 'Use of AI tools during advising', 
     sessionData.observations.advisingProcess.aiToolsUsage.rating,
     sessionData.observations.advisingProcess.aiToolsUsage.notes],
    ['', 'Advisor refers student to additional support services', 
     sessionData.observations.advisingProcess.referralServices.rating,
     sessionData.observations.advisingProcess.referralServices.notes],
    ['', '', '', ''],
    // Student Engagement
    ['Student Engagement', 'Student asks questions proactively', 
     sessionData.observations.studentEngagement.questionsProactive.rating,
     sessionData.observations.studentEngagement.questionsProactive.notes],
    ['', 'Student interacts with AI system independently', 
     sessionData.observations.studentEngagement.aiInteraction.rating,
     sessionData.observations.studentEngagement.aiInteraction.notes],
    ['', 'Student shows understanding of advice given', 
     sessionData.observations.studentEngagement.understandingAdvice.rating,
     sessionData.observations.studentEngagement.understandingAdvice.notes],
    ['', '', '', ''],
    // AI Enhanced Tools
    ['Use of AI-Enhanced Tools', 'AI system provides accurate information', 
     sessionData.observations.aiEnhancedTools.accurateInfo.rating,
     sessionData.observations.aiEnhancedTools.accurateInfo.notes],
    ['', 'AI tool enhances efficiency of advising session', 
     sessionData.observations.aiEnhancedTools.enhancesEfficiency.rating,
     sessionData.observations.aiEnhancedTools.enhancesEfficiency.notes],
    ['', 'Technical issues encountered during session', 
     sessionData.observations.aiEnhancedTools.technicalIssues.rating,
     sessionData.observations.aiEnhancedTools.technicalIssues.notes],
    ['', '', '', ''],
    // Communication & Interaction
    ['Communication & Interaction', 'Advisor demonstrates active listening', 
     sessionData.observations.communicationInteraction.activeListening.rating,
     sessionData.observations.communicationInteraction.activeListening.notes],
    ['', 'Advisor integrates AI output into discussion', 
     sessionData.observations.communicationInteraction.aiOutputIntegration.rating,
     sessionData.observations.communicationInteraction.aiOutputIntegration.notes],
    ['', 'Student satisfaction cues (body language, tone, feedback)', 
     sessionData.observations.communicationInteraction.studentSatisfaction.rating,
     sessionData.observations.communicationInteraction.studentSatisfaction.notes],
    ['', '', '', ''],
    // Leadership & Institutional Alignment
    ['Leadership & Institutional Alignment', 'Session aligns with ADU\'s retention and enrollment strategies', 
     sessionData.observations.leadershipAlignment.retentionStrategies.rating,
     sessionData.observations.leadershipAlignment.retentionStrategies.notes],
    ['', 'Evidence of systems thinking (coordination across services)', 
     sessionData.observations.leadershipAlignment.systemsThinking.rating,
     sessionData.observations.leadershipAlignment.systemsThinking.notes],
    ['', '', '', ''],
    ['General Notes', '', '', ''],
    ['', '', '', sessionData.generalNotes],
    ['', '', '', ''],
    ['Low Completion Justification', '', '', ''],
    ['', '', '', sessionData.lowCompletionJustification || 'N/A']
  ]

  // Create workbook
  const wb = XLSX.utils.book_new()
  
  // Add session info worksheet
  const ws1 = XLSX.utils.aoa_to_sheet(sessionInfoData)
  XLSX.utils.book_append_sheet(wb, ws1, 'Session Info')
  
  // Add observations worksheet
  const ws2 = XLSX.utils.aoa_to_sheet(observationsData)
  XLSX.utils.book_append_sheet(wb, ws2, 'Observations')

  // Add media worksheet if media exists
  if (media && media.length > 0) {
    const mediaData = generateMediaExportData(media)
    const mediaDataArray = [
      ['Media Evidence Summary', ''],
      ['Total Files:', mediaData.totalFiles.toString()],
      ['Images:', mediaData.imageCount.toString()],
      ['Videos:', mediaData.videoCount.toString()],
      ['Total Size:', formatFileSize(mediaData.totalSize)],
      ['', ''],
      ['File List', '', '', '', ''],
      ['#', 'File Name', 'Type', 'Size', 'Description', 'Uploaded At'],
      ...mediaData.files.map(file => [
        file.index,
        file.name,
        file.type,
        file.size,
        file.description,
        file.uploadedAt
      ])
    ]
    
    const ws3 = XLSX.utils.aoa_to_sheet(mediaDataArray)
    XLSX.utils.book_append_sheet(wb, ws3, 'Media Evidence')
    ws3['!cols'] = [{ width: 5 }, { width: 30 }, { width: 10 }, { width: 15 }, { width: 40 }, { width: 20 }]
  }

  // Set column widths for better readability
  ws1['!cols'] = [{ width: 20 }, { width: 30 }]
  ws2['!cols'] = [{ width: 25 }, { width: 40 }, { width: 20 }, { width: 50 }]

  // Export the file
  XLSX.writeFile(wb, `observation_session_${session.id}.xlsx`)
}

export const exportAllSessionsToExcel = (sessions) => {
  if (sessions.length === 0) {
    alert('No completed sessions to export.')
    return
  }

  // Debug: Log all sessions to see their structure
  console.log('=== EXPORT DEBUG ===')
  console.log('Total sessions to export:', sessions.length)
  sessions.forEach((session, index) => {
    console.log(`Session ${index + 1}:`, {
      id: session.id,
      studentCode: session.sessionInfo?.studentCode,
      advisor: session.sessionInfo?.advisor,
      hasJustification: !!session.lowCompletionJustification,
      justification: session.lowCompletionJustification,
      justificationLength: session.lowCompletionJustification?.length || 0,
      allKeys: Object.keys(session)
    })
  })
  console.log('=== END EXPORT DEBUG ===')



  // Create summary worksheet
  const summaryData = [
    ['All Observation Sessions Summary', '', '', '', '', '', ''],
    ['Generated on:', new Date().toLocaleDateString(), '', '', '', '', ''],
    ['Total Sessions:', sessions.length.toString(), '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['Session ID', 'Date', 'Time', 'Duration', 'Advisor', 'Student Code', 'Session Type', 'Low Completion Justification'],
    ...sessions.map(session => [
      session.id,
      session.sessionInfo?.date || '',
      session.sessionInfo?.time || '',
      session.sessionInfo?.duration ? (typeof session.sessionInfo.duration === 'number' ? 
        `${Math.floor(session.sessionInfo.duration / 60)}:${(session.sessionInfo.duration % 60).toString().padStart(2, '0')}` : 
        session.sessionInfo.duration) : '',
      session.sessionInfo?.advisor || '',
      session.sessionInfo?.studentCode || '',
      session.sessionInfo?.sessionType || '',
      session.lowCompletionJustification || 'N/A'
    ])
  ]

  // Create detailed observations worksheet
  const detailedData = [
    ['Session ID', 'Date', 'Advisor', 'Student Code', 'Category', 'Indicator/Item', 'Rating/Frequency', 'Observation Notes', 'General Notes', 'Low Completion Justification']
  ]

  sessions.forEach(session => {
    const sessionInfo = session.sessionInfo || {}
    const observations = session.observations || {}
    
          // Add observations for each category
      const categories = [
        { key: 'advisingProcess', name: 'Advising Process', items: [
          { key: 'degreeRequirements', label: 'Advisor explains degree requirements clearly' },
          { key: 'aiToolsUsage', label: 'Use of AI tools during advising' },
          { key: 'referralServices', label: 'Advisor refers student to additional support services' }
        ]},
        { key: 'studentEngagement', name: 'Student Engagement', items: [
          { key: 'questionsProactive', label: 'Student asks questions proactively' },
          { key: 'aiInteraction', label: 'Student interacts with AI system independently' },
          { key: 'understandingAdvice', label: 'Student shows understanding of advice given' }
        ]},
        { key: 'aiEnhancedTools', name: 'Use of AI-Enhanced Tools', items: [
          { key: 'accurateInfo', label: 'AI system provides accurate information' },
          { key: 'enhancesEfficiency', label: 'AI tool enhances efficiency of advising session' },
          { key: 'technicalIssues', label: 'Technical issues encountered during session' }
        ]},
        { key: 'communicationInteraction', name: 'Communication & Interaction', items: [
          { key: 'activeListening', label: 'Advisor demonstrates active listening' },
          { key: 'aiOutputIntegration', label: 'Advisor integrates AI output into discussion' },
          { key: 'studentSatisfaction', label: 'Student satisfaction cues' }
        ]},
        { key: 'leadershipAlignment', name: 'Leadership & Institutional Alignment', items: [
          { key: 'retentionStrategies', label: 'Session aligns with ADU\'s retention and enrollment strategies' },
          { key: 'systemsThinking', label: 'Evidence of systems thinking' }
        ]}
      ]

    categories.forEach(category => {
      category.items.forEach((item, index) => {
        const obsData = observations[category.key]?.[item.key] || { rating: '', notes: '' }
        detailedData.push([
          session.id,
          sessionInfo.date || '',
          sessionInfo.advisor || '',
          sessionInfo.studentCode || '',
          category.name,
          item.label,
          obsData.rating || '',
          obsData.notes || '',
          index === 0 ? (session.generalNotes || '') : '', // Only add general notes once per session
          index === 0 ? (session.lowCompletionJustification || 'N/A') : '' // Only add justification once per session
        ])
      })
    })
  })

  // Create workbook
  const wb = XLSX.utils.book_new()
  
  // Add summary worksheet
  const ws1 = XLSX.utils.aoa_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(wb, ws1, 'Sessions Summary')
  
  // Add detailed observations worksheet
  const ws2 = XLSX.utils.aoa_to_sheet(detailedData)
  XLSX.utils.book_append_sheet(wb, ws2, 'All Observations')

  // Set column widths
  ws1['!cols'] = [
    { width: 15 }, { width: 15 }, { width: 15 }, { width: 12 }, 
    { width: 20 }, { width: 15 }, { width: 18 }, { width: 50 }
  ]
  ws2['!cols'] = [
    { width: 15 }, { width: 12 }, { width: 20 }, { width: 15 }, 
    { width: 25 }, { width: 40 }, { width: 20 }, { width: 50 }, { width: 50 }, { width: 50 }
  ]

  // Export the file
  const timestamp = new Date().toISOString().split('T')[0]
  XLSX.writeFile(wb, `all_observation_sessions_${timestamp}.xlsx`)
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
