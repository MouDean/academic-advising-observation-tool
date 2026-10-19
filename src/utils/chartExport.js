import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import Logo from '@/assets/Logo Mousa.png'

/**
 * Sanitize text by removing emojis and special characters
 */
const sanitizeText = (text) => {
  if (!text) return ''
  
  // Convert to string if it's not already
  const stringText = String(text)
  
  // Remove ALL special characters, emojis, and non-standard text
  return stringText
    // Remove common problematic Unicode characters
    .replace(/[Ø]/g, '')           // Remove Ø character
    .replace(/[Ü]/g, '')           // Remove Ü character
    .replace(/[¡]/g, '')           // Remove ¡ character
    .replace(/[È]/g, '')           // Remove È character
    .replace(/[<]/g, '')           // Remove < character
    .replace(/[=]/g, '')           // Remove = character
    .replace(/[&]/g, '')           // Remove & character
    // Remove emojis and pictographs
    .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Emoticons
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Misc symbols and pictographs
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport and map symbols
    .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '') // Regional indicator symbols
    .replace(/[\u{2600}-\u{26FF}]/gu, '')   // Misc symbols
    .replace(/[\u{2700}-\u{27BF}]/gu, '')   // Dingbats
    // Remove all non-ASCII characters
    .replace(/[^\x20-\x7E]/g, '')  // Keep only printable ASCII (space to tilde)
    // Remove any remaining special characters
    .replace(/[^\w\s\-\.\,\%\()]/g, '')
    .trim()
}

/**
 * Deep clean all data to remove any problematic characters
 */
const deepCleanData = (data) => {
  if (typeof data === 'string') {
    return sanitizeText(data)
  }
  
  if (typeof data === 'number') {
    return data
  }
  
  if (Array.isArray(data)) {
    return data.map(item => deepCleanData(item))
  }
  
  if (data && typeof data === 'object') {
    const cleaned = {}
    for (const [key, value] of Object.entries(data)) {
      cleaned[sanitizeText(key)] = deepCleanData(value)
    }
    return cleaned
  }
  
  return data
}

/**
 * Get risk level colors for PDF styling
 */
const getRiskLevelColors = (riskLevel) => {
  switch (riskLevel) {
    case 'CRITICAL':
      return {
        background: [239, 68, 68],    // Red
        text: [255, 255, 255],        // White text
        border: [220, 38, 38]         // Darker red border
      }
    case 'HIGH':
      return {
        background: [249, 115, 22],   // Orange
        text: [255, 255, 255],        // White text
        border: [234, 88, 12]         // Darker orange border
      }
    case 'MEDIUM':
      return {
        background: [245, 158, 11],   // Yellow/Amber
        text: [0, 0, 0],              // Black text
        border: [217, 119, 6]         // Darker amber border
      }
    case 'LOW':
      return {
        background: [34, 197, 94],    // Green
        text: [255, 255, 255],        // White text
        border: [22, 163, 74]         // Darker green border
      }
    default:
      return {
        background: [107, 114, 128],  // Gray
        text: [255, 255, 255],        // White text
        border: [75, 85, 99]          // Darker gray border
      }
  }
}

/**
 * Get priority level colors
 */
const getPriorityColors = (priority) => {
  switch (priority) {
    case 'CRITICAL':
      return { background: [239, 68, 68], text: [255, 255, 255] }
    case 'HIGH':
      return { background: [249, 115, 22], text: [255, 255, 255] }
    case 'MEDIUM':
      return { background: [245, 158, 11], text: [0, 0, 0] }
    case 'ONGOING':
    case 'STRATEGIC':
    case 'LONG-TERM':
      return { background: [59, 130, 246], text: [255, 255, 255] }
    case 'SYSTEMIC':
      return { background: [139, 69, 19], text: [255, 255, 255] }
    default:
      return { background: [107, 114, 128], text: [255, 255, 255] }
  }
}

/**
 * Export Predictive Analytics to PDF - Truly Comprehensive Version with Colors
 */
