import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import Logo from '@/assets/Logo Mousa.png'

// PDF Export Utility for Observation Tool
class PDFExporter {
  constructor() {
    this.doc = null
    this.currentY = 0
    this.margin = 20
    this.pageWidth = 210
    this.contentWidth = this.pageWidth - (this.margin * 2)
  }

  // Initialize new PDF document
  initDocument(title = 'Observation Report') {
    this.doc = new jsPDF('p', 'mm', 'a4')
    this.currentY = this.margin
    
    // Add header
    this.addHeader(title)
    
    return this.doc
  }

  // Add professional header
  addHeader(title) {
    // Title area (left side)
    this.doc.setFontSize(24)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(44, 62, 80) // Dark blue-gray
    this.doc.text('ADU Observation Tool', this.margin, this.currentY + 8)
    
    this.currentY += 8
    
    // Subtitle
    this.doc.setFontSize(16)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setTextColor(52, 73, 94) // Lighter blue-gray
    this.doc.text(title, this.margin, this.currentY + 8)
    
    this.currentY += 15
    
    // Date and time
    this.doc.setFontSize(10)
    this.doc.setTextColor(127, 140, 141) // Gray
    const now = new Date()
    this.doc.text(`Generated on: ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`, this.margin, this.currentY + 8)
    
    // Add logo on the right side
    try {
      this.doc.addImage(Logo, 'PNG', this.pageWidth - this.margin - 50, this.currentY - 35, 50, 50)
    } catch (error) {
      console.warn('Could not load logo for PDF:', error)
    }
    
    this.currentY += 20
  }

  // Add section header
  addSectionHeader(text, color = [44, 62, 80]) {
    this.checkPageBreak(15)
    
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(...color)
    this.doc.text(text, this.margin, this.currentY)
    
    this.currentY += 8
    
    // Add underline
    this.doc.setDrawColor(...color)
    this.doc.setLineWidth(0.5)
    this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY)
    
