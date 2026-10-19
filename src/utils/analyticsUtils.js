import * as XLSX from 'xlsx'
import { getSessionTypeLabel } from './sessionTypeUtils.js'

// Function to create chart placeholder data for Excel
const createChartPlaceholder = (chartType, data) => {
  const placeholders = {
    'advisor-performance': [
      ['📊 ADVISOR PERFORMANCE CHART', '', '', ''],
      ['Chart Type:', 'Bar Chart', '', ''],
      ['Data Points:', data.length.toString(), '', ''],
      ['', '', '', ''],
      ['Chart Data Summary:', '', '', ''],
      ['Advisor', 'Sessions', 'Completion Rate (%)', 'Performance Level'],
      ...data.map(advisor => [
        advisor.advisor,
        advisor.sessions,
        advisor.completionRate,
        advisor.completionRate >= 90 ? 'Excellent' : 
        advisor.completionRate >= 80 ? 'Good' : 
        advisor.completionRate >= 60 ? 'Average' : 'Needs Improvement'
      ]),
      ['', '', '', ''],
      ['💡 Interactive chart available in web dashboard', '', '', ''],
      ['📈 View real-time visualizations and trends', '', '', '']
    ],
    'category-performance': [
      ['📊 CATEGORY PERFORMANCE CHART', '', '', ''],
      ['Chart Type:', 'Bar Chart', '', ''],
      ['Data Points:', data.length.toString(), '', ''],
      ['', '', '', ''],
      ['Chart Data Summary:', '', '', ''],
      ['Category', 'Completed', 'Total', 'Completion Rate (%)'],
      ...data.map(category => [
        category.category,
        category.completedObservations,
        category.totalObservations,
        category.completionRate
      ]),
      ['', '', '', ''],
      ['💡 Interactive chart available in web dashboard', '', '', ''],
      ['📈 View real-time visualizations and trends', '', '', '']
    ],
    'monthly-trends': [
      ['📊 MONTHLY TRENDS CHART', '', '', ''],
      ['Chart Type:', 'Area Chart with Line', '', ''],
      ['Data Points:', data.length.toString(), '', ''],
      ['', '', '', ''],
      ['Chart Data Summary:', '', '', ''],
      ['Month', 'Sessions', 'Completion Rate (%)', 'Trend'],
      ...data.map((trend, index) => [
        trend.month,
        trend.sessions,
        trend.completionRate,
        index > 0 ? 
          (trend.completionRate > data[index - 1].completionRate + 5 ? '↑ Improving' :
           trend.completionRate < data[index - 1].completionRate - 5 ? '↓ Declining' : 'Stable') : 'Baseline'
      ]),
      ['', '', '', ''],
      ['💡 Interactive chart available in web dashboard', '', '', ''],
      ['📈 View real-time visualizations and trends', '', '', '']
    ],
    'rating-distribution': [
      ['📊 RATING DISTRIBUTION CHART', '', '', ''],
      ['Chart Type:', 'Pie Chart', '', ''],
      ['Data Points:', data.length.toString(), '', ''],
      ['', '', '', ''],
      ['Chart Data Summary:', '', '', ''],
      ['Rating', 'Count', 'Percentage', 'Frequency'],
      ...data.map(rating => {
        const total = data.reduce((sum, item) => sum + item.value, 0)
        const percentage = ((rating.value / total) * 100).toFixed(1)
        const frequency = percentage > 20 ? 'Very Common' : 
                         percentage > 10 ? 'Common' : 
                         percentage > 5 ? 'Occasional' : 'Rare'
        return [rating.name, rating.value, `${percentage}%`, frequency]
      }),
      ['', '', '', ''],
      ['💡 Interactive chart available in web dashboard', '', '', ''],
      ['📈 View real-time visualizations and trends', '', '', '']
    ]
  }
  
  return placeholders[chartType] || [
    ['📊 CHART PLACEHOLDER', '', '', ''],
    ['Chart data available in web dashboard', '', '', '']
  ]
}

