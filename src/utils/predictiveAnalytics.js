// Predictive Analytics and Trend Analysis for Academic Advising
// Identifies at-risk students and provides longitudinal insights

// Risk factors and their weights for at-risk student identification
const RISK_FACTORS = {
  // Academic Performance
  lowCompletionRate: { weight: 0.25, threshold: 50 },
  frequentLowCompletion: { weight: 0.20, threshold: 3 },
  decliningPerformance: { weight: 0.15, threshold: -10 },
  
  // Engagement Patterns
  poorEngagement: { weight: 0.15, threshold: 0.3 },
  inconsistentAttendance: { weight: 0.10, threshold: 0.4 },
  
  // AI Tool Usage
  poorAIToolUsage: { weight: 0.10, threshold: 0.2 },
  technicalIssues: { weight: 0.05, threshold: 0.5 }
}

// Risk levels and their descriptions
export const RISK_LEVELS = {
  LOW: { level: 'LOW', score: 0, color: 'green', description: 'Student performing well' },
  MEDIUM: { level: 'MEDIUM', score: 1, color: 'yellow', description: 'Monitor closely' },
  HIGH: { level: 'HIGH', score: 2, color: 'orange', description: 'Intervention needed' },
  CRITICAL: { level: 'CRITICAL', score: 3, color: 'red', description: 'Immediate action required' }
}

/**
 * Calculate risk score for a student based on multiple factors
 * @param {Array} studentSessions - All sessions for a specific student
 * @returns {Object} Risk assessment with score, level, and factors
 */