    this.currentY += 10
  }

  // Add subsection header
  addSubSectionHeader(text, color = [59, 130, 246]) {
    this.checkPageBreak(12)
    
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(...color)
    this.doc.text(text, this.margin, this.currentY)
    
    this.currentY += 6
    
    // Add subtle underline
    this.doc.setDrawColor(...color)
    this.doc.setLineWidth(0.3)
    this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY)
    
    this.currentY += 8
  }

  // Add text content
  addText(text, fontSize = 11, color = [52, 73, 94]) {
    this.checkPageBreak(10)
    
    this.doc.setFontSize(fontSize)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setTextColor(...color)
    
    // Split text into lines that fit the page width
    const lines = this.doc.splitTextToSize(text, this.contentWidth)
    
    lines.forEach(line => {
      this.doc.text(line, this.margin, this.currentY)
      this.currentY += 5
    })
    
    this.currentY += 5
  }

  // Add key-value pair
  addKeyValue(key, value, fontSize = 11) {
    this.checkPageBreak(10)
    
    this.doc.setFontSize(fontSize)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(44, 62, 80)
    this.doc.text(`${key}:`, this.margin, this.currentY)
    
    const keyWidth = this.doc.getTextWidth(`${key}:`)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setTextColor(52, 73, 94)
    
    // Split value text if it's too long
    const valueLines = this.doc.splitTextToSize(value, this.contentWidth - keyWidth - 5)
    
    valueLines.forEach((line, index) => {
      const xPos = index === 0 ? this.margin + keyWidth + 5 : this.margin + keyWidth + 15
      this.doc.text(line, xPos, this.currentY)
      this.currentY += 5
    })
    
    this.currentY += 3
  }

  // Add table
  addTable(headers, data, title = '') {
    this.checkPageBreak(50)
    
    if (title) {
      this.addText(title, 12, [44, 62, 80])
    }
    
    autoTable(this.doc, {
      head: [headers],
      body: data,
      startY: this.currentY,
      margin: { left: this.margin },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineColor: [44, 62, 80],
        lineWidth: 0.1,
        textColor: [52, 73, 94],
        font: 'helvetica'
      },
      headStyles: {
        fillColor: [44, 62, 80],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      }
    })
    
    this.currentY = this.doc.lastAutoTable.finalY + 10
  }

  // Add observation category
  addObservationCategory(categoryName, observations) {
    this.checkPageBreak(30)
    
    this.addSectionHeader(categoryName, [52, 73, 94])
    
    Object.entries(observations).forEach(([field, data]) => {
      if (data.rating) {
        this.addKeyValue(
          data.label || field,
          `${data.rating}${data.notes ? ` - ${data.notes}` : ''}`
        )
      }
    })
  }

  // Add media evidence section
  addMediaEvidence(media) {
    if (!media || media.length === 0) return
    
    this.checkPageBreak(30)
    
    this.addSectionHeader('Media Evidence', [52, 73, 94])
    
         const mediaData = media.map((file, index) => [
       `${index + 1}`,
       file.name,
       this.formatFileSize(file.size),
       file.type,
       file.description || 'No description',
       new Date(file.uploadedAt).toLocaleDateString(),
       file.localPath ? 'Saved locally' : 'Browser storage'
     ])
    
         this.addTable(
       ['#', 'File Name', 'Size', 'Type', 'Description', 'Upload Date', 'Storage'],
       mediaData,
       'Uploaded Media Files'
     )
  }

  // Add analytics summary (simplified without charts)
  addAnalyticsSummary(analyticsData) {
    this.checkPageBreak(50)
    
    this.addSectionHeader('Analytics Summary', [44, 62, 80])
    
    // Key metrics
    const metricsData = [
      ['Total Sessions', analyticsData.totalSessions.toString()],
      ['Average Completion Rate', `${analyticsData.averageCompletionRate}%`],
      ['Average Session Duration', this.formatDuration(analyticsData.averageSessionDuration)],
      ['Low Completion Sessions', analyticsData.lowCompletionSessions.toString()]
    ]
    
    this.addTable(['Metric', 'Value'], metricsData, 'Key Performance Metrics')
  }

  // Add AI insights
  addAIInsights(insights) {
    if (!insights || insights.length === 0) return
    
    this.checkPageBreak(50)
    
    this.addSectionHeader('AI-Powered Insights', [44, 62, 80])
    
    insights.forEach((insight, index) => {
      this.checkPageBreak(25)
      
      // Insight title
      this.doc.setFontSize(12)
      this.doc.setFont('helvetica', 'bold')
      this.doc.setTextColor(44, 62, 80)
      this.doc.text(`${index + 1}. ${insight.title}`, this.margin, this.currentY)
      
      this.currentY += 6
      
      // Insight category
      this.doc.setFontSize(9)
      this.doc.setFont('helvetica', 'italic')
      this.doc.setTextColor(127, 140, 141)
      this.doc.text(`Category: ${insight.category} | Priority: ${insight.priority}`, this.margin, this.currentY)
      
      this.currentY += 6
      
      // Insight description
      this.doc.setFontSize(10)
      this.doc.setFont('helvetica', 'normal')
      this.doc.setTextColor(52, 73, 94)
      
      const lines = this.doc.splitTextToSize(insight.description, this.contentWidth)
      lines.forEach(line => {
        this.doc.text(line, this.margin, this.currentY)
        this.currentY += 5
      })
      
      this.currentY += 8
    })
  }

  // Check if we need a page break
  checkPageBreak(requiredSpace) {
    if (this.currentY + requiredSpace > 280) {
      this.doc.addPage()
      this.currentY = this.margin
    }
  }

  // Format file size
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Format duration
  formatDuration(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Save the PDF
  save(filename) {
    this.doc.save(filename)
  }
}

// Export individual session to PDF
export const exportSessionToPDF = (session) => {
  const exporter = new PDFExporter()
  exporter.initDocument(`Session Report - ${session.sessionInfo?.advisor || 'Unknown Advisor'}`)
  
  // Session Information
  exporter.addSectionHeader('Session Information', [44, 62, 80])
  
  exporter.addKeyValue('Session ID', session.id)
  exporter.addKeyValue('Advisor', session.sessionInfo?.advisor || 'Not specified')
  exporter.addKeyValue('Date', session.sessionInfo?.date ? new Date(session.sessionInfo.date).toLocaleDateString() : 'Not specified')
  exporter.addKeyValue('Duration', session.sessionInfo?.duration ? exporter.formatDuration(session.sessionInfo.duration) : 'Not specified')
  exporter.addKeyValue('Status', session.status || 'Unknown')
  exporter.addKeyValue('Completion Rate', `${Math.round(session.completionRate || 0)}%`)
  
  if (session.completedAt) {
    exporter.addKeyValue('Completed At', new Date(session.completedAt).toLocaleString())
  }
  
  if (session.lowCompletionJustification) {
    exporter.addKeyValue('Low Completion Justification', session.lowCompletionJustification)
  }
  
  // Observations
  if (session.observations) {
    exporter.addSectionHeader('Observations', [44, 62, 80])
    
    Object.entries(session.observations).forEach(([category, observations]) => {
      exporter.addObservationCategory(
        category.replace(/([A-Z])/g, ' $1').trim(),
        observations
      )
    })
  }
  
  // Media Evidence
  if (session.media && session.media.length > 0) {
    exporter.addMediaEvidence(session.media)
  }
  
  // General Notes
  if (session.generalNotes) {
    exporter.addSectionHeader('General Notes', [44, 62, 80])
    exporter.addText(session.generalNotes)
  }
  
  // Save the PDF
  const filename = `session_${session.id}_${new Date().toISOString().split('T')[0]}.pdf`
  exporter.save(filename)
}