// Function to export analytics data to Excel with charts
export const exportAnalyticsToExcel = (sessions, analyticsData) => {
  try {
    // Create workbook with multiple sheets
    const workbook = XLSX.utils.book_new()
    
         // Summary sheet
     const summaryData = [
       ['Analytics Dashboard Report', '', '', ''],
       ['Generated on:', new Date().toLocaleDateString(), '', ''],
       ['', '', '', ''],
       ['Key Metrics', '', '', ''],
       ['Total Sessions:', analyticsData.totalSessions.toString(), '', ''],
       ['Average Completion Rate:', `${analyticsData.averageCompletionRate}%`, '', ''],
       ['Average Session Duration:', formatDuration(analyticsData.averageSessionDuration), '', ''],
       ['Low Completion Sessions:', analyticsData.lowCompletionSessions.toString(), '', ''],
       ['Total Observations:', analyticsData.totalObservations.toString(), '', ''],
       ['', '', '', ''],
       ['📊 Chart Information:', '', '', ''],
       ['• Chart placeholders are included in each analysis sheet', '', '', ''],
       ['• Interactive charts are available in the web dashboard', '', '', ''],
       ['• Each sheet contains detailed data and chart summaries', '', '', ''],
       ['', '', '', ''],
       ['💡 For interactive visualizations, visit the analytics dashboard', '', '', '']
     ]
    
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')
    
    // Sessions data
    const sessionsData = [
      ['Session ID', 'Date', 'Advisor', 'Student Code', 'Session Type', 'Duration (min)', 'Completion Rate (%)', 'Status']
    ]
    
    sessions.forEach(session => {
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
      
      const completionRate = Math.round((completedFields / totalFields) * 100)
      const status = completionRate < 50 ? 'Low Completion' : 'Completed'
      
      sessionsData.push([
        session.id,
        session.sessionInfo?.date || '',
        session.sessionInfo?.advisor || '',
        session.sessionInfo?.studentCode || '',
        getSessionTypeLabel(session.sessionInfo?.sessionType || ''),
        Math.floor((session.sessionInfo?.duration || 0) / 60),
        completionRate,
        status
      ])
    })
    
    const sessionsSheet = XLSX.utils.aoa_to_sheet(sessionsData)
    XLSX.utils.book_append_sheet(workbook, sessionsSheet, 'Sessions')
    
         // Advisor Performance with chart placeholder
     const advisorData = [
       ['Advisor Performance Analysis', '', '', ''],
       ['Advisor', 'Sessions', 'Completion Rate (%)', 'Performance Level']
     ]
     
     analyticsData.advisorPerformance.forEach(advisor => {
       let performanceLevel = 'Good'
       if (advisor.completionRate < 60) performanceLevel = 'Needs Improvement'
       else if (advisor.completionRate < 80) performanceLevel = 'Average'
       else if (advisor.completionRate >= 90) performanceLevel = 'Excellent'
       
       advisorData.push([
         advisor.advisor,
         advisor.sessions,
         advisor.completionRate,
         performanceLevel
       ])
     })
     
     // Add chart placeholder data
     const advisorChartData = createChartPlaceholder('advisor-performance', analyticsData.advisorPerformance)
     advisorData.push(['', '', '', '']) // Empty row
     advisorData.push(...advisorChartData)
     
     const advisorSheet = XLSX.utils.aoa_to_sheet(advisorData)
     XLSX.utils.book_append_sheet(workbook, advisorSheet, 'Advisor Performance')
    
         // Category Performance with chart placeholder
     const categoryData = [
       ['Category Performance Analysis', '', '', ''],
       ['Category', 'Completed', 'Total', 'Completion Rate (%)', 'Performance Level']
     ]
     
     analyticsData.categoryPerformance.forEach(category => {
       let performanceLevel = 'Good'
       if (category.completionRate < 60) performanceLevel = 'Needs Improvement'
       else if (category.completionRate < 80) performanceLevel = 'Average'
       else if (category.completionRate >= 90) performanceLevel = 'Excellent'
       
       categoryData.push([
         category.category,
         category.completedObservations,
         category.totalObservations,
         category.completionRate,
         performanceLevel
       ])
     })
     
     // Add chart placeholder data
     const categoryChartData = createChartPlaceholder('category-performance', analyticsData.categoryPerformance)
     categoryData.push(['', '', '', '', '']) // Empty row
     categoryData.push(...categoryChartData)
     
     const categorySheet = XLSX.utils.aoa_to_sheet(categoryData)
     XLSX.utils.book_append_sheet(workbook, categorySheet, 'Category Performance')
    
         // Monthly Trends with chart placeholder
     const trendsData = [
       ['Monthly Trends Analysis', '', '', ''],
       ['Month', 'Sessions', 'Completion Rate (%)', 'Trend']
     ]
     
     analyticsData.monthlyTrends.forEach((trend, index) => {
       let trendIndicator = 'Stable'
       if (index > 0) {
         const prevRate = analyticsData.monthlyTrends[index - 1].completionRate
         if (trend.completionRate > prevRate + 5) trendIndicator = '↑ Improving'
         else if (trend.completionRate < prevRate - 5) trendIndicator = '↓ Declining'
       }
       
       trendsData.push([
         trend.month,
         trend.sessions,
         trend.completionRate,
         trendIndicator
       ])
     })
     
     // Add chart placeholder data
     const trendsChartData = createChartPlaceholder('monthly-trends', analyticsData.monthlyTrends)
     trendsData.push(['', '', '', '']) // Empty row
     trendsData.push(...trendsChartData)
     
     const trendsSheet = XLSX.utils.aoa_to_sheet(trendsData)
     XLSX.utils.book_append_sheet(workbook, trendsSheet, 'Monthly Trends')
    
         // Rating Distribution with chart placeholder
     const ratingData = [
       ['Rating Distribution Analysis', '', '', ''],
       ['Rating', 'Count', 'Percentage', 'Frequency']
     ]
     
     const totalRatings = analyticsData.ratingDistribution.reduce((sum, item) => sum + item.value, 0)
     
     analyticsData.ratingDistribution.forEach(rating => {
       const percentage = ((rating.value / totalRatings) * 100).toFixed(1)
       let frequency = 'Rare'
       if (percentage > 20) frequency = 'Very Common'
       else if (percentage > 10) frequency = 'Common'
       else if (percentage > 5) frequency = 'Occasional'
       
       ratingData.push([
         rating.name,
         rating.value,
         `${percentage}%`,
         frequency
       ])
     })
     
     // Add chart placeholder data
     const ratingChartData = createChartPlaceholder('rating-distribution', analyticsData.ratingDistribution)
     ratingData.push(['', '', '', '']) // Empty row
     ratingData.push(...ratingChartData)
     
     const ratingSheet = XLSX.utils.aoa_to_sheet(ratingData)
     XLSX.utils.book_append_sheet(workbook, ratingSheet, 'Rating Distribution')
    
    // Set column widths for better formatting
    summarySheet['!cols'] = [
      { width: 25 }, { width: 20 }, { width: 15 }, { width: 15 }
    ]
    sessionsSheet['!cols'] = [
      { width: 15 }, { width: 12 }, { width: 20 }, { width: 15 }, { width: 20 }, { width: 15 }, { width: 20 }, { width: 15 }
    ]
    advisorSheet['!cols'] = [
      { width: 20 }, { width: 15 }, { width: 20 }, { width: 20 }
    ]
    categorySheet['!cols'] = [
      { width: 25 }, { width: 15 }, { width: 15 }, { width: 20 }, { width: 20 }
    ]
    trendsSheet['!cols'] = [
      { width: 15 }, { width: 15 }, { width: 20 }, { width: 15 }
    ]
    ratingSheet['!cols'] = [
      { width: 20 }, { width: 15 }, { width: 15 }, { width: 15 }
    ]
    
    // Export the workbook
    const timestamp = new Date().toISOString().split('T')[0]
    XLSX.writeFile(workbook, `analytics_dashboard_with_charts_${timestamp}.xlsx`)
    
  } catch (error) {
    console.error('Error exporting to Excel with charts:', error)
    // Fallback to original method if chart export fails
    exportAnalyticsToExcelFallback(sessions, analyticsData)
  }
}

