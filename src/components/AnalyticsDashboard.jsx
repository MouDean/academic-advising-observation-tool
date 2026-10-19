import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts'
import { 
  TrendingUp, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Calendar,
  Download,
  Filter,
  FileText,
  FileSpreadsheet,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon
} from 'lucide-react'
import { exportAnalyticsToExcel, exportAnalyticsToJSON, calculateAnalyticsData, calculateCorrelationAnalysis, calculateEnhancedTrends } from '@/utils/analyticsUtils.js'
import { exportAnalyticsToPDF, exportComprehensiveReport } from '@/utils/pdfExport.js'
import { showNotification } from '@/components/Notification.jsx'
import AIInsights from './AIInsights.jsx'
import StorageManager from './StorageManager.jsx'
import CorrelationAnalysisDashboard from './CorrelationAnalysisDashboard.jsx'
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor.js'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

const AnalyticsDashboard = React.memo(({ sessions }) => {
  // Performance monitoring
  usePerformanceMonitor('AnalyticsDashboard')
  
  const [timeFilter, setTimeFilter] = useState('all')
  const [advisorFilter, setAdvisorFilter] = useState('all')
  const [aiInsights, setAiInsights] = useState([])
  
  // Calculate enhanced analytics data
  const enhancedAnalyticsData = useMemo(() => {
    if (!sessions || sessions.length === 0) return null
    return calculateEnhancedTrends(sessions)
  }, [sessions])
  
  // Calculate correlation analysis data
  const correlationData = useMemo(() => {
    if (!sessions || sessions.length === 0) return null
    return calculateCorrelationAnalysis(sessions)
  }, [sessions])

  // Calculate analytics data
  const analyticsData = useMemo(() => {
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

    const filteredSessions = sessions.filter(session => {
      const sessionDate = new Date(session.createdAt)
      const now = new Date()
      
      // Apply time filter
      if (timeFilter === 'hour') {
        const hourAgo = new Date(now.getTime() - 60 * 60 * 1000)
        if (sessionDate < hourAgo) return false
      } else if (timeFilter === 'day') {
        const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        if (sessionDate < dayAgo) return false
      } else if (timeFilter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        if (sessionDate < weekAgo) return false
      } else if (timeFilter === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        if (sessionDate < monthAgo) return false
      } else if (timeFilter === 'quarter') {
        const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        if (sessionDate < quarterAgo) return false
      }

      // Apply advisor filter
      if (advisorFilter !== 'all' && session.sessionInfo?.advisor !== advisorFilter) {
        return false
      }

      return true
    })

    // Calculate completion rates - use stored completionRate if available, otherwise calculate
    const completionRates = filteredSessions.map(session => {
      // Use stored completion rate if available
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
    })

    const averageCompletionRate = completionRates.length > 0 
      ? completionRates.reduce((sum, rate) => sum + rate, 0) / completionRates.length 
      : 0

    // Calculate session durations
    const durations = filteredSessions
      .map(session => session.sessionInfo?.duration || 0)
      .filter(duration => duration > 0)
    
    const averageSessionDuration = durations.length > 0 
      ? durations.reduce((sum, duration) => sum + duration, 0) / durations.length 
      : 0

    // Count low completion sessions
    const lowCompletionSessions = completionRates.filter(rate => rate < 50).length

    // Calculate category performance
    const categoryPerformance = calculateCategoryPerformance(filteredSessions)

    // Calculate advisor performance
    const advisorPerformance = calculateAdvisorPerformance(filteredSessions)

    // Calculate monthly trends
    const monthlyTrends = calculateMonthlyTrends(filteredSessions)

    // Calculate rating distribution
    const ratingDistribution = calculateRatingDistribution(filteredSessions)

    return {
      totalSessions: filteredSessions.length,
      averageCompletionRate: Math.round(averageCompletionRate * 10) / 10,
      averageSessionDuration: Math.round(averageSessionDuration),
      lowCompletionSessions,
      totalObservations: filteredSessions.length * 13,
      completionTrends: completionRates,
      categoryPerformance,
      advisorPerformance,
      monthlyTrends,
      ratingDistribution
    }
  }, [sessions, timeFilter, advisorFilter])

  // Get unique advisors for filter
  const uniqueAdvisors = useMemo(() => {
    const advisors = sessions
      .map(session => session.sessionInfo?.advisor)
      .filter(advisor => advisor && advisor.trim() !== '')
    return [...new Set(advisors)]
  }, [sessions])

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleExportExcel = () => {
    try {
      exportAnalyticsToExcel(sessions, analyticsData)
      showNotification.success('Analytics exported to Excel with charts successfully!')
    } catch (error) {
      console.error('Export error:', error)
      showNotification.error('Error occurred during export')
    }
  }

  const handleExportJSON = () => {
    try {
      exportAnalyticsToJSON(sessions, analyticsData)
      showNotification.success('Analytics exported to JSON successfully!')
    } catch (error) {
      showNotification.error('Error occurred during export')
    }
  }

  const handleExportPDF = async () => {
    try {
      showNotification.info('Generating PDF... This may take a moment.')
      await exportAnalyticsToPDF(sessions, analyticsData, aiInsights)
      showNotification.success('Analytics exported to PDF successfully!')
    } catch (error) {
      console.error('PDF export error:', error)
      showNotification.error('Error occurred during PDF export')
    }
  }

  const handleExportComprehensive = async () => {
    try {
      showNotification.info('Generating comprehensive PDF... This may take a moment.')
      await exportComprehensiveReport(sessions, analyticsData, aiInsights)
      showNotification.success('Comprehensive report exported to PDF successfully!')
    } catch (error) {
      console.error('Comprehensive PDF export error:', error)
      showNotification.error('Error occurred during comprehensive PDF export')
    }
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Comprehensive insights into observation sessions and performance metrics
            </p>
          </div>
          
          {/* Filters and Export */}
          <div className="flex gap-2">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="hour">Last Hour</SelectItem>
                <SelectItem value="day">Last Day</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={advisorFilter} onValueChange={setAdvisorFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Advisors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Advisors</SelectItem>
                {uniqueAdvisors.map(advisor => (
                  <SelectItem key={advisor} value={advisor}>{advisor}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={handleExportExcel} variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export Excel
            </Button>
            
            <Button onClick={handleExportJSON} variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export JSON
            </Button>
            
            <Button onClick={handleExportPDF} variant="outline" size="sm" className="gap-2">
              <FileText className="w-4 h-4" />
              Export PDF
            </Button>
            
            <Button onClick={handleExportComprehensive} variant="outline" size="sm" className="gap-2">
              <FileText className="w-4 h-4" />
              Comprehensive PDF
            </Button>
          </div>
        </div>

        {/* Empty State */}
        {analyticsData.totalSessions === 0 && (
          <Card className="p-8 text-center">
            <div className="space-y-4">
              <div className="text-6xl">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                No Data Available
              </h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                There are no completed observation sessions to analyze. 
                Complete some observation sessions or generate sample data to see analytics.
              </p>
              <div className="flex justify-center gap-4">
                <Button onClick={() => window.location.reload()} variant="outline">
                  Refresh Page
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Key Metrics */}
        {analyticsData.totalSessions > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.totalSessions}</div>
              <p className="text-xs text-muted-foreground">
                Observation sessions conducted
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.averageCompletionRate}%</div>
              <p className="text-xs text-muted-foreground">
                Average observation completion
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Session Duration</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDuration(analyticsData.averageSessionDuration)}</div>
              <p className="text-xs text-muted-foreground">
                Average session length
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Completion</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.lowCompletionSessions}</div>
              <p className="text-xs text-muted-foreground">
                Sessions below 50% completion
              </p>
            </CardContent>
          </Card>
        </div>
        )}

        {/* Charts */}
        {analyticsData.totalSessions > 0 && (
          <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="correlations">Correlations</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Completion Rate Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Completion Rate Distribution</CardTitle>
                  <CardDescription>
                    Distribution of session completion rates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getCompletionRateDistribution(analyticsData.completionTrends)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="range" 
                        fontSize={10}
                        interval={0}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

                             {/* Rating Distribution */}
               <Card>
                 <CardHeader>
                   <CardTitle>Rating Distribution</CardTitle>
                   <CardDescription>
                     Distribution of ratings across all observations
                   </CardDescription>
                 </CardHeader>
                 <CardContent data-chart="rating-distribution">
                   <ResponsiveContainer width="100%" height={300}>
                                          <PieChart>
                       <Pie
                         data={analyticsData.ratingDistribution}
                         cx="50%"
                         cy="50%"
                         labelLine={true}
                         label={({ name, percent, cx, cy, midAngle, innerRadius, outerRadius }) => {
                           const RADIAN = Math.PI / 180
                           const radius = outerRadius + 20 // Position labels outside the pie
                           const x = cx + radius * Math.cos(-midAngle * RADIAN)
                           const y = cy + radius * Math.sin(-midAngle * RADIAN)
                           
                           // Only show labels for segments with more than 2%
                           if (percent > 0.02) {
                             return (
                               <text 
                                 x={x} 
                                 y={y} 
                                 fill="#374151" 
                                 textAnchor={x > cx ? 'start' : 'end'} 
                                 dominantBaseline="central"
                                 fontSize="10"
                                 fontWeight="medium"
                               >
                                 {`${name} ${(percent * 100).toFixed(0)}%`}
                               </text>
                             )
                           }
                           return null
                         }}
                         outerRadius={80}
                         fill="#8884d8"
                         dataKey="value"
                       >
                         {analyticsData.ratingDistribution.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                         ))}
                       </Pie>
                       <Tooltip 
                         formatter={(value, name) => [`${value} observations (${((value / analyticsData.ratingDistribution.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%)`, name]}
                         labelFormatter={(label) => `${label}`}
                       />
                     </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                             {/* Advisor Performance */}
               <Card>
                 <CardHeader>
                   <CardTitle>Advisor Performance</CardTitle>
                   <CardDescription>
                     Average completion rates by advisor
                   </CardDescription>
                 </CardHeader>
                 <CardContent data-chart="advisor-performance">
                   <ResponsiveContainer width="100%" height={300}>
                     <BarChart data={analyticsData.advisorPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="advisor" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        fontSize={10}
                        interval={0}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="completionRate" fill="#00C49F" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

                             {/* Category Performance */}
               <Card>
                 <CardHeader>
                   <CardTitle>Category Performance</CardTitle>
                   <CardDescription>
                     Completion rates by observation category
                   </CardDescription>
                 </CardHeader>
                 <CardContent data-chart="category-performance">
                   <ResponsiveContainer width="100%" height={300}>
                     <BarChart data={analyticsData.categoryPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="category" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        fontSize={10}
                        interval={0}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="completionRate" fill="#FFBB28" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

                     <TabsContent value="trends" className="space-y-4">
             <Card>
               <CardHeader>
                 <CardTitle>Daily Trends</CardTitle>
                 <CardDescription>
                   Session volume and completion rates by day
                 </CardDescription>
               </CardHeader>
               <CardContent data-chart="monthly-trends">
                                   <ResponsiveContainer width="100%" height={400}>
                     <AreaChart data={analyticsData.monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="month" 
                        fontSize={10}
                        interval={0}
                      />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Area 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="sessions" 
                        stackId="1" 
                        stroke="#8884d8" 
                        fill="#8884d8" 
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="completionRate" 
                        stroke="#ff7300" 
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="correlations" className="space-y-4">
            <CorrelationAnalysisDashboard 
              correlationData={correlationData}
              enhancedTrends={enhancedAnalyticsData}
            />
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {/* Detailed Category Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Category Analysis</CardTitle>
                  <CardDescription>
                    Performance breakdown by observation category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.categoryPerformance.map((category, index) => (
                      <div key={category.category} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                          <div>
                            <h4 className="font-medium">{category.category}</h4>
                            <p className="text-sm text-muted-foreground">
                              {category.completedObservations} of {category.totalObservations} observations completed
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{category.completionRate}%</div>
                          <div className="text-sm text-muted-foreground">Completion Rate</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai-insights" className="space-y-4">
            <AIInsights 
              sessionsData={sessions} 
              onInsightsGenerated={setAiInsights}
              initialInsights={aiInsights}
            />
          </TabsContent>

          <TabsContent value="storage" className="space-y-4">
            <StorageManager 
              onStorageChange={() => {
                // Trigger a re-render when storage changes
                window.location.reload()
              }}
            />
          </TabsContent>
        </Tabs>
        )}
      </div>
    </div>
  )
})

// Helper functions
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
      advisorData[advisor] = { sessions: 0, totalCompletionRate: 0 }
    }

    advisorData[advisor].sessions++
    
    // Use stored completion rate if available, otherwise calculate
    let completionRate = session.completionRate
    if (completionRate === undefined) {
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
      completionRate = (completedFields / totalFields) * 100
    }

    advisorData[advisor].totalCompletionRate += completionRate
  })

  return Object.entries(advisorData).map(([advisor, data]) => ({
    advisor,
    sessions: data.sessions,
    completionRate: Math.round(data.totalCompletionRate / data.sessions)
  })).sort((a, b) => b.completionRate - a.completionRate)
}

const calculateMonthlyTrends = (sessions) => {
  const dailyData = {}

  sessions.forEach(session => {
    const date = new Date(session.createdAt)
    const dayKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    
    if (!dailyData[dayKey]) {
      dailyData[dayKey] = { sessions: 0, totalCompletionRate: 0 }
    }

    dailyData[dayKey].sessions++
    
    // Use stored completion rate if available, otherwise calculate
    let completionRate = session.completionRate
    if (completionRate === undefined) {
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
      completionRate = (completedFields / totalFields) * 100
    }

    dailyData[dayKey].totalCompletionRate += completionRate
  })

  return Object.entries(dailyData)
    .map(([day, data]) => ({
      month: day, // Keep 'month' key for compatibility with existing chart
      sessions: data.sessions,
      completionRate: Math.round(data.totalCompletionRate / data.sessions)
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

const getCompletionRateDistribution = (completionRates) => {
  const ranges = [
    { range: '0-25%', min: 0, max: 25, count: 0 },
    { range: '26-50%', min: 26, max: 50, count: 0 },
    { range: '51-75%', min: 51, max: 75, count: 0 },
    { range: '76-100%', min: 76, max: 100, count: 0 }
  ]

  completionRates.forEach(rate => {
    const range = ranges.find(r => rate >= r.min && rate <= r.max)
    if (range) {
      range.count++
    }
  })

  return ranges
}

export default AnalyticsDashboard
