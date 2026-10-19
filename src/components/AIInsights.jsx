import React, { useState, useCallback, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb, 
  Target, 
  BarChart3, 
  Sparkles,
  RefreshCw,
  Zap,
  Calendar,
  Users,
  Globe,
  ArrowRight,
  GraduationCap,
  BookOpen,
  Scale,
  Shield,
  Trophy,
  Smartphone,
  Heart,
  Repeat,
  FileText,
  ClipboardList,
  Link,
  PieChart,
  Clock
} from 'lucide-react'
import { showNotification } from '@/components/Notification.jsx'
import { getSessionTypeLabel } from '@/utils/sessionTypeUtils.js'

const AIInsights = React.memo(({ sessionsData, onInsightsGenerated, initialInsights = [] }) => {
  const [insights, setInsights] = useState(initialInsights)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [lastAnalysis, setLastAnalysis] = useState(() => {
    // Try to restore last analysis timestamp from localStorage
    const saved = localStorage.getItem('ai-insights-last-analysis')
    return saved ? new Date(saved) : null
  })

  // Update insights when initialInsights prop changes
  React.useEffect(() => {
    if (initialInsights.length > 0) {
      setInsights(initialInsights)
    }
  }, [initialInsights])

  // Analyze sessions data
  const analyzeSessions = async () => {
    if (!sessionsData || sessionsData.length === 0) {
      showNotification.warning('No sessions available for analysis')
      return
    }

    setIsAnalyzing(true)
    setAnalysisProgress(0)

    try {
      // Simulate AI analysis with progress updates
      const analysisSteps = [
        'Analyzing session patterns...',
        'Identifying trends and correlations...',
        'Generating improvement suggestions...',
        'Calculating performance metrics...',
        'Finalizing insights...'
      ]

      for (let i = 0; i < analysisSteps.length; i++) {
        setAnalysisProgress(((i + 1) / analysisSteps.length) * 100)
        await new Promise(resolve => setTimeout(resolve, 800))
      }

      const generatedInsights = generateAIInsights(sessionsData)
      const analysisTime = new Date()
      
      setInsights(generatedInsights)
      setLastAnalysis(analysisTime)
      
      // Save analysis timestamp to localStorage
      localStorage.setItem('ai-insights-last-analysis', analysisTime.toISOString())
      
      // Pass insights back to parent component
      if (onInsightsGenerated) {
        onInsightsGenerated(generatedInsights)
      }
      
      showNotification.success('AI analysis completed successfully!')
    } catch (error) {
      console.error('Error during AI analysis:', error)
      showNotification.error('Failed to complete AI analysis')
    } finally {
      setIsAnalyzing(false)
      setAnalysisProgress(0)
    }
  }

  // Generate AI insights based on session data
  const generateAIInsights = (sessionsData) => {
    const insights = []

    // Calculate overall statistics
    const totalSessions = sessionsData.length
    const completedSessions = sessionsData.filter(s => s.status === 'completed').length
    const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0

    // Analyze advisor performance with enhanced insights
    // Note: This is now handled by the comprehensive advisor analysis functions below

    // Analyze session types and categories
    const sessionTypeInsights = analyzeSessionTypes(sessionsData)
    insights.push(...sessionTypeInsights)

    // Analyze observation patterns with more depth
    const observationPatterns = analyzeObservationPatterns(sessionsData)
    insights.push(...observationPatterns)

    // Analyze completion trends with predictions
    const completionTrends = analyzeCompletionTrends(sessionsData)
    insights.push(...completionTrends)

    // Generate contextual improvement suggestions
    const improvementSuggestions = generateImprovementSuggestions(sessionsData)
    insights.push(...improvementSuggestions)

    // Analyze session quality with detailed metrics
    const qualityInsights = analyzeSessionQuality(sessionsData)
    insights.push(...qualityInsights)

    // NEW: Analyze student engagement patterns
    const engagementInsights = analyzeStudentEngagement(sessionsData)
    insights.push(...engagementInsights)

    // NEW: Analyze AI tool effectiveness
    const aiToolInsights = analyzeAIToolEffectiveness(sessionsData)
    insights.push(...aiToolInsights)

    // NEW: Analyze temporal patterns
    const temporalInsights = analyzeTemporalPatterns(sessionsData)
    insights.push(...temporalInsights)

    // NEW: Generate strategic recommendations
    const strategicInsights = generateStrategicRecommendations(sessionsData)
    insights.push(...strategicInsights)

    // NEW: Comprehensive advisor performance analysis
    const advisorPerformanceInsights = analyzeAdvisorPerformance(sessionsData)
    insights.push(...advisorPerformanceInsights)

    // NEW: Advisor communication and interaction analysis
    const advisorCommunicationInsights = analyzeAdvisorCommunication(sessionsData)
    insights.push(...advisorCommunicationInsights)

    // NEW: Advisor technology integration analysis
    const advisorTechInsights = analyzeAdvisorTechnologyUse(sessionsData)
    insights.push(...advisorTechInsights)

    // NEW: Advisor specialization and expertise analysis
    const advisorExpertiseInsights = analyzeAdvisorExpertise(sessionsData)
    insights.push(...advisorExpertiseInsights)

    // NEW: Analyze success factors
    const successFactors = analyzeSuccessFactors(sessionsData)
    insights.push(...successFactors)

    // NEW: Enhanced session type deep analysis
    const sessionTypeDeepInsights = analyzeSessionTypeDeepPatterns(sessionsData)
    insights.push(...sessionTypeDeepInsights)

    // NEW: Student demographic insights
    const demographicInsights = analyzeStudentDemographics(sessionsData)
    insights.push(...demographicInsights)

    // NEW: Academic progression insights
    const progressionInsights = analyzeAcademicProgression(sessionsData)
    insights.push(...progressionInsights)

    // NEW: Resource optimization insights
    const resourceInsights = analyzeResourceOptimization(sessionsData)
    insights.push(...resourceInsights)

    // NEW: Risk management insights
    const riskInsights = analyzeRiskManagement(sessionsData)
    insights.push(...riskInsights)

    // NEW: Performance benchmarking insights
    const benchmarkingInsights = analyzePerformanceBenchmarking(sessionsData)
    insights.push(...benchmarkingInsights)

    // NEW: Innovation opportunity insights
    const innovationInsights = analyzeInnovationOpportunities(sessionsData)
    insights.push(...innovationInsights)

    // NEW: Compliance and quality assurance insights
    const complianceInsights = analyzeComplianceQuality(sessionsData)
    insights.push(...complianceInsights)

    // NEW: Cross-functional collaboration insights
    const collaborationInsights = analyzeCrossFunctionalCollaboration(sessionsData)
    insights.push(...collaborationInsights)

    // NEW: Technology adoption insights
    const technologyInsights = analyzeTechnologyAdoption(sessionsData)
    insights.push(...technologyInsights)

    // NEW: Student satisfaction insights
    const satisfactionInsights = analyzeStudentSatisfaction(sessionsData)
    insights.push(...satisfactionInsights)

    // NEW: Operational efficiency insights
    const efficiencyInsights = analyzeOperationalEfficiency(sessionsData)
    insights.push(...efficiencyInsights)

    // NEW: Strategic planning insights
    const planningInsights = analyzeStrategicPlanning(sessionsData)
    insights.push(...planningInsights)

    // Categorize and organize insights by priority and type
    const categorizedInsights = categorizeInsights(insights)
    
    // Return a balanced mix of insights from different categories
    const balancedInsights = getBalancedInsights(categorizedInsights)
    
    return balancedInsights
  }

  // Helper function to check if an insight is strategic
  const isStrategicInsight = (insight) => {
    if (!insight.category) return false
    
    const strategicKeywords = [
      'Strategy', 'Strategic', 'Service Strategy', 'Strategic Planning', 
      'Strategic Excellence', 'Growth Opportunity', 'Quality Assurance',
      'Professional Development', 'Technology Strategy', 'Critical Services',
      'Global Services', 'Accessibility', 'Student Success', 'Student Transition',
      'Career Services', 'Financial Support', 'Advanced Education', 
      'Student Experience', 'Technology Integration', 'Academic Planning',
      'Student Engagement', 'Communication Effectiveness', 'Information Quality',
      'Operational Efficiency', 'Resource Planning', 'Service Integration',
      'Quality Management', 'Innovation', 'Compliance', 'Collaboration',
      'Student Diversity', 'Service Patterns',
      // ADVISOR ANALYSIS CATEGORIES
      'Advisor Excellence', 'Communication Excellence', 'Communication Development',
      'Technology Adoption', 'Information Quality', 'Technology Efficiency',
      'Technical Support', 'Technical Proficiency', 'Student Relations',
      'Technology Communication', 'Communication Adaptability', 'Advisor Versatility',
      'Student Success Focus', 'Retention Strategy', 'Service Integration',
      'Resource Utilization', 'Performance Comparison', 'Technology Mentoring',
      'Advisor Specialization', 'Multi-Specialization', 'Performance Consistency',
      'Session Efficiency', 'Session Quality'
    ]
    
    return strategicKeywords.some(keyword => insight.category.includes(keyword))
  }

  // Categorize insights by type and priority for better organization
  const categorizeInsights = (insights) => {
    const categories = {
      performance: { high: [], medium: [], low: [] },
      efficiency: { high: [], medium: [], low: [] },
      quality: { high: [], medium: [], low: [] },
      strategy: { high: [], medium: [], low: [] },
      risk: { high: [], medium: [], low: [] },
      innovation: { high: [], medium: [], low: [] }
    }

    insights.forEach(insight => {
      const category = getInsightCategory(insight)
      const priority = insight.priority || 'medium'
      
      if (categories[category] && categories[category][priority]) {
        categories[category][priority].push(insight)
      }
    })

    return categories
  }

  // Get balanced insights from different categories
  const getBalancedInsights = (categorizedInsights) => {
    const balanced = []
    const maxPerCategory = 6
    const maxPerPriority = 3

    // Add high priority insights first
    Object.values(categorizedInsights).forEach(category => {
      if (category.high.length > 0) {
        balanced.push(...category.high.slice(0, maxPerPriority))
      }
    })

    // Add medium priority insights
    Object.values(categorizedInsights).forEach(category => {
      if (category.medium.length > 0) {
        balanced.push(...category.medium.slice(0, maxPerPriority))
      }
    })

    // Add low priority insights to fill remaining slots
    Object.values(categorizedInsights).forEach(category => {
      if (category.low.length > 0 && balanced.length < 35) {
        const remaining = 35 - balanced.length
        balanced.push(...category.low.slice(0, Math.min(maxPerPriority, remaining)))
      }
    })

    // Shuffle and limit to 35 insights (increased from 20)
    return shuffleArray(balanced).slice(0, 35)
  }

  // Categorize insight based on its content and type
  const getInsightCategory = (insight) => {
    const title = insight.title?.toLowerCase() || ''
    const category = insight.category?.toLowerCase() || ''
    const description = insight.description?.toLowerCase() || ''

    if (title.includes('performance') || title.includes('excellence') || title.includes('success')) {
      return 'performance'
    } else if (title.includes('efficiency') || title.includes('time') || title.includes('optimization')) {
      return 'efficiency'
    } else if (title.includes('quality') || title.includes('improvement') || title.includes('standards')) {
      return 'quality'
    } else if (title.includes('strategy') || title.includes('planning') || title.includes('growth')) {
      return 'strategy'
    } else if (title.includes('risk') || title.includes('warning') || title.includes('crisis')) {
      return 'risk'
    } else if (title.includes('innovation') || title.includes('opportunity') || title.includes('technology')) {
      return 'innovation'
    } else {
      return 'strategy' // default category
    }
  }

  // Enhanced advisor performance analysis
  const analyzeAdvisorPerformance = (sessions) => {
    const insights = []
    const advisorData = {}

    // Group sessions by advisor with detailed metrics
    sessions.forEach(session => {
      const advisor = session.sessionInfo?.advisor || 'Unknown'
      if (!advisorData[advisor]) {
        advisorData[advisor] = {
          total: 0,
          completed: 0,
          avgDuration: 0,
          strongCategories: [],
          improvementAreas: [],
          durations: []
        }
      }
      advisorData[advisor].total++
      if (session.status === 'completed') advisorData[advisor].completed++
      if (session.sessionInfo?.duration) {
        advisorData[advisor].durations.push(session.sessionInfo.duration)
      }
    })

    // Calculate average duration for each advisor
    Object.keys(advisorData).forEach(advisor => {
      const data = advisorData[advisor]
      if (data.durations.length > 0) {
        data.avgDuration = data.durations.reduce((a, b) => a + b, 0) / data.durations.length
      }
    })

    // Find various types of high performers
    const advisorInsights = generateAdvisorInsights(advisorData)
    insights.push(...advisorInsights)

    return insights
  }

  // Generate varied advisor insights
  const generateAdvisorInsights = (advisorData) => {
    const insights = []
    const advisors = Object.entries(advisorData).filter(([_, data]) => data.total >= 2)

    if (advisors.length === 0) return insights

    // Top completion rate
    const topCompletion = advisors
      .sort(([_, a], [__, b]) => (b.completed / b.total) - (a.completed / a.total))
      .slice(0, 2)

    if (topCompletion.length > 0) {
      const [topName, topData] = topCompletion[0]
      const completionRate = Math.round((topData.completed / topData.total) * 100)

      insights.push({
        type: 'success',
        category: 'Performance',
        title: 'Excellence in Session Management',
        description: `${topName} demonstrates exceptional consistency with ${completionRate}% session completion rate, setting a benchmark for the team.`,
        icon: <TrendingUp className="w-5 h-5" />,
        priority: 'high'
      })
    }

    // Most efficient advisor (good completion with reasonable duration)
    const efficient = advisors
      .filter(([_, data]) => data.avgDuration > 0)
      .sort(([_, a], [__, b]) => {
        const aEfficiency = (a.completed / a.total) / (a.avgDuration / 3600) // per hour
        const bEfficiency = (b.completed / b.total) / (b.avgDuration / 3600)
        return bEfficiency - aEfficiency
      })

    if (efficient.length > 0) {
      const [efficientName, efficientData] = efficient[0]
      const avgMinutes = Math.round(efficientData.avgDuration / 60)

      insights.push({
        type: 'success',
        category: 'Efficiency',
        title: 'Time Management Excellence',
        description: `${efficientName} demonstrates optimal time management with ${avgMinutes}-minute average sessions while maintaining high quality.`,
        icon: <Target className="w-5 h-5" />,
        priority: 'medium'
      })
    }

    return insights
  }

  // Enhanced observation patterns analysis
  const analyzeObservationPatterns = (sessions) => {
    const insights = []
    const categoryStats = {
      advisingProcess: { high: 0, medium: 0, low: 0 },
      studentEngagement: { high: 0, medium: 0, low: 0 },
      aiEnhancedTools: { high: 0, medium: 0, low: 0 },
      communicationInteraction: { high: 0, medium: 0, low: 0 },
      leadershipAlignment: { high: 0, medium: 0, low: 0 }
    }

    // Analyze ratings across categories
    sessions.forEach(session => {
      if (session.observations) {
        Object.keys(categoryStats).forEach(category => {
          const categoryData = session.observations[category]
          if (categoryData) {
            Object.values(categoryData).forEach(item => {
              if (item.rating) {
                if (['High', 'Yes', 'Observed'].includes(item.rating)) {
                  categoryStats[category].high++
                } else if (['Medium', 'Sometimes'].includes(item.rating)) {
                  categoryStats[category].medium++
                } else {
                  categoryStats[category].low++
                }
              }
            })
          }
        })
      }
    })

    // Generate varied insights for different patterns
    Object.entries(categoryStats).forEach(([category, stats]) => {
      const total = stats.high + stats.medium + stats.low
      if (total > 0) {
        const highPercentage = (stats.high / total) * 100
        const lowPercentage = (stats.low / total) * 100
        const categoryName = category.replace(/([A-Z])/g, ' $1').trim()

        // Celebrate strong performance
        if (highPercentage > 70) {
          insights.push({
            type: 'success',
            category: 'Strengths',
            title: `${categoryName} Excellence`,
            description: `Exceptional ${categoryName} performance! ${Math.round(highPercentage)}% of observations show high-quality implementation.`,
            icon: <CheckCircle className="w-5 h-5" />,
            priority: 'high'
          })
        }
        // Address improvement areas with focused language
        else if (lowPercentage > 30) {
          insights.push({
            type: 'warning',
            category: 'Growth Areas',
            title: `${categoryName} Development Opportunity`,
            description: `${categoryName} shows potential for growth with ${Math.round(lowPercentage)}% of observations needing enhancement. Consider targeted development.`,
            icon: <AlertTriangle className="w-5 h-5" />,
            priority: 'medium'
          })
        }
        // Acknowledge steady progress
        else if (highPercentage > 40 && lowPercentage < 30) {
          insights.push({
            type: 'info',
            category: 'Stability',
            title: `${categoryName} Steady Performance`,
            description: `${categoryName} shows steady progress with balanced performance across observations. Continue current approaches.`,
            icon: <BarChart3 className="w-5 h-5" />,
            priority: 'low'
          })
        }
      }
    })

    return insights
  }

  // Analyze completion trends
  const analyzeCompletionTrends = (sessions) => {
    const insights = []
    
    // Group sessions by month
    const monthlyStats = {}
    sessions.forEach(session => {
      const date = new Date(session.sessionInfo?.date || session.createdAt)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = { total: 0, completed: 0 }
      }
      monthlyStats[monthKey].total++
      if (session.status === 'completed') monthlyStats[monthKey].completed++
    })

    // Check for trends
    const months = Object.keys(monthlyStats).sort()
    if (months.length >= 2) {
      const recentMonths = months.slice(-2)
      const recentCompletion = monthlyStats[recentMonths[1]].completed / monthlyStats[recentMonths[1]].total
      const previousCompletion = monthlyStats[recentMonths[0]].completed / monthlyStats[recentMonths[0]].total
      
      if (recentCompletion > previousCompletion + 0.1) {
        insights.push({
          type: 'success',
          category: 'Trends',
          title: 'Improving Completion Rates',
          description: `Completion rates have improved by ${Math.round((recentCompletion - previousCompletion) * 100)}% in recent months.`,
          icon: <TrendingUp className="w-5 h-5" />,
          priority: 'medium'
        })
      } else if (recentCompletion < previousCompletion - 0.1) {
        insights.push({
          type: 'warning',
          category: 'Trends',
          title: 'Declining Completion Rates',
          description: `Completion rates have decreased by ${Math.round((previousCompletion - recentCompletion) * 100)}% recently.`,
          icon: <AlertTriangle className="w-5 h-5" />,
          priority: 'high'
        })
      }
    }

    return insights
  }

  // Generate improvement suggestions
  const generateImprovementSuggestions = (sessions) => {
    const insights = []
    
    // Analyze common issues
    const commonIssues = []
    sessions.forEach(session => {
      if (session.lowCompletionJustification) {
        commonIssues.push(session.lowCompletionJustification.toLowerCase())
      }
    })

    // Find most common issues
    const issueCounts = {}
    commonIssues.forEach(issue => {
      const keywords = issue.split(' ').filter(word => word.length > 3)
      keywords.forEach(keyword => {
        issueCounts[keyword] = (issueCounts[keyword] || 0) + 1
      })
    })

    const topIssues = Object.entries(issueCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)

    if (topIssues.length > 0) {
      insights.push({
        type: 'info',
        category: 'Suggestions',
        title: 'Address Common Issues',
        description: `Focus on addressing: ${topIssues.map(([issue, count]) => 
          `${issue} (${count} occurrences)`
        ).join(', ')}.`,
        icon: <Target className="w-5 h-5" />,
        priority: 'high'
      })
    }

    // Suggest training areas
    const lowRatedCategories = analyzeLowRatedCategories(sessions)
    if (lowRatedCategories.length > 0) {
      insights.push({
        type: 'info',
        category: 'Training',
        title: 'Recommended Training Areas',
        description: `Consider additional training in: ${lowRatedCategories.join(', ')}.`,
        icon: <Lightbulb className="w-5 h-5" />,
        priority: 'medium'
      })
    }

    return insights
  }

  // Analyze session quality
  const analyzeSessionQuality = (sessions) => {
    const insights = []
    
    // Calculate average session duration
    const durations = sessions
      .filter(s => s.sessionInfo?.duration)
      .map(s => s.sessionInfo.duration)
    
    if (durations.length > 0) {
      const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length
      const avgMinutes = Math.floor(avgDuration / 60)
      
      if (avgMinutes < 15) {
        insights.push({
          type: 'warning',
          category: 'Quality',
          title: 'Short Session Duration',
          description: `Average session duration is ${avgMinutes} minutes. Consider extending sessions for more comprehensive observations.`,
          icon: <AlertTriangle className="w-5 h-5" />,
          priority: 'medium'
        })
      } else if (avgMinutes > 45) {
        insights.push({
          type: 'info',
          category: 'Quality',
          title: 'Extended Session Duration',
          description: `Average session duration is ${avgMinutes} minutes. Sessions are comprehensive but may impact efficiency.`,
          icon: <CheckCircle className="w-5 h-5" />,
          priority: 'low'
        })
      }
    }

    return insights
  }

  // Helper function to analyze low-rated categories
  const analyzeLowRatedCategories = (sessions) => {
    const categoryScores = {}
    
    sessions.forEach(session => {
      if (session.observations) {
        Object.entries(session.observations).forEach(([category, data]) => {
          if (!categoryScores[category]) {
            categoryScores[category] = { total: 0, low: 0 }
          }
          
          Object.values(data).forEach(item => {
            if (item.rating) {
              categoryScores[category].total++
              if (['Low', 'No', 'Not Observed'].includes(item.rating)) {
                categoryScores[category].low++
              }
            }
          })
        })
      }
    })

    return Object.entries(categoryScores)
      .filter(([_, scores]) => scores.total > 0 && (scores.low / scores.total) > 0.3)
      .map(([category, _]) => category.replace(/([A-Z])/g, ' $1').trim())
  }

  // NEW: Analyze student engagement patterns
  const analyzeStudentEngagement = (sessions) => {
    const insights = []
    const engagementPatterns = {}

    sessions.forEach(session => {
      if (session.observations?.studentEngagement) {
        Object.entries(session.observations.studentEngagement).forEach(([key, item]) => {
          if (!engagementPatterns[key]) engagementPatterns[key] = { high: 0, medium: 0, low: 0, total: 0 }
          engagementPatterns[key].total++
          
          if (['High', 'Yes', 'Observed'].includes(item.rating)) {
            engagementPatterns[key].high++
          } else if (['Medium', 'Sometimes'].includes(item.rating)) {
            engagementPatterns[key].medium++
          } else {
            engagementPatterns[key].low++
          }
        })
      }
    })

    // Find highest and lowest engagement areas
    const engagementInsights = Object.entries(engagementPatterns)
      .filter(([_, data]) => data.total > 0)
      .map(([key, data]) => ({
        key,
        highRate: (data.high / data.total) * 100,
        lowRate: (data.low / data.total) * 100
      }))
      .sort((a, b) => b.highRate - a.highRate)

    if (engagementInsights.length > 0) {
      const topEngagement = engagementInsights[0]
      const engagement_comments = [
        ` Students show exceptional engagement in ${topEngagement.key.replace(/([A-Z])/g, ' $1')} with ${Math.round(topEngagement.highRate)}% high participation rates.`,
        ` Outstanding student interaction observed in ${topEngagement.key.replace(/([A-Z])/g, ' $1')} - ${Math.round(topEngagement.highRate)}% demonstrate active engagement.`,
        ` ${topEngagement.key.replace(/([A-Z])/g, ' $1')} generates strong student enthusiasm with ${Math.round(topEngagement.highRate)}% showing high engagement levels.`,
        ` Remarkable student response in ${topEngagement.key.replace(/([A-Z])/g, ' $1')} sessions - ${Math.round(topEngagement.highRate)}% actively participate.`
      ]

      insights.push({
        type: 'success',
        category: 'Engagement',
        title: 'Peak Student Engagement',
        description: engagement_comments[Math.floor(Math.random() * engagement_comments.length)],
        icon: <Sparkles className="w-5 h-5" />,
        priority: 'high'
      })
    }

    return insights
  }

  // NEW: Analyze AI tool effectiveness
  const analyzeAIToolEffectiveness = (sessions) => {
    const insights = []
    const aiToolData = { effective: 0, ineffective: 0, total: 0 }

    sessions.forEach(session => {
      if (session.observations?.aiEnhancedTools) {
        Object.values(session.observations.aiEnhancedTools).forEach(item => {
          if (item.rating) {
            aiToolData.total++
            if (['High', 'Yes', 'Observed'].includes(item.rating)) {
              aiToolData.effective++
            } else if (['Low', 'No', 'Not Observed'].includes(item.rating)) {
              aiToolData.ineffective++
            }
          }
        })
      }
    })

    if (aiToolData.total > 0) {
      const effectiveRate = (aiToolData.effective / aiToolData.total) * 100
      
      if (effectiveRate > 60) {
        const ai_success_insights = [
          ` AI tools are making a significant impact! ${Math.round(effectiveRate)}% effectiveness rate demonstrates successful technology integration.`,
          ` Exceptional AI tool adoption with ${Math.round(effectiveRate)}% positive outcomes. Technology is enhancing student experiences.`,
          ` AI-enhanced sessions show remarkable success - ${Math.round(effectiveRate)}% effectiveness indicates strong digital literacy.`,
          ` Outstanding AI tool utilization achieving ${Math.round(effectiveRate)}% effectiveness. Innovation is driving results.`
        ]

        insights.push({
          type: 'success',
          category: 'Technology',
          title: 'AI Tools Driving Success',
          description: ai_success_insights[Math.floor(Math.random() * ai_success_insights.length)],
          icon: <Brain className="w-5 h-5" />,
          priority: 'high'
        })
      } else if (effectiveRate < 40) {
        const ai_improvement_insights = [
          ` AI tool effectiveness at ${Math.round(effectiveRate)}% suggests room for training and optimization. Consider additional support.`,
          ` AI tools show potential with ${Math.round(effectiveRate)}% current effectiveness. Additional training could unlock their full power.`,
          ` Opportunity to enhance AI tool integration - current ${Math.round(effectiveRate)}% effectiveness indicates need for guidance.`,
          ` AI tools need optimization. ${Math.round(effectiveRate)}% effectiveness suggests training and technical support could help.`
        ]

        insights.push({
          type: 'warning',
          category: 'Technology',
          title: 'AI Tools Need Enhancement',
          description: ai_improvement_insights[Math.floor(Math.random() * ai_improvement_insights.length)],
          icon: <AlertTriangle className="w-5 h-5" />,
          priority: 'medium'
        })
      }
    }

    return insights
  }

  // NEW: Analyze temporal patterns
  const analyzeTemporalPatterns = (sessions) => {
    const insights = []
    const timePatterns = { morning: 0, afternoon: 0, evening: 0 }
    
    sessions.forEach(session => {
      const time = session.sessionInfo?.time
      if (time) {
        const hour = parseInt(time.split(':')[0])
        if (hour < 12) timePatterns.morning++
        else if (hour < 17) timePatterns.afternoon++
        else timePatterns.evening++
      }
    })

    const total = timePatterns.morning + timePatterns.afternoon + timePatterns.evening
    if (total > 0) {
      const peak = Object.entries(timePatterns)
        .sort(([,a], [,b]) => b - a)[0]
      
      const peakPercentage = (peak[1] / total) * 100
      
      if (peakPercentage > 50) {
        const time_insights = [
          ` Peak productivity identified in ${peak[0]} sessions with ${Math.round(peakPercentage)}% of activity. Optimal scheduling detected!`,
          ` ${peak[0]} emerges as the prime time slot with ${Math.round(peakPercentage)}% of sessions. Energy levels are highest then.`,
          ` Strategic timing advantage: ${peak[0]} sessions account for ${Math.round(peakPercentage)}% of activity, indicating optimal focus periods.`,
          ` ${peak[0]} sessions dominate with ${Math.round(peakPercentage)}% of activity. This timing maximizes advisor and student effectiveness.`
        ]

        insights.push({
          type: 'info',
          category: 'Timing',
          title: 'Optimal Session Timing',
          description: time_insights[Math.floor(Math.random() * time_insights.length)],
          icon: <Target className="w-5 h-5" />,
          priority: 'medium'
        })
      }
    }

    return insights
  }

  // Enhanced strategic recommendations with comprehensive analysis
  const generateStrategicRecommendations = (sessions) => {
    const insights = []
    const sessionTypes = {}
    const sessionCategories = {}
    const advisorPerformance = {}
    const completionRates = {}
    
    // Analyze comprehensive session data
    sessions.forEach(session => {
      const type = session.sessionInfo?.sessionType || 'General'
      const category = getSessionTypeCategory(type)
      const advisor = session.sessionInfo?.advisor || 'Unknown'
      const completionRate = session.completionRate || 0
      
      sessionTypes[type] = (sessionTypes[type] || 0) + 1
      sessionCategories[category] = (sessionCategories[category] || 0) + 1
      
      if (!advisorPerformance[advisor]) {
        advisorPerformance[advisor] = { total: 0, completed: 0, avgCompletion: 0 }
      }
      advisorPerformance[advisor].total++
      if (session.status === 'completed') advisorPerformance[advisor].completed++
      advisorPerformance[advisor].avgCompletion += completionRate
      
      // Track completion rates by session type
      if (!completionRates[type]) completionRates[type] = []
      completionRates[type].push(completionRate)
    })

    const totalSessions = sessions.length
    if (totalSessions > 10) {
      // 1. Session Type Strategy
      const topSessionTypes = Object.entries(sessionTypes)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
      
      if (topSessionTypes.length > 0) {
        const [topType, count] = topSessionTypes[0]
        const topTypeLabel = getSessionTypeLabel(topType)
        const percentage = Math.round((count / totalSessions) * 100)
        
        insights.push({
          type: 'success',
          category: 'Service Strategy',
          title: 'Primary Service Focus',
          description: `${topTypeLabel} sessions represent ${percentage}% of all sessions (${count} sessions). Develop specialized training programs and resource allocation to maintain excellence in this core service area.`,
          icon: <Target className="w-5 h-5" />,
          priority: 'high'
        })
      }

      // 2. Category Distribution Strategy
      const topCategories = Object.entries(sessionCategories)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 2)
      
      if (topCategories.length > 0) {
        const [topCategory, count] = topCategories[0]
        const categoryName = getCategoryDisplayName(topCategory)
        const percentage = Math.round((count / totalSessions) * 100)

      insights.push({
        type: 'info',
          category: 'Strategic Planning',
          title: 'Service Category Dominance',
          description: `${categoryName} services account for ${percentage}% of sessions. Consider expanding specialized expertise, cross-training advisors, and developing best practice protocols for this dominant category.`,
          icon: <BarChart3 className="w-5 h-5" />,
          priority: 'medium'
        })
      }

      // 3. Underutilized Services Strategy
      const underutilizedTypes = Object.entries(sessionTypes)
        .filter(([, count]) => count < 2)
        .map(([type]) => getSessionTypeLabel(type))
      
      if (underutilizedTypes.length > 0) {
        insights.push({
          type: 'warning',
          category: 'Growth Opportunity',
          title: 'Service Expansion Strategy',
          description: `Promote ${underutilizedTypes.slice(0, 3).join(', ')} sessions through targeted marketing, advisor training, and student awareness campaigns. These specialized services could significantly enhance institutional offerings and student support.`,
          icon: <TrendingUp className="w-5 h-5" />,
          priority: 'medium'
        })
      }

      // 4. Quality Improvement Strategy
      const lowCompletionTypes = Object.entries(completionRates)
        .filter(([, rates]) => {
          const avgRate = rates.reduce((a, b) => a + b, 0) / rates.length
          return avgRate < 70
        })
        .map(([type]) => getSessionTypeLabel(type))
      
      if (lowCompletionTypes.length > 0) {
        insights.push({
          type: 'warning',
          category: 'Quality Assurance',
          title: 'Quality Improvement Focus',
          description: `Focus on improving completion rates in ${lowCompletionTypes.slice(0, 3).join(', ')} sessions. Implement targeted training, process optimization, and support systems to enhance advisor effectiveness in these areas.`,
          icon: <AlertTriangle className="w-5 h-5" />,
          priority: 'high'
        })
      }

      // 5. Advisor Development Strategy
      const advisorStats = Object.entries(advisorPerformance)
        .filter(([, data]) => data.total >= 3)
        .map(([name, data]) => ({
          name,
          completionRate: (data.completed / data.total) * 100,
          avgCompletion: data.avgCompletion / data.total
        }))
        .sort((a, b) => b.completionRate - a.completionRate)
      
      if (advisorStats.length > 0) {
        const topAdvisor = advisorStats[0]
        const bottomAdvisor = advisorStats[advisorStats.length - 1]
        
        if (topAdvisor.completionRate - bottomAdvisor.completionRate > 20) {
          insights.push({
            type: 'info',
            category: 'Professional Development',
            title: 'Knowledge Transfer Strategy',
            description: `Performance gap detected: ${topAdvisor.name} (${Math.round(topAdvisor.completionRate)}%) vs ${bottomAdvisor.name} (${Math.round(bottomAdvisor.completionRate)}%). Implement peer mentoring programs and best practice sharing to bridge this gap.`,
            icon: <Users className="w-5 h-5" />,
            priority: 'medium'
          })
        }
      }

      // 6. Technology Integration Strategy
      const aiToolSessions = sessions.filter(s => {
        const observations = s.observations?.aiEnhancedTools
        return observations && Object.values(observations).some(item => 
          item.rating && ['Yes', 'Observed', 'Effective'].includes(item.rating)
        )
      }).length
      
      const aiAdoptionRate = (aiToolSessions / totalSessions) * 100
      
      if (aiAdoptionRate < 60) {
        insights.push({
          type: 'info',
          category: 'Technology Strategy',
          title: 'AI Tool Adoption Strategy',
          description: `AI tool adoption rate is ${Math.round(aiAdoptionRate)}%. Develop comprehensive training programs, create AI tool champions, and establish clear protocols to increase technology integration across all session types.`,
          icon: <Smartphone className="w-5 h-5" />,
          priority: 'medium'
        })
      }

      // 7. Crisis Management Strategy
      const crisisSessions = sessions.filter(s => 
        ['crisis-intervention', 'mental-health'].includes(s.sessionInfo?.sessionType)
      ).length
      
      if (crisisSessions > 0) {
        insights.push({
          type: 'warning',
          category: 'Critical Services',
          title: 'Crisis Response Strategy',
          description: `${crisisSessions} crisis intervention sessions detected. Ensure comprehensive crisis protocols, staff training, and support systems are in place. Consider establishing a dedicated crisis response team.`,
          icon: <Shield className="w-5 h-5" />,
          priority: 'high'
        })
      }

      // 8. International Student Strategy
      const internationalSessions = sessions.filter(s => 
        ['international-student', 'study-abroad'].includes(s.sessionInfo?.sessionType)
      ).length
      
      if (internationalSessions > 0) {
        insights.push({
          type: 'info',
          category: 'Global Services',
          title: 'International Student Support Strategy',
          description: `${internationalSessions} international student sessions indicate growing global engagement. Develop specialized cultural competency training, multilingual resources, and international student support protocols.`,
          icon: <Globe className="w-5 h-5" />,
          priority: 'medium'
        })
      }

      // 9. Resource Optimization Strategy
      const avgSessionDuration = sessions.reduce((total, s) => 
        total + (s.sessionInfo?.duration || 0), 0
      ) / totalSessions
      
      if (avgSessionDuration > 1200) { // More than 20 minutes
        insights.push({
          type: 'info',
          category: 'Operational Efficiency',
          title: 'Session Duration Optimization',
          description: `Average session duration is ${Math.round(avgSessionDuration / 60)} minutes. Implement time management training, session templates, and process streamlining to optimize advisor efficiency while maintaining quality.`,
          icon: <Clock className="w-5 h-5" />,
          priority: 'medium'
        })
      }

      // 10. Data-Driven Decision Making Strategy
      insights.push({
        type: 'success',
        category: 'Analytics Strategy',
        title: 'Data-Driven Strategic Planning',
        description: `With ${totalSessions} sessions across ${Object.keys(sessionTypes).length} types, leverage this rich dataset for evidence-based decision making. Establish regular analytics reviews, performance dashboards, and strategic planning cycles.`,
        icon: <BarChart3 className="w-5 h-5" />,
        priority: 'high'
      })

      // 11. Student Success Strategy
      const academicProbationSessions = sessions.filter(s => 
        s.sessionInfo?.sessionType === 'academic-probation'
      ).length
      
      if (academicProbationSessions > 0) {
        insights.push({
          type: 'warning',
          category: 'Student Success',
          title: 'Academic Probation Intervention Strategy',
          description: `${academicProbationSessions} academic probation sessions detected. Implement early warning systems, proactive intervention programs, and academic support networks to prevent academic difficulties.`,
          icon: <GraduationCap className="w-5 h-5" />,
          priority: 'high'
        })
      }

      // 12. Transfer Student Strategy
      const transferSessions = sessions.filter(s => 
        ['transfer-student', 'transfer-credit'].includes(s.sessionInfo?.sessionType)
      ).length
      
      if (transferSessions > 0) {
        insights.push({
          type: 'info',
          category: 'Student Transition',
          title: 'Transfer Student Support Strategy',
          description: `${transferSessions} transfer student sessions indicate growing transfer population. Develop comprehensive orientation programs, credit evaluation systems, and transition support services.`,
          icon: <ArrowRight className="w-5 h-5" />,
          priority: 'medium'
        })
      }

      // 13. Career Development Strategy
      const careerSessions = sessions.filter(s => 
        ['career-counseling', 'internship-coop'].includes(s.sessionInfo?.sessionType)
      ).length
      
      if (careerSessions > 0) {
        insights.push({
          type: 'info',
          category: 'Career Services',
          title: 'Career Development Strategy',
          description: `${careerSessions} career-focused sessions suggest strong career preparation needs. Expand career counseling services, internship programs, and industry partnership networks.`,
          icon: <Target className="w-5 h-5" />,
          priority: 'medium'
        })
      }

      // 14. Financial Aid Strategy
      const financialSessions = sessions.filter(s => 
        s.sessionInfo?.sessionType === 'financial-aid'
      ).length
      
      if (financialSessions > 0) {
        insights.push({
          type: 'info',
          category: 'Financial Support',
          title: 'Financial Aid Optimization Strategy',
          description: `${financialSessions} financial aid sessions indicate student financial concerns. Develop comprehensive financial literacy programs, scholarship databases, and emergency funding protocols.`,
          icon: <Scale className="w-5 h-5" />,
          priority: 'medium'
        })
      }

      // 15. Graduate School Strategy
      const graduateSessions = sessions.filter(s => 
        s.sessionInfo?.sessionType === 'graduate-school'
      ).length
      
      if (graduateSessions > 0) {
        insights.push({
          type: 'info',
          category: 'Advanced Education',
          title: 'Graduate School Preparation Strategy',
          description: `${graduateSessions} graduate school sessions show advanced academic planning needs. Establish graduate school preparation programs, research opportunities, and faculty mentoring networks.`,
          icon: <BookOpen className="w-5 h-5" />,
          priority: 'medium'
        })
      }

      // 16. Study Abroad Strategy
      const studyAbroadSessions = sessions.filter(s => 
        s.sessionInfo?.sessionType === 'study-abroad'
      ).length
      
      if (studyAbroadSessions > 0) {
        insights.push({
          type: 'info',
          category: 'Global Education',
          title: 'Study Abroad Expansion Strategy',
          description: `${studyAbroadSessions} study abroad sessions indicate international education interest. Develop comprehensive study abroad programs, cultural preparation, and international partnership networks.`,
          icon: <Globe className="w-5 h-5" />,
          priority: 'medium'
        })
      }

      // 17. Disability Services Strategy
      const disabilitySessions = sessions.filter(s => 
        s.sessionInfo?.sessionType === 'disability-services'
      ).length
      
      if (disabilitySessions > 0) {
        insights.push({
          type: 'info',
          category: 'Accessibility',
          title: 'Disability Services Enhancement Strategy',
          description: `${disabilitySessions} disability services sessions show accessibility needs. Implement comprehensive accommodation systems, accessibility training, and inclusive design principles across all services.`,
          icon: <Heart className="w-5 h-5" />,
          priority: 'medium'
        })
      }

      // 18. Communication Strategy
      const communicationSessions = sessions.filter(s => {
        const observations = s.observations?.communicationInteraction
        return observations && Object.values(observations).some(item => 
          item.rating && ['Weak', 'Moderate'].includes(item.rating)
        )
      }).length
      
      if (communicationSessions > 0) {
        insights.push({
          type: 'warning',
          category: 'Communication',
          title: 'Communication Skills Enhancement Strategy',
          description: `${communicationSessions} sessions show communication improvement needs. Implement communication training programs, cultural competency workshops, and active listening skill development.`,
          icon: <Users className="w-5 h-5" />,
          priority: 'medium'
        })
      }

      // 19. AI Tool Effectiveness Strategy
      const aiEffectivenessSessions = sessions.filter(s => {
        const observations = s.observations?.aiEnhancedTools
        return observations && Object.values(observations).some(item => 
          item.rating && ['Limited', 'Not used'].includes(item.rating)
        )
      }).length
      
      if (aiEffectivenessSessions > 0) {
        insights.push({
          type: 'warning',
          category: 'Technology',
          title: 'AI Tool Effectiveness Strategy',
          description: `${aiEffectivenessSessions} sessions show AI tool effectiveness issues. Develop comprehensive AI training programs, user experience improvements, and integration protocols.`,
          icon: <Smartphone className="w-5 h-5" />,
          priority: 'medium'
        })
      }

      // 20. Student Engagement Strategy
      const lowEngagementSessions = sessions.filter(s => {
        const observations = s.observations?.studentEngagement
        return observations && Object.values(observations).some(item => 
          item.rating && ['Low', 'No'].includes(item.rating)
        )
      }).length
      
      if (lowEngagementSessions > 0) {
        insights.push({
          type: 'warning',
          category: 'Student Engagement',
          title: 'Student Engagement Enhancement Strategy',
          description: `${lowEngagementSessions} sessions show low student engagement. Implement interactive advising techniques, student-centered approaches, and engagement measurement systems.`,
          icon: <Heart className="w-5 h-5" />,
          priority: 'medium'
        })
      }

      // 21. Referral Services Strategy
      const referralSessions = sessions.filter(s => {
        const observations = s.observations?.advisingProcess?.referralServices
        return observations && observations.rating === 'No'
      }).length
      
      if (referralSessions > 0) {
        insights.push({
          type: 'info',
          category: 'Service Integration',
          title: 'Referral Services Enhancement Strategy',
          description: `${referralSessions} sessions show referral service opportunities. Develop comprehensive referral networks, service integration protocols, and cross-departmental collaboration systems.`,
          icon: <Link className="w-5 h-5" />,
          priority: 'medium'
        })
      }

      // 22. Active Listening Strategy
      const listeningSessions = sessions.filter(s => {
        const observations = s.observations?.communicationInteraction?.activeListening
        return observations && ['Weak', 'Moderate'].includes(observations.rating)
      }).length
      
      if (listeningSessions > 0) {
        insights.push({
          type: 'warning',
          category: 'Professional Skills',
          title: 'Active Listening Enhancement Strategy',
          description: `${listeningSessions} sessions show active listening improvement needs. Implement listening skills training, empathy development programs, and communication assessment tools.`,
          icon: <Users className="w-5 h-5" />,
          priority: 'medium'
        })
      }

      // 23. Systems Thinking Strategy
      const systemsSessions = sessions.filter(s => {
        const observations = s.observations?.leadershipAlignment?.systemsThinking
        return observations && observations.rating === 'Not Observed'
      }).length
      
      if (systemsSessions > 0) {
        insights.push({
          type: 'info',
          category: 'Leadership Development',
          title: 'Systems Thinking Enhancement Strategy',
          description: `${systemsSessions} sessions show systems thinking development opportunities. Implement leadership training programs, institutional perspective workshops, and cross-functional collaboration initiatives.`,
          icon: <BarChart3 className="w-5 h-5" />,
          priority: 'medium'
        })
      }

      // 24. Retention Strategy
      const retentionSessions = sessions.filter(s => {
        const observations = s.observations?.leadershipAlignment?.retentionStrategies
        return observations && observations.rating === 'No'
      }).length
      
      if (retentionSessions > 0) {
        insights.push({
          type: 'warning',
          category: 'Student Retention',
          title: 'Retention Strategy Implementation',
          description: `${retentionSessions} sessions show retention strategy gaps. Develop comprehensive retention programs, early warning systems, and student success initiatives.`,
          icon: <TrendingUp className="w-5 h-5" />,
          priority: 'high'
        })
      }

      // 25. Technical Issues Strategy
      const technicalSessions = sessions.filter(s => {
        const observations = s.observations?.aiEnhancedTools?.technicalIssues
        return observations && observations.rating === 'Yes'
      }).length
      
      if (technicalSessions > 0) {
        insights.push({
          type: 'warning',
          category: 'Technical Support',
          title: 'Technical Support Enhancement Strategy',
          description: `${technicalSessions} sessions experienced technical issues. Implement robust technical support systems, preventive maintenance protocols, and user training programs.`,
          icon: <Zap className="w-5 h-5" />,
          priority: 'medium'
        })
      }

      // 26. Student Satisfaction Strategy
      const satisfactionSessions = sessions.filter(s => {
        const observations = s.observations?.communicationInteraction?.studentSatisfaction
        return observations && ['Neutral', 'Negative'].includes(observations.rating)
      }).length
      
      if (satisfactionSessions > 0) {
        insights.push({
          type: 'warning',
          category: 'Student Experience',
          title: 'Student Satisfaction Enhancement Strategy',
          description: `${satisfactionSessions} sessions show student satisfaction concerns. Implement satisfaction measurement systems, service improvement protocols, and student feedback integration.`,
          icon: <Heart className="w-5 h-5" />,
          priority: 'high'
        })
      }

      // 27. AI Integration Strategy
      const aiIntegrationSessions = sessions.filter(s => {
        const observations = s.observations?.communicationInteraction?.aiOutputIntegration
        return observations && ['Limited', 'Not used'].includes(observations.rating)
      }).length
      
      if (aiIntegrationSessions > 0) {
        insights.push({
          type: 'warning',
          category: 'Technology Integration',
          title: 'AI Integration Enhancement Strategy',
          description: `${aiIntegrationSessions} sessions show AI integration improvement needs. Develop seamless AI integration protocols, user experience optimization, and natural conversation flow enhancement.`,
          icon: <Smartphone className="w-5 h-5" />,
          priority: 'medium'
        })
      }

      // 28. Degree Requirements Strategy
      const degreeSessions = sessions.filter(s => {
        const observations = s.observations?.advisingProcess?.degreeRequirements
        return observations && ['Sometimes', 'Never'].includes(observations.rating)
      }).length
      
      if (degreeSessions > 0) {
        insights.push({
          type: 'warning',
          category: 'Academic Planning',
          title: 'Degree Requirements Clarity Strategy',
          description: `${degreeSessions} sessions show degree requirements confusion. Implement clear degree planning tools, requirement visualization systems, and academic pathway mapping.`,
          icon: <GraduationCap className="w-5 h-5" />,
          priority: 'medium'
        })
      }

      // 29. Proactive Questions Strategy
      const proactiveSessions = sessions.filter(s => {
        const observations = s.observations?.studentEngagement?.questionsProactive
        return observations && ['Low', 'Medium'].includes(observations.rating)
      }).length
      
      if (proactiveSessions > 0) {
        insights.push({
          type: 'info',
          category: 'Student Engagement',
          title: 'Proactive Question Encouragement Strategy',
          description: `${proactiveSessions} sessions show low proactive questioning. Implement question-encouraging techniques, student curiosity development, and interactive advising approaches.`,
        icon: <Lightbulb className="w-5 h-5" />,
        priority: 'medium'
        })
      }

      // 30. Understanding Advice Strategy
      const understandingSessions = sessions.filter(s => {
        const observations = s.observations?.studentEngagement?.understandingAdvice
        return observations && ['No', 'Unclear'].includes(observations.rating)
      }).length
      
      if (understandingSessions > 0) {
        insights.push({
          type: 'warning',
          category: 'Communication Effectiveness',
          title: 'Advice Understanding Enhancement Strategy',
          description: `${understandingSessions} sessions show advice comprehension issues. Implement clear communication protocols, comprehension verification methods, and follow-up confirmation systems.`,
          icon: <CheckCircle className="w-5 h-5" />,
          priority: 'medium'
        })
      }

      // 31. Accurate Information Strategy
      const accuracySessions = sessions.filter(s => {
        const observations = s.observations?.aiEnhancedTools?.accurateInfo
        return observations && ['Partially Accurate', 'Inaccurate'].includes(observations.rating)
      }).length
      
      if (accuracySessions > 0) {
        insights.push({
          type: 'warning',
          category: 'Information Quality',
          title: 'Information Accuracy Enhancement Strategy',
          description: `${accuracySessions} sessions show information accuracy concerns. Implement information verification protocols, real-time update systems, and accuracy monitoring tools.`,
          icon: <CheckCircle className="w-5 h-5" />,
          priority: 'high'
        })
      }

      // 32. Efficiency Enhancement Strategy
      const efficiencySessions = sessions.filter(s => {
        const observations = s.observations?.aiEnhancedTools?.enhancesEfficiency
        return observations && observations.rating === 'No'
      }).length
      
      if (efficiencySessions > 0) {
        insights.push({
          type: 'warning',
          category: 'Operational Efficiency',
          title: 'Efficiency Enhancement Strategy',
          description: `${efficiencySessions} sessions show efficiency improvement needs. Implement process optimization, workflow streamlining, and efficiency measurement systems.`,
          icon: <Target className="w-5 h-5" />,
          priority: 'medium'
        })
      }

      // 33-49. Additional Strategic Insights (simplified to avoid undefined function calls)
      
      // 33. Time Management Strategy
      const sessionTimes = sessions.map(s => s.sessionInfo?.duration || 0)
      const avgDuration = sessionTimes.reduce((a, b) => a + b, 0) / sessionTimes.length
      
      if (avgDuration > 1200) { // More than 20 minutes
        insights.push({
          type: 'info',
          category: 'Resource Planning',
          title: 'Session Duration Optimization Strategy',
          description: `Average session duration is ${Math.round(avgDuration / 60)} minutes. Implement time management training, session templates, and process streamlining to optimize efficiency.`,
          icon: <Clock className="w-5 h-5" />,
          priority: 'medium'
        })
      }

      // 34. Service Integration Strategy
      const referralRate = sessions.filter(s => {
        const observations = s.observations?.advisingProcess?.referralServices
        return observations && observations.rating === 'Yes'
      }).length / sessions.length * 100
      
      if (referralRate < 30) {
        insights.push({
          type: 'info',
          category: 'Service Integration',
          title: 'Cross-Service Integration Strategy',
          description: `Only ${Math.round(referralRate)}% of sessions include referrals. Develop comprehensive referral networks and cross-departmental collaboration systems.`,
          icon: <Link className="w-5 h-5" />,
          priority: 'medium'
        })
      }

      // 35. Professional Development Strategy
      const advisorCount = new Set(sessions.map(s => s.sessionInfo?.advisor)).size
      
      if (advisorCount > 1) {
        insights.push({
          type: 'success',
          category: 'Professional Development',
          title: 'Multi-Advisor Collaboration Strategy',
          description: `${advisorCount} advisors contributing to sessions. Develop knowledge sharing platforms, peer mentoring programs, and best practice documentation.`,
          icon: <Users className="w-5 h-5" />,
          priority: 'medium'
        })
      }

      // 36. Quality Management Strategy
      const highQualitySessions = sessions.filter(s => s.completionRate > 85).length
      const qualityRate = (highQualitySessions / sessions.length) * 100
      
      if (qualityRate < 60) {
        insights.push({
          type: 'warning',
          category: 'Quality Management',
          title: 'Quality Enhancement Strategy',
          description: `${Math.round(qualityRate)}% high-quality sessions. Implement quality assurance protocols, performance standards, and continuous improvement processes.`,
          icon: <Scale className="w-5 h-5" />,
          priority: 'medium'
        })
      }

      // 37. Innovation Strategy
      const aiUsageSessions = sessions.filter(s => {
        const observations = s.observations?.aiEnhancedTools
        return observations && Object.values(observations).some(item => 
          item.rating && ['Yes', 'Effective', 'Accurate'].includes(item.rating)
        )
      }).length
      
      if (aiUsageSessions > 0) {
        insights.push({
          type: 'success',
          category: 'Innovation',
          title: 'Technology Innovation Strategy',
          description: `${aiUsageSessions} sessions demonstrate AI tool adoption. Expand innovation programs, technology integration, and digital transformation initiatives.`,
          icon: <Sparkles className="w-5 h-5" />,
          priority: 'medium'
        })
      }

      // 38. Compliance Strategy
      const documentationRate = sessions.filter(s => s.observations?.generalNotes && s.observations.generalNotes.trim()).length / sessions.length * 100
      
      if (documentationRate < 70) {
        insights.push({
          type: 'warning',
          category: 'Compliance',
          title: 'Documentation Compliance Strategy',
          description: `${Math.round(documentationRate)}% sessions have complete documentation. Implement documentation standards, compliance monitoring, and audit protocols.`,
          icon: <Shield className="w-5 h-5" />,
          priority: 'high'
        })
      }

      // 39. Collaboration Strategy
      const collaborativeSessions = sessions.filter(s => {
        const observations = s.observations?.leadershipAlignment?.systemsThinking
        return observations && observations.rating === 'Observed'
      }).length
      
      if (collaborativeSessions > 0) {
        insights.push({
          type: 'info',
          category: 'Collaboration',
          title: 'Systems Collaboration Strategy',
          description: `${collaborativeSessions} sessions demonstrate systems thinking. Develop collaborative platforms, cross-functional teams, and integrated service models.`,
          icon: <Users className="w-5 h-5" />,
          priority: 'medium'
        })
      }

      // 40. Performance Strategy
      const performanceMetrics = {
        totalSessions: sessions.length,
        completedSessions: sessions.filter(s => s.status === 'completed').length,
        avgCompletion: sessions.reduce((sum, s) => sum + (s.completionRate || 0), 0) / sessions.length
      }
      
      insights.push({
        type: 'info',
        category: 'Performance',
        title: 'Performance Excellence Strategy',
        description: `${performanceMetrics.completedSessions}/${performanceMetrics.totalSessions} completed sessions with ${Math.round(performanceMetrics.avgCompletion)}% avg completion. Implement performance dashboards and improvement tracking.`,
        icon: <Trophy className="w-5 h-5" />,
        priority: 'medium'
      })

      // 41. Resource Management Strategy
      const uniqueSessionTypes = new Set(sessions.map(s => s.sessionInfo?.sessionType)).size
      
      insights.push({
        type: 'info',
        category: 'Resource Management',
        title: 'Service Diversification Strategy',
        description: `${uniqueSessionTypes} different session types offered. Optimize resource allocation, staff specialization, and service delivery models for maximum efficiency.`,
        icon: <BarChart3 className="w-5 h-5" />,
        priority: 'medium'
      })

      // 42. Academic Success Strategy
      const academicSessions = sessions.filter(s => 
        ['initial-advising', 'course-registration', 'graduation-planning'].includes(s.sessionInfo?.sessionType)
      ).length
      
      if (academicSessions > 0) {
        insights.push({
          type: 'warning',
          category: 'Academic Success',
          title: 'Academic Pathway Strategy',
          description: `${academicSessions} core academic sessions. Implement progression tracking, milestone monitoring, and success intervention protocols.`,
          icon: <GraduationCap className="w-5 h-5" />,
          priority: 'high'
        })
      }

      // 50. Comprehensive Improvement Strategy
      insights.push({
        type: 'success',
        category: 'Strategic Excellence',
        title: 'Comprehensive Institutional Improvement Strategy',
        description: `With ${totalSessions} sessions analyzed across ${Object.keys(sessionTypes).length} types, implement a comprehensive improvement framework covering all strategic areas for institutional excellence.`,
        icon: <Trophy className="w-5 h-5" />,
        priority: 'high'
      })
    }

    return insights
  }

  // NEW: Analyze success factors
  const analyzeSuccessFactors = (sessions) => {
    const insights = []
    const completedSessions = sessions.filter(s => s.status === 'completed')
    
    if (completedSessions.length > 0) {
      const successRate = (completedSessions.length / sessions.length) * 100
      
      if (successRate > 80) {
        const success_insights = [
          ` Exceptional ${Math.round(successRate)}% completion rate demonstrates outstanding systematic approach and dedication to student success.`,
          ` Remarkable ${Math.round(successRate)}% completion rate reflects strong organizational skills and commitment to comprehensive documentation.`,
          ` Outstanding ${Math.round(successRate)}% completion rate indicates excellent planning, execution, and follow-through capabilities.`,
          ` Impressive ${Math.round(successRate)}% completion rate showcases consistent high-quality service delivery and professional excellence.`
        ]

        insights.push({
          type: 'success',
          category: 'Excellence',
          title: 'Exceptional Success Rate',
          description: success_insights[Math.floor(Math.random() * success_insights.length)],
          icon: <CheckCircle className="w-5 h-5" />,
          priority: 'high'
        })
      } else if (successRate < 60) {
        const improvement_insights = [
          ` ${Math.round(successRate)}% completion rate suggests opportunities for process improvement and support systems enhancement.`,
          ` Current ${Math.round(successRate)}% completion rate indicates potential for growth through targeted interventions and training.`,
          ` ${Math.round(successRate)}% completion rate shows room for development. Consider workflow optimization and additional resources.`,
          ` ${Math.round(successRate)}% completion rate presents improvement opportunities. Focus on time management and process efficiency.`
        ]

        insights.push({
          type: 'warning',
          category: 'Improvement',
          title: 'Completion Rate Enhancement',
          description: improvement_insights[Math.floor(Math.random() * improvement_insights.length)],
          icon: <AlertTriangle className="w-5 h-5" />,
          priority: 'medium'
        })
      }
    }

    return insights
  }

  // NEW: Analyze session types and provide insights
  const analyzeSessionTypes = (sessions) => {
    const insights = []
    
    if (sessions.length === 0) return insights

    // Analyze session type distribution
    const sessionTypeCounts = {}
    const categoryCounts = {}
    
    sessions.forEach(session => {
      const sessionType = session.sessionInfo?.sessionType
      if (sessionType) {
        sessionTypeCounts[sessionType] = (sessionTypeCounts[sessionType] || 0) + 1
        
        const category = getSessionTypeCategory(sessionType)
        categoryCounts[category] = (categoryCounts[category] || 0) + 1
      }
    })

    // Find most common session types
    const topSessionTypes = Object.entries(sessionTypeCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)

    // Find most common categories
    const topCategories = Object.entries(categoryCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)

    // Generate insights for top session types
    if (topSessionTypes.length > 0) {
      const [topType, topCount] = topSessionTypes[0]
      const topTypeLabel = getSessionTypeLabel(topType)
      const percentage = Math.round((topCount / sessions.length) * 100)
      
      insights.push({
        type: 'info',
        category: 'Session Analysis',
        title: 'Primary Service Focus',
        description: `${topTypeLabel} sessions represent ${percentage}% of all sessions (${topCount} sessions). This suggests strong institutional expertise in this area.`,
        icon: <Target className="w-5 h-5" />,
        priority: 'medium'
      })
    }

    // Generate insights for categories
    if (topCategories.length > 0) {
      const [topCategory, topCount] = topCategories[0]
      const categoryName = getCategoryDisplayName(topCategory)
      const percentage = Math.round((topCount / sessions.length) * 100)
      
      insights.push({
        type: 'info',
        category: 'Service Strategy',
        title: 'Service Category Dominance',
        description: `${categoryName} services account for ${percentage}% of sessions. Consider expanding specialized expertise in this category.`,
        icon: <Lightbulb className="w-5 h-5" />,
        priority: 'medium'
      })
    }

    // Check for underutilized session types
    const underutilizedTypes = Object.entries(sessionTypeCounts)
      .filter(([, count]) => count < 2)
      .map(([type]) => getSessionTypeLabel(type))
    
    if (underutilizedTypes.length > 0) {
      insights.push({
        type: 'warning',
        category: 'Growth Opportunity',
        title: 'Underutilized Services',
        description: `Consider promoting ${underutilizedTypes.slice(0, 3).join(', ')} sessions. These specialized services could enhance student support offerings.`,
        icon: <AlertTriangle className="w-5 h-5" />,
        priority: 'medium'
      })
    }

    // Check for crisis intervention sessions
    const crisisSessions = sessions.filter(s => {
      const type = s.sessionInfo?.sessionType
      return type === 'crisis-intervention' || type === 'mental-health'
    }).length

    if (crisisSessions > 0) {
      insights.push({
        type: 'warning',
        category: 'Critical Services',
        title: 'Crisis Intervention Sessions',
        description: `${crisisSessions} crisis intervention sessions detected. Ensure proper protocols and support systems are in place for these critical services.`,
        icon: <AlertTriangle className="w-5 h-5" />,
        priority: 'high'
      })
    }

    // Check for accessibility services
    const accessibilitySessions = sessions.filter(s => {
      const type = s.sessionInfo?.sessionType
      return type === 'disability-services' || type === 'international-student'
    }).length

    if (accessibilitySessions > 0) {
      insights.push({
        type: 'info',
        category: 'Inclusive Services',
        title: 'Accessibility Services',
        description: `${accessibilitySessions} accessibility and special needs sessions. This demonstrates commitment to inclusive student support.`,
        icon: <CheckCircle className="w-5 h-5" />,
        priority: 'medium'
      })
    }

    return insights
  }

  // NEW: Analyze communication effectiveness
  const analyzeCommunicationEffectiveness = (sessions) => {
    const insights = []
    const communicationData = { high: 0, medium: 0, low: 0, total: 0 }

    sessions.forEach(session => {
      if (session.observations?.communicationInteraction) {
        Object.values(session.observations.communicationInteraction).forEach(item => {
          if (item.rating) {
            communicationData.total++
            if (['High', 'Yes', 'Observed'].includes(item.rating)) {
              communicationData.high++
            } else if (['Medium', 'Sometimes'].includes(item.rating)) {
              communicationData.medium++
            } else {
              communicationData.low++
            }
          }
        })
      }
    })

    if (communicationData.total > 0) {
      const highRate = (communicationData.high / communicationData.total) * 100
      const lowRate = (communicationData.low / communicationData.total) * 100

      if (highRate > 70) {
        const comm_success_insights = [
          ` Exceptional communication skills demonstrated with ${Math.round(highRate)}% high-rated interactions. Your team excels at clear, effective dialogue.`,
          ` Outstanding communication effectiveness! ${Math.round(highRate)}% of interactions show superior clarity and engagement.`,
          ` Remarkable communication mastery - ${Math.round(highRate)}% high ratings indicate exceptional interpersonal skills.`,
          ` Communication excellence achieved! ${Math.round(highRate)}% of interactions demonstrate superior student-advisor rapport.`
        ]

        insights.push({
          type: 'success',
          category: 'Communication',
          title: 'Communication Excellence',
          description: comm_success_insights[Math.floor(Math.random() * comm_success_insights.length)],
          icon: <CheckCircle className="w-5 h-5" />,
          priority: 'high'
        })
      } else if (lowRate > 30) {
        const comm_improvement_insights = [
          ` Communication enhancement opportunity: ${Math.round(lowRate)}% of interactions could benefit from improved clarity and engagement techniques.`,
          ` Communication skills development needed: ${Math.round(lowRate)}% of interactions suggest room for enhanced dialogue strategies.`,
          ` Communication optimization potential: ${Math.round(lowRate)}% of interactions indicate opportunities for better student engagement.`,
          ` Communication improvement area: ${Math.round(lowRate)}% of interactions could be enhanced through targeted training and practice.`
        ]

        insights.push({
          type: 'warning',
          category: 'Communication',
          title: 'Communication Enhancement',
          description: comm_improvement_insights[Math.floor(Math.random() * comm_improvement_insights.length)],
          icon: <AlertTriangle className="w-5 h-5" />,
          priority: 'medium'
        })
      }
    }

    return insights
  }

  // NEW: Analyze leadership alignment patterns
  const analyzeLeadershipAlignment = (sessions) => {
    const insights = []
    const leadershipData = { high: 0, medium: 0, low: 0, total: 0 }

    sessions.forEach(session => {
      if (session.observations?.leadershipAlignment) {
        Object.values(session.observations.leadershipAlignment).forEach(item => {
          if (item.rating) {
            leadershipData.total++
            if (['High', 'Yes', 'Observed'].includes(item.rating)) {
              leadershipData.high++
            } else if (['Medium', 'Sometimes'].includes(item.rating)) {
              leadershipData.medium++
            } else {
              leadershipData.low++
            }
          }
        })
      }
    })

    if (leadershipData.total > 0) {
      const highRate = (leadershipData.high / leadershipData.total) * 100
      const lowRate = (leadershipData.low / leadershipData.total) * 100

      if (highRate > 70) {
        const leadership_success_insights = [
          ` Strong leadership alignment demonstrated with ${Math.round(highRate)}% high-rated observations. Strategic vision is well-executed.`,
          ` Exceptional leadership integration! ${Math.round(highRate)}% of observations show perfect alignment with institutional goals.`,
          ` Outstanding leadership synergy - ${Math.round(highRate)}% high ratings indicate excellent strategic coordination.`,
          ` Leadership excellence achieved! ${Math.round(highRate)}% of observations demonstrate perfect institutional alignment.`
        ]

        insights.push({
          type: 'success',
          category: 'Leadership',
          title: 'Leadership Alignment Excellence',
          description: leadership_success_insights[Math.floor(Math.random() * leadership_success_insights.length)],
          icon: <Target className="w-5 h-5" />,
          priority: 'high'
        })
      } else if (lowRate > 30) {
        const leadership_improvement_insights = [
          ` Leadership alignment opportunity: ${Math.round(lowRate)}% of observations suggest need for better strategic coordination.`,
          ` Leadership integration enhancement: ${Math.round(lowRate)}% of observations indicate room for improved goal alignment.`,
          ` Leadership synergy development: ${Math.round(lowRate)}% of observations show potential for better strategic execution.`,
          ` Leadership coordination improvement: ${Math.round(lowRate)}% of observations suggest enhanced alignment strategies.`
        ]

        insights.push({
          type: 'warning',
          category: 'Leadership',
          title: 'Leadership Alignment Enhancement',
          description: leadership_improvement_insights[Math.floor(Math.random() * leadership_improvement_insights.length)],
          icon: <AlertTriangle className="w-5 h-5" />,
          priority: 'medium'
        })
      }
    }

    return insights
  }

  // NEW: Analyze session complexity and outcomes
  const analyzeSessionComplexity = (sessions) => {
    const insights = []
    const complexityData = { simple: 0, moderate: 0, complex: 0, total: 0 }

    sessions.forEach(session => {
      if (session.observations) {
        const totalFields = Object.values(session.observations).reduce((sum, category) => 
          sum + Object.keys(category).length, 0)
        
        if (totalFields <= 8) complexityData.simple++
        else if (totalFields <= 12) complexityData.moderate++
        else complexityData.complex++
        complexityData.total++
      }
    })

    if (complexityData.total > 0) {
      const complexRate = (complexityData.complex / complexityData.total) * 100
      const simpleRate = (complexityData.simple / complexityData.total) * 100

      if (complexRate > 40) {
        const complexity_insights = [
          ` High session complexity detected with ${Math.round(complexRate)}% of sessions requiring comprehensive observation coverage.`,
          ` Complex session patterns identified: ${Math.round(complexRate)}% of sessions demand detailed multi-category analysis.`,
          ` Intensive observation requirements: ${Math.round(complexRate)}% of sessions show high complexity, indicating sophisticated student needs.`,
          ` Advanced session complexity: ${Math.round(complexRate)}% of sessions require extensive observation frameworks for comprehensive assessment.`
        ]

        insights.push({
          type: 'info',
          category: 'Complexity',
          title: 'High Session Complexity',
          description: complexity_insights[Math.floor(Math.random() * complexity_insights.length)],
          icon: <BarChart3 className="w-5 h-5" />,
          priority: 'medium'
        })
      } else if (simpleRate > 50) {
        const simplicity_insights = [
          ` Streamlined session approach: ${Math.round(simpleRate)}% of sessions show focused, efficient observation patterns.`,
          ` Efficient session design: ${Math.round(simpleRate)}% of sessions demonstrate streamlined, targeted observation strategies.`,
          ` Optimized session complexity: ${Math.round(simpleRate)}% of sessions show balanced, efficient observation coverage.`,
          ` Streamlined observation patterns: ${Math.round(simpleRate)}% of sessions demonstrate focused, effective assessment approaches.`
        ]

        insights.push({
          type: 'success',
          category: 'Efficiency',
          title: 'Streamlined Session Design',
          description: simplicity_insights[Math.floor(Math.random() * simplicity_insights.length)],
          icon: <Target className="w-5 h-5" />,
          priority: 'low'
        })
      }
    }

    return insights
  }

  // NEW: Analyze student diversity and inclusion
  const analyzeStudentDiversity = (sessions) => {
    const insights = []
    const studentTypes = {}
    const sessionTypes = {}

    sessions.forEach(session => {
      const studentCode = session.sessionInfo?.studentCode || 'Unknown'
      const sessionType = session.sessionInfo?.sessionType || 'General'
      
      studentTypes[studentCode] = (studentTypes[studentCode] || 0) + 1
      sessionTypes[sessionType] = (sessionTypes[sessionType] || 0) + 1
    })

    const uniqueStudents = Object.keys(studentTypes).length
    const uniqueSessionTypes = Object.keys(sessionTypes).length

    if (uniqueStudents > 5) {
      const diversity_insights = [
        ` Diverse student population served with ${uniqueStudents} unique students, indicating broad institutional reach and impact.`,
        ` Wide student diversity demonstrated: ${uniqueStudents} unique students show comprehensive institutional coverage.`,
        ` Broad student engagement: ${uniqueStudents} unique students indicate extensive institutional outreach and support.`,
        ` Comprehensive student service: ${uniqueStudents} unique students demonstrate wide-ranging institutional impact.`
      ]

      insights.push({
        type: 'success',
        category: 'Diversity',
        title: 'Student Diversity Excellence',
        description: diversity_insights[Math.floor(Math.random() * diversity_insights.length)],
        icon: <Sparkles className="w-5 h-5" />,
        priority: 'medium'
      })
    }

    if (uniqueSessionTypes > 2) {
      const variety_insights = [
        ` Session variety excellence: ${uniqueSessionTypes} different session types show comprehensive service delivery.`,
        ` Multi-format service delivery: ${uniqueSessionTypes} session types demonstrate flexible, adaptive advising approaches.`,
        ` Diverse session offerings: ${uniqueSessionTypes} session types indicate comprehensive student support strategies.`,
        ` Service variety achievement: ${uniqueSessionTypes} session types show adaptable, student-centered advising.`
      ]

      insights.push({
        type: 'success',
        category: 'Service Variety',
        title: 'Session Variety Excellence',
        description: variety_insights[Math.floor(Math.random() * variety_insights.length)],
        icon: <CheckCircle className="w-5 h-5" />,
        priority: 'medium'
      })
    }

    return insights
  }

  // NEW: Analyze resource utilization
  const analyzeResourceUtilization = (sessions) => {
    const insights = []
    const resourceData = { underutilized: 0, optimal: 0, overutilized: 0, total: 0 }

    sessions.forEach(session => {
      if (session.sessionInfo?.duration) {
        const duration = session.sessionInfo.duration
        if (duration < 900) resourceData.underutilized++ // < 15 min
        else if (duration <= 2700) resourceData.optimal++ // 15-45 min
        else resourceData.overutilized++ // > 45 min
        resourceData.total++
      }
    })

    if (resourceData.total > 0) {
      const optimalRate = (resourceData.optimal / resourceData.total) * 100
      const underutilizedRate = (resourceData.underutilized / resourceData.total) * 100

      if (optimalRate > 60) {
        const optimal_insights = [
          ` Optimal resource utilization achieved with ${Math.round(optimalRate)}% of sessions in the ideal duration range.`,
          ` Perfect resource balance: ${Math.round(optimalRate)}% of sessions demonstrate optimal time allocation.`,
          ` Resource efficiency excellence: ${Math.round(optimalRate)}% of sessions show perfect time utilization.`,
          ` Resource optimization mastery: ${Math.round(optimalRate)}% of sessions demonstrate ideal resource allocation.`
        ]

        insights.push({
          type: 'success',
          category: 'Resource Management',
          title: 'Optimal Resource Utilization',
          description: optimal_insights[Math.floor(Math.random() * optimal_insights.length)],
          icon: <Target className="w-5 h-5" />,
          priority: 'high'
        })
      } else if (underutilizedRate > 30) {
        const underutilized_insights = [
          ` Resource underutilization detected: ${Math.round(underutilizedRate)}% of sessions may benefit from extended engagement.`,
          ` Resource optimization opportunity: ${Math.round(underutilizedRate)}% of sessions suggest room for enhanced utilization.`,
          ` Resource efficiency enhancement: ${Math.round(underutilizedRate)}% of sessions indicate potential for better utilization.`,
          ` Resource utilization improvement: ${Math.round(underutilizedRate)}% of sessions could benefit from enhanced engagement.`
        ]

        insights.push({
          type: 'warning',
          category: 'Resource Management',
          title: 'Resource Utilization Enhancement',
          description: underutilized_insights[Math.floor(Math.random() * underutilized_insights.length)],
          icon: <AlertTriangle className="w-5 h-5" />,
          priority: 'medium'
        })
      }
    }

    return insights
  }

  // NEW: Analyze seasonal and cyclical patterns
  const analyzeSeasonalPatterns = (sessions) => {
    const insights = []
    const monthlyData = {}
    const weeklyData = {}

    sessions.forEach(session => {
      const date = new Date(session.sessionInfo?.date || session.createdAt)
      const month = date.getMonth()
      const dayOfWeek = date.getDay()
      
      monthlyData[month] = (monthlyData[month] || 0) + 1
      weeklyData[dayOfWeek] = (weeklyData[dayOfWeek] || 0) + 1
    })

    // Find peak months
    const peakMonth = Object.entries(monthlyData)
      .sort(([,a], [,b]) => b - a)[0]
    
    if (peakMonth) {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                         'July', 'August', 'September', 'October', 'November', 'December']
      const monthName = monthNames[parseInt(peakMonth[0])]
      const monthPercentage = (peakMonth[1] / Object.values(monthlyData).reduce((a, b) => a + b, 0)) * 100

      if (monthPercentage > 20) {
        const seasonal_insights = [
          ` Peak activity season identified: ${monthName} shows ${Math.round(monthPercentage)}% of annual sessions, indicating optimal timing for student engagement.`,
          ` Seasonal peak detected: ${monthName} accounts for ${Math.round(monthPercentage)}% of sessions, suggesting strategic planning opportunities.`,
          ` High activity period: ${monthName} demonstrates ${Math.round(monthPercentage)}% of annual sessions, indicating peak student needs.`,
          ` Seasonal concentration: ${monthName} shows ${Math.round(monthPercentage)}% of sessions, highlighting optimal resource allocation timing.`
        ]

        insights.push({
          type: 'info',
          category: 'Seasonal Patterns',
          title: 'Peak Activity Season',
          description: seasonal_insights[Math.floor(Math.random() * seasonal_insights.length)],
          icon: <Calendar className="w-5 h-5" />,
          priority: 'medium'
        })
      }
    }

    // Find peak weekdays
    const peakWeekday = Object.entries(weeklyData)
      .sort(([,a], [,b]) => b - a)[0]
    
    if (peakWeekday) {
      const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const weekdayName = weekdayNames[parseInt(peakWeekday[0])]
      const weekdayPercentage = (peakWeekday[1] / Object.values(weeklyData).reduce((a, b) => a + b, 0)) * 100

      if (weekdayPercentage > 25) {
        const weekly_insights = [
          ` Peak weekday identified: ${weekdayName} shows ${Math.round(weekdayPercentage)}% of weekly sessions, indicating optimal scheduling.`,
          ` High activity day: ${weekdayName} accounts for ${Math.round(weekdayPercentage)}% of weekly sessions, suggesting strategic focus.`,
          ` Peak productivity day: ${weekdayName} demonstrates ${Math.round(weekdayPercentage)}% of weekly sessions, indicating optimal energy levels.`,
          ` Weekly concentration: ${weekdayName} shows ${Math.round(weekdayPercentage)}% of weekly sessions, highlighting optimal timing.`
        ]

        insights.push({
          type: 'info',
          category: 'Weekly Patterns',
          title: 'Peak Weekday Activity',
          description: weekly_insights[Math.floor(Math.random() * weekly_insights.length)],
          icon: <Calendar className="w-5 h-5" />,
          priority: 'medium'
        })
      }
    }

    return insights
  }

  // NEW: Analyze cross-category correlations
  const analyzeCrossCategoryCorrelations = (sessions) => {
    const insights = []
    const categoryCorrelations = {}

    sessions.forEach(session => {
      if (session.observations) {
        const categories = Object.keys(session.observations)
        for (let i = 0; i < categories.length; i++) {
          for (let j = i + 1; j < categories.length; j++) {
            const cat1 = categories[i]
            const cat2 = categories[j]
            const key = `${cat1}-${cat2}`
            
            if (!categoryCorrelations[key]) {
              categoryCorrelations[key] = { bothHigh: 0, bothLow: 0, mixed: 0, total: 0 }
            }

            const cat1High = hasHighRating(session.observations[cat1])
            const cat2High = hasHighRating(session.observations[cat2])
            
            if (cat1High && cat2High) categoryCorrelations[key].bothHigh++
            else if (!cat1High && !cat2High) categoryCorrelations[key].bothLow++
            else categoryCorrelations[key].mixed++
            categoryCorrelations[key].total++
          }
        }
      }
    })

    // Find strong correlations
    Object.entries(categoryCorrelations).forEach(([key, data]) => {
      if (data.total >= 3) {
        const correlationStrength = Math.max(data.bothHigh, data.bothLow) / data.total
        
        if (correlationStrength > 0.7) {
          const [cat1, cat2] = key.split('-')
          const cat1Name = cat1.replace(/([A-Z])/g, ' $1').trim()
          const cat2Name = cat2.replace(/([A-Z])/g, ' $1').trim()
          
          const correlation_insights = [
            ` Strong correlation detected between ${cat1Name} and ${cat2Name} with ${Math.round(correlationStrength * 100)}% consistency.`,
            ` High correlation identified: ${cat1Name} and ${cat2Name} show ${Math.round(correlationStrength * 100)}% consistent performance patterns.`,
            ` Correlation pattern found: ${cat1Name} and ${cat2Name} demonstrate ${Math.round(correlationStrength * 100)}% aligned performance.`,
            ` Performance correlation: ${cat1Name} and ${cat2Name} show ${Math.round(correlationStrength * 100)}% consistent outcomes.`
          ]

          insights.push({
            type: 'info',
            category: 'Correlations',
            title: 'Performance Correlation Detected',
            description: correlation_insights[Math.floor(Math.random() * correlation_insights.length)],
            icon: <BarChart3 className="w-5 h-5" />,
            priority: 'medium'
          })
        }
      }
    })

    return insights
  }

  // NEW: Analyze advisor specialization patterns
  const analyzeAdvisorSpecialization = (sessions) => {
    const insights = []
    const advisorSpecializations = {}

    sessions.forEach(session => {
      const advisor = session.sessionInfo?.advisor || 'Unknown'
      if (!advisorSpecializations[advisor]) {
        advisorSpecializations[advisor] = { categories: {}, total: 0 }
      }
      
      if (session.observations) {
        Object.entries(session.observations).forEach(([category, data]) => {
          if (!advisorSpecializations[advisor].categories[category]) {
            advisorSpecializations[advisor].categories[category] = 0
          }
          advisorSpecializations[advisor].categories[category]++
        })
        advisorSpecializations[advisor].total++
      }
    })

    // Find specialists
    Object.entries(advisorSpecializations).forEach(([advisor, data]) => {
      if (data.total >= 3) {
        const topCategory = Object.entries(data.categories)
          .sort(([,a], [,b]) => b - a)[0]
        
        if (topCategory) {
          const specializationRate = (topCategory[1] / data.total) * 100
          const categoryName = topCategory[0].replace(/([A-Z])/g, ' $1').trim()
          
          if (specializationRate > 60) {
            const specialization_insights = [
              ` ${advisor} shows specialization in ${categoryName} with ${Math.round(specializationRate)}% focus, indicating deep expertise.`,
              ` ${advisor} demonstrates ${categoryName} specialization: ${Math.round(specializationRate)}% concentration shows targeted expertise.`,
              ` ${advisor} excels in ${categoryName} specialization: ${Math.round(specializationRate)}% focus indicates deep knowledge.`,
              ` ${advisor} shows ${categoryName} mastery: ${Math.round(specializationRate)}% specialization demonstrates expert-level skills.`
            ]

            insights.push({
              type: 'success',
              category: 'Specialization',
              title: 'Advisor Specialization Identified',
              description: specialization_insights[Math.floor(Math.random() * specialization_insights.length)],
              icon: <Target className="w-5 h-5" />,
              priority: 'medium'
            })
          }
        }
      }
    })

    return insights
  }

  // NEW: Analyze quality vs quantity trade-offs
  const analyzeQualityQuantityTradeoffs = (sessions) => {
    const insights = []
    const qualityQuantityData = { highQuality: 0, highQuantity: 0, balanced: 0, total: 0 }

    sessions.forEach(session => {
      if (session.observations && session.sessionInfo?.duration) {
        const quality = calculateSessionQuality(session)
        const duration = session.sessionInfo.duration
        
        if (quality > 0.8 && duration > 1800) qualityQuantityData.highQuality++ // High quality, longer duration
        else if (quality < 0.6 && duration < 1200) qualityQuantityData.highQuantity++ // Lower quality, shorter duration
        else qualityQuantityData.balanced++ // Balanced approach
        qualityQuantityData.total++
      }
    })

    if (qualityQuantityData.total > 0) {
      const balancedRate = (qualityQuantityData.balanced / qualityQuantityData.total) * 100
      const highQualityRate = (qualityQuantityData.highQuality / qualityQuantityData.total) * 100

      if (balancedRate > 50) {
        const balanced_insights = [
          ` Quality-quantity balance achieved: ${Math.round(balancedRate)}% of sessions show optimal trade-off management.`,
          ` Balanced approach excellence: ${Math.round(balancedRate)}% of sessions demonstrate optimal quality-quantity ratios.`,
          ` Quality-quantity optimization: ${Math.round(balancedRate)}% of sessions show perfect balance between thoroughness and efficiency.`,
          ` Optimal trade-off management: ${Math.round(balancedRate)}% of sessions demonstrate balanced quality-quantity approaches.`
        ]

        insights.push({
          type: 'success',
          category: 'Balance',
          title: 'Quality-Quantity Balance',
          description: balanced_insights[Math.floor(Math.random() * balanced_insights.length)],
          icon: <Target className="w-5 h-5" />,
          priority: 'high'
        })
      } else if (highQualityRate > 30) {
        const quality_insights = [
          ` Quality-focused approach: ${Math.round(highQualityRate)}% of sessions prioritize thoroughness over speed.`,
          ` Quality emphasis strategy: ${Math.round(highQualityRate)}% of sessions show commitment to comprehensive assessment.`,
          ` Quality-driven methodology: ${Math.round(highQualityRate)}% of sessions demonstrate thorough, detailed approaches.`,
          ` Quality-centric execution: ${Math.round(highQualityRate)}% of sessions prioritize comprehensive evaluation.`
        ]

        insights.push({
          type: 'info',
          category: 'Quality Focus',
          title: 'Quality-Driven Approach',
          description: quality_insights[Math.floor(Math.random() * quality_insights.length)],
          icon: <CheckCircle className="w-5 h-5" />,
          priority: 'medium'
        })
      }
    }

    return insights
  }

  // Helper function to check if category has high ratings
  const hasHighRating = (categoryData) => {
    if (!categoryData) return false
    const ratings = Object.values(categoryData).map(item => item.rating).filter(Boolean)
    return ratings.some(rating => ['High', 'Yes', 'Observed'].includes(rating))
  }

  // Helper function to calculate session quality score
  const calculateSessionQuality = (session) => {
    if (!session.observations) return 0
    
    let totalFields = 0
    let highRatedFields = 0
    
    Object.values(session.observations).forEach(category => {
      Object.values(category).forEach(item => {
        if (item.rating) {
          totalFields++
          if (['High', 'Yes', 'Observed'].includes(item.rating)) {
            highRatedFields++
          }
        }
      })
    })
    
    return totalFields > 0 ? highRatedFields / totalFields : 0
  }

  // Helper function to shuffle array for variety
  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50 dark:bg-red-950'
      case 'medium': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950'
      case 'low': return 'text-green-500 bg-green-50 dark:bg-green-950'
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-950'
    }
  }

  // Get insight type color
  const getInsightTypeColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'error': return 'text-red-600'
      case 'info': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  // NEW: Enhanced session type deep analysis
  const analyzeSessionTypeDeepPatterns = (sessions) => {
    const insights = []
    
    if (sessions.length === 0) return insights

    // Analyze session type complexity patterns
    const complexityByType = {}
    const durationByType = {}
    const completionByType = {}
    
    sessions.forEach(session => {
      const sessionType = session.sessionInfo?.sessionType
      if (sessionType) {
        if (!complexityByType[sessionType]) {
          complexityByType[sessionType] = { total: 0, completed: 0, avgDuration: 0, durations: [] }
        }
        
        complexityByType[sessionType].total++
        if (session.status === 'completed') complexityByType[sessionType].completed++
        if (session.sessionInfo?.duration) {
          complexityByType[sessionType].durations.push(session.sessionInfo.duration)
        }
      }
    })

    // Calculate complexity metrics for each session type
    Object.entries(complexityByType).forEach(([type, data]) => {
      if (data.total >= 2) {
        const completionRate = (data.completed / data.total) * 100
        const avgDuration = data.durations.length > 0 ? 
          data.durations.reduce((a, b) => a + b, 0) / data.durations.length : 0
        
        // Identify high-complexity session types
        if (avgDuration > 45 && completionRate < 80) {
          insights.push({
            type: 'warning',
            category: 'Session Complexity',
            title: 'High-Complexity Session Type',
            description: `${getSessionTypeLabel(type)} sessions show high complexity (avg: ${Math.round(avgDuration)}min) with ${Math.round(completionRate)}% completion rate. Consider providing additional support resources.`,
            icon: <AlertTriangle className="w-5 h-5" />,
            priority: 'medium'
          })
        }
        
        // Identify efficient session types
        if (avgDuration < 30 && completionRate > 90) {
          insights.push({
            type: 'success',
            category: 'Session Efficiency',
            title: 'Highly Efficient Session Type',
            description: `${getSessionTypeLabel(type)} sessions demonstrate excellent efficiency with ${Math.round(avgDuration)}min average duration and ${Math.round(completionRate)}% completion rate.`,
            icon: <CheckCircle className="w-5 h-5" />,
            priority: 'low'
          })
        }
      }
    })

    // Analyze session type combinations
    const sessionTypeSequences = {}
    sessions.forEach(session => {
      const studentCode = session.sessionInfo?.studentCode
      if (studentCode) {
        if (!sessionTypeSequences[studentCode]) {
          sessionTypeSequences[studentCode] = []
        }
        sessionTypeSequences[studentCode].push(session.sessionInfo?.sessionType)
      }
    })

    // Find common session type sequences
    const sequencePatterns = {}
    Object.values(sessionTypeSequences).forEach(sequence => {
      if (sequence.length > 1) {
        for (let i = 0; i < sequence.length - 1; i++) {
          const pair = `${sequence[i]} → ${sequence[i + 1]}`
          sequencePatterns[pair] = (sequencePatterns[pair] || 0) + 1
        }
      }
    })

    // Identify strong session type sequences
    const strongSequences = Object.entries(sequencePatterns)
      .filter(([, count]) => count >= 2)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)

    if (strongSequences.length > 0) {
      insights.push({
        type: 'info',
        category: 'Session Sequencing',
        title: 'Strong Session Type Sequences',
        description: `Common session patterns: ${strongSequences.map(([seq]) => {
          const [first, second] = seq.split(' → ')
          return `${getSessionTypeLabel(first)} → ${getSessionTypeLabel(second)}`
        }).join(', ')}. Consider formalizing these pathways.`,
        icon: <TrendingUp className="w-5 h-5" />,
        priority: 'medium'
      })
    }

    return insights
  }

  // NEW: Student demographic insights
  const analyzeStudentDemographics = (sessions) => {
    const insights = []
    
    if (sessions.length === 0) return insights

    // Analyze student code patterns
    const studentCodes = sessions.map(s => s.sessionInfo?.studentCode).filter(Boolean)
    const uniqueStudents = new Set(studentCodes).size
    const repeatStudents = studentCodes.length - uniqueStudents
    
    if (repeatStudents > 0) {
      const repeatRate = (repeatStudents / studentCodes.length) * 100
      insights.push({
        type: 'info',
        category: 'Student Engagement',
        title: 'Student Return Rate',
        description: `${Math.round(repeatRate)}% of sessions are from returning students, indicating strong ongoing support relationships.`,
        icon: <Users className="w-5 h-5" />,
        priority: 'medium'
      })
    }

    // Analyze international vs domestic students
    const internationalSessions = sessions.filter(s => 
      s.sessionInfo?.sessionType === 'international-student'
    ).length

    if (internationalSessions > 0) {
      insights.push({
        type: 'info',
        category: 'Student Diversity',
        title: 'International Student Support',
        description: `${internationalSessions} international student sessions detected. Ensure cultural sensitivity and language support resources are available.`,
        icon: <Globe className="w-5 h-5" />,
        priority: 'medium'
      })
    }

    // Analyze transfer student patterns
    const transferSessions = sessions.filter(s => 
      s.sessionInfo?.sessionType === 'transfer-student'
    ).length

    if (transferSessions > 0) {
      insights.push({
        type: 'info',
        category: 'Student Transition',
        title: 'Transfer Student Support',
        description: `${transferSessions} transfer student sessions. Consider developing specialized orientation programs for smoother transitions.`,
        icon: <ArrowRight className="w-5 h-5" />,
        priority: 'medium'
      })
    }

    return insights
  }

  // NEW: Academic progression insights
  const analyzeAcademicProgression = (sessions) => {
    const insights = []
    
    if (sessions.length === 0) return insights

    // Analyze graduation planning patterns
    const graduationSessions = sessions.filter(s => 
      s.sessionInfo?.sessionType === 'graduation-planning'
    ).length

    if (graduationSessions > 0) {
      insights.push({
        type: 'info',
        category: 'Academic Milestones',
        title: 'Graduation Planning Activity',
        description: `${graduationSessions} graduation planning sessions. This indicates students are actively preparing for degree completion.`,
        icon: <GraduationCap className="w-5 h-5" />,
        priority: 'medium'
      })
    }

    // Analyze course registration patterns
    const courseRegSessions = sessions.filter(s => 
      s.sessionInfo?.sessionType === 'course-registration'
    ).length

    if (courseRegSessions > 0) {
      insights.push({
        type: 'info',
        category: 'Academic Planning',
        title: 'Course Registration Support',
        description: `${courseRegSessions} course registration sessions. Consider providing self-service tools to reduce advisor workload during peak periods.`,
        icon: <BookOpen className="w-5 h-5" />,
        priority: 'medium'
      })
    }

    // Analyze academic probation support
    const probationSessions = sessions.filter(s => 
      s.sessionInfo?.sessionType === 'academic-probation'
    ).length

    if (probationSessions > 0) {
      insights.push({
        type: 'warning',
        category: 'Academic Support',
        title: 'Academic Probation Support',
        description: `${probationSessions} academic probation sessions. Implement early intervention programs to prevent academic difficulties.`,
        icon: <AlertTriangle className="w-5 h-5" />,
        priority: 'high'
      })
    }

    return insights
  }

  // NEW: Resource optimization insights
  const analyzeResourceOptimization = (sessions) => {
    const insights = []
    
    if (sessions.length === 0) return insights

    // Analyze advisor workload distribution
    const advisorWorkload = {}
    sessions.forEach(session => {
      const advisor = session.sessionInfo?.advisor
      if (advisor) {
        advisorWorkload[advisor] = (advisorWorkload[advisor] || 0) + 1
      }
    })

    const workloadValues = Object.values(advisorWorkload)
    if (workloadValues.length > 1) {
      const avgWorkload = workloadValues.reduce((a, b) => a + b, 0) / workloadValues.length
      const maxWorkload = Math.max(...workloadValues)
      const minWorkload = Math.min(...workloadValues)
      const workloadVariance = maxWorkload - minWorkload

      if (workloadVariance > avgWorkload * 0.5) {
        insights.push({
          type: 'warning',
          category: 'Resource Distribution',
          title: 'Workload Imbalance',
          description: `Advisor workload varies significantly (${minWorkload} to ${maxWorkload} sessions). Consider redistributing sessions for better balance.`,
          icon: <Scale className="w-5 h-5" />,
          priority: 'medium'
        })
      }
    }

    // Analyze session duration optimization
    const durations = sessions
      .map(s => s.sessionInfo?.duration)
      .filter(d => d && d > 0)
    
    if (durations.length > 0) {
      const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length
      const longSessions = durations.filter(d => d > 60).length
      const shortSessions = durations.filter(d => d < 15).length

      if (longSessions > durations.length * 0.2) {
        insights.push({
          type: 'info',
          category: 'Session Efficiency',
          title: 'Long Session Optimization',
          description: `${Math.round((longSessions / durations.length) * 100)}% of sessions exceed 60 minutes. Consider breaking complex sessions into multiple shorter ones.`,
          icon: <Clock className="w-5 h-5" />,
          priority: 'medium'
        })
      }

      if (shortSessions > durations.length * 0.3) {
        insights.push({
          type: 'info',
          category: 'Session Quality',
          title: 'Short Session Quality',
          description: `${Math.round((shortSessions / durations.length) * 100)}% of sessions are under 15 minutes. Ensure adequate time for comprehensive support.`,
          icon: <Clock className="w-5 h-5" />,
          priority: 'medium'
        })
      }
    }

    return insights
  }

  // NEW: Risk management insights
  const analyzeRiskManagement = (sessions) => {
    const insights = []
    
    if (sessions.length === 0) return insights

    // Analyze crisis intervention patterns
    const crisisSessions = sessions.filter(s => 
      ['crisis-intervention', 'mental-health'].includes(s.sessionInfo?.sessionType)
    ).length

    if (crisisSessions > 0) {
      const crisisRate = (crisisSessions / sessions.length) * 100
      
      if (crisisRate > 5) {
        insights.push({
          type: 'warning',
          category: 'Risk Management',
          title: 'High Crisis Intervention Rate',
          description: `${Math.round(crisisRate)}% of sessions involve crisis intervention. Ensure adequate mental health resources and crisis protocols are in place.`,
          icon: <AlertTriangle className="w-5 h-5" />,
          priority: 'high'
        })
      } else {
        insights.push({
          type: 'info',
          category: 'Risk Management',
          title: 'Crisis Intervention Monitoring',
          description: `${crisisSessions} crisis intervention sessions detected. Maintain current support systems and staff training.`,
          icon: <Shield className="w-5 h-5" />,
          priority: 'medium'
        })
      }
    }

    // Analyze incomplete session risks
    const incompleteSessions = sessions.filter(s => s.status !== 'completed').length
    if (incompleteSessions > 0) {
      const incompleteRate = (incompleteSessions / sessions.length) * 100
      
      if (incompleteRate > 20) {
        insights.push({
          type: 'warning',
          category: 'Risk Management',
          title: 'High Incomplete Session Rate',
          description: `${Math.round(incompleteRate)}% of sessions are incomplete. This may indicate workflow issues or insufficient follow-up procedures.`,
          icon: <AlertTriangle className="w-5 h-5" />,
          priority: 'medium'
        })
      }
    }

    // Analyze accessibility compliance
    const accessibilitySessions = sessions.filter(s => 
      ['disability-services', 'international-student'].includes(s.sessionInfo?.sessionType)
    ).length

    if (accessibilitySessions > 0) {
      insights.push({
        type: 'info',
        category: 'Compliance',
        title: 'Accessibility Services Compliance',
        description: `${accessibilitySessions} accessibility-related sessions. Ensure compliance with accessibility standards and regulations.`,
        icon: <CheckCircle className="w-5 h-5" />,
        priority: 'medium'
      })
    }

    return insights
  }

  // NEW: Performance benchmarking insights
  const analyzePerformanceBenchmarking = (sessions) => {
    const insights = []
    
    if (sessions.length === 0) return insights

    // Benchmark completion rates
    const completionRate = (sessions.filter(s => s.status === 'completed').length / sessions.length) * 100
    
    if (completionRate >= 90) {
      insights.push({
        type: 'success',
        category: 'Performance Excellence',
        title: 'Exceptional Completion Rate',
        description: `${Math.round(completionRate)}% completion rate exceeds industry benchmarks. Your team demonstrates outstanding performance standards.`,
        icon: <Trophy className="w-5 h-5" />,
        priority: 'low'
      })
    } else if (completionRate >= 80) {
      insights.push({
        type: 'info',
        category: 'Performance',
        title: 'Strong Completion Performance',
        description: `${Math.round(completionRate)}% completion rate shows solid performance. Focus on the remaining ${Math.round(100 - completionRate)}% for excellence.`,
        icon: <TrendingUp className="w-5 h-5" />,
        priority: 'medium'
      })
    } else {
      insights.push({
        type: 'warning',
        category: 'Performance Improvement',
        title: 'Completion Rate Enhancement Needed',
        description: `${Math.round(completionRate)}% completion rate indicates room for improvement. Implement process optimization and support systems.`,
        icon: <AlertTriangle className="w-5 h-5" />,
        priority: 'high'
      })
    }

    // Benchmark session efficiency
    const durations = sessions
      .map(s => s.sessionInfo?.duration)
      .filter(d => d && d > 0)
    
    if (durations.length > 0) {
      const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length
      
      if (avgDuration <= 30) {
        insights.push({
          type: 'success',
          category: 'Efficiency',
          title: 'Excellent Session Efficiency',
          description: `Average session duration of ${Math.round(avgDuration)} minutes demonstrates exceptional efficiency and productivity.`,
          icon: <Zap className="w-5 h-5" />,
          priority: 'low'
        })
      } else if (avgDuration <= 45) {
        insights.push({
          type: 'info',
          category: 'Efficiency',
          title: 'Good Session Efficiency',
          description: `Average session duration of ${Math.round(avgDuration)} minutes shows good efficiency. Consider optimization strategies for further improvement.`,
          icon: <Clock className="w-5 h-5" />,
          priority: 'medium'
        })
      } else {
        insights.push({
          type: 'warning',
          category: 'Efficiency',
          title: 'Session Duration Optimization',
          description: `Average session duration of ${Math.round(avgDuration)} minutes suggests opportunities for efficiency improvements.`,
          icon: <Clock className="w-5 h-5" />,
          priority: 'medium'
        })
      }
    }

    return insights
  }

  // NEW: Innovation opportunity insights
  const analyzeInnovationOpportunities = (sessions) => {
    const insights = []
    
    if (sessions.length === 0) return insights

    // Analyze technology adoption opportunities
    const techAdoptionSessions = sessions.filter(s => 
      s.sessionInfo?.sessionType === 'other' && 
      s.observations?.technologyIntegration
    ).length

    if (techAdoptionSessions === 0) {
      insights.push({
        type: 'info',
        category: 'Innovation',
        title: 'Technology Integration Opportunity',
        description: 'No technology integration sessions detected. Consider implementing digital tools to enhance student support services.',
        icon: <Lightbulb className="w-5 h-5" />,
        priority: 'medium'
      })
    }

    // Analyze service innovation patterns
    const uniqueSessionTypes = new Set(sessions.map(s => s.sessionInfo?.sessionType).filter(Boolean)).size
    
    if (uniqueSessionTypes >= 15) {
      insights.push({
        type: 'success',
        category: 'Innovation',
        title: 'Diverse Service Portfolio',
        description: `${uniqueSessionTypes} different session types demonstrate innovative service offerings. Continue expanding specialized support areas.`,
        icon: <Sparkles className="w-5 h-5" />,
        priority: 'low'
      })
    } else if (uniqueSessionTypes >= 10) {
      insights.push({
        type: 'info',
        category: 'Innovation',
        title: 'Service Innovation Opportunity',
        description: `${uniqueSessionTypes} session types provide good coverage. Consider adding specialized services for underserved student populations.`,
        icon: <Lightbulb className="w-5 h-5" />,
        priority: 'medium'
      })
    }

    // Analyze process innovation
    const processInnovationSessions = sessions.filter(s => 
      s.observations?.processImprovement || s.observations?.workflowOptimization
    ).length

    if (processInnovationSessions === 0) {
      insights.push({
        type: 'info',
        category: 'Innovation',
        title: 'Process Innovation Opportunity',
        description: 'No process improvement sessions detected. Implement continuous improvement initiatives to optimize workflows.',
        icon: <RefreshCw className="w-5 h-5" />,
        priority: 'medium'
      })
    }

    return insights
  }

  // NEW: Compliance and quality assurance insights
  const analyzeComplianceQuality = (sessions) => {
    const insights = []
    
    if (sessions.length === 0) return insights

    // Analyze documentation completeness
    const wellDocumentedSessions = sessions.filter(s => 
      s.observations && Object.keys(s.observations).length >= 5
    ).length

    const documentationRate = (wellDocumentedSessions / sessions.length) * 100
    
    if (documentationRate >= 90) {
      insights.push({
        type: 'success',
        category: 'Quality Assurance',
        title: 'Excellent Documentation Standards',
        description: `${Math.round(documentationRate)}% of sessions meet comprehensive documentation standards. Maintain these high-quality practices.`,
        icon: <CheckCircle className="w-5 h-5" />,
        priority: 'low'
      })
    } else if (documentationRate >= 75) {
      insights.push({
        type: 'info',
        category: 'Quality Assurance',
        title: 'Good Documentation Practices',
        description: `${Math.round(documentationRate)}% of sessions have comprehensive documentation. Focus on improving the remaining sessions.`,
        icon: <FileText className="w-5 h-5" />,
        priority: 'medium'
      })
    } else {
      insights.push({
        type: 'warning',
        category: 'Quality Assurance',
        title: 'Documentation Improvement Needed',
        description: `${Math.round(documentationRate)}% of sessions meet documentation standards. Implement training and quality control measures.`,
        icon: <AlertTriangle className="w-5 h-5" />,
        priority: 'high'
      })
    }

    // Analyze observation consistency
    const observationCategories = ['communicationInteraction', 'academicSupport', 'studentEngagement', 'resourceUtilization']
    const consistentSessions = sessions.filter(s => {
      if (!s.observations) return false
      return observationCategories.every(cat => s.observations[cat])
    }).length

    const consistencyRate = (consistentSessions / sessions.length) * 100
    
    if (consistencyRate < 80) {
      insights.push({
        type: 'warning',
        category: 'Quality Assurance',
        title: 'Observation Consistency',
        description: `${Math.round(consistencyRate)}% of sessions have consistent observation categories. Standardize observation protocols for better data quality.`,
        icon: <ClipboardList className="w-5 h-5" />,
        priority: 'medium'
      })
    }

    return insights
  }

  // NEW: Cross-functional collaboration insights
  const analyzeCrossFunctionalCollaboration = (sessions) => {
    const insights = []
    
    if (sessions.length === 0) return insights

    // Analyze multi-advisor collaboration
    const advisorCollaboration = {}
    sessions.forEach(session => {
      const advisor = session.sessionInfo?.advisor
      if (advisor) {
        if (!advisorCollaboration[advisor]) {
          advisorCollaboration[advisor] = new Set()
        }
        // Check if session involves multiple observation categories (indicating collaboration)
        if (session.observations && Object.keys(session.observations).length > 3) {
          advisorCollaboration[advisor].add('multi-category')
        }
      }
    })

    const collaborativeAdvisors = Object.values(advisorCollaboration)
      .filter(collaborations => collaborations.size > 0).length

    if (collaborativeAdvisors > 0) {
      insights.push({
        type: 'success',
        category: 'Collaboration',
        title: 'Cross-Functional Collaboration',
        description: `${collaborativeAdvisors} advisors demonstrate cross-functional collaboration. Continue fostering interdisciplinary approaches.`,
        icon: <Users className="w-5 h-5" />,
        priority: 'low'
      })
    } else {
      insights.push({
        type: 'info',
        category: 'Collaboration',
        title: 'Collaboration Opportunity',
        description: 'Limited cross-functional collaboration detected. Consider implementing team-based approaches for complex student cases.',
        icon: <Users className="w-5 h-5" />,
        priority: 'medium'
      })
    }

    // Analyze service integration
    const integratedServices = sessions.filter(s => 
      s.sessionInfo?.sessionType && 
      ['academic-planning', 'career-counseling', 'financial-aid'].includes(s.sessionInfo.sessionType)
    ).length

    if (integratedServices > 0) {
      insights.push({
        type: 'info',
        category: 'Service Integration',
        title: 'Integrated Service Delivery',
        description: `${integratedServices} integrated service sessions detected. Consider formalizing cross-service referral systems.`,
        icon: <Link className="w-5 h-5" />,
        priority: 'medium'
      })
    }

    return insights
  }

  // NEW: Technology adoption insights
  const analyzeTechnologyAdoption = (sessions) => {
    const insights = []
    
    if (sessions.length === 0) return insights

    // Analyze digital tool usage
    const digitalToolSessions = sessions.filter(s => 
      s.observations?.technologyIntegration || 
      s.observations?.digitalResources
    ).length

    const digitalAdoptionRate = (digitalToolSessions / sessions.length) * 100
    
    if (digitalAdoptionRate >= 70) {
      insights.push({
        type: 'success',
        category: 'Technology',
        title: 'High Technology Adoption',
        description: `${Math.round(digitalAdoptionRate)}% of sessions utilize digital tools. Excellent technology integration for enhanced student support.`,
        icon: <Smartphone className="w-5 h-5" />,
        priority: 'low'
      })
    } else if (digitalAdoptionRate >= 40) {
      insights.push({
        type: 'info',
        category: 'Technology',
        title: 'Moderate Technology Adoption',
        description: `${Math.round(digitalAdoptionRate)}% of sessions use digital tools. Consider expanding technology integration for improved efficiency.`,
        icon: <Smartphone className="w-5 h-5" />,
        priority: 'medium'
      })
    } else {
      insights.push({
        type: 'warning',
        category: 'Technology',
        title: 'Technology Adoption Opportunity',
        description: `${Math.round(digitalAdoptionRate)}% of sessions utilize digital tools. Implement technology solutions to enhance service delivery.`,
        icon: <Smartphone className="w-5 h-5" />,
        priority: 'medium'
      })
    }

    // Analyze AI tool effectiveness
    const aiToolSessions = sessions.filter(s => 
      s.observations?.aiAssistance || 
      s.observations?.predictiveAnalytics
    ).length

    if (aiToolSessions > 0) {
      insights.push({
        type: 'info',
        category: 'AI Integration',
        title: 'AI Tool Utilization',
        description: `${aiToolSessions} sessions utilize AI tools. Continue expanding AI integration for data-driven insights and automation.`,
        icon: <Brain className="w-5 h-5" />,
        priority: 'medium'
      })
    } else {
      insights.push({
        type: 'info',
        category: 'AI Integration',
        title: 'AI Integration Opportunity',
        description: 'No AI tool usage detected. Consider implementing AI-powered analytics and automation tools for enhanced efficiency.',
        icon: <Brain className="w-5 h-5" />,
        priority: 'medium'
      })
    }

    return insights
  }

  // NEW: Student satisfaction insights
  const analyzeStudentSatisfaction = (sessions) => {
    const insights = []
    
    if (sessions.length === 0) return insights

    // Analyze student engagement ratings
    const engagementRatings = sessions
      .map(s => s.observations?.studentEngagement?.overallSatisfaction)
      .filter(r => r && ['High', 'Very High', 'Excellent'].includes(r))

    const satisfactionRate = (engagementRatings.length / sessions.length) * 100
    
    if (satisfactionRate >= 80) {
      insights.push({
        type: 'success',
        category: 'Student Satisfaction',
        title: 'Excellent Student Satisfaction',
        description: `${Math.round(satisfactionRate)}% of sessions show high student satisfaction. Maintain these exceptional service standards.`,
        icon: <Heart className="w-5 h-5" />,
        priority: 'low'
      })
    } else if (satisfactionRate >= 60) {
      insights.push({
        type: 'info',
        category: 'Student Satisfaction',
        title: 'Good Student Satisfaction',
        description: `${Math.round(satisfactionRate)}% of sessions show high satisfaction. Focus on improving the remaining sessions.`,
        icon: <Heart className="w-5 h-5" />,
        priority: 'medium'
      })
    } else {
      insights.push({
        type: 'warning',
        category: 'Student Satisfaction',
        title: 'Student Satisfaction Improvement',
        description: `${Math.round(satisfactionRate)}% of sessions show high satisfaction. Implement feedback systems and service improvements.`,
        icon: <Heart className="w-5 h-5" />,
        priority: 'high'
      })
    }

    // Analyze follow-up effectiveness
    const followUpSessions = sessions.filter(s => 
      s.sessionInfo?.sessionType === 'follow-up'
    ).length

    if (followUpSessions > 0) {
      insights.push({
        type: 'info',
        category: 'Follow-up Services',
        title: 'Follow-up Service Utilization',
        description: `${followUpSessions} follow-up sessions demonstrate commitment to ongoing student support and relationship building.`,
        icon: <Repeat className="w-5 h-5" />,
        priority: 'medium'
      })
    }

    return insights
  }

  // NEW: Operational efficiency insights
  const analyzeOperationalEfficiency = (sessions) => {
    const insights = []
    
    if (sessions.length === 0) return insights

    // Analyze session scheduling efficiency
    const scheduledSessions = sessions.filter(s => 
      s.sessionInfo?.date && s.sessionInfo?.time
    ).length

    const schedulingRate = (scheduledSessions / sessions.length) * 100
    
    if (schedulingRate < 90) {
      insights.push({
        type: 'warning',
        category: 'Operational Efficiency',
        title: 'Session Scheduling',
        description: `${Math.round(schedulingRate)}% of sessions have proper scheduling. Implement standardized scheduling procedures for better organization.`,
        icon: <Calendar className="w-5 h-5" />,
        priority: 'medium'
      })
    }

    // Analyze session duration consistency
    const durations = sessions
      .map(s => s.sessionInfo?.duration)
      .filter(d => d && d > 0)
    
    if (durations.length > 0) {
      const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length
      const durationVariance = Math.sqrt(
        durations.reduce((sum, d) => sum + Math.pow(d - avgDuration, 2), 0) / durations.length
      )
      
      if (durationVariance > avgDuration * 0.3) {
        insights.push({
          type: 'info',
          category: 'Operational Efficiency',
          title: 'Session Duration Consistency',
          description: `High session duration variance (${Math.round(durationVariance)}min) suggests opportunities for standardized session planning.`,
          icon: <Clock className="w-5 h-5" />,
          priority: 'medium'
        })
      }
    }

    // Analyze resource allocation efficiency
    const resourceUtilization = sessions.filter(s => 
      s.observations?.resourceUtilization
    ).length

    const resourceTrackingRate = (resourceUtilization / sessions.length) * 100
    
    if (resourceTrackingRate < 50) {
      insights.push({
        type: 'info',
        category: 'Operational Efficiency',
        title: 'Resource Tracking',
        description: `${Math.round(resourceTrackingRate)}% of sessions track resource utilization. Implement comprehensive resource monitoring for better efficiency.`,
        icon: <BarChart3 className="w-5 h-5" />,
        priority: 'medium'
      })
    }

    return insights
  }

  // NEW: Strategic planning insights
  const analyzeStrategicPlanning = (sessions) => {
    const insights = []
    
    if (sessions.length === 0) return insights

    // Analyze long-term planning sessions
    const planningSessions = sessions.filter(s => 
      ['academic-planning', 'graduation-planning', 'career-counseling'].includes(s.sessionInfo?.sessionType)
    ).length

    const planningRate = (planningSessions / sessions.length) * 100
    
    if (planningRate >= 30) {
      insights.push({
        type: 'success',
        category: 'Strategic Planning',
        title: 'Strong Long-term Planning',
        description: `${Math.round(planningRate)}% of sessions focus on long-term planning. Excellent strategic approach to student development.`,
        icon: <Target className="w-5 h-5" />,
        priority: 'low'
      })
    } else if (planningRate >= 15) {
      insights.push({
        type: 'info',
        category: 'Strategic Planning',
        title: 'Moderate Long-term Planning',
        description: `${Math.round(planningRate)}% of sessions involve long-term planning. Consider increasing strategic planning focus for better student outcomes.`,
        icon: <Target className="w-5 h-5" />,
        priority: 'medium'
      })
    } else {
      insights.push({
        type: 'warning',
        category: 'Strategic Planning',
        title: 'Strategic Planning Enhancement',
        description: `${Math.round(planningRate)}% of sessions focus on long-term planning. Implement strategic planning initiatives for improved student success.`,
        icon: <Target className="w-5 h-5" />,
        priority: 'medium'
      })
    }

    // Analyze service portfolio balance
    const serviceCategories = {
      academic: sessions.filter(s => ['initial-advising', 'follow-up', 'academic-planning', 'course-registration', 'graduation-planning', 'transfer-credit'].includes(s.sessionInfo?.sessionType)).length,
      support: sessions.filter(s => ['academic-probation', 'transfer-student', 'study-abroad', 'career-counseling', 'financial-aid'].includes(s.sessionInfo?.sessionType)).length,
      crisis: sessions.filter(s => ['crisis-intervention', 'mental-health'].includes(s.sessionInfo?.sessionType)).length,
      accessibility: sessions.filter(s => ['disability-services', 'international-student'].includes(s.sessionInfo?.sessionType)).length,
      advanced: sessions.filter(s => ['graduate-school', 'internship-coop'].includes(s.sessionInfo?.sessionType)).length
    }

    const totalServices = Object.values(serviceCategories).reduce((a, b) => a + b, 0)
    const balancedServices = Object.values(serviceCategories).filter(count => 
      count > 0 && count >= totalServices * 0.1
    ).length

    if (balancedServices >= 4) {
      insights.push({
        type: 'success',
        category: 'Strategic Planning',
        title: 'Balanced Service Portfolio',
        description: `${balancedServices} service categories show balanced utilization. Excellent strategic service distribution across student needs.`,
        icon: <PieChart className="w-5 h-5" />,
        priority: 'low'
      })
    } else if (balancedServices >= 3) {
      insights.push({
        type: 'info',
        category: 'Strategic Planning',
        title: 'Service Portfolio Balance',
        description: `${balancedServices} service categories show good utilization. Consider expanding underutilized service areas for better balance.`,
        icon: <PieChart className="w-5 h-5" />,
        priority: 'medium'
      })
    } else {
      insights.push({
        type: 'warning',
        category: 'Strategic Planning',
        title: 'Service Portfolio Optimization',
        description: `${balancedServices} service categories show balanced utilization. Implement strategic initiatives to diversify service offerings.`,
        icon: <PieChart className="w-5 h-5" />,
        priority: 'medium'
      })
    }

    return insights
  }

  // Helper function to get session type category
  const getSessionTypeCategory = (sessionType) => {
    if (!sessionType) return 'other'
    
    // Map session types to categories based on our constants
    const categoryMap = {
      'initial-advising': 'academic',
      'follow-up': 'academic',
      'academic-planning': 'academic',
      'course-registration': 'academic',
      'graduation-planning': 'academic',
      'transfer-credit': 'academic',
      'academic-probation': 'support',
      'transfer-student': 'support',
      'study-abroad': 'support',
      'career-counseling': 'support',
      'financial-aid': 'support',
      'crisis-intervention': 'crisis',
      'mental-health': 'crisis',
      'disability-services': 'accessibility',
      'international-student': 'accessibility',
      'graduate-school': 'advanced',
      'internship-coop': 'advanced',
      'other': 'other'
    }
    
    return categoryMap[sessionType] || 'other'
  }

  // Helper function to get category display names
  const getCategoryDisplayName = (category) => {
    const categoryNames = {
      'academic': 'Academic Planning & Advising',
      'support': 'Specialized Support',
      'crisis': 'Crisis & Intervention',
      'accessibility': 'Accessibility & Special Needs',
      'advanced': 'Advanced Planning',
      'other': 'Other Services'
    }
    return categoryNames[category] || 'Other'
  }

  // Helper function to get session type label
  const getSessionTypeLabel = (sessionType) => {
    if (!sessionType) return 'Unknown'
    
    const labelMap = {
      'initial-advising': 'Initial Advising',
      'follow-up': 'Follow-up Session',
      'academic-planning': 'Academic Planning',
      'course-registration': 'Course Registration',
      'graduation-planning': 'Graduation Planning',
      'transfer-credit': 'Transfer Credit Evaluation',
      'academic-probation': 'Academic Probation Support',
      'transfer-student': 'Transfer Student Orientation',
      'study-abroad': 'Study Abroad Planning',
      'career-counseling': 'Career Counseling',
      'financial-aid': 'Financial Aid Consultation',
      'crisis-intervention': 'Crisis Intervention',
      'mental-health': 'Mental Health Referral',
      'disability-services': 'Disability Services Support',
      'international-student': 'International Student Support',
      'graduate-school': 'Graduate School Preparation',
      'internship-coop': 'Internship/Co-op Guidance',
      'other': 'Other'
    }
    
    return labelMap[sessionType] || sessionType
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          AI-Powered Insights
        </CardTitle>
        <CardDescription>
          Intelligent analysis of your observation patterns and personalized improvement suggestions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Analysis Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-600">
              {lastAnalysis ? `Last analyzed: ${lastAnalysis.toLocaleString()}` : 'No analysis yet'}
            </span>
          </div>
          
          <Button
            onClick={analyzeSessions}
            disabled={isAnalyzing || !sessionsData || sessionsData.length === 0}
            className="gap-2"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Generate Insights
              </>
            )}
          </Button>
        </div>

        {/* Analysis Progress */}
        {isAnalyzing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>AI Analysis in Progress...</span>
              <span>{Math.round(analysisProgress)}%</span>
            </div>
            <Progress value={analysisProgress} className="w-full" />
          </div>
        )}

        {/* Strategic Recommendations Display */}
        {insights.length > 0 && !isAnalyzing && (
          <div className="space-y-6">
            {/* Strategic Recommendations Section */}
          <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2 text-lg">
                <Target className="w-5 h-5 text-blue-600" />
                Strategic Recommendations ({insights.filter(isStrategicInsight).length})
            </h4>
            
            <div className="grid gap-3">
                {insights
                  .filter(isStrategicInsight)
                  .slice(0, 20) // Show top 20 strategic recommendations
                  .map((insight, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className={getInsightTypeColor(insight.type)}>
                            {insight.icon}
                          </div>
                          <div>
                            <h5 className="font-medium text-sm text-blue-900">{insight.title}</h5>
                            <p className="text-xs text-blue-600">{insight.category}</p>
                          </div>
                        </div>
                        <Badge className={`text-xs ${getPriorityColor(insight.priority)}`}>
                          {insight.priority}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-blue-800 leading-relaxed">
                        {insight.description}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Other AI Insights Section */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2 text-lg">
                <BarChart3 className="w-4 h-4 text-green-600" />
                Other AI Insights ({insights.filter(insight => !isStrategicInsight(insight)).length})
              </h4>
              
              <div className="grid gap-3">
                {insights
                  .filter(insight => !isStrategicInsight(insight))
                  .slice(0, 15) // Show top 15 other insights
                  .map((insight, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={getInsightTypeColor(insight.type)}>
                        {insight.icon}
                      </div>
                      <div>
                        <h5 className="font-medium text-sm">{insight.title}</h5>
                        <p className="text-xs text-gray-500">{insight.category}</p>
                      </div>
                    </div>
                    <Badge className={`text-xs ${getPriorityColor(insight.priority)}`}>
                      {insight.priority}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {insights.length === 0 && !isAnalyzing && (
          <div className="text-center py-8 text-gray-500">
            <Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No AI insights available</p>
            <p className="text-sm">Click "Generate Insights" to analyze your observation patterns</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
})

// ============================
// ADVISOR PERFORMANCE ANALYSIS
// ============================

// Comprehensive advisor performance analysis
const analyzeAdvisorPerformance = (sessions) => {
  const insights = []
  
  if (sessions.length === 0) return insights

  // Group sessions by advisor
  const advisorMetrics = {}
  
  sessions.forEach(session => {
    const advisor = session.sessionInfo?.advisor || 'Unknown'
    if (!advisorMetrics[advisor]) {
      advisorMetrics[advisor] = {
        totalSessions: 0,
        completedSessions: 0,
        avgCompletionRate: 0,
        totalCompletionRate: 0,
        avgDuration: 0,
        totalDuration: 0,
        sessionTypes: new Set(),
        studentSatisfaction: [],
        communicationScores: [],
        aiIntegrationScores: [],
        retentionFocus: 0,
        referralRate: 0,
        totalReferrals: 0
      }
    }
    
    const advisor_data = advisorMetrics[advisor]
    advisor_data.totalSessions++
    
    if (session.status === 'completed') {
      advisor_data.completedSessions++
    }
    
    const completionRate = session.completionRate || 0
    advisor_data.totalCompletionRate += completionRate
    advisor_data.avgCompletionRate = advisor_data.totalCompletionRate / advisor_data.totalSessions
    
    const duration = session.sessionInfo?.duration || 0
    advisor_data.totalDuration += duration
    advisor_data.avgDuration = advisor_data.totalDuration / advisor_data.totalSessions
    
    advisor_data.sessionTypes.add(session.sessionInfo?.sessionType || 'unknown')
    
    // Analyze communication scores
    const observations = session.observations
    if (observations?.communicationInteraction) {
      const activeListening = observations.communicationInteraction.activeListening?.rating
      const studentSat = observations.communicationInteraction.studentSatisfaction?.rating
      const aiIntegration = observations.communicationInteraction.aiOutputIntegration?.rating
      
      if (activeListening) {
        const score = activeListening === 'Strong' ? 3 : activeListening === 'Moderate' ? 2 : 1
        advisor_data.communicationScores.push(score)
      }
      
      if (studentSat) {
        advisor_data.studentSatisfaction.push(studentSat)
      }
      
      if (aiIntegration) {
        const score = aiIntegration === 'Effective' ? 3 : aiIntegration === 'Limited' ? 2 : 1
        advisor_data.aiIntegrationScores.push(score)
      }
    }
    
    // Check retention focus
    if (observations?.leadershipAlignment?.retentionStrategies?.rating === 'Yes') {
      advisor_data.retentionFocus++
    }
    
    // Check referral rate
    if (observations?.advisingProcess?.referralServices?.rating === 'Yes') {
      advisor_data.totalReferrals++
    }
    advisor_data.referralRate = (advisor_data.totalReferrals / advisor_data.totalSessions) * 100
  })

  // Generate insights for each advisor with meaningful sessions
  Object.entries(advisorMetrics).forEach(([advisor, metrics]) => {
    if (metrics.totalSessions >= 3) { // Only analyze advisors with sufficient data
      
      // Performance Excellence Recognition
      if (metrics.avgCompletionRate > 85 && metrics.completedSessions / metrics.totalSessions > 0.9) {
        insights.push({
          type: 'success',
          category: 'Advisor Excellence',
          title: `${advisor}: Exceptional Performance`,
          description: `${advisor} demonstrates outstanding performance with ${Math.round(metrics.avgCompletionRate)}% avg completion rate across ${metrics.totalSessions} sessions. Consistent excellence in session completion and documentation quality.`,
          icon: <Trophy className="w-5 h-5" />,
          priority: 'high'
        })
      }
      
      // Communication Excellence
      if (metrics.communicationScores.length > 0) {
        const avgCommScore = metrics.communicationScores.reduce((a, b) => a + b, 0) / metrics.communicationScores.length
        if (avgCommScore >= 2.5) {
                  insights.push({
          type: 'success',
          category: 'Communication Excellence',
          title: `${advisor}: Strong Communication Skills`,
          description: `${advisor} excels in communication with an average score of ${avgCommScore.toFixed(1)}/3.0. Demonstrates strong active listening and student engagement capabilities.`,
          icon: <Users className="w-5 h-5" />,
          priority: 'high'
        })
        } else if (avgCommScore < 2.0) {
          insights.push({
            type: 'warning',
            category: 'Communication Development',
            title: `${advisor}: Communication Enhancement Opportunity`,
            description: `${advisor} has potential for communication improvement (${avgCommScore.toFixed(1)}/3.0). Consider targeted training in active listening and student engagement techniques.`,
            icon: <Users className="w-5 h-5" />,
            priority: 'medium'
          })
        }
      }
      
      // Technology Integration Analysis
      if (metrics.aiIntegrationScores.length > 0) {
        const avgTechScore = metrics.aiIntegrationScores.reduce((a, b) => a + b, 0) / metrics.aiIntegrationScores.length
        if (avgTechScore >= 2.5) {
                  insights.push({
          type: 'success',
          category: 'Technology Integration',
          title: `${advisor}: Technology Integration Leader`,
          description: `${advisor} effectively integrates AI tools with ${avgTechScore.toFixed(1)}/3.0 integration score. Serves as a model for technology-enhanced advising practices.`,
          icon: <Smartphone className="w-5 h-5" />,
          priority: 'high'
        })
        } else if (avgTechScore < 2.0) {
          insights.push({
            type: 'warning',
            category: 'Technology Development',
            title: `${advisor}: Technology Integration Development`,
            description: `${advisor} could benefit from enhanced technology training (${avgTechScore.toFixed(1)}/3.0). Recommend AI tool workshops and digital literacy development.`,
            icon: <Smartphone className="w-5 h-5" />,
            priority: 'medium'
          })
        }
      }
      
      // Session Efficiency Analysis
      if (metrics.avgDuration > 0) {
        const avgMinutes = Math.round(metrics.avgDuration / 60)
        if (avgMinutes > 25) {
          insights.push({
            type: 'info',
            category: 'Session Efficiency',
            title: `${advisor}: Extended Session Duration`,
            description: `${advisor} averages ${avgMinutes} minutes per session, indicating thorough coverage but potential efficiency optimization opportunities. Consider time management training.`,
            icon: <Clock className="w-5 h-5" />,
            priority: 'low'
          })
        } else if (avgMinutes < 8) {
          insights.push({
            type: 'warning',
            category: 'Session Quality',
            title: `${advisor}: Brief Session Duration`,
            description: `${advisor} averages ${avgMinutes} minutes per session. Ensure comprehensive student needs are being addressed and consider session depth enhancement.`,
            icon: <Clock className="w-5 h-5" />,
            priority: 'medium'
          })
        }
      }
      
      // Specialization Analysis
      const sessionTypeCount = metrics.sessionTypes.size
      if (sessionTypeCount >= 8) {
        insights.push({
          type: 'success',
          category: 'Advisor Versatility',
          title: `${advisor}: Multi-Specialist Advisor`,
          description: `${advisor} demonstrates versatility across ${sessionTypeCount} session types. Valuable generalist with broad institutional knowledge and adaptability.`,
          icon: <Target className="w-5 h-5" />,
          priority: 'medium'
        })
      } else if (sessionTypeCount <= 3) {
        const primaryTypes = Array.from(metrics.sessionTypes).slice(0, 3).join(', ')
        insights.push({
          type: 'info',
          category: 'Advisor Specialization',
          title: `${advisor}: Focused Specialist`,
          description: `${advisor} specializes in ${sessionTypeCount} session types: ${primaryTypes}. Consider leveraging specialization or expanding service range.`,
          icon: <Target className="w-5 h-5" />,
          priority: 'low'
        })
      }
      
      // Retention Focus Analysis
      const retentionRate = (metrics.retentionFocus / metrics.totalSessions) * 100
      if (retentionRate > 60) {
        insights.push({
          type: 'success',
          category: 'Student Success Focus',
          title: `${advisor}: Strong Retention Focus`,
          description: `${advisor} incorporates retention strategies in ${Math.round(retentionRate)}% of sessions. Demonstrates strong commitment to student success and institutional goals.`,
          icon: <TrendingUp className="w-5 h-5" />,
          priority: 'medium'
        })
      } else if (retentionRate < 30) {
        insights.push({
          type: 'warning',
          category: 'Retention Strategy',
          title: `${advisor}: Retention Strategy Enhancement`,
          description: `${advisor} addresses retention in ${Math.round(retentionRate)}% of sessions. Consider training on retention-focused advising techniques and early intervention strategies.`,
          icon: <TrendingUp className="w-5 h-5" />,
          priority: 'medium'
        })
      }
      
      // Referral Network Utilization
      if (metrics.referralRate > 40) {
        insights.push({
          type: 'success',
          category: 'Service Integration',
          title: `${advisor}: Strong Referral Network Usage`,
          description: `${advisor} utilizes referral services in ${Math.round(metrics.referralRate)}% of sessions. Excellent collaborative approach and resource awareness.`,
          icon: <Link className="w-5 h-5" />,
          priority: 'medium'
        })
      } else if (metrics.referralRate < 15) {
        insights.push({
          type: 'warning',
          category: 'Resource Utilization',
          title: `${advisor}: Referral Network Development`,
          description: `${advisor} makes referrals in ${Math.round(metrics.referralRate)}% of sessions. Consider training on institutional resources and collaborative service delivery.`,
          icon: <Link className="w-5 h-5" />,
          priority: 'medium'
        })
      }
    }
  })
  
  // Cross-advisor comparison insights
  const advisorList = Object.entries(advisorMetrics).filter(([, metrics]) => metrics.totalSessions >= 3)
  
  if (advisorList.length > 1) {
    // Performance comparison
    const sortedByPerformance = advisorList.sort(([,a], [,b]) => b.avgCompletionRate - a.avgCompletionRate)
    const topPerformer = sortedByPerformance[0]
    const bottomPerformer = sortedByPerformance[sortedByPerformance.length - 1]
    
    if (topPerformer[1].avgCompletionRate - bottomPerformer[1].avgCompletionRate > 15) {
      insights.push({
        type: 'info',
        category: 'Performance Comparison',
        title: 'Advisor Performance Gap Analysis',
        description: `Performance gap identified: ${topPerformer[0]} (${Math.round(topPerformer[1].avgCompletionRate)}%) vs ${bottomPerformer[0]} (${Math.round(bottomPerformer[1].avgCompletionRate)}%). Implement peer mentoring and best practice sharing programs.`,
        icon: <BarChart3 className="w-5 h-5" />,
        priority: 'medium'
      })
    }
    
    // Technology adoption comparison
    const techScores = advisorList.map(([name, metrics]) => ({
      name,
      score: metrics.aiIntegrationScores.length > 0 ? 
        metrics.aiIntegrationScores.reduce((a, b) => a + b, 0) / metrics.aiIntegrationScores.length : 0
    })).filter(advisor => advisor.score > 0)
    
    if (techScores.length > 1) {
      const techLeader = techScores.reduce((a, b) => a.score > b.score ? a : b)
      const techTrailers = techScores.filter(advisor => advisor.score < 2.0)
      
      if (techTrailers.length > 0 && techLeader.score >= 2.5) {
        insights.push({
          type: 'info',
          category: 'Technology Mentoring',
          title: 'Technology Integration Mentoring Opportunity',
          description: `${techLeader.name} (${techLeader.score.toFixed(1)}/3.0) could mentor ${techTrailers.length} advisors in technology integration. Establish tech mentoring program.`,
          icon: <Smartphone className="w-5 h-5" />,
          priority: 'medium'
        })
      }
    }
  }

  return insights
}

// Advisor communication and interaction analysis
const analyzeAdvisorCommunication = (sessions) => {
  const insights = []
  
  if (sessions.length === 0) return insights

  const communicationPatterns = {}
  
  sessions.forEach(session => {
    const advisor = session.sessionInfo?.advisor || 'Unknown'
    const observations = session.observations?.communicationInteraction
    
    if (!communicationPatterns[advisor]) {
      communicationPatterns[advisor] = {
        sessions: 0,
        activeListeningScores: [],
        studentSatisfactionRatings: [],
        aiIntegrationScores: [],
        sessionTypes: new Set()
      }
    }
    
    communicationPatterns[advisor].sessions++
    communicationPatterns[advisor].sessionTypes.add(session.sessionInfo?.sessionType)
    
    if (observations) {
      // Active listening analysis
      if (observations.activeListening?.rating) {
        const rating = observations.activeListening.rating
        communicationPatterns[advisor].activeListeningScores.push(rating)
      }
      
      // Student satisfaction analysis
      if (observations.studentSatisfaction?.rating) {
        const rating = observations.studentSatisfaction.rating
        communicationPatterns[advisor].studentSatisfactionRatings.push(rating)
      }
      
      // AI integration communication analysis
      if (observations.aiOutputIntegration?.rating) {
        const rating = observations.aiOutputIntegration.rating
        communicationPatterns[advisor].aiIntegrationScores.push(rating)
      }
    }
  })

  // Generate communication insights for each advisor
  Object.entries(communicationPatterns).forEach(([advisor, data]) => {
    if (data.sessions >= 3) {
      
      // Active listening analysis
      if (data.activeListeningScores.length > 0) {
        const strongCount = data.activeListeningScores.filter(score => score === 'Strong').length
        const strongRate = (strongCount / data.activeListeningScores.length) * 100
        
        if (strongRate >= 80) {
          insights.push({
            type: 'success',
            category: 'Communication Excellence',
            title: `${advisor}: Active Listening Mastery`,
            description: `${advisor} demonstrates strong active listening in ${Math.round(strongRate)}% of observed sessions. Excellent empathy and student connection capabilities.`,
            icon: <Heart className="w-5 h-5" />,
            priority: 'high'
          })
        } else if (strongRate < 40) {
          insights.push({
            type: 'warning',
            category: 'Communication Development',
            title: `${advisor}: Active Listening Enhancement Needed`,
            description: `${advisor} shows strong active listening in ${Math.round(strongRate)}% of sessions. Recommend active listening workshops and empathy training programs.`,
            icon: <Heart className="w-5 h-5" />,
            priority: 'medium'
          })
        }
      }
      
      // Student satisfaction communication analysis
      if (data.studentSatisfactionRatings.length > 0) {
        const positiveCount = data.studentSatisfactionRatings.filter(rating => rating === 'Positive').length
        const positiveRate = (positiveCount / data.studentSatisfactionRatings.length) * 100
        
        if (positiveRate >= 85) {
          insights.push({
            type: 'success',
            category: 'Student Relations',
            title: `${advisor}: Exceptional Student Relations`,
            description: `${advisor} achieves positive student satisfaction in ${Math.round(positiveRate)}% of sessions. Outstanding interpersonal skills and student connection abilities.`,
            icon: <Users className="w-5 h-5" />,
            priority: 'high'
          })
        } else if (positiveRate < 60) {
          const negativeCount = data.studentSatisfactionRatings.filter(rating => rating === 'Negative').length
          if (negativeCount > 0) {
            insights.push({
              type: 'warning',
              category: 'Student Relations',
              title: `${advisor}: Student Satisfaction Improvement Needed`,
              description: `${advisor} has ${Math.round(positiveRate)}% positive satisfaction rate with some negative feedback. Recommend relationship building and communication style assessment.`,
              icon: <AlertTriangle className="w-5 h-5" />,
              priority: 'high'
            })
          }
        }
      }
      
      // AI communication integration analysis
      if (data.aiIntegrationScores.length > 0) {
        const effectiveCount = data.aiIntegrationScores.filter(score => score === 'Effective').length
        const effectiveRate = (effectiveCount / data.aiIntegrationScores.length) * 100
        
        if (effectiveRate >= 70) {
          insights.push({
            type: 'success',
            category: 'Technology Communication',
            title: `${advisor}: Seamless AI Communication Integration`,
            description: `${advisor} effectively integrates AI output into conversations in ${Math.round(effectiveRate)}% of sessions. Excellent technology-human communication balance.`,
            icon: <Smartphone className="w-5 h-5" />,
            priority: 'medium'
          })
        } else if (effectiveRate < 40) {
          insights.push({
            type: 'warning',
            category: 'Technology Communication',
            title: `${advisor}: AI Communication Integration Training Needed`,
            description: `${advisor} effectively integrates AI output in ${Math.round(effectiveRate)}% of sessions. Consider training on natural AI integration and conversation flow.`,
            icon: <Smartphone className="w-5 h-5" />,
            priority: 'medium'
          })
        }
      }
      
      // Communication consistency across session types
      if (data.sessionTypes.size >= 4) {
        insights.push({
          type: 'success',
          category: 'Communication Adaptability',
          title: `${advisor}: Versatile Communication Skills`,
          description: `${advisor} maintains consistent communication quality across ${data.sessionTypes.size} session types. Strong adaptability and professional communication skills.`,
          icon: <Target className="w-5 h-5" />,
          priority: 'medium'
        })
      }
    }
  })

  return insights
}

// Advisor technology integration analysis
const analyzeAdvisorTechnologyUse = (sessions) => {
  const insights = []
  
  if (sessions.length === 0) return insights

  const techUsagePatterns = {}
  
  sessions.forEach(session => {
    const advisor = session.sessionInfo?.advisor || 'Unknown'
    const observations = session.observations
    
    if (!techUsagePatterns[advisor]) {
      techUsagePatterns[advisor] = {
        sessions: 0,
        aiToolsUsage: [],
        accurateInfoRatings: [],
        efficiencyEnhancement: [],
        technicalIssues: [],
        aiIntegrationQuality: []
      }
    }
    
    techUsagePatterns[advisor].sessions++
    
    if (observations) {
      // AI tools usage analysis
      if (observations.advisingProcess?.aiToolsUsage?.rating) {
        techUsagePatterns[advisor].aiToolsUsage.push(observations.advisingProcess.aiToolsUsage.rating)
      }
      
      // Information accuracy analysis
      if (observations.aiEnhancedTools?.accurateInfo?.rating) {
        techUsagePatterns[advisor].accurateInfoRatings.push(observations.aiEnhancedTools.accurateInfo.rating)
      }
      
      // Efficiency enhancement analysis
      if (observations.aiEnhancedTools?.enhancesEfficiency?.rating) {
        techUsagePatterns[advisor].efficiencyEnhancement.push(observations.aiEnhancedTools.enhancesEfficiency.rating)
      }
      
      // Technical issues tracking
      if (observations.aiEnhancedTools?.technicalIssues?.rating) {
        techUsagePatterns[advisor].technicalIssues.push(observations.aiEnhancedTools.technicalIssues.rating)
      }
      
      // AI integration quality
      if (observations.communicationInteraction?.aiOutputIntegration?.rating) {
        techUsagePatterns[advisor].aiIntegrationQuality.push(observations.communicationInteraction.aiOutputIntegration.rating)
      }
    }
  })

  // Generate technology insights for each advisor
  Object.entries(techUsagePatterns).forEach(([advisor, data]) => {
    if (data.sessions >= 3) {
      
      // AI tools adoption analysis
      if (data.aiToolsUsage.length > 0) {
        const observedCount = data.aiToolsUsage.filter(usage => usage === 'Observed').length
        const adoptionRate = (observedCount / data.aiToolsUsage.length) * 100
        
        if (adoptionRate >= 80) {
          insights.push({
            type: 'success',
            category: 'Technology Adoption',
            title: `${advisor}: AI Tools Champion`,
            description: `${advisor} actively uses AI tools in ${Math.round(adoptionRate)}% of sessions. Demonstrates strong technology adoption and digital innovation leadership.`,
            icon: <Sparkles className="w-5 h-5" />,
            priority: 'high'
          })
        } else if (adoptionRate < 40) {
          insights.push({
            type: 'warning',
            category: 'Technology Adoption',
            title: `${advisor}: AI Tools Training Opportunity`,
            description: `${advisor} uses AI tools in ${Math.round(adoptionRate)}% of sessions. Consider comprehensive AI tools training and technology integration workshops.`,
            icon: <Smartphone className="w-5 h-5" />,
            priority: 'medium'
          })
        }
      }
      
      // Information accuracy with technology
      if (data.accurateInfoRatings.length > 0) {
        const accurateCount = data.accurateInfoRatings.filter(rating => rating === 'Accurate').length
        const accuracyRate = (accurateCount / data.accurateInfoRatings.length) * 100
        
        if (accuracyRate >= 90) {
          insights.push({
            type: 'success',
            category: 'Information Quality',
            title: `${advisor}: Exceptional Information Accuracy`,
            description: `${advisor} provides accurate information in ${Math.round(accuracyRate)}% of technology-enhanced sessions. Outstanding quality control and verification skills.`,
            icon: <CheckCircle className="w-5 h-5" />,
            priority: 'high'
          })
        } else if (accuracyRate < 70) {
          insights.push({
            type: 'warning',
            category: 'Information Quality',
            title: `${advisor}: Information Accuracy Enhancement Needed`,
            description: `${advisor} maintains ${Math.round(accuracyRate)}% information accuracy. Recommend training on information verification and quality assurance protocols.`,
            icon: <AlertTriangle className="w-5 h-5" />,
            priority: 'high'
          })
        }
      }
      
      // Technology efficiency enhancement
      if (data.efficiencyEnhancement.length > 0) {
        const yesCount = data.efficiencyEnhancement.filter(rating => rating === 'Yes').length
        const efficiencyRate = (yesCount / data.efficiencyEnhancement.length) * 100
        
        if (efficiencyRate >= 75) {
          insights.push({
            type: 'success',
            category: 'Technology Efficiency',
            title: `${advisor}: Technology Efficiency Expert`,
            description: `${advisor} enhances session efficiency through technology in ${Math.round(efficiencyRate)}% of sessions. Excellent optimization and workflow management skills.`,
            icon: <Target className="w-5 h-5" />,
            priority: 'medium'
          })
        } else if (efficiencyRate < 50) {
          insights.push({
            type: 'warning',
            category: 'Technology Efficiency',
            title: `${advisor}: Technology Efficiency Training Needed`,
            description: `${advisor} achieves technology-enhanced efficiency in ${Math.round(efficiencyRate)}% of sessions. Consider workflow optimization and efficiency training programs.`,
            icon: <Target className="w-5 h-5" />,
            priority: 'medium'
          })
        }
      }
      
      // Technical issues management
      if (data.technicalIssues.length > 0) {
        const issuesCount = data.technicalIssues.filter(rating => rating === 'Yes').length
        const issuesRate = (issuesCount / data.technicalIssues.length) * 100
        
        if (issuesRate > 30) {
          insights.push({
            type: 'warning',
            category: 'Technical Support',
            title: `${advisor}: Technical Issues Resolution Support Needed`,
            description: `${advisor} experiences technical issues in ${Math.round(issuesRate)}% of sessions. Consider additional technical training and support system enhancement.`,
            icon: <Zap className="w-5 h-5" />,
            priority: 'medium'
          })
        } else if (issuesRate < 10) {
          insights.push({
            type: 'success',
            category: 'Technical Proficiency',
            title: `${advisor}: Strong Technical Problem-Solving`,
            description: `${advisor} has minimal technical issues (${Math.round(issuesRate)}% of sessions). Demonstrates strong technical proficiency and problem-solving abilities.`,
            icon: <CheckCircle className="w-5 h-5" />,
            priority: 'low'
          })
        }
      }
    }
  })

  return insights
}

// Advisor specialization and expertise analysis
const analyzeAdvisorExpertise = (sessions) => {
  const insights = []
  
  if (sessions.length === 0) return insights

  const expertisePatterns = {}
  
  sessions.forEach(session => {
    const advisor = session.sessionInfo?.advisor || 'Unknown'
    const sessionType = session.sessionInfo?.sessionType || 'unknown'
    const completionRate = session.completionRate || 0
    
    if (!expertisePatterns[advisor]) {
      expertisePatterns[advisor] = {
        sessionTypes: {},
        totalSessions: 0,
        overallCompletion: 0,
        specializations: new Set()
      }
    }
    
    expertisePatterns[advisor].totalSessions++
    expertisePatterns[advisor].overallCompletion += completionRate
    
    if (!expertisePatterns[advisor].sessionTypes[sessionType]) {
      expertisePatterns[advisor].sessionTypes[sessionType] = {
        count: 0,
        totalCompletion: 0,
        avgCompletion: 0
      }
    }
    
    expertisePatterns[advisor].sessionTypes[sessionType].count++
    expertisePatterns[advisor].sessionTypes[sessionType].totalCompletion += completionRate
    expertisePatterns[advisor].sessionTypes[sessionType].avgCompletion = 
      expertisePatterns[advisor].sessionTypes[sessionType].totalCompletion / 
      expertisePatterns[advisor].sessionTypes[sessionType].count
  })

  // Analyze expertise patterns
  Object.entries(expertisePatterns).forEach(([advisor, data]) => {
    if (data.totalSessions >= 5) {
      const avgOverallCompletion = data.overallCompletion / data.totalSessions
      
      // Identify specializations (session types with high frequency and performance)
      const specializations = Object.entries(data.sessionTypes)
        .filter(([type, typeData]) => typeData.count >= 3 && typeData.avgCompletion > avgOverallCompletion + 5)
        .map(([type, typeData]) => ({ type, ...typeData }))
        .sort((a, b) => b.avgCompletion - a.avgCompletion)
      
      // Identify areas of expertise
      if (specializations.length > 0) {
        const topSpecialization = specializations[0]
        const sessionTypeLabel = getSessionTypeLabel(topSpecialization.type)
        
        insights.push({
          type: 'success',
          category: 'Advisor Specialization',
          title: `${advisor}: ${sessionTypeLabel} Specialist`,
          description: `${advisor} demonstrates expertise in ${sessionTypeLabel} with ${Math.round(topSpecialization.avgCompletion)}% avg completion rate across ${topSpecialization.count} sessions. Consider as lead specialist for this service area.`,
          icon: <Target className="w-5 h-5" />,
          priority: 'medium'
        })
      }
      
      // Multi-specialization recognition
      if (specializations.length >= 3) {
        const specializationTypes = specializations.slice(0, 3).map(s => getSessionTypeLabel(s.type)).join(', ')
        insights.push({
          type: 'success',
          category: 'Multi-Specialization',
          title: `${advisor}: Multi-Specialty Expert`,
          description: `${advisor} shows expertise across multiple areas: ${specializationTypes}. Valuable resource for diverse advising needs and cross-training initiatives.`,
          icon: <Users className="w-5 h-5" />,
          priority: 'medium'
        })
      }
      
      // Identify development areas (session types with lower performance)
      const developmentAreas = Object.entries(data.sessionTypes)
        .filter(([type, typeData]) => typeData.count >= 2 && typeData.avgCompletion < avgOverallCompletion - 10)
        .map(([type, typeData]) => ({ type, ...typeData }))
        .sort((a, b) => a.avgCompletion - b.avgCompletion)
      
      if (developmentAreas.length > 0) {
        const developmentArea = developmentAreas[0]
        const sessionTypeLabel = getSessionTypeLabel(developmentArea.type)
        
        insights.push({
          type: 'warning',
          category: 'Professional Development',
          title: `${advisor}: ${sessionTypeLabel} Development Opportunity`,
          description: `${advisor} has development opportunity in ${sessionTypeLabel} (${Math.round(developmentArea.avgCompletion)}% completion rate). Consider specialized training and mentoring in this area.`,
          icon: <BookOpen className="w-5 h-5" />,
          priority: 'medium'
        })
      }
      
      // Volume and consistency analysis
      const sessionTypeCount = Object.keys(data.sessionTypes).length
      if (sessionTypeCount >= 8) {
        insights.push({
          type: 'success',
          category: 'Advisor Versatility',
          title: `${advisor}: Comprehensive Service Provider`,
          description: `${advisor} handles ${sessionTypeCount} different session types with ${Math.round(avgOverallCompletion)}% overall completion rate. Strong generalist capabilities across diverse student needs.`,
          icon: <Globe className="w-5 h-5" />,
          priority: 'medium'
        })
      }
      
      // Consistency analysis
      const completionRates = Object.values(data.sessionTypes).map(typeData => typeData.avgCompletion)
      const minCompletion = Math.min(...completionRates)
      const maxCompletion = Math.max(...completionRates)
      const consistencyRange = maxCompletion - minCompletion
      
      if (consistencyRange < 15 && avgOverallCompletion > 75) {
        insights.push({
          type: 'success',
          category: 'Performance Consistency',
          title: `${advisor}: Consistent High Performance`,
          description: `${advisor} maintains consistent performance across session types (${Math.round(consistencyRange)}% variation). Reliable, high-quality advisor with stable service delivery.`,
          icon: <CheckCircle className="w-5 h-5" />,
          priority: 'medium'
        })
      } else if (consistencyRange > 30) {
        insights.push({
          type: 'warning',
          category: 'Performance Consistency',
          title: `${advisor}: Performance Standardization Opportunity`,
          description: `${advisor} shows performance variation across session types (${Math.round(consistencyRange)}% range). Consider training to standardize quality across all service areas.`,
          icon: <BarChart3 className="w-5 h-5" />,
          priority: 'medium'
        })
      }
    }
  })

  return insights
}

export default AIInsights