// Fallback function without charts
const exportAnalyticsToExcelFallback = (sessions, analyticsData) => {
  // Create workbook with multiple sheets
  const workbook = XLSX.utils.book_new()
  
  // Summary sheet
  const summaryData = [
    ['Analytics Dashboard Report', '', '', ''],
    ['Generated on:', new Date().toLocaleDateString(), '', ''],
    ['', '', '', ''],
    ['Key Metrics', '', '', ''],
    ['Total Sessions:', analyticsData.totalSessions.toString(), '', ''],
    ['Average Completion Rate:', `${analyticsData.averageCompletionRate}%`, '', ''],
    ['Average Session Duration:', formatDuration(analyticsData.averageSessionDuration), '', ''],
    ['Low Completion Sessions:', analyticsData.lowCompletionSessions.toString(), '', ''],
    ['Total Observations:', analyticsData.totalObservations.toString(), '', ''],
    ['', '', '', ''],
    ['Note: Charts are available in the web dashboard. This export contains the raw data for analysis.', '', '', '']
  ]
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')
  
  // Sessions data
  const sessionsData = [
    ['Session ID', 'Date', 'Advisor', 'Student Code', 'Session Type', 'Duration (min)', 'Completion Rate (%)', 'Status']
  ]
  
  sessions.forEach(session => {
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
    
    const completionRate = Math.round((completedFields / totalFields) * 100)
    const status = completionRate < 50 ? 'Low Completion' : 'Completed'
    
    sessionsData.push([
      session.id,
      session.sessionInfo?.date || '',
      session.sessionInfo?.advisor || '',
      session.sessionInfo?.studentCode || '',
      getSessionTypeLabel(session.sessionInfo?.sessionType || ''),
      Math.floor((session.sessionInfo?.duration || 0) / 60),
      completionRate,
      status
    ])
  })
  
  const sessionsSheet = XLSX.utils.aoa_to_sheet(sessionsData)
  XLSX.utils.book_append_sheet(workbook, sessionsSheet, 'Sessions')
  
  // Advisor Performance
  const advisorData = [
    ['Advisor Performance Analysis', '', '', ''],
    ['Advisor', 'Sessions', 'Completion Rate (%)', 'Performance Level']
  ]
  
  analyticsData.advisorPerformance.forEach(advisor => {
    let performanceLevel = 'Good'
    if (advisor.completionRate < 60) performanceLevel = 'Needs Improvement'
    else if (advisor.completionRate < 80) performanceLevel = 'Average'
    else if (advisor.completionRate >= 90) performanceLevel = 'Excellent'
    
    advisorData.push([
      advisor.advisor,
      advisor.sessions,
      advisor.completionRate,
      performanceLevel
    ])
  })
  
  const advisorSheet = XLSX.utils.aoa_to_sheet(advisorData)
  XLSX.utils.book_append_sheet(workbook, advisorSheet, 'Advisor Performance')
  
  // Category Performance
  const categoryData = [
    ['Category Performance Analysis', '', '', ''],
    ['Category', 'Completed', 'Total', 'Completion Rate (%)', 'Performance Level']
  ]
  
  analyticsData.categoryPerformance.forEach(category => {
    let performanceLevel = 'Good'
    if (category.completionRate < 60) performanceLevel = 'Needs Improvement'
    else if (category.completionRate < 80) performanceLevel = 'Average'
    else if (category.completionRate >= 90) performanceLevel = 'Excellent'
    
    categoryData.push([
      category.category,
      category.completedObservations,
      category.totalObservations,
      category.completionRate,
      performanceLevel
    ])
  })
  
  const categorySheet = XLSX.utils.aoa_to_sheet(categoryData)
  XLSX.utils.book_append_sheet(workbook, categorySheet, 'Category Performance')
  
  // Monthly Trends
  const trendsData = [
    ['Monthly Trends Analysis', '', '', ''],
    ['Month', 'Sessions', 'Completion Rate (%)', 'Trend']
  ]
  
  analyticsData.monthlyTrends.forEach((trend, index) => {
    let trendIndicator = 'Stable'
    if (index > 0) {
      const prevRate = analyticsData.monthlyTrends[index - 1].completionRate
      if (trend.completionRate > prevRate + 5) trendIndicator = '↑ Improving'
      else if (trend.completionRate < prevRate - 5) trendIndicator = '↓ Declining'
    }
    
    trendsData.push([
      trend.month,
      trend.sessions,
      trend.completionRate,
      trendIndicator
    ])
  })
  
  const trendsSheet = XLSX.utils.aoa_to_sheet(trendsData)
  XLSX.utils.book_append_sheet(workbook, trendsSheet, 'Monthly Trends')
  
  // Rating Distribution
  const ratingData = [
    ['Rating Distribution Analysis', '', '', ''],
    ['Rating', 'Count', 'Percentage', 'Frequency']
  ]
  
  const totalRatings = analyticsData.ratingDistribution.reduce((sum, item) => sum + item.value, 0)
  
  analyticsData.ratingDistribution.forEach(rating => {
    const percentage = ((rating.value / totalRatings) * 100).toFixed(1)
    let frequency = 'Rare'
    if (percentage > 20) frequency = 'Very Common'
    else if (percentage > 10) frequency = 'Common'
    else if (percentage > 5) frequency = 'Occasional'
    
    ratingData.push([
      rating.name,
      rating.value,
      `${percentage}%`,
      frequency
    ])
  })
  
  const ratingSheet = XLSX.utils.aoa_to_sheet(ratingData)
  XLSX.utils.book_append_sheet(workbook, ratingSheet, 'Rating Distribution')
  
  // Set column widths for better formatting
  summarySheet['!cols'] = [
    { width: 25 }, { width: 20 }, { width: 15 }, { width: 15 }
  ]
  sessionsSheet['!cols'] = [
    { width: 15 }, { width: 12 }, { width: 20 }, { width: 15 }, { width: 20 }, { width: 15 }, { width: 20 }, { width: 15 }
  ]
  advisorSheet['!cols'] = [
    { width: 20 }, { width: 15 }, { width: 20 }, { width: 20 }
  ]
  categorySheet['!cols'] = [
    { width: 25 }, { width: 15 }, { width: 15 }, { width: 20 }, { width: 20 }
  ]
  trendsSheet['!cols'] = [
    { width: 15 }, { width: 15 }, { width: 20 }, { width: 15 }
  ]
  ratingSheet['!cols'] = [
    { width: 20 }, { width: 15 }, { width: 15 }, { width: 15 }
  ]
  
  // Export the workbook
  const timestamp = new Date().toISOString().split('T')[0]
  XLSX.writeFile(workbook, `analytics_dashboard_${timestamp}.xlsx`)
}