export const exportChartsToPDF = async (predictiveData, timeUnit = 'month') => {
  try {
    // Deep clean all data first to remove any problematic characters
    const cleanData = deepCleanData(predictiveData)
    
    // Create new PDF document
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 20
    const contentWidth = pageWidth - (margin * 2)
    
    let currentY = margin

    // Add header
    pdf.setFontSize(24)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(44, 62, 80)
    pdf.text('ADU Observation Tool', margin, currentY + 8)
    
    currentY += 8
    
    // Subtitle with color
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(59, 130, 246) // Blue color for subtitle
    pdf.text('Comprehensive Predictive Analytics Report', margin, currentY + 8)
    
    currentY += 15
    
    // Date and time
    pdf.setFontSize(10)
    pdf.setTextColor(127, 140, 141)
    const now = new Date()
    pdf.text(`Generated on: ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`, margin, currentY + 8)
    
    // Add logo on the right side
    try {
      pdf.addImage(Logo, 'PNG', pageWidth - margin - 50, currentY - 35, 50, 50)
    } catch (error) {
      console.warn('Could not load logo for PDF:', error)
    }
    
    currentY += 20

    // Executive Summary section with color
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(44, 62, 80)
    pdf.text('Executive Summary', margin, currentY)
    
    currentY += 8
    
    // Add colored underline
    pdf.setDrawColor(59, 130, 246) // Blue underline
    pdf.setLineWidth(1)
    pdf.line(margin, currentY, pageWidth - margin, currentY)
    
    currentY += 10

    // Enhanced Key Performance Metrics table
    const totalStudents = cleanData?.totalStudents || 0
    const highRiskStudents = cleanData?.highRiskStudents || 0
    const averageRiskScore = cleanData?.averageRiskScore || 0
    const studentRiskData = cleanData?.studentRiskData || {}
    
    // Calculate additional metrics
    const criticalRiskStudents = Object.values(studentRiskData).filter(
      data => data && data.riskLevel === 'CRITICAL'
    ).length
    
    const mediumRiskStudents = Object.values(studentRiskData).filter(
      data => data && data.riskLevel === 'MEDIUM'
    ).length
    
    const lowRiskStudents = Object.values(studentRiskData).filter(
      data => data && data.riskLevel === 'LOW'
    ).length
    
    const totalRiskFactors = Object.values(studentRiskData).reduce((total, student) => {
      return total + (student?.riskFactors?.length || 0)
    }, 0)
    
    const metricsData = [
      ['Total Students Analyzed', totalStudents.toString()],
      ['Critical Risk Students', `${criticalRiskStudents} (${totalStudents > 0 ? ((criticalRiskStudents / totalStudents) * 100).toFixed(1) : '0.0'}%)`],
      ['High Risk Students', `${highRiskStudents} (${totalStudents > 0 ? ((highRiskStudents / totalStudents) * 100).toFixed(1) : '0.0'}%)`],
      ['Medium Risk Students', `${mediumRiskStudents} (${totalStudents > 0 ? ((mediumRiskStudents / totalStudents) * 100).toFixed(1) : '0.0'}%)`],
      ['Low Risk Students', `${lowRiskStudents} (${totalStudents > 0 ? ((lowRiskStudents / totalStudents) * 100).toFixed(1) : '0.0'}%)`],
      ['Average Risk Score', `${(averageRiskScore * 100).toFixed(1)}%`],
      ['Total Risk Factors Identified', totalRiskFactors.toString()],
      ['Analysis Period', `${timeUnit.charAt(0).toUpperCase() + timeUnit.slice(1)}ly`],
      ['Report Type', 'Comprehensive Risk Assessment & Trend Analysis'],
      ['Generated By', 'ADU Observation Tool AI Engine']
    ]
    
    autoTable(pdf, {
      head: [['Metric', 'Value']],
      body: metricsData,
      startY: currentY,
      margin: { left: margin },
      styles: {
        fontSize: 8,
        cellPadding: 2,
        lineColor: [44, 62, 80],
        lineWidth: 0.1,
        textColor: [52, 73, 94],
        font: 'helvetica'
      },
      headStyles: {
        fillColor: [59, 130, 246], // Blue header
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      },
      // Color code the risk-related rows
      didParseCell: function(data) {
        if (data.row.index === 1) { // Critical Risk Students
          data.cell.styles.fillColor = [254, 226, 226] // Light red background
          data.cell.styles.textColor = [153, 27, 27] // Dark red text
        } else if (data.row.index === 2) { // High Risk Students  
          data.cell.styles.fillColor = [255, 237, 213] // Light orange background
          data.cell.styles.textColor = [194, 65, 12] // Dark orange text
        } else if (data.row.index === 3) { // Medium Risk Students
          data.cell.styles.fillColor = [254, 243, 199] // Light yellow background
          data.cell.styles.textColor = [146, 64, 14] // Dark amber text
        } else if (data.row.index === 4) { // Low Risk Students
          data.cell.styles.fillColor = [220, 252, 231] // Light green background
          data.cell.styles.textColor = [22, 101, 52] // Dark green text
        }
      }
    })
    
    currentY = pdf.lastAutoTable.finalY + 10

    // Risk Level Distribution table with colors
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(44, 62, 80)
    pdf.text('Risk Level Distribution', margin, currentY)
    
    currentY += 8
    
    // Add colored underline
    pdf.setDrawColor(59, 130, 246)
    pdf.setLineWidth(1)
    pdf.line(margin, currentY, pageWidth - margin, currentY)
    
    currentY += 10

    // Create comprehensive risk distribution data
    const riskLevels = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']
    const riskData = riskLevels.map(level => {
      const count = Object.values(studentRiskData).filter(
        data => data && data.riskLevel === level
      ).length
      const percentage = totalStudents > 0 ? ((count / totalStudents) * 100).toFixed(1) : '0.0'
      return [level, count.toString(), `${percentage}%`]
    })

    autoTable(pdf, {
      head: [['Risk Level', 'Students', 'Percentage']],
      body: riskData,
      startY: currentY,
      margin: { left: margin },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineColor: [44, 62, 80],
        lineWidth: 0.1,
        textColor: [52, 73, 94],
        font: 'helvetica'
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      },
      // Color code each risk level row
      didParseCell: function(data) {
        if (data.section === 'body') {
          const riskLevel = riskData[data.row.index][0]
          const colors = getRiskLevelColors(riskLevel)
          data.cell.styles.fillColor = colors.background
          data.cell.styles.textColor = colors.text
          data.cell.styles.fontStyle = 'bold'
        }
      }
    })
    
    currentY = pdf.lastAutoTable.finalY + 10

    // Comprehensive Individual Student Analysis section
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(44, 62, 80)
    pdf.text('Individual Student Risk Analysis', margin, currentY)
    
    currentY += 8
    
    // Add underline
    pdf.setDrawColor(44, 62, 80)
    pdf.setLineWidth(0.5)
    pdf.line(margin, currentY, pageWidth - margin, currentY)
    
    currentY += 10

    // Create comprehensive student data table with ALL available metrics
    const studentData = Object.entries(studentRiskData).map(([studentCode, data]) => [
      studentCode || 'N/A',
      data?.riskLevel || 'Unknown',
      `${((data?.riskScore || 0) * 100).toFixed(1)}%`,
      data?.metrics?.totalSessions || 0,
      data?.metrics?.avgCompletionRate ? `${(data.metrics.avgCompletionRate * 100).toFixed(1)}%` : 'N/A',
      data?.metrics?.avgEngagement ? `${(data.metrics.avgEngagement * 100).toFixed(1)}%` : 'N/A',
      data?.metrics?.avgAIScore ? `${(data.metrics.avgAIScore * 100).toFixed(1)}%` : 'N/A',
      data?.metrics?.technicalIssuesRate ? `${(data.metrics.technicalIssuesRate * 100).toFixed(1)}%` : 'N/A',
      data?.trend || 'Stable',
      data?.riskFactors?.length || 0
    ])

    autoTable(pdf, {
      head: [['Student Code', 'Risk Level', 'Risk Score', 'Sessions', 'Completion Rate', 'Engagement', 'AI Score', 'Tech Issues', 'Trend', 'Risk Factors']],
      body: studentData,
      startY: currentY,
      margin: { left: margin },
      styles: {
        fontSize: 7,
        cellPadding: 1,
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

    currentY = pdf.lastAutoTable.finalY + 10

    // Detailed Risk Factors Analysis section
    if (Object.keys(studentRiskData).length > 0) {
      // Check if we need a new page
      if (currentY > pageHeight - 120) {
        pdf.addPage()
        currentY = margin
      }

      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(44, 62, 80)
      pdf.text('Detailed Risk Factors Analysis', margin, currentY)
      
      currentY += 8
      
      // Add underline
      pdf.setDrawColor(44, 62, 80)
      pdf.setLineWidth(0.5)
      pdf.line(margin, currentY, pageWidth - margin, currentY)
      
      currentY += 10

      // Analyze ALL risk factors across all students with detailed information
      const riskFactors = {}
      Object.values(studentRiskData).forEach(student => {
        if (student && student.riskFactors && Array.isArray(student.riskFactors)) {
          student.riskFactors.forEach(factor => {
            if (factor && factor.factor) {
              if (!riskFactors[factor.factor]) {
                riskFactors[factor.factor] = {
                  count: 0,
                  totalValue: 0,
                  descriptions: [],
                  impacts: []
                }
              }
              riskFactors[factor.factor].count++
              if (factor.value) riskFactors[factor.factor].totalValue += parseFloat(factor.value) || 0
              if (factor.description) riskFactors[factor.factor].descriptions.push(factor.description)
              if (factor.impact) riskFactors[factor.factor].impacts.push(factor.impact)
            }
          })
        }
      })

      const topRiskFactors = Object.entries(riskFactors)
        .sort(([,a], [,b]) => b.count - a.count)
        .slice(0, 15)

      if (topRiskFactors.length > 0) {
        const riskFactorData = topRiskFactors.map(([factor, data]) => [
          factor,
          data.count.toString(),
          `${((data.count / totalStudents) * 100).toFixed(1)}%`,
          data.impacts.includes('high') ? 'High' : data.impacts.includes('medium') ? 'Medium' : 'Low'
        ])

        autoTable(pdf, {
          head: [['Risk Factor', 'Affected Students', 'Percentage', 'Impact Level']],
          body: riskFactorData,
          startY: currentY,
          margin: { left: margin },
          styles: {
            fontSize: 8,
            cellPadding: 2,
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
        
        currentY = pdf.lastAutoTable.finalY + 10

        // Add detailed descriptions for top risk factors
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(44, 62, 80)
        pdf.text('Risk Factor Details:', margin, currentY)
        currentY += 8
        
        pdf.setFontSize(8)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(52, 73, 94)
        
        topRiskFactors.slice(0, 5).forEach(([factor, data]) => {
          const avgValue = data.totalValue > 0 ? (data.totalValue / data.count).toFixed(1) : 'N/A'
          const description = data.descriptions[0] || 'No description available'
          const impactLevel = data.impacts.includes('high') ? 'High' : data.impacts.includes('medium') ? 'Medium' : 'Low'
          
          const factorText = `• ${factor}: ${data.count} students affected (${((data.count / totalStudents) * 100).toFixed(1)}%), Impact: ${impactLevel}, Avg Value: ${avgValue}`
          const lines = pdf.splitTextToSize(factorText, contentWidth)
          lines.forEach(line => {
            pdf.text(line, margin, currentY)
            currentY += 4
          })
          
          const descText = `  Description: ${description}`
          const descLines = pdf.splitTextToSize(descText, contentWidth - 10)
          descLines.forEach(line => {
            pdf.text(line, margin + 5, currentY)
            currentY += 4
          })
          
          currentY += 3
        })
        
        currentY += 5
      }
    }

    // Individual Student Recommendations section
    if (Object.keys(studentRiskData).length > 0) {
      // Check if we need a new page
      if (currentY > pageHeight - 100) {
        pdf.addPage()
        currentY = margin
      }

      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(44, 62, 80)
      pdf.text('Individual Student Recommendations', margin, currentY)
      
      currentY += 8
      
      // Add underline
      pdf.setDrawColor(44, 62, 80)
      pdf.setLineWidth(0.5)
      pdf.line(margin, currentY, pageWidth - margin, currentY)
      
      currentY += 10

      // Show recommendations for top 5 highest risk students
      const sortedStudents = Object.entries(studentRiskData)
        .filter(([, data]) => data && typeof data.riskScore === 'number')
        .sort(([, a], [, b]) => (b.riskScore || 0) - (a.riskScore || 0))
        .slice(0, 5)

      sortedStudents.forEach(([studentCode, studentData], index) => {
        if (currentY > pageHeight - 80) {
          pdf.addPage()
          currentY = margin
        }

        // Student header
        pdf.setFontSize(11)
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(44, 62, 80)
        pdf.text(`${index + 1}. Student ${studentCode} - ${studentData.riskLevel} RISK`, margin, currentY)
        currentY += 6
        
        // Risk score and metrics
        pdf.setFontSize(9)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(52, 73, 94)
        pdf.text(`Risk Score: ${((studentData.riskScore || 0) * 100).toFixed(1)}% | Sessions: ${studentData.metrics?.totalSessions || 0}`, margin, currentY)
        currentY += 5
        
        // Recommendations
        if (studentData.recommendations && studentData.recommendations.length > 0) {
          pdf.setFontSize(9)
          pdf.setFont('helvetica', 'bold')
          pdf.setTextColor(44, 62, 80)
          pdf.text('Recommendations:', margin, currentY)
          currentY += 4
          
          pdf.setFontSize(8)
          pdf.setFont('helvetica', 'normal')
          pdf.setTextColor(52, 73, 94)
          
          studentData.recommendations.slice(0, 3).forEach((rec, recIndex) => {
            const recText = `• ${rec.title || 'Recommendation'}: ${rec.description || 'No description'}`
            const lines = pdf.splitTextToSize(recText, contentWidth)
            lines.forEach(line => {
              pdf.text(line, margin + 5, currentY)
              currentY += 4
            })
            
            // Add actions if available
            if (rec.actions && rec.actions.length > 0) {
              rec.actions.slice(0, 2).forEach(action => {
                const actionText = `  - ${action}`
                const actionLines = pdf.splitTextToSize(actionText, contentWidth - 10)
                actionLines.forEach(line => {
                  pdf.text(line, margin + 10, currentY)
                  currentY += 4
                })
              })
            }
            
            currentY += 2
          })
        }
        
        currentY += 8
      })
    }

    // Performance Trends & Longitudinal Analysis section
    if (cleanData?.longitudinalData) {
      // Check if we need a new page
      if (currentY > pageHeight - 100) {
        pdf.addPage()
        currentY = margin
      }

      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(44, 62, 80)
      pdf.text('Performance Trends & Longitudinal Analysis', margin, currentY)
      
      currentY += 8
      
      // Add underline
      pdf.setDrawColor(44, 62, 80)
      pdf.setLineWidth(0.5)
      pdf.line(margin, currentY, pageWidth - margin, currentY)
      
      currentY += 10

      const longitudinalData = cleanData.longitudinalData
      
      // Add comprehensive trend insights
      if (longitudinalData.trends && longitudinalData.trends.length > 0) {
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(44, 62, 80)
        pdf.text('Key Performance Trends:', margin, currentY)
        currentY += 8
        
        pdf.setFontSize(9)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(52, 73, 94)
        
        longitudinalData.trends.slice(0, 8).forEach((trend, index) => {
          const trendText = `• ${trend.period || 'Period'}: ${trend.pattern || 'Stable'} performance with ${trend.totalSessions || 0} sessions`
          const lines = pdf.splitTextToSize(trendText, contentWidth)
          lines.forEach(line => {
            pdf.text(line, margin, currentY)
            currentY += 5
          })
          
          // Add additional trend details if available
          if (trend.avgCompletionRate !== undefined) {
            const detailText = `  Completion Rate: ${(trend.avgCompletionRate * 100).toFixed(1)}%`
            pdf.text(detailText, margin + 5, currentY)
            currentY += 5
          }
          
          if (trend.avgEngagement !== undefined) {
            const detailText = `  Engagement: ${(trend.avgEngagement * 100).toFixed(1)}%`
            pdf.text(detailText, margin + 5, currentY)
            currentY += 5
          }
          
          currentY += 3
        })
        
        currentY += 5
      }

      // Add comprehensive recommendations if available
      if (longitudinalData.recommendations && longitudinalData.recommendations.length > 0) {
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(44, 62, 80)
        pdf.text('Strategic Recommendations & Insights:', margin, currentY)
        currentY += 8
        
        pdf.setFontSize(9)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(52, 73, 94)
        
        longitudinalData.recommendations.slice(0, 8).forEach((rec, index) => {
          const recText = `${index + 1}. ${rec.title || 'Recommendation'}: ${rec.description || 'No description available'}`
          const lines = pdf.splitTextToSize(recText, contentWidth)
          lines.forEach(line => {
            pdf.text(line, margin, currentY)
            currentY += 5
          })
          
          // Add actions if available
          if (rec.actions && rec.actions.length > 0) {
            pdf.setFontSize(8)
            pdf.setTextColor(127, 140, 141)
            rec.actions.slice(0, 3).forEach(action => {
              const actionText = `  • ${action}`
              const actionLines = pdf.splitTextToSize(actionText, contentWidth - 10)
              actionLines.forEach(line => {
                pdf.text(line, margin + 5, currentY)
                currentY += 4
              })
            })
            pdf.setTextColor(52, 73, 94)
          }
          
          currentY += 5
        })
        
        currentY += 5
      }

      // Add patterns and insights if available
      if (longitudinalData.patterns && longitudinalData.patterns.length > 0) {
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(44, 62, 80)
        pdf.text('Identified Patterns:', margin, currentY)
        currentY += 8
        
        pdf.setFontSize(9)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(52, 73, 94)
        
        longitudinalData.patterns.slice(0, 5).forEach((pattern, index) => {
          const patternText = `• ${pattern.description || 'Pattern identified'}: ${pattern.impact || 'Impact analysis'}`
          const lines = pdf.splitTextToSize(patternText, contentWidth)
          lines.forEach(line => {
            pdf.text(line, margin, currentY)
            currentY += 5
          })
          currentY += 3
        })
        
        currentY += 5
      }
    }

    // Comprehensive Action Items section
    // Check if we need a new page
    if (currentY > pageHeight - 120) {
      pdf.addPage()
      currentY = margin
    }

    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(44, 62, 80)
    pdf.text('Comprehensive Action Plan', margin, currentY)
    
    currentY += 8
    
    // Add underline
    pdf.setDrawColor(44, 62, 80)
    pdf.setLineWidth(0.5)
    pdf.line(margin, currentY, pageWidth - margin, currentY)
    
    currentY += 10

    // Generate comprehensive action items based on ALL available data
    const actionItems = []
    
    if (criticalRiskStudents > 0) {
      actionItems.push([
        'CRITICAL',
        'Emergency Intervention',
        `Immediate support required for ${criticalRiskStudents} critical-risk students`
      ])
    }
    
    if (highRiskStudents > 0) {
      actionItems.push([
        'HIGH',
        'High-Risk Student Support',
        `Comprehensive intervention needed for ${highRiskStudents} high-risk students`
      ])
    }
    
    if (mediumRiskStudents > 0) {
      actionItems.push([
        'MEDIUM',
        'Preventive Measures',
        `Targeted support for ${mediumRiskStudents} medium-risk students to prevent escalation`
      ])
    }
    
    if (averageRiskScore > 0.5) {
      actionItems.push([
        'SYSTEMIC',
        'Process Improvement',
        'Overall risk score indicates need for systemic improvements'
      ])
    }
    
    if (totalRiskFactors > totalStudents * 2) {
      actionItems.push([
        'STRATEGIC',
        'Risk Factor Reduction',
        'High number of risk factors suggests need for comprehensive risk management strategy'
      ])
    }
    
    actionItems.push([
      'ONGOING',
      'Continuous Monitoring',
      'Implement regular risk assessment and monitoring protocols'
    ])
    
    actionItems.push([
      'STRATEGIC',
      'Data-Driven Decisions',
      'Use comprehensive analytics to inform training and support programs'
    ])
    
    actionItems.push([
      'LONG-TERM',
      'Prevention Strategy',
      'Develop long-term strategies to reduce risk factors and improve student outcomes'
    ])

    autoTable(pdf, {
      head: [['Priority Level', 'Action Category', 'Description']],
      body: actionItems,
      startY: currentY,
      margin: { left: margin },
      styles: {
        fontSize: 8,
        cellPadding: 2,
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

    // Add page numbers
    const pageCount = pdf.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i)
      pdf.setFontSize(8)
      pdf.setTextColor(127, 140, 141)
      pdf.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 20, pageHeight - 10)
    }

    // Save the PDF
    pdf.save(`comprehensive-predictive-analytics-report-${timeUnit}-${new Date().toISOString().split('T')[0]}.pdf`)
    
  } catch (error) {
    console.error('PDF export error:', error)
    throw new Error('Failed to generate PDF report')
  }
}