export const calculateStudentRiskScore = (studentSessions) => {
  if (!studentSessions || studentSessions.length === 0) {
    return {
      riskScore: 0,
      riskLevel: RISK_LEVELS.LOW.level,
      riskFactors: [],
      recommendations: [],
      trend: 'stable'
    }
  }

  const riskFactors = []
  let totalRiskScore = 0

  // 1. Completion Rate Analysis
  const completionRates = studentSessions.map(session => {
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

  const avgCompletionRate = completionRates.reduce((sum, rate) => sum + rate, 0) / completionRates.length
  const lowCompletionSessions = completionRates.filter(rate => rate < RISK_FACTORS.lowCompletionRate.threshold).length

  if (avgCompletionRate < RISK_FACTORS.lowCompletionRate.threshold) {
    const riskScore = (RISK_FACTORS.lowCompletionRate.threshold - avgCompletionRate) / 10
    totalRiskScore += riskScore * RISK_FACTORS.lowCompletionRate.weight
    riskFactors.push({
      factor: 'Low Completion Rate',
      value: `${avgCompletionRate.toFixed(1)}%`,
      threshold: `${RISK_FACTORS.lowCompletionRate.threshold}%`,
      impact: 'high',
      description: 'Student consistently shows low completion rates in observations'
    })
  }

  if (lowCompletionSessions >= RISK_FACTORS.frequentLowCompletion.threshold) {
    totalRiskScore += RISK_FACTORS.frequentLowCompletion.weight
    riskFactors.push({
      factor: 'Frequent Low Completion',
      value: `${lowCompletionSessions} sessions`,
      threshold: `${RISK_FACTORS.frequentLowCompletion.threshold}+ sessions`,
      impact: 'high',
      description: 'Multiple sessions with poor completion rates'
    })
  }

  // 2. Performance Trend Analysis
  if (completionRates.length >= 3) {
    const recentRates = completionRates.slice(-3)
    const earlierRates = completionRates.slice(-6, -3)
    
    if (earlierRates.length >= 3) {
      const recentAvg = recentRates.reduce((sum, rate) => sum + rate, 0) / recentRates.length
      const earlierAvg = earlierRates.reduce((sum, rate) => sum + rate, 0) / earlierRates.length
      const decline = recentAvg - earlierAvg
      
      if (decline < RISK_FACTORS.decliningPerformance.threshold) {
        totalRiskScore += RISK_FACTORS.decliningPerformance.weight
        riskFactors.push({
          factor: 'Declining Performance',
          value: `${decline.toFixed(1)}%`,
          threshold: `${RISK_FACTORS.decliningPerformance.threshold}%`,
          impact: 'medium',
          description: 'Student performance is declining over time'
        })
      }
    }
  }

  // 3. Engagement Analysis
  const engagementScores = studentSessions.map(session => {
    let engagementScore = 0
    let totalEngagementFields = 0
    
    if (session.observations?.studentEngagement) {
      const engagement = session.observations.studentEngagement
      
      // Questions proactive
      if (engagement.questionsProactive?.rating === 'High') engagementScore += 1
      else if (engagement.questionsProactive?.rating === 'Medium') engagementScore += 0.5
      
      // AI interaction
      if (engagement.aiInteraction?.rating === 'Yes') engagementScore += 1
      
      // Understanding advice
      if (engagement.understandingAdvice?.rating === 'Yes') engagementScore += 1
      else if (engagement.understandingAdvice?.rating === 'Unclear') engagementScore += 0.3
      
      totalEngagementFields = 3
    }
    
    return totalEngagementFields > 0 ? engagementScore / totalEngagementFields : 0
  })

  const avgEngagement = engagementScores.reduce((sum, score) => sum + score, 0) / engagementScores.length
  
  if (avgEngagement < RISK_FACTORS.poorEngagement.threshold) {
    totalRiskScore += RISK_FACTORS.poorEngagement.weight
    riskFactors.push({
      factor: 'Poor Engagement',
      value: `${(avgEngagement * 100).toFixed(1)}%`,
      threshold: `${(RISK_FACTORS.poorEngagement.threshold * 100).toFixed(1)}%`,
      impact: 'medium',
      description: 'Student shows low engagement during advising sessions'
    })
  }

  // 4. AI Tool Usage Analysis
  const aiToolScores = studentSessions.map(session => {
    let aiScore = 0
    let totalAIFields = 0
    
    if (session.observations?.aiEnhancedTools) {
      const aiTools = session.observations.aiEnhancedTools
      
      // Accurate info
      if (aiTools.accurateInfo?.rating === 'Accurate') aiScore += 1
      else if (aiTools.accurateInfo?.rating === 'Partially Accurate') aiScore += 0.5
      
      // Enhances efficiency
      if (aiTools.enhancesEfficiency?.rating === 'Yes') aiScore += 1
      
      // Technical issues
      if (aiTools.technicalIssues?.rating === 'No') aiScore += 1
      
      totalAIFields = 3
    }
    
    return totalAIFields > 0 ? aiScore / totalAIFields : 0
  })

  const avgAIScore = aiToolScores.reduce((sum, score) => sum + score, 0) / aiToolScores.length
  
  if (avgAIScore < RISK_FACTORS.poorAIToolUsage.threshold) {
    totalRiskScore += RISK_FACTORS.poorAIToolUsage.weight
    riskFactors.push({
      factor: 'Poor AI Tool Usage',
      value: `${(avgAIScore * 100).toFixed(1)}%`,
      threshold: `${(RISK_FACTORS.poorAIToolUsage.threshold * 100).toFixed(1)}%`,
      impact: 'low',
      description: 'Student struggles with AI-enhanced tools'
    })
  }

  // 5. Technical Issues Analysis
  const technicalIssuesCount = studentSessions.filter(session => 
    session.observations?.aiEnhancedTools?.technicalIssues?.rating === 'Yes'
  ).length
  
  const technicalIssuesRate = technicalIssuesCount / studentSessions.length
  
  if (technicalIssuesRate > RISK_FACTORS.technicalIssues.threshold) {
    totalRiskScore += RISK_FACTORS.technicalIssues.weight
    riskFactors.push({
      factor: 'Frequent Technical Issues',
      value: `${(technicalIssuesRate * 100).toFixed(1)}%`,
      threshold: `${(RISK_FACTORS.technicalIssues.threshold * 100).toFixed(1)}%`,
      impact: 'low',
      description: 'Student encounters frequent technical problems'
    })
  }

  // Determine risk level
  let riskLevel = RISK_LEVELS.LOW.level
  if (totalRiskScore >= 0.7) riskLevel = RISK_LEVELS.CRITICAL.level
  else if (totalRiskScore >= 0.5) riskLevel = RISK_LEVELS.HIGH.level
  else if (totalRiskScore >= 0.3) riskLevel = RISK_LEVELS.MEDIUM.level

  // Generate recommendations
  const recommendations = generateRecommendations(riskFactors, avgCompletionRate, avgEngagement)

  // Determine trend
  let trend = 'stable'
  if (completionRates.length >= 2) {
    const recent = completionRates.slice(-2).reduce((sum, rate) => sum + rate, 0) / 2
    const earlier = completionRates.slice(-4, -2).reduce((sum, rate) => sum + rate, 0) / 2
    if (recent > earlier + 5) trend = 'improving'
    else if (recent < earlier - 5) trend = 'declining'
  }

  return {
    riskScore: Math.round(totalRiskScore * 100) / 100,
    riskLevel,
    riskFactors,
    recommendations,
    trend,
    metrics: {
      avgCompletionRate: Math.round(avgCompletionRate * 10) / 10,
      avgEngagement: Math.round(avgEngagement * 100) / 100,
      avgAIScore: Math.round(avgAIScore * 100) / 100,
      technicalIssuesRate: Math.round(technicalIssuesRate * 100) / 100,
      totalSessions: studentSessions.length
    }
  }
}

/**
 * Generate personalized recommendations based on risk factors
 */
const generateRecommendations = (riskFactors, completionRate, engagement) => {
  const recommendations = []

  // Completion rate recommendations (enhanced with more variations)
  if (completionRate < 30) {
    recommendations.push({
      type: 'completion',
      priority: 'high',
      title: 'Critical Completion Intervention',
      description: 'Extremely low completion rate requires immediate attention',
      actions: [
        'One-on-one completion training',
        'Implement completion tracking system',
        'Daily completion monitoring'
      ]
    })
  } else if (completionRate < 50) {
    recommendations.push({
      type: 'completion',
      priority: 'high',
      title: 'Session Completion Improvement',
      description: 'Focus on completing all observation fields during sessions',
      actions: [
        'Use structured observation checklist',
        'Set reminders for incomplete fields',
        'Provide training on observation techniques'
      ]
    })
  } else if (completionRate < 70) {
    recommendations.push({
      type: 'completion',
      priority: 'medium',
      title: 'Completion Rate Enhancement',
      description: 'Good progress but room for improvement in completion rates',
      actions: [
        'Fine-tune observation processes',
        'Identify completion barriers',
        'Implement efficiency improvements'
      ]
    })
  }

  // Engagement recommendations (enhanced with more variations)
  if (engagement < 0.3) {
    recommendations.push({
      type: 'engagement',
      priority: 'high',
      title: 'Critical Engagement Intervention',
      description: 'Very low engagement requires immediate attention',
      actions: [
        'Implement engagement strategies',
        'Create interactive session formats',
        'Use gamification techniques'
      ]
    })
  } else if (engagement < 0.5) {
    recommendations.push({
      type: 'engagement',
      priority: 'medium',
      title: 'Student Engagement Enhancement',
      description: 'Increase student participation and interaction',
      actions: [
        'Ask more open-ended questions',
        'Encourage student questions',
        'Use interactive AI tools more effectively'
      ]
    })
  } else if (engagement < 0.7) {
    recommendations.push({
      type: 'engagement',
      priority: 'low',
      title: 'Engagement Optimization',
      description: 'Good engagement levels with potential for enhancement',
      actions: [
        'Implement advanced engagement techniques',
        'Create peer interaction opportunities',
        'Develop personalized engagement strategies'
      ]
    })
  }

  // AI tool recommendations (enhanced)
  const aiRiskFactors = riskFactors.filter(factor => factor.factor.includes('AI'))
  if (aiRiskFactors.length > 0) {
    const severityLevel = aiRiskFactors.some(factor => factor.impact === 'high') ? 'high' : 'medium'
    
    if (severityLevel === 'high') {
      recommendations.push({
        type: 'ai_tools',
        priority: 'high',
        title: 'AI Tool Mastery Program',
        description: 'Significant AI tool challenges require intensive support',
        actions: [
          'Comprehensive AI training program',
          'Individual AI coaching sessions',
          'Technical support assignment'
        ]
      })
    } else {
      recommendations.push({
        type: 'ai_tools',
        priority: 'medium',
        title: 'AI Tool Integration',
        description: 'Better integrate AI tools into advising sessions',
        actions: [
          'Provide AI tool training',
          'Start with simple AI interactions',
          'Monitor technical issues closely'
        ]
      })
    }
  }

  // Technical issues recommendations
  if (riskFactors.some(factor => factor.factor.includes('Technical'))) {
    recommendations.push({
      type: 'technical',
      priority: 'medium',
      title: 'Technical Support Enhancement',
      description: 'Address recurring technical issues',
      actions: [
        'IT support consultation',
        'Equipment upgrade evaluation',
        'Technical skills training'
      ]
    })
  }

  // Declining performance recommendations
  if (riskFactors.some(factor => factor.factor.includes('Declining'))) {
    recommendations.push({
      type: 'performance',
      priority: 'high',
      title: 'Performance Recovery Plan',
      description: 'Address declining performance trends',
      actions: [
        'Identify performance decline causes',
        'Implement recovery strategies',
        'Close monitoring and support'
      ]
    })
  }

  // Attendance-related recommendations
  if (riskFactors.some(factor => factor.factor.includes('Attendance'))) {
    recommendations.push({
      type: 'attendance',
      priority: 'medium',
      title: 'Attendance Improvement Strategy',
      description: 'Address attendance consistency issues',
      actions: [
        'Flexible scheduling options',
        'Attendance motivation programs',
        'Remove attendance barriers'
      ]
    })
  }

  // Communication recommendations
  if (completionRate > 80 && engagement > 0.7) {
    recommendations.push({
      type: 'communication',
      priority: 'low',
      title: 'Advanced Communication Skills',
      description: 'Excellent performance - focus on advanced skills',
      actions: [
        'Mentor other students',
        'Lead group discussions',
        'Develop presentation skills'
      ]
    })
  }

  // Study skills recommendations
  if (riskFactors.length >= 2 && riskFactors.length < 4) {
    recommendations.push({
      type: 'study_skills',
      priority: 'medium',
      title: 'Study Skills Development',
      description: 'Multiple challenges suggest need for study skills improvement',
      actions: [
        'Time management training',
        'Study technique workshops',
        'Goal-setting sessions'
      ]
    })
  }

  // Comprehensive intervention for high risk
  if (riskFactors.length >= 4) {
    recommendations.push({
      type: 'comprehensive',
      priority: 'high',
      title: 'Intensive Support Program',
      description: 'Multiple serious risk factors require comprehensive intervention',
      actions: [
        'Multi-disciplinary support team',
        'Intensive monitoring program',
        'Personalized intervention plan'
      ]
    })
  } else if (riskFactors.length >= 3) {
    recommendations.push({
      type: 'general',
      priority: 'high',
      title: 'Enhanced Support Services',
      description: 'Multiple risk factors indicate need for enhanced support',
      actions: [
        'Schedule follow-up sessions',
        'Involve additional support staff',
        'Create personalized improvement plan'
      ]
    })
  }

  // Success reinforcement for low-risk students
  if (riskFactors.length === 0 && completionRate > 85 && engagement > 0.8) {
    recommendations.push({
      type: 'excellence',
      priority: 'low',
      title: 'Excellence Recognition Program',
      description: 'Outstanding performance deserves recognition and challenge',
      actions: [
        'Advanced learning opportunities',
        'Leadership development programs',
        'Peer mentoring opportunities'
      ]
    })
  }

  return recommendations
}

/**
 * Perform longitudinal trend analysis across multiple time periods
 * @param {Array} sessions - All sessions data
 * @param {string} timeUnit - 'week', 'month', 'quarter', 'semester'
 * @returns {Object} Trend analysis results
 */
export const performLongitudinalAnalysis = (sessions, timeUnit = 'month') => {
  if (!sessions || sessions.length === 0) {
    return {
      trends: [],
      patterns: [],
      insights: [],
      recommendations: []
    }
  }

  // Group sessions by time period
  const groupedSessions = groupSessionsByTime(sessions, timeUnit)
  
  // Calculate trends for each period
  const trends = Object.entries(groupedSessions).map(([period, periodSessions]) => {
    const periodData = calculatePeriodMetrics(periodSessions)
    return {
      period,
      ...periodData
    }
  }).sort((a, b) => new Date(a.period) - new Date(b.period))

  // Identify patterns and insights
  const patterns = identifyTrendPatterns(trends)
  const insights = generateTrendInsights(trends, patterns)
  const recommendations = generateTrendRecommendations(patterns, insights)

  return {
    trends,
    patterns,
    insights,
    recommendations,
    timeUnit
  }
}

/**
 * Group sessions by time period
 */
const groupSessionsByTime = (sessions, timeUnit) => {
  const grouped = {}
  
  sessions.forEach(session => {
    const date = new Date(session.createdAt)
    let periodKey
    
    switch (timeUnit) {
      case 'hour':
        periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${String(date.getHours()).padStart(2, '0')}`
        break
      case 'day':
        periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        break
      case 'week':
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        periodKey = weekStart.toISOString().split('T')[0]
        break
      case 'month':
        periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        break
      case 'quarter':
        const quarter = Math.floor(date.getMonth() / 3) + 1
        periodKey = `${date.getFullYear()}-Q${quarter}`
        break
      case 'semester':
        const semester = date.getMonth() < 6 ? 'Spring' : 'Fall'
        periodKey = `${date.getFullYear()}-${semester}`
        break
      default:
        periodKey = date.toISOString().split('T')[0]
    }
    
    if (!grouped[periodKey]) {
      grouped[periodKey] = []
    }
    grouped[periodKey].push(session)
  })
  
  return grouped
}

/**
 * Calculate metrics for a specific time period
 */
const calculatePeriodMetrics = (periodSessions) => {
  const completionRates = periodSessions.map(session => {
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

  const avgCompletionRate = completionRates.reduce((sum, rate) => sum + rate, 0) / completionRates.length
  const lowCompletionCount = completionRates.filter(rate => rate < 50).length
  
  // Calculate engagement scores
  const engagementScores = periodSessions.map(session => {
    let score = 0
    let totalFields = 0
    
    if (session.observations?.studentEngagement) {
      const engagement = session.observations.studentEngagement
      if (engagement.questionsProactive?.rating === 'High') score += 1
      if (engagement.aiInteraction?.rating === 'Yes') score += 1
      if (engagement.understandingAdvice?.rating === 'Yes') score += 1
      totalFields = 3
    }
    
    return totalFields > 0 ? score / totalFields : 0
  })

  const avgEngagement = engagementScores.reduce((sum, score) => sum + score, 0) / engagementScores.length

  return {
    sessionCount: periodSessions.length,
    avgCompletionRate: Math.round(avgCompletionRate * 10) / 10,
    lowCompletionRate: Math.round((lowCompletionCount / periodSessions.length) * 100) / 100,
    avgEngagement: Math.round(avgEngagement * 100) / 100,
    completionRates,
    engagementScores
  }
}

/**
 * Identify patterns in trends
 */
const identifyTrendPatterns = (trends) => {
  const patterns = []
  
  if (trends.length < 2) return patterns

  // Identify consistent trends
  let consistentImprovement = 0
  let consistentDecline = 0
  
  for (let i = 1; i < trends.length; i++) {
    const current = trends[i]
    const previous = trends[i - 1]
    
    if (current.avgCompletionRate > previous.avgCompletionRate + 2) {
      consistentImprovement++
      consistentDecline = 0
    } else if (current.avgCompletionRate < previous.avgCompletionRate - 2) {
      consistentDecline++
      consistentImprovement = 0
    } else {
      consistentImprovement = 0
      consistentDecline = 0
    }
  }

  if (consistentImprovement >= 2) {
    patterns.push({
      type: 'improvement_trend',
      strength: consistentImprovement >= 3 ? 'strong' : 'moderate',
      description: `Consistent improvement over ${consistentImprovement} periods`
    })
  }

  if (consistentDecline >= 2) {
    patterns.push({
      type: 'decline_trend',
      strength: consistentDecline >= 3 ? 'strong' : 'moderate',
      description: `Consistent decline over ${consistentDecline} periods`
    })
  }

  // Identify seasonal patterns
  if (trends.length >= 6) {
    const seasonalVariation = calculateSeasonalVariation(trends)
    if (seasonalVariation > 0.1) {
      patterns.push({
        type: 'seasonal_pattern',
        strength: seasonalVariation > 0.2 ? 'strong' : 'moderate',
        description: `Seasonal variation detected (${(seasonalVariation * 100).toFixed(1)}%)`
      })
    }
  }

  return patterns
}

/**
 * Calculate seasonal variation
 */
const calculateSeasonalVariation = (trends) => {
  // Simple seasonal variation calculation
  const quarterlyGroups = {}
  
  trends.forEach(trend => {
    const quarter = trend.period.split('-')[1]?.substring(0, 2) || 'Q1'
    if (!quarterlyGroups[quarter]) {
      quarterlyGroups[quarter] = []
    }
    quarterlyGroups[quarter].push(trend.avgCompletionRate)
  })

  const quarterlyAverages = Object.values(quarterlyGroups).map(rates => 
    rates.reduce((sum, rate) => sum + rate, 0) / rates.length
  )

  if (quarterlyAverages.length < 2) return 0

  const overallAverage = quarterlyAverages.reduce((sum, rate) => sum + rate, 0) / quarterlyAverages.length
  const variance = quarterlyAverages.reduce((sum, rate) => 
    sum + Math.pow(rate - overallAverage, 2), 0
  ) / quarterlyAverages.length

  return Math.sqrt(variance) / overallAverage
}

/**
 * Generate insights from trends
 */
const generateTrendInsights = (trends, patterns) => {
  const insights = []
  
  if (trends.length < 2) return insights

  const latest = trends[trends.length - 1]
  const previous = trends[trends.length - 2]
  
  // Performance change insights
  const completionChange = latest.avgCompletionRate - previous.avgCompletionRate
  if (Math.abs(completionChange) > 5) {
    insights.push({
      type: completionChange > 0 ? 'positive' : 'negative',
      title: completionChange > 0 ? 'Performance Improvement' : 'Performance Decline',
      description: `Completion rate ${completionChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(completionChange).toFixed(1)}%`,
      impact: Math.abs(completionChange) > 10 ? 'high' : 'medium'
    })
  }

  // Pattern-based insights
  patterns.forEach(pattern => {
    if (pattern.type === 'improvement_trend') {
      insights.push({
        type: 'positive',
        title: 'Sustained Improvement',
        description: pattern.description,
        impact: 'high'
      })
    } else if (pattern.type === 'decline_trend') {
      insights.push({
        type: 'negative',
        title: 'Sustained Decline',
        description: pattern.description,
        impact: 'high'
      })
    }
  })

  return insights
}

/**
 * Generate recommendations based on trends
 */
const generateTrendRecommendations = (patterns, insights) => {
  const recommendations = []
  
  patterns.forEach(pattern => {
    if (pattern.type === 'decline_trend') {
      if (pattern.strength === 'strong') {
        recommendations.push({
          priority: 'high',
          title: 'Critical Trend Intervention',
          description: `Strong declining trend detected over ${pattern.description}. Immediate systematic intervention required.`,
          actions: [
            'Emergency task force formation',
            'Comprehensive root cause analysis',
            'Immediate process overhaul'
          ]
        })
      } else {
        recommendations.push({
          priority: 'high',
          title: 'Declining Trend Management',
          description: 'Investigate causes of consistent performance decline',
          actions: [
            'Review recent session recordings',
            'Conduct advisor training sessions',
            'Implement intervention strategies'
          ]
        })
      }
    } else if (pattern.type === 'improvement_trend') {
      recommendations.push({
        priority: 'low',
        title: 'Sustain Improvement Momentum',
        description: 'Positive trends identified. Maintain and enhance current strategies.',
        actions: [
          'Document successful practices',
          'Share improvement strategies',
          'Continue monitoring progress'
        ]
      })
    } else if (pattern.type === 'seasonal_pattern') {
      recommendations.push({
        priority: 'medium',
        title: 'Seasonal Optimization Strategy',
        description: 'Seasonal patterns detected. Optimize resource allocation accordingly.',
        actions: [
          'Develop seasonal planning strategies',
          'Adjust resource allocation by season',
          'Create seasonal performance benchmarks'
        ]
      })
    }
  })

  insights.forEach(insight => {
    if (insight.type === 'negative' && insight.impact === 'high') {
      recommendations.push({
        priority: 'high',
        title: 'Immediate Performance Intervention',
        description: insight.description,
        actions: [
          'Schedule emergency review meeting',
          'Implement temporary measures',
          'Monitor closely for next period'
        ]
      })
    } else if (insight.type === 'negative' && insight.impact === 'medium') {
      recommendations.push({
        priority: 'medium',
        title: 'Performance Correction Needed',
        description: insight.description,
        actions: [
          'Analyze performance factors',
          'Develop improvement plan',
          'Implement corrective measures'
        ]
      })
    } else if (insight.type === 'positive' && insight.impact === 'high') {
      recommendations.push({
        priority: 'low',
        title: 'Excellence Recognition & Expansion',
        description: insight.description,
        actions: [
          'Document success factors',
          'Replicate successful strategies',
          'Celebrate achievements'
        ]
      })
    }
  })

  // Additional trend-based recommendations
  if (patterns.length === 0 && insights.length === 0) {
    recommendations.push({
      priority: 'low',
      title: 'Trend Monitoring Enhancement',
      description: 'No significant patterns detected. Consider expanding data collection for better trend analysis.',
      actions: [
        'Increase data collection frequency',
        'Expand observation categories',
        'Implement automated trend detection'
      ]
    })
  }

  // Performance stability recommendation
  if (patterns.some(p => p.type === 'improvement_trend') && patterns.some(p => p.type === 'decline_trend')) {
    recommendations.push({
      priority: 'medium',
      title: 'Performance Stabilization',
      description: 'Mixed trends detected. Focus on stabilizing performance.',
      actions: [
        'Identify volatility causes',
        'Implement performance stabilization measures',
        'Create consistent operating procedures'
      ]
    })
  }

  return recommendations
}

/**
 * Export predictive analytics data
 */
export const exportPredictiveAnalytics = (sessions, studentRiskData, longitudinalData) => {
  const exportData = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalStudents: Object.keys(studentRiskData).length,
      highRiskStudents: Object.values(studentRiskData).filter(data => 
        data.riskLevel === RISK_LEVELS.HIGH.level || data.riskLevel === RISK_LEVELS.CRITICAL.level
      ).length,
      averageRiskScore: Object.values(studentRiskData).reduce((sum, data) => 
        sum + data.riskScore, 0
      ) / Object.keys(studentRiskData).length
    },
    studentRiskData,
    longitudinalData,
    riskFactors: RISK_FACTORS,
    riskLevels: RISK_LEVELS
  }

  const dataStr = JSON.stringify(exportData, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = window.URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `predictive_analytics_${new Date().toISOString().split('T')[0]}.json`
  link.click()
  window.URL.revokeObjectURL(url)
}