// Function to export analytics data to JSON
export const exportAnalyticsToJSON = (sessions, analyticsData) => {
  const exportData = {
    exportDate: new Date().toISOString(),
    summary: {
      totalSessions: analyticsData.totalSessions,
      averageCompletionRate: analyticsData.averageCompletionRate,
      averageSessionDuration: analyticsData.averageSessionDuration,
      lowCompletionSessions: analyticsData.lowCompletionSessions,
      totalObservations: analyticsData.totalObservations
    },
    sessions: sessions.map(session => ({
      id: session.id,
      date: session.sessionInfo?.date,
      advisor: session.sessionInfo?.advisor,
      studentCode: session.sessionInfo?.studentCode,
      sessionType: session.sessionInfo?.sessionType,
      duration: session.sessionInfo?.duration,
      observations: session.observations,
      generalNotes: session.generalNotes,
      lowCompletionJustification: session.lowCompletionJustification
    })),
    advisorPerformance: analyticsData.advisorPerformance,
    categoryPerformance: analyticsData.categoryPerformance,
    monthlyTrends: analyticsData.monthlyTrends,
    ratingDistribution: analyticsData.ratingDistribution
  }
  
  const dataStr = JSON.stringify(exportData, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = window.URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `analytics_dashboard_${new Date().toISOString().split('T')[0]}.json`
  link.click()
  window.URL.revokeObjectURL(url)
}

// Helper function to format duration
const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Helper functions (duplicates from AnalyticsDashboard for consistency)
export const calculateAnalyticsData = (sessions) => {
  if (!sessions || sessions.length === 0) {
    return {
      totalSessions: 0,
      averageCompletionRate: 0,
      averageSessionDuration: 0,
      lowCompletionSessions: 0,
      totalObservations: 0,
      completionTrends: [],
      categoryPerformance: [],
      advisorPerformance: [],
      monthlyTrends: [],
      ratingDistribution: []
    }
  }

  // Calculate completion rates
  const completionRates = sessions.map(session => {
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
    
    return (completedFields / totalFields) * 100
  })

  const averageCompletionRate = completionRates.length > 0 
    ? completionRates.reduce((sum, rate) => sum + rate, 0) / completionRates.length 
    : 0

  // Calculate session durations
  const durations = sessions
    .map(session => session.sessionInfo?.duration || 0)
    .filter(duration => duration > 0)
  
  const averageSessionDuration = durations.length > 0 
    ? durations.reduce((sum, duration) => sum + duration, 0) / durations.length 
    : 0

  // Count low completion sessions
  const lowCompletionSessions = completionRates.filter(rate => rate < 50).length

  // Calculate category performance
  const categoryPerformance = calculateCategoryPerformance(sessions)

  // Calculate advisor performance
  const advisorPerformance = calculateAdvisorPerformance(sessions)

  // Calculate monthly trends
  const monthlyTrends = calculateMonthlyTrends(sessions)

  // Calculate rating distribution
  const ratingDistribution = calculateRatingDistribution(sessions)

  return {
    totalSessions: sessions.length,
    averageCompletionRate: Math.round(averageCompletionRate * 10) / 10,
    averageSessionDuration: Math.round(averageSessionDuration),
    lowCompletionSessions,
    totalObservations: sessions.length * 13,
    completionTrends: completionRates,
    categoryPerformance,
    advisorPerformance,
    monthlyTrends,
    ratingDistribution
  }
}

const calculateCategoryPerformance = (sessions) => {
  const categories = {
    'Advising Process': { completed: 0, total: 0 },
    'Student Engagement': { completed: 0, total: 0 },
    'AI Tools': { completed: 0, total: 0 },
    'Communication': { completed: 0, total: 0 },
    'Leadership': { completed: 0, total: 0 }
  }

  sessions.forEach(session => {
    if (session.observations) {
      // Advising Process
      Object.values(session.observations.advisingProcess || {}).forEach(field => {
        categories['Advising Process'].total++
        if (field.rating && field.rating.trim() !== '') {
          categories['Advising Process'].completed++
        }
      })

      // Student Engagement
      Object.values(session.observations.studentEngagement || {}).forEach(field => {
        categories['Student Engagement'].total++
        if (field.rating && field.rating.trim() !== '') {
          categories['Student Engagement'].completed++
        }
      })

      // AI Tools
      Object.values(session.observations.aiEnhancedTools || {}).forEach(field => {
        categories['AI Tools'].total++
        if (field.rating && field.rating.trim() !== '') {
          categories['AI Tools'].completed++
        }
      })

      // Communication
      Object.values(session.observations.communicationInteraction || {}).forEach(field => {
        categories['Communication'].total++
        if (field.rating && field.rating.trim() !== '') {
          categories['Communication'].completed++
        }
      })

      // Leadership
      Object.values(session.observations.leadershipAlignment || {}).forEach(field => {
        categories['Leadership'].total++
        if (field.rating && field.rating.trim() !== '') {
          categories['Leadership'].completed++
        }
      })
    }
  })

  return Object.entries(categories).map(([category, data]) => ({
    category,
    completedObservations: data.completed,
    totalObservations: data.total,
    completionRate: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0
  }))
}

const calculateAdvisorPerformance = (sessions) => {
  const advisorData = {}

  sessions.forEach(session => {
    const advisor = session.sessionInfo?.advisor || 'Unknown'
    if (!advisorData[advisor]) {
      advisorData[advisor] = { sessions: 0, totalFields: 0, completedFields: 0 }
    }

    advisorData[advisor].sessions++
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

    advisorData[advisor].totalFields += totalFields
    advisorData[advisor].completedFields += completedFields
  })

  return Object.entries(advisorData).map(([advisor, data]) => ({
    advisor,
    sessions: data.sessions,
    completionRate: Math.round((data.completedFields / data.totalFields) * 100)
  })).sort((a, b) => b.completionRate - a.completionRate)
}

const calculateMonthlyTrends = (sessions) => {
  const dailyData = {}

  sessions.forEach(session => {
    const date = new Date(session.createdAt)
    const dayKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    
    if (!dailyData[dayKey]) {
      dailyData[dayKey] = { sessions: 0, totalFields: 0, completedFields: 0 }
    }

    dailyData[dayKey].sessions++
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

    dailyData[dayKey].totalFields += totalFields
    dailyData[dayKey].completedFields += completedFields
  })

  return Object.entries(dailyData)
    .map(([day, data]) => ({
      month: day, // Keep 'month' key for compatibility with existing chart
      sessions: data.sessions,
      completionRate: Math.round((data.completedFields / data.totalFields) * 100)
    }))
    .sort((a, b) => a.month.localeCompare(b.month))
}

const calculateRatingDistribution = (sessions) => {
  const ratingCounts = {}

  sessions.forEach(session => {
    if (session.observations) {
      Object.values(session.observations).forEach(category => {
        Object.values(category).forEach(field => {
          if (field.rating && field.rating.trim() !== '') {
            ratingCounts[field.rating] = (ratingCounts[field.rating] || 0) + 1
          }
        })
      })
    }
  })

  return Object.entries(ratingCounts).map(([rating, count]) => ({
    name: rating,
    value: count
  })).sort((a, b) => b.value - a.value)
}

// Enhanced Analytics Functions - Phase 1
export const calculateCorrelationAnalysis = (sessions) => {
  if (!sessions || sessions.length === 0) {
    return {
      durationVsCompletion: { correlation: 0, data: [], insight: 'No data available' },
      timeOfDayVsSuccess: { correlation: 0, data: [], insight: 'No data available' },
      sessionTypeVsCompletion: { data: [], insight: 'No data available' }
    }
  }

  // Helper function to calculate completion rate from observations
  const calculateCompletionRate = (session) => {
    if (session.completionRate !== undefined) {
      return session.completionRate
    }
    
    // Fallback calculation if completionRate is not stored
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
    
    return (completedFields / totalFields) * 100
  }

  // Duration vs Completion Rate correlation
  const durationVsCompletion = sessions
    .filter(session => session.sessionInfo?.duration)
    .map(session => ({
      duration: Math.round(session.sessionInfo.duration / 60), // Convert to minutes
      completionRate: calculateCompletionRate(session),
      sessionId: session.id
    }))

  // Time of Day vs Success Rate
  const timeOfDayVsSuccess = sessions
    .filter(session => session.createdAt)
    .map(session => {
      const hour = new Date(session.createdAt).getHours()
      const timeSlot = hour < 12 ? 'Morning (6-12)' : 
                      hour < 17 ? 'Afternoon (12-17)' : 'Evening (17-22)'
      return {
        timeSlot,
        completionRate: calculateCompletionRate(session),
        hour,
        sessionId: session.id
      }
    })

  // Session Type vs Completion Rate
  const sessionTypeVsCompletion = sessions
    .filter(session => session.sessionInfo?.sessionType)
    .map(session => ({
      sessionType: session.sessionInfo.sessionType,
      completionRate: calculateCompletionRate(session),
      sessionId: session.id
    }))

  // Calculate correlations
  const durationCorrelation = calculatePearsonCorrelation(
    durationVsCompletion.map(d => d.duration),
    durationVsCompletion.map(d => d.completionRate)
  )

  const timeCorrelation = calculatePearsonCorrelation(
    timeOfDayVsSuccess.map(t => t.hour),
    timeOfDayVsSuccess.map(t => t.completionRate)
  )

  return {
    durationVsCompletion: {
      correlation: durationCorrelation,
      data: durationVsCompletion,
      insight: getCorrelationInsight(durationCorrelation, 'Duration', 'Completion Rate')
    },
    timeOfDayVsSuccess: {
      correlation: timeCorrelation,
      data: timeOfDayVsSuccess,
      insight: getCorrelationInsight(timeCorrelation, 'Time of Day', 'Completion Rate')
    },
    sessionTypeVsCompletion: {
      data: sessionTypeVsCompletion,
      insight: 'Session type analysis shows patterns in completion rates'
    }
  }
}

// Calculate Pearson correlation coefficient
const calculatePearsonCorrelation = (x, y) => {
  if (x.length !== y.length || x.length < 2) return 0
  
  const n = x.length
  const sumX = x.reduce((a, b) => a + b, 0)
  const sumY = y.reduce((a, b) => a + b, 0)
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0)
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0)
  
  const numerator = n * sumXY - sumX * sumY
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))
  
  return denominator === 0 ? 0 : numerator / denominator
}