// Export analytics to PDF (simplified)
export const exportAnalyticsToPDF = async (sessions, analyticsData, insights = []) => {
  const exporter = new PDFExporter()
  exporter.initDocument('Analytics Report')
  
  // Analytics Summary
  exporter.addAnalyticsSummary(analyticsData)
  
  // AI Insights
  exporter.addAIInsights(insights)
  
  // Session List
  if (sessions && sessions.length > 0) {
    exporter.addSectionHeader('Session Details', [44, 62, 80])
    
    const sessionData = sessions.map(session => [
      session.id,
      session.sessionInfo?.advisor || 'Unknown',
      session.sessionInfo?.date ? new Date(session.sessionInfo.date).toLocaleDateString() : 'N/A',
      session.status || 'Unknown',
      `${Math.round(session.completionRate || 0)}%`,
      session.sessionInfo?.duration ? exporter.formatDuration(session.sessionInfo.duration) : 'N/A'
    ])
    
    exporter.addTable(
      ['Session ID', 'Advisor', 'Date', 'Status', 'Completion Rate', 'Duration'],
      sessionData,
      'All Sessions'
    )
  }
  
  // Save the PDF
  const filename = `analytics_report_${new Date().toISOString().split('T')[0]}.pdf`
  exporter.save(filename)
}

