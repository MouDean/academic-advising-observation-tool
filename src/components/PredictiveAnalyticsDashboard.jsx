import React, { useState, useMemo, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  Download,
  BarChart3,
  LineChart,
  PieChart,
  Calendar,
  Target,
  Lightbulb
} from 'lucide-react'
import { showNotification } from '@/components/Notification.jsx'
import { 
  calculateStudentRiskScore, 
  performLongitudinalAnalysis, 
  exportPredictiveAnalytics,
  RISK_LEVELS 
} from '@/utils/predictiveAnalytics.js'
import Loading from '@/components/ui/loading.jsx'
import {
  RiskDistributionChart,
  TrendAnalysisChart,
  RiskFactorsChart,
  PerformanceMetricsChart
} from '@/components/charts'
import { exportChartsToPDF } from '@/utils/chartExport.js'

const PredictiveAnalyticsDashboard = React.memo(({ sessions }) => {
  const [timeUnit, setTimeUnit] = useState('day')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [isExporting, setIsExporting] = useState(false)
  const [isExportingPDF, setIsExportingPDF] = useState(false)

  // Helper function to get session type category
  const getSessionTypeCategory = (sessionType) => {
    if (!sessionType) return 'other'
    
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

  // Analyze session type patterns for predictions
  const analyzeSessionTypePatterns = (sessions) => {
    if (!sessions || sessions.length === 0) return null

    const patterns = {
      sessionTypeTrends: {},
      categoryPredictions: {},
      riskIndicators: {},
      recommendations: []
    }

    // Analyze session type frequency trends
    const sessionTypeCounts = {}
    const categoryCounts = {}
    
    sessions.forEach(session => {
      const sessionType = session.sessionInfo?.sessionType
      if (sessionType) {
        sessionTypeCounts[sessionType] = (sessionTypeCounts[sessionType] || 0) + 1
        
        // Map to categories
        const category = getSessionTypeCategory(sessionType)
        categoryCounts[category] = (categoryCounts[category] || 0) + 1
      }
    })

    // Identify trending session types
    const sortedTypes = Object.entries(sessionTypeCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
    
    patterns.sessionTypeTrends = sortedTypes.map(([type, count]) => ({
      type,
      count,
      percentage: Math.round((count / sessions.length) * 100),
      trend: count > 3 ? 'increasing' : count > 1 ? 'stable' : 'emerging'
    }))

    // Analyze category distribution
    patterns.categoryPredictions = Object.entries(categoryCounts).map(([category, count]) => ({
      category: getCategoryDisplayName(category),
      count,
      percentage: Math.round((count / sessions.length) * 100),
      growth: count > 2 ? 'high' : count > 1 ? 'medium' : 'low'
    }))

    // Generate risk indicators based on session types
    const crisisSessions = sessions.filter(s => 
      ['crisis-intervention', 'mental-health'].includes(s.sessionInfo?.sessionType)
    ).length

    if (crisisSessions > 0) {
      patterns.riskIndicators.crisisIntervention = {
        count: crisisSessions,
        risk: 'high',
        recommendation: 'Ensure crisis protocols are in place and staff are trained'
      }
    }

    // Check for academic probation patterns
    const probationSessions = sessions.filter(s => 
      s.sessionInfo?.sessionType === 'academic-probation'
    ).length

    if (probationSessions > 0) {
      patterns.riskIndicators.academicProbation = {
        count: probationSessions,
        risk: 'medium',
        recommendation: 'Implement early intervention programs for at-risk students'
      }
    }

    // Generate recommendations
    if (patterns.sessionTypeTrends.length > 0) {
      const topType = patterns.sessionTypeTrends[0]
      patterns.recommendations.push({
        type: 'focus',
        title: 'Primary Service Focus',
        description: `Focus on ${getSessionTypeLabel(topType.type)} sessions as they represent ${topType.percentage}% of all sessions`,
        priority: 'high'
      })
    }

    // Check for underutilized services
    const underutilizedTypes = Object.entries(sessionTypeCounts)
      .filter(([, count]) => count < 2)
      .map(([type]) => getSessionTypeLabel(type))
    
    if (underutilizedTypes.length > 0) {
      patterns.recommendations.push({
        type: 'growth',
        title: 'Service Expansion Opportunity',
        description: `Consider promoting ${underutilizedTypes.slice(0, 3).join(', ')} services`,
        priority: 'medium'
      })
    }

    return patterns
  }

  // Calculate predictive analytics data
  const predictiveData = useMemo(() => {
    if (!sessions || sessions.length === 0) return null

    // Group sessions by student
    const studentSessions = {}
    sessions.forEach(session => {
      const studentCode = session.sessionInfo?.studentCode || 'Unknown'
      if (!studentSessions[studentCode]) {
        studentSessions[studentCode] = []
      }
      studentSessions[studentCode].push(session)
    })

    // Calculate risk scores for each student
    const studentRiskData = {}
    Object.entries(studentSessions).forEach(([studentCode, studentSessions]) => {
      studentRiskData[studentCode] = calculateStudentRiskScore(studentSessions)
    })

    // Perform longitudinal analysis
    const longitudinalData = performLongitudinalAnalysis(sessions, timeUnit)

    // Analyze session type patterns for predictions
    const sessionTypePredictions = analyzeSessionTypePatterns(sessions)

    return {
      studentRiskData,
      longitudinalData,
      sessionTypePredictions,
      totalStudents: Object.keys(studentRiskData).length,
      highRiskStudents: Object.values(studentRiskData).filter(data => 
        data.riskLevel === RISK_LEVELS.HIGH.level || data.riskLevel === RISK_LEVELS.CRITICAL.level
      ).length,
      averageRiskScore: Object.values(studentRiskData).reduce((sum, data) => 
        sum + data.riskScore, 0
      ) / Object.keys(studentRiskData).length
    }
  }, [sessions, timeUnit])

    // Handle JSON export
  const handleExport = useCallback(async () => {
    if (!predictiveData) return

    setIsExporting(true)
    try {
      await exportPredictiveAnalytics(
        sessions,
        predictiveData.studentRiskData,
        predictiveData.longitudinalData
      )
      showNotification.success('Predictive analytics exported successfully!')
    } catch (error) {
      showNotification.error('Export failed')
      console.error('Export error:', error)
    } finally {
      setIsExporting(false)
    }
  }, [predictiveData, sessions])

  // Handle PDF export
  const handlePDFExport = useCallback(async () => {
    if (!predictiveData) return

    setIsExportingPDF(true)
    try {
      await exportChartsToPDF(predictiveData, timeUnit)
      showNotification.success('PDF report exported successfully!')
    } catch (error) {
      showNotification.error('PDF export failed')
      console.error('PDF export error:', error)
    } finally {
      setIsExportingPDF(false)
    }
  }, [predictiveData, timeUnit])





  // Get risk level color
  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case RISK_LEVELS.LOW.level: return 'bg-green-100 text-green-800 border-green-200'
      case RISK_LEVELS.MEDIUM.level: return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case RISK_LEVELS.HIGH.level: return 'bg-orange-100 text-orange-800 border-orange-200'
      case RISK_LEVELS.CRITICAL.level: return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Get trend icon
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-600" />
      default: return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  if (!predictiveData) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">No data available for predictive analytics</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Predictive Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Identify at-risk students and analyze trends over time
            </p>
          </div>
          
          {/* Export Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleExport}
              disabled={isExporting || isExportingPDF}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              {isExporting ? (
                <Loading size="sm" text="" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {isExporting ? 'Exporting...' : 'Export JSON'}
            </Button>
            <Button
              onClick={handlePDFExport}
              disabled={isExporting || isExportingPDF}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              {isExportingPDF ? (
                <Loading size="sm" text="" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {isExportingPDF ? 'Creating PDF...' : 'Export PDF'}
            </Button>
          </div>
        </div>

        {/* Time Unit Filter */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Analysis Period:
            </label>
            <Select value={timeUnit} onValueChange={setTimeUnit}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hour">Hourly</SelectItem>
                <SelectItem value="day">Daily</SelectItem>
                <SelectItem value="week">Weekly</SelectItem>
                <SelectItem value="month">Monthly</SelectItem>
                <SelectItem value="quarter">Quarterly</SelectItem>
                <SelectItem value="semester">Semester</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-1 pt-1">
            <div className="text-lg font-bold">{predictiveData.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Students with observation data
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-sm font-medium">High Risk Students</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-1 pt-1">
            <div className="text-lg font-bold text-orange-600">
              {predictiveData.highRiskStudents}
            </div>
            <p className="text-xs text-muted-foreground">
              Need immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-sm font-medium">Average Risk Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-1 pt-1">
            <div className="text-lg font-bold">
              {(predictiveData.averageRiskScore * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Lower is better
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-sm font-medium">Risk Distribution</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-1 pt-1">
            <div id="risk-distribution-chart" className="h-32">
              <RiskDistributionChart studentRiskData={predictiveData.studentRiskData} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="risk-analysis" className="space-y-4">
        <TabsList>
          <TabsTrigger value="risk-analysis">Risk Analysis</TabsTrigger>
          <TabsTrigger value="trend-analysis">Trend Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        {/* Risk Analysis Tab */}
        <TabsContent value="risk-analysis" className="space-y-4">
          {/* Summary Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Card className="p-2">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {Object.values(predictiveData.studentRiskData).filter(
                    data => data.riskLevel === RISK_LEVELS.LOW.level
                  ).length}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Low Risk</p>
              </div>
            </Card>

            <Card className="p-2">
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-600">
                  {Object.values(predictiveData.studentRiskData).filter(
                    data => data.riskLevel === RISK_LEVELS.MEDIUM.level
                  ).length}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Medium Risk</p>
              </div>
            </Card>

            <Card className="p-2">
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">
                  {Object.values(predictiveData.studentRiskData).filter(
                    data => data.riskLevel === RISK_LEVELS.HIGH.level
                  ).length}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">High Risk</p>
              </div>
            </Card>

            <Card className="p-2">
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">
                  {Object.values(predictiveData.studentRiskData).filter(
                    data => data.riskLevel === RISK_LEVELS.CRITICAL.level
                  ).length}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Critical Risk</p>
              </div>
            </Card>
          </div>

          {/* Risk Overview Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Risk Factors Distribution
                </CardTitle>
                <CardDescription>
                  Most common risk factors across all students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div id="risk-factors-chart">
                  <RiskFactorsChart studentRiskData={predictiveData.studentRiskData} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Performance Metrics Overview
                </CardTitle>
                <CardDescription>
                  Average performance across key metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div id="performance-metrics-chart">
                  <PerformanceMetricsChart studentRiskData={predictiveData.studentRiskData} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Student Risk Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Student Risk Assessment
              </CardTitle>
              <CardDescription>
                Identify students who may need additional support or intervention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(predictiveData.studentRiskData)
                  .sort(([, a], [, b]) => b.riskScore - a.riskScore)
                  .map(([studentCode, riskData]) => (
                    <div 
                      key={studentCode}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                        selectedStudent === studentCode ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedStudent(selectedStudent === studentCode ? null : studentCode)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            Student {studentCode}
                          </h4>
                          <Badge 
                            variant="outline" 
                            className={getRiskLevelColor(riskData.riskLevel)}
                          >
                            {riskData.riskLevel}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            Risk Score: {(riskData.riskScore * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getTrendIcon(riskData.trend)}
                          <span className="text-sm text-gray-500 capitalize">
                            {riskData.trend}
                          </span>
                        </div>
                      </div>

                      {selectedStudent === studentCode && (
                        <div className="mt-4 space-y-4 border-t pt-4">
                          {/* Risk Factors */}
                          {riskData.riskFactors.length > 0 && (
                            <div>
                              <h5 className="font-medium mb-2">Risk Factors:</h5>
                              <div className="space-y-2">
                                {riskData.riskFactors.map((factor, index) => (
                                  <div key={index} className="flex items-start gap-2 text-sm">
                                    <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                      <span className="font-medium">{factor.factor}</span>
                                      <span className="text-gray-500 ml-2">
                                        ({factor.value} vs {factor.threshold})
                                      </span>
                                      <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                                        {factor.description}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Recommendations */}
                          {riskData.recommendations.length > 0 && (
                            <div>
                              <h5 className="font-medium mb-2">Recommendations:</h5>
                              <div className="space-y-2">
                                {riskData.recommendations.map((rec, index) => (
                                  <div key={index} className="flex items-start gap-2 text-sm">
                                    <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                      <span className="font-medium">{rec.title}</span>
                                      <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                                        {rec.description}
                                      </p>
                                      <ul className="text-xs text-gray-500 mt-1 ml-4 list-disc">
                                        {rec.actions.map((action, actionIndex) => (
                                          <li key={actionIndex}>{action}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Metrics */}
                          <div>
                            <h5 className="font-medium mb-2">Performance Metrics:</h5>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Avg Completion:</span>
                                <span className="ml-2 font-medium">{riskData.metrics.avgCompletionRate}%</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Avg Engagement:</span>
                                <span className="ml-2 font-medium">{riskData.metrics.avgEngagement}%</span>
                              </div>
                              <div>
                                <span className="text-gray-500">AI Tool Score:</span>
                                <span className="ml-2 font-medium">{riskData.metrics.avgAIScore}%</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Total Sessions:</span>
                                <span className="ml-2 font-medium">{riskData.metrics.totalSessions}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trend Analysis Tab */}
        <TabsContent value="trend-analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="w-5 h-5" />
                    Longitudinal Trend Analysis
                  </CardTitle>
                  <CardDescription>
                    Analyze performance trends over time periods
                  </CardDescription>
                </div>
                <Select value={timeUnit} onValueChange={setTimeUnit}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hour">Hour</SelectItem>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="quarter">Quarter</SelectItem>
                    <SelectItem value="semester">Semester</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {predictiveData.longitudinalData.trends.length > 0 ? (
                <div className="space-y-6">
                  {/* Trends Chart */}
                  <div>
                    <h4 className="font-medium mb-4">Performance Trends Over Time</h4>
                    <div id="trend-analysis-chart">
                      <TrendAnalysisChart 
                        trends={predictiveData.longitudinalData.trends} 
                        timeUnit={timeUnit} 
                      />
                    </div>
                  </div>

                  {/* Patterns */}
                  {predictiveData.longitudinalData.patterns.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-4">Identified Patterns</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {predictiveData.longitudinalData.patterns.map((pattern, index) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              {pattern.type === 'improvement_trend' ? (
                                <TrendingUp className="w-4 h-4 text-green-500" />
                              ) : pattern.type === 'decline_trend' ? (
                                <TrendingDown className="w-4 h-4 text-red-500" />
                              ) : (
                                <Calendar className="w-4 h-4 text-blue-500" />
                              )}
                              <span className="font-medium capitalize">
                                {pattern.type.replace('_', ' ')}
                              </span>
                              <Badge variant="outline" className="ml-auto">
                                {pattern.strength}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {pattern.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Insights */}
                  {predictiveData.longitudinalData.insights.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-4">Key Insights</h4>
                      <div className="space-y-3">
                        {predictiveData.longitudinalData.insights.map((insight, index) => (
                          <div 
                            key={index} 
                            className={`p-3 border rounded-lg ${
                              insight.type === 'positive' 
                                ? 'border-green-200 bg-green-50 dark:bg-green-900/20' 
                                : 'border-red-200 bg-red-50 dark:bg-red-900/20'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              {insight.type === 'positive' ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                              )}
                              <span className="font-medium">{insight.title}</span>
                              <Badge 
                                variant="outline" 
                                className={`ml-auto ${
                                  insight.impact === 'high' ? 'border-red-300 text-red-700' : 'border-orange-300 text-orange-700'
                                }`}
                              >
                                {insight.impact} impact
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {insight.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <LineChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Insufficient data for trend analysis</p>
                  <p className="text-sm">Need at least 2 time periods with data</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Actionable Recommendations
              </CardTitle>
              <CardDescription>
                Prioritized actions based on risk analysis and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Generate additional recommendations based on current data */}
                {(() => {
                  const additionalRecommendations = []
                  
                  // 1. Risk Score Analysis Recommendations
                  if (predictiveData.averageRiskScore > 0.5) {
                    additionalRecommendations.push({
                      priority: 'high',
                      title: 'Critical Risk Alert System',
                      description: `Extremely high average risk score of ${(predictiveData.averageRiskScore * 100).toFixed(1)}%. Immediate systematic intervention required.`,
                      actions: [
                        'Implement emergency response protocols',
                        'Conduct immediate advisor meetings',
                        'Review and overhaul current processes'
                      ]
                    })
                  } else if (predictiveData.averageRiskScore > 0.3) {
                    additionalRecommendations.push({
                      priority: 'high',
                      title: 'Elevated Risk Management',
                      description: `Above-average risk score of ${(predictiveData.averageRiskScore * 100).toFixed(1)}%. Proactive measures needed.`,
                      actions: [
                        'Enhance monitoring protocols',
                        'Increase advisor training frequency',
                        'Deploy preventive intervention strategies'
                      ]
                    })
                  } else if (predictiveData.averageRiskScore > 0.1) {
                    additionalRecommendations.push({
                      priority: 'medium',
                      title: 'Preventive Risk Management',
                      description: `Moderate risk score of ${(predictiveData.averageRiskScore * 100).toFixed(1)}%. Maintain vigilance and improve processes.`,
                      actions: [
                        'Regular performance reviews',
                        'Continuous improvement initiatives',
                        'Best practice sharing sessions'
                      ]
                    })
                  }
                  
                  // 2. High Risk Student Interventions
                  if (predictiveData.highRiskStudents > 5) {
                    additionalRecommendations.push({
                      priority: 'high',
                      title: 'Mass Intervention Strategy',
                      description: `${predictiveData.highRiskStudents} high-risk students detected. Implement systematic intervention approach.`,
                      actions: [
                        'Create dedicated support team',
                        'Develop group intervention programs',
                        'Implement peer mentoring system'
                      ]
                    })
                  } else if (predictiveData.highRiskStudents > 2) {
                    additionalRecommendations.push({
                      priority: 'high',
                      title: 'Targeted Intervention Program',
                      description: `${predictiveData.highRiskStudents} students require immediate attention. Focus resources on individual support.`,
                      actions: [
                        'Assign case managers',
                        'Create individual action plans',
                        'Weekly progress monitoring'
                      ]
                    })
                  } else if (predictiveData.highRiskStudents > 0) {
                    additionalRecommendations.push({
                      priority: 'medium',
                      title: 'Individual Support Enhancement',
                      description: `${predictiveData.highRiskStudents} student(s) need focused support. Personalized intervention approach.`,
                      actions: [
                        'One-on-one mentoring sessions',
                        'Customized learning plans',
                        'Regular check-in meetings'
                      ]
                    })
                  }
                  
                  // 3. Student Population Analysis
                  const lowRiskStudents = Object.values(predictiveData.studentRiskData).filter(data => 
                    data.riskLevel === 'LOW'
                  ).length
                  const mediumRiskStudents = Object.values(predictiveData.studentRiskData).filter(data => 
                    data.riskLevel === 'MEDIUM'
                  ).length
                  
                  if (lowRiskStudents > predictiveData.totalStudents * 0.8) {
                    additionalRecommendations.push({
                      priority: 'low',
                      title: 'Excellence Maintenance Program',
                      description: `${lowRiskStudents} of ${predictiveData.totalStudents} students (${Math.round((lowRiskStudents/predictiveData.totalStudents)*100)}%) are low-risk. Maintain current standards.`,
                      actions: [
                        'Document best practices',
                        'Share success strategies',
                        'Create mentorship opportunities'
                      ]
                    })
                  }
                  
                  if (mediumRiskStudents > predictiveData.totalStudents * 0.3) {
                    additionalRecommendations.push({
                      priority: 'medium',
                      title: 'Medium Risk Prevention',
                      description: `${mediumRiskStudents} students are at medium risk. Prevent escalation to high risk.`,
                      actions: [
                        'Early intervention programs',
                        'Enhanced monitoring protocols',
                        'Proactive support measures'
                      ]
                    })
                  }
                  
                  // 4. Data Quality and Volume Analysis
                  if (predictiveData.totalStudents > 50) {
                    additionalRecommendations.push({
                      priority: 'medium',
                      title: 'Large Scale Data Management',
                      description: `Managing ${predictiveData.totalStudents} students requires robust data management systems.`,
                      actions: [
                        'Implement automated reporting',
                        'Create data visualization dashboards',
                        'Establish data governance protocols'
                      ]
                    })
                  } else if (predictiveData.totalStudents > 20) {
                    additionalRecommendations.push({
                      priority: 'medium',
                      title: 'Scalable System Enhancement',
                      description: `${predictiveData.totalStudents} students under observation. Optimize for efficient management.`,
                      actions: [
                        'Streamline data collection processes',
                        'Implement batch processing workflows',
                        'Create standardized reporting templates'
                      ]
                    })
                  } else if (predictiveData.totalStudents > 5) {
                    additionalRecommendations.push({
                      priority: 'medium',
                      title: 'Data Quality Optimization',
                      description: `Monitoring ${predictiveData.totalStudents} students. Focus on data consistency and quality.`,
                      actions: [
                        'Regular data validation checks',
                        'Advisor training on data entry',
                        'Quality assurance protocols'
                      ]
                    })
                  } else {
                    additionalRecommendations.push({
                      priority: 'low',
                      title: 'Data Collection Expansion',
                      description: `Only ${predictiveData.totalStudents} students currently monitored. Consider expanding coverage.`,
                      actions: [
                        'Identify additional students for monitoring',
                        'Develop recruitment strategies',
                        'Create awareness programs'
                      ]
                    })
                  }
                  
                  // 5. Performance Distribution Analysis
                  const totalStudents = predictiveData.totalStudents
                  const riskDistribution = {
                    low: lowRiskStudents / totalStudents,
                    medium: mediumRiskStudents / totalStudents,
                    high: predictiveData.highRiskStudents / totalStudents
                  }
                  
                  if (riskDistribution.high > 0.3) {
                    additionalRecommendations.push({
                      priority: 'high',
                      title: 'Performance Crisis Management',
                      description: `${Math.round(riskDistribution.high * 100)}% of students are high-risk. Systematic overhaul needed.`,
                      actions: [
                        'Emergency task force formation',
                        'Root cause analysis',
                        'Comprehensive process redesign'
                      ]
                    })
                  } else if (riskDistribution.medium > 0.5) {
                    additionalRecommendations.push({
                      priority: 'medium',
                      title: 'Performance Improvement Initiative',
                      description: `${Math.round(riskDistribution.medium * 100)}% of students are medium-risk. Focus on prevention.`,
                      actions: [
                        'Enhanced support programs',
                        'Skill development workshops',
                        'Peer collaboration initiatives'
                      ]
                    })
                  }
                  
                  // 6. Activity Pattern Analysis
                  const sessionsThisMonth = sessions.filter(session => {
                    const sessionDate = new Date(session.createdAt)
                    const now = new Date()
                    return sessionDate.getMonth() === now.getMonth() && sessionDate.getFullYear() === now.getFullYear()
                  }).length
                  
                  if (sessionsThisMonth > totalStudents * 2) {
                    additionalRecommendations.push({
                      priority: 'medium',
                      title: 'High Activity Period Management',
                      description: `${sessionsThisMonth} sessions this month indicates high activity. Optimize resource allocation.`,
                      actions: [
                        'Increase advisor capacity',
                        'Implement efficient scheduling',
                        'Create quick-turnaround protocols'
                      ]
                    })
                  } else if (sessionsThisMonth < totalStudents * 0.5) {
                    additionalRecommendations.push({
                      priority: 'medium',
                      title: 'Engagement Enhancement',
                      description: `Only ${sessionsThisMonth} sessions this month. Increase student engagement.`,
                      actions: [
                        'Proactive outreach campaigns',
                        'Flexible scheduling options',
                        'Engagement incentive programs'
                      ]
                    })
                  }
                  
                  // 7. Completion Rate Analysis
                  const completedSessions = sessions.filter(s => s.status === 'completed').length
                  const completionRate = sessions.length > 0 ? (completedSessions / sessions.length) * 100 : 0
                  
                  if (completionRate > 90) {
                    additionalRecommendations.push({
                      priority: 'low',
                      title: 'Excellence Documentation',
                      description: `Outstanding ${completionRate.toFixed(1)}% completion rate. Document and share best practices.`,
                      actions: [
                        'Create success case studies',
                        'Develop training materials',
                        'Share with other institutions'
                      ]
                    })
                  } else if (completionRate < 60) {
                    additionalRecommendations.push({
                      priority: 'high',
                      title: 'Completion Rate Improvement',
                      description: `Low completion rate of ${completionRate.toFixed(1)}%. Urgent improvement needed.`,
                      actions: [
                        'Identify completion barriers',
                        'Implement completion incentives',
                        'Provide additional training'
                      ]
                    })
                  } else if (completionRate < 80) {
                    additionalRecommendations.push({
                      priority: 'medium',
                      title: 'Completion Rate Enhancement',
                      description: `Moderate completion rate of ${completionRate.toFixed(1)}%. Room for improvement.`,
                      actions: [
                        'Streamline completion processes',
                        'Provide completion support tools',
                        'Regular completion rate monitoring'
                      ]
                    })
                  }
                  
                  return additionalRecommendations
                })().map((rec, index) => (
                  <div key={`additional-${index}`} className="p-4 border-2 border-blue-200 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-5 h-5 text-blue-500" />
                      <span className="font-medium text-blue-800 dark:text-blue-200">
                        {rec.title}
                      </span>
                      <Badge variant="outline" className="ml-auto border-blue-300 text-blue-700">
                        {rec.priority === 'high' ? 'High Priority' : 'Medium Priority'}
                      </Badge>
                    </div>
                    <p className="text-blue-700 dark:text-blue-300 mb-3">
                      {rec.description}
                    </p>
                    <div>
                      <span className="font-medium text-blue-800 dark:text-blue-200">Actions:</span>
                      <ul className="mt-2 space-y-1">
                        {rec.actions.map((action, actionIndex) => (
                          <li key={actionIndex} className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}

                {/* High Priority Recommendations */}
                {(predictiveData.longitudinalData?.recommendations || [])
                  .filter(rec => rec.priority === 'high')
                  .map((rec, index) => (
                    <div key={index} className="p-4 border-2 border-red-200 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <span className="font-medium text-red-800 dark:text-red-200">
                          {rec.title}
                        </span>
                        <Badge variant="outline" className="ml-auto border-red-300 text-red-700">
                          High Priority
                        </Badge>
                      </div>
                      <p className="text-red-700 dark:text-red-300 mb-3">
                        {rec.description}
                      </p>
                      <div>
                        <span className="font-medium text-red-800 dark:text-red-200">Actions:</span>
                        <ul className="mt-2 space-y-1">
                          {rec.actions.map((action, actionIndex) => (
                            <li key={actionIndex} className="text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}

                {/* Medium Priority Recommendations */}
                {(predictiveData.longitudinalData?.recommendations || [])
                  .filter(rec => rec.priority === 'medium')
                  .map((rec, index) => (
                    <div key={index} className="p-4 border border-orange-200 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-orange-500" />
                        <span className="font-medium text-orange-800 dark:text-orange-200">
                          {rec.title}
                        </span>
                        <Badge variant="outline" className="ml-auto border-orange-300 text-orange-700">
                          Medium Priority
                        </Badge>
                      </div>
                      <p className="text-orange-700 dark:text-orange-300 mb-3">
                        {rec.description}
                      </p>
                      <div>
                        <span className="font-medium text-orange-800 dark:text-orange-200">Actions:</span>
                        <ul className="mt-2 space-y-1">
                          {rec.actions.map((action, actionIndex) => (
                            <li key={actionIndex} className="text-sm text-orange-700 dark:text-orange-300 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}

                {/* Show empty state only if no recommendations at all */}
                {(() => {
                  const longitudinalRecs = predictiveData.longitudinalData?.recommendations || []
                  const additionalRecs = []
                  
                  // Count additional recommendations that would be generated
                  if (predictiveData.averageRiskScore > 0.3) additionalRecs.push('overall-risk')
                  if (predictiveData.highRiskStudents > 0) additionalRecs.push('high-risk')
                  if (predictiveData.totalStudents > 0) additionalRecs.push('data-quality')
                  
                  const totalRecs = longitudinalRecs.length + additionalRecs.length
                  
                  return totalRecs === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No specific recommendations at this time</p>
                      <p className="text-sm">Continue monitoring for trends and patterns</p>
                    </div>
                  ) : null
                })()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  )
})

export default PredictiveAnalyticsDashboard