// Generate correlation insights
const getCorrelationInsight = (correlation, variable1, variable2) => {
  const absCorr = Math.abs(correlation)
  if (absCorr < 0.1) return `No significant relationship between ${variable1} and ${variable2}`
  if (absCorr < 0.3) return `Weak relationship between ${variable1} and ${variable2}`
  if (absCorr < 0.5) return `Moderate relationship between ${variable1} and ${variable2}`
  if (absCorr < 0.7) return `Strong relationship between ${variable1} and ${variable2}`
  return `Very strong relationship between ${variable1} and ${variable2}`
}

// Enhanced trend analysis
export const calculateEnhancedTrends = (sessions) => {
  if (!sessions || sessions.length === 0) {
    return {
      seasonalPatterns: [],
      performanceTrajectories: [],
      anomalies: []
    }
  }

  // Helper function to calculate completion rate from observations
  const calculateCompletionRate = (session) => {
    if (session.completionRate !== undefined) {
      return session.completionRate
    }
    
    // Fallback calculation if completionRate is not stored
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
    
    return (completedFields / totalFields) * 100
  }

  // Seasonal patterns - academic calendar impact
  const seasonalPatterns = calculateSeasonalPatterns(sessions, calculateCompletionRate)

  // Performance trajectories for individual advisors
  const performanceTrajectories = calculatePerformanceTrajectories(sessions, calculateCompletionRate)

  // Anomaly detection
  const anomalies = detectAnomalies(sessions, calculateCompletionRate)

  return {
    seasonalPatterns,
    performanceTrajectories,
    anomalies
  }
}