// Export comprehensive report with ALL analytics data
export const exportComprehensiveReport = async (sessions, analyticsData, insights = []) => {
  const exporter = new PDFExporter()
  exporter.initDocument('Comprehensive Analytics Dashboard Report')
  
  // Executive Summary
  exporter.addSectionHeader('Executive Summary', [44, 62, 80])
  exporter.addText(`This comprehensive analytics report covers ${sessions.length} observation sessions conducted across the institution. The analysis provides detailed insights into advisor performance, observation patterns, completion trends, category performance, and strategic recommendations for improvement.`)
  
  // Enhanced Analytics Overview with ALL metrics
  exporter.addSectionHeader('Comprehensive Analytics Overview', [44, 62, 80])
  
  // Key Performance Indicators
  exporter.addSubSectionHeader('Key Performance Indicators', [59, 130, 246])
  exporter.addKeyValue('Total Sessions Analyzed', analyticsData.totalSessions.toString())
  exporter.addKeyValue('Average Completion Rate', `${analyticsData.averageCompletionRate}%`)
  exporter.addKeyValue('Average Session Duration', exporter.formatDuration(analyticsData.averageSessionDuration))
  exporter.addKeyValue('Low Completion Sessions (<50%)', analyticsData.lowCompletionSessions.toString())
  exporter.addKeyValue('Total Observations', analyticsData.totalObservations.toString())
  
  // Completion Rate Analysis
  if (analyticsData.completionTrends && analyticsData.completionTrends.length > 0) {
    exporter.addSubSectionHeader('Completion Rate Analysis', [59, 130, 246])
    
    const highCompletion = analyticsData.completionTrends.filter(rate => rate >= 90).length
    const goodCompletion = analyticsData.completionTrends.filter(rate => rate >= 80 && rate < 90).length
    const averageCompletion = analyticsData.completionTrends.filter(rate => rate >= 60 && rate < 80).length
    const lowCompletion = analyticsData.completionTrends.filter(rate => rate < 60).length
    
    exporter.addKeyValue('Excellent (90%+)', `${highCompletion} sessions (${((highCompletion / analyticsData.totalSessions) * 100).toFixed(1)}%)`)
    exporter.addKeyValue('Good (80-89%)', `${goodCompletion} sessions (${((goodCompletion / analyticsData.totalSessions) * 100).toFixed(1)}%)`)
    exporter.addKeyValue('Average (60-79%)', `${averageCompletion} sessions (${((averageCompletion / analyticsData.totalSessions) * 100).toFixed(1)}%)`)
    exporter.addKeyValue('Needs Improvement (<60%)', `${lowCompletion} sessions (${((lowCompletion / analyticsData.totalSessions) * 100).toFixed(1)}%)`)
  }
  
  // Category Performance Analysis
  if (analyticsData.categoryPerformance && analyticsData.categoryPerformance.length > 0) {
    exporter.addSubSectionHeader('Category Performance Analysis', [59, 130, 246])
    
    const categoryData = analyticsData.categoryPerformance.map(cat => [
      cat.category.replace(/([A-Z])/g, ' $1').trim(),
      cat.completedObservations.toString(),
      cat.totalObservations.toString(),
      `${cat.completionRate.toFixed(1)}%`,
      cat.completionRate >= 90 ? 'Excellent' : 
      cat.completionRate >= 80 ? 'Good' : 
      cat.completionRate >= 60 ? 'Average' : 'Needs Improvement'
    ])
    
    exporter.addTable(
      ['Category', 'Completed', 'Total', 'Completion Rate', 'Performance Level'],
      categoryData,
      'Category Performance Summary'
    )
  }
  
  // Advisor Performance Analysis
  if (analyticsData.advisorPerformance && analyticsData.advisorPerformance.length > 0) {
    exporter.addSubSectionHeader('Advisor Performance Analysis', [59, 130, 246])
    
    const advisorData = analyticsData.advisorPerformance.map(advisor => [
      advisor.advisor,
      advisor.sessions.toString(),
      `${advisor.completionRate.toFixed(1)}%`,
      advisor.completionRate >= 90 ? 'Excellent' : 
      advisor.completionRate >= 80 ? 'Good' : 
      advisor.completionRate >= 60 ? 'Average' : 'Needs Improvement'
    ])
    
    exporter.addTable(
      ['Advisor', 'Sessions', 'Completion Rate', 'Performance Level'],
      advisorData,
      'Advisor Performance Summary'
    )
  }
  
  // Monthly Trends Analysis
  if (analyticsData.monthlyTrends && analyticsData.monthlyTrends.length > 0) {
    exporter.addSubSectionHeader('Monthly Trends Analysis', [59, 130, 246])
    
    const trendsData = analyticsData.monthlyTrends.map((trend, index) => {
      let trendIndicator = 'Baseline'
      if (index > 0) {
        const prevRate = analyticsData.monthlyTrends[index - 1].completionRate
        if (trend.completionRate > prevRate + 5) trendIndicator = '↑ Improving'
        else if (trend.completionRate < prevRate - 5) trendIndicator = '↓ Declining'
        else trendIndicator = '→ Stable'
      }
      
      return [
        trend.month,
        trend.sessions.toString(),
        `${trend.completionRate.toFixed(1)}%`,
        trendIndicator
      ]
    })
    
    exporter.addTable(
      ['Month', 'Sessions', 'Completion Rate', 'Trend'],
      trendsData,
      'Monthly Performance Trends'
    )
  }
  
  // Rating Distribution Analysis
  if (analyticsData.ratingDistribution && analyticsData.ratingDistribution.length > 0) {
    exporter.addSubSectionHeader('Rating Distribution Analysis', [59, 130, 246])
    
    const totalRatings = analyticsData.ratingDistribution.reduce((sum, item) => sum + item.value, 0)
    const ratingData = analyticsData.ratingDistribution.map(rating => {
      const percentage = ((rating.value / totalRatings) * 100).toFixed(1)
      const frequency = percentage > 20 ? 'Very Common' : 
                       percentage > 10 ? 'Common' : 
                       percentage > 5 ? 'Occasional' : 'Rare'
      return [
        rating.name,
        rating.value.toString(),
        `${percentage}%`,
        frequency
      ]
    })
    
    exporter.addTable(
      ['Rating', 'Count', 'Percentage', 'Frequency'],
      ratingData,
      'Rating Distribution Summary'
    )
  }
  
  // AI Insights with Enhanced Details
  if (insights && insights.length > 0) {
    exporter.addSectionHeader('AI-Powered Insights & Recommendations', [44, 62, 80])
    
    insights.forEach((insight, index) => {
      exporter.addSubSectionHeader(`${index + 1}. ${insight.title}`, [59, 130, 246])
      
      exporter.addKeyValue('Category', insight.category)
      exporter.addKeyValue('Priority', insight.priority)
      exporter.addKeyValue('Description', insight.description)
      
      if (insight.actions && insight.actions.length > 0) {
        exporter.addText('Recommended Actions:', 10, [44, 62, 80])
        insight.actions.forEach(action => {
          exporter.addText(`• ${action}`, 9, [52, 73, 94])
        })
      }
      
      exporter.currentY += 5
    })
  }
  
  // Detailed Session Analysis
  if (sessions && sessions.length > 0) {
    exporter.addSectionHeader('Detailed Session Analysis', [44, 62, 80])
    
    // Session Summary Table
    const sessionSummaryData = sessions.map(session => [
      session.id,
      session.sessionInfo?.advisor || 'Unknown',
      session.sessionInfo?.date ? new Date(session.sessionInfo.date).toLocaleDateString() : 'Not specified',
      session.status || 'Unknown',
      `${Math.round(session.completionRate || 0)}%`,
      session.sessionInfo?.duration ? exporter.formatDuration(session.sessionInfo.duration) : 'N/A',
      session.media && session.media.length > 0 ? `${session.media.length} files` : 'None'
    ])
    
    exporter.addTable(
      ['Session ID', 'Advisor', 'Date', 'Status', 'Completion Rate', 'Duration', 'Media Files'],
      sessionSummaryData,
      'All Sessions Summary'
    )
    
    // Individual Session Details (Top 10 for space)
    exporter.addSubSectionHeader('Individual Session Details (Top 10)', [59, 130, 246])
    
    sessions.slice(0, 10).forEach((session, index) => {
      exporter.addSubSectionHeader(`Session ${index + 1}: ${session.sessionInfo?.advisor || 'Unknown Advisor'}`, [52, 73, 94])
      
      exporter.addKeyValue('Session ID', session.id)
      exporter.addKeyValue('Date', session.sessionInfo?.date ? new Date(session.sessionInfo.date).toLocaleDateString() : 'Not specified')
      exporter.addKeyValue('Status', session.status || 'Unknown')
      exporter.addKeyValue('Completion Rate', `${Math.round(session.completionRate || 0)}%`)
      exporter.addKeyValue('Duration', session.sessionInfo?.duration ? exporter.formatDuration(session.sessionInfo.duration) : 'Not specified')
      
      if (session.lowCompletionJustification) {
        exporter.addKeyValue('Low Completion Justification', session.lowCompletionJustification)
      }
      
      // Detailed Observations
      if (session.observations) {
        exporter.addText('Observations by Category:', 10, [44, 62, 80])
        
        Object.entries(session.observations).forEach(([category, observations]) => {
          const completedCount = Object.values(observations).filter(obs => obs.rating && obs.rating.trim() !== '').length
          const totalCount = Object.keys(observations).length
          const completionRate = totalCount > 0 ? ((completedCount / totalCount) * 100).toFixed(1) : '0.0'
          
          exporter.addKeyValue(
            category.replace(/([A-Z])/g, ' $1').trim(),
            `${completedCount}/${totalCount} completed (${completionRate}%)`
          )
        })
      }
      
      if (session.media && session.media.length > 0) {
        exporter.addKeyValue('Media Files', `${session.media.length} files attached`)
      }
      
      if (session.generalNotes) {
        exporter.addKeyValue('General Notes', session.generalNotes)
      }
      
      exporter.currentY += 10
    })
  }
  
  // Strategic Recommendations
  exporter.addSectionHeader('Strategic Recommendations', [44, 62, 80])
  
  // Generate recommendations based on analytics data
  if (analyticsData.averageCompletionRate < 80) {
    exporter.addText('• Focus on improving completion rates through better training and process optimization', 10, [52, 73, 94])
  }
  
  if (analyticsData.lowCompletionSessions > analyticsData.totalSessions * 0.2) {
    exporter.addText('• High number of low-completion sessions indicates need for intervention strategies', 10, [52, 73, 94])
  }
  
  if (analyticsData.categoryPerformance) {
    const lowPerformingCategories = analyticsData.categoryPerformance.filter(cat => cat.completionRate < 70)
    if (lowPerformingCategories.length > 0) {
      exporter.addText(`• Focus on improving performance in: ${lowPerformingCategories.map(cat => cat.category.replace(/([A-Z])/g, ' $1').trim()).join(', ')}`, 10, [52, 73, 94])
    }
  }
  
  exporter.addText('• Continue monitoring trends and patterns for continuous improvement', 10, [52, 73, 94])
  exporter.addText('• Use AI insights to guide targeted training and support programs', 10, [52, 73, 94])
  
  // Save the PDF
  const filename = `comprehensive_analytics_dashboard_report_${new Date().toISOString().split('T')[0]}.pdf`
  exporter.save(filename)
}

export default PDFExporter