// Calculate seasonal patterns based on academic calendar
const calculateSeasonalPatterns = (sessions, calculateCompletionRate) => {
  const seasonalData = {
    'Fall Semester': { sessions: 0, totalCompletion: 0 },
    'Spring Semester': { sessions: 0, totalCompletion: 0 },
    'Summer Session': { sessions: 0, totalCompletion: 0 }
  }

  sessions.forEach(session => {
    const date = new Date(session.createdAt)
    const month = date.getMonth() + 1
    
    let season = 'Other'
    if (month >= 8 && month <= 12) season = 'Fall Semester'
    else if (month >= 1 && month <= 5) season = 'Spring Semester'
    else if (month >= 6 && month <= 7) season = 'Summer Session'
    
    if (seasonalData[season]) {
      seasonalData[season].sessions++
      seasonalData[season].totalCompletion += calculateCompletionRate(session)
    }
  })

  // Calculate averages with more precision
  Object.keys(seasonalData).forEach(season => {
    if (seasonalData[season].sessions > 0) {
      seasonalData[season].avgCompletion = Math.round(
        seasonalData[season].totalCompletion / seasonalData[season].sessions
      )
    }
  })

  // Filter out seasons with no data and add realistic session counts for visualization
  return Object.entries(seasonalData)
    .filter(([season, data]) => data.sessions > 0) // Only show seasons with actual data
    .map(([season, data]) => ({
      season,
      sessions: data.sessions,
      avgCompletion: data.avgCompletion || 0,
      trend: data.avgCompletion > 75 ? 'High' : data.avgCompletion > 60 ? 'Medium' : 'Low'
    }))
    .sort((a, b) => b.sessions - a.sessions) // Sort by session count for better visualization
}

// Calculate performance trajectories for individual advisors
const calculatePerformanceTrajectories = (sessions, calculateCompletionRate) => {
  const advisorData = {}

  sessions.forEach(session => {
    const advisor = session.sessionInfo?.advisor || 'Unknown'
    const date = new Date(session.createdAt)
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    
    if (!advisorData[advisor]) {
      advisorData[advisor] = {}
    }
    
    if (!advisorData[advisor][month]) {
      advisorData[advisor][month] = { sessions: 0, totalCompletion: 0 }
    }
    
    advisorData[advisor][month].sessions++
    advisorData[advisor][month].totalCompletion += calculateCompletionRate(session)
  })

  return Object.entries(advisorData)
    .filter(([advisor, months]) => {
      // More inclusive filtering - include advisors with at least 1 month of data
      const monthCount = Object.keys(months).length
      return monthCount >= 1 // Reduced from 2 to 1 for more inclusive results
    })
    .map(([advisor, months]) => {
      const monthData = Object.entries(months)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, data]) => ({
          month,
          avgCompletion: Math.round(data.totalCompletion / data.sessions),
          sessions: data.sessions
        }))

      // Calculate trajectory with more sensitive thresholds for better accuracy
      let trajectory = 'Stable'
      if (monthData.length >= 2) {
        const first = monthData[0].avgCompletion
        const last = monthData[monthData.length - 1].avgCompletion
        const change = last - first
        
        // More sensitive thresholds for better trend detection
        if (change > 3) trajectory = 'Improving'
        else if (change < -3) trajectory = 'Declining'
      } else {
        // For single month data, determine trajectory based on performance level
        const avgCompletion = monthData[0]?.avgCompletion || 0
        if (avgCompletion >= 80) trajectory = 'High Performance'
        else if (avgCompletion >= 60) trajectory = 'Good Performance'
        else trajectory = 'Needs Improvement'
      }

      return {
        advisor,
        trajectory,
        monthData,
        overallTrend: monthData.length > 0 ? 
          Math.round(monthData.reduce((sum, m) => sum + m.avgCompletion, 0) / monthData.length) : 0
      }
    })
    .sort((a, b) => b.overallTrend - a.overallTrend) // Sort by overall performance
}

// Detect anomalies in the data
const detectAnomalies = (sessions, calculateCompletionRate) => {
  const anomalies = []
  
  // Detect unusual completion rates
  const completionRates = sessions.map(s => calculateCompletionRate(s))
  
  if (completionRates.length > 0) {
    const mean = completionRates.reduce((a, b) => a + b, 0) / completionRates.length
    const variance = completionRates.reduce((sum, rate) => sum + Math.pow(rate - mean, 2), 0) / completionRates.length
    const stdDev = Math.sqrt(variance)
    
    // More sensitive anomaly detection for better accuracy
    // Flag sessions with completion rates 1.5 standard deviations from mean (more sensitive)
    sessions.forEach(session => {
      const completionRate = calculateCompletionRate(session)
      const zScore = Math.abs((completionRate - mean) / stdDev)
      
      // More sensitive thresholds for better anomaly detection
      if (zScore > 1.5) {
        anomalies.push({
          type: 'Unusual Completion Rate',
          sessionId: session.id,
          advisor: session.sessionInfo?.advisor || 'Unknown',
          value: completionRate,
          expected: `${Math.round(mean)}% ± ${Math.round(stdDev)}%`,
          severity: zScore > 2.5 ? 'High' : 'Medium',
          date: session.createdAt
        })
      }
    })
  }

  return anomalies
}
