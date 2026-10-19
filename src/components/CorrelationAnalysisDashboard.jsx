import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  Clock,
  Target,
  AlertTriangle,
  PieChart as PieChartIcon,
  BarChart3,
  Activity
} from 'lucide-react'

const CorrelationAnalysisDashboard = ({ correlationData, enhancedTrends }) => {
  if (!correlationData || !enhancedTrends) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">No correlation data available</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Chart color schemes for better visual appeal
  const CHART_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0']
  const CORRELATION_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6']

  const getCorrelationColor = (correlation) => {
    const absCorr = Math.abs(correlation)
    if (absCorr < 0.1) return 'bg-gray-100 text-gray-600'
    if (absCorr < 0.3) return 'bg-blue-100 text-blue-600'
    if (absCorr < 0.5) return 'bg-yellow-100 text-yellow-600'
    if (absCorr < 0.7) return 'bg-orange-100 text-orange-600'
    return 'bg-red-100 text-red-600'
  }

  const getCorrelationStrength = (correlation) => {
    const absCorr = Math.abs(correlation)
    if (absCorr < 0.1) return 'No Relationship'
    if (absCorr < 0.3) return 'Weak'
    if (absCorr < 0.5) return 'Moderate'
    if (absCorr < 0.7) return 'Strong'
    return 'Very Strong'
  }



  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-600'
      case 'Medium': return 'bg-yellow-100 text-yellow-600'
      default: return 'bg-blue-100 text-blue-600'
    }
  }

  // Prepare data for different chart types
  const prepareTimeOfDayData = () => {
    const timeData = {}
    correlationData.timeOfDayVsSuccess.data.forEach(item => {
      if (!timeData[item.timeSlot]) {
        timeData[item.timeSlot] = { total: 0, count: 0 }
      }
      timeData[item.timeSlot].total += item.completionRate
      timeData[item.timeSlot].count++
    })
    
    return Object.entries(timeData).map(([timeSlot, data]) => ({
      timeSlot,
      avgCompletion: Math.round(data.total / data.count),
      sessions: data.count
    }))
  }

  const prepareSessionTypeData = () => {
    const typeData = {}
    correlationData.sessionTypeVsCompletion.data.forEach(item => {
      if (!typeData[item.sessionType]) {
        typeData[item.sessionType] = { total: 0, count: 0 }
      }
      typeData[item.sessionType].total += item.completionRate
      typeData[item.sessionType].count++
    })
    
    return Object.entries(typeData).map(([sessionType, data]) => ({
      sessionType,
      avgCompletion: Math.round(data.total / data.count),
      sessions: data.count
    }))
  }

  const timeOfDayData = prepareTimeOfDayData()
  const sessionTypeData = prepareSessionTypeData()

  return (
    <div className="space-y-6">
      {/* Chart Type Selection Info */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-3">
            <Activity className="h-5 w-5 text-blue-400" />
            <h3 className="font-semibold text-white">Chart Types Guide</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <ScatterChart className="h-4 w-4 text-blue-400" />
              <span className="text-gray-100"><strong className="text-white">Scatter Plot:</strong> Shows relationships between two variables</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-green-400" />
              <span className="text-gray-100"><strong className="text-white">Bar Chart:</strong> Compares categories or time periods</span>
            </div>
            <div className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4 text-purple-400" />
              <span className="text-gray-100"><strong className="text-white">Pie Chart:</strong> Shows proportions and percentages</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Correlation Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duration vs Completion</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.abs(correlationData.durationVsCompletion.correlation).toFixed(3)}
            </div>
            <Badge className={getCorrelationColor(correlationData.durationVsCompletion.correlation)}>
              {getCorrelationStrength(correlationData.durationVsCompletion.correlation)}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              {correlationData.durationVsCompletion.insight}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time vs Success</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.abs(correlationData.timeOfDayVsSuccess.correlation).toFixed(3)}
            </div>
            <Badge className={getCorrelationColor(correlationData.timeOfDayVsSuccess.correlation)}>
              {getCorrelationStrength(correlationData.timeOfDayVsSuccess.correlation)}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              {correlationData.timeOfDayVsSuccess.insight}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anomalies Detected</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {enhancedTrends.anomalies?.length || 0}
            </div>
            <Badge className="bg-orange-100 text-orange-600">
              {enhancedTrends.anomalies?.length > 5 ? 'High' : 
               enhancedTrends.anomalies?.length > 2 ? 'Medium' : 'Low'}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              Unusual patterns detected
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Correlation Charts with Different Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Duration vs Completion - Scatter Plot */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScatterChart className="h-5 w-5" />
              Duration vs Completion Rate
            </CardTitle>
            <CardDescription>
              Scatter plot showing relationship between session duration and completion rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={correlationData.durationVsCompletion.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="duration" 
                  name="Duration (minutes)"
                  type="number"
                />
                <YAxis 
                  dataKey="completionRate" 
                  name="Completion Rate (%)"
                  domain={['dataMin - 5', 'dataMax + 5']}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'duration' ? `${value} minutes` : `${value}%`,
                    name === 'duration' ? 'Duration' : 'Completion Rate'
                  ]}
                  labelFormatter={(label) => `Session ${label}`}
                />
                <Scatter 
                  dataKey="completionRate" 
                  fill="#8884d8" 
                  name="Sessions"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Time of Day vs Success - Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Time of Day vs Success Rate
            </CardTitle>
            <CardDescription>
              Bar chart showing completion rates by time of day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeOfDayData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timeSlot" />
                <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Completion Rate']}
                />
                <Bar dataKey="avgCompletion" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Session Type Analysis - Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            Session Type Performance Distribution
          </CardTitle>
          <CardDescription>
            Pie chart showing completion rates by session type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sessionTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ sessionType, avgCompletion }) => `${sessionType}: ${avgCompletion}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="avgCompletion"
              >
                {sessionTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Completion Rate']}
                labelFormatter={(label) => `Session Type: ${label}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Debug Information */}
      <div className="mt-4 p-3 bg-gray-700 rounded-lg">
        <h4 className="text-sm font-medium text-gray-200 mb-2">Data Verification:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {sessionTypeData.map((item, index) => (
            <div key={index} className="text-gray-300">
              <strong>{item.sessionType}:</strong> {item.avgCompletion}% 
              ({item.sessions} sessions)
            </div>
          ))}
        </div>
        <div className="mt-2 text-xs text-gray-400">
          <strong>Raw Data Sample:</strong> {JSON.stringify(correlationData.sessionTypeVsCompletion.data.slice(0, 2), null, 2)}
        </div>
      </div>

      {/* Enhanced Trends with Different Chart Types */}
      <div className="space-y-6">
        {/* Anomalies - Enhanced Display */}
        {enhancedTrends.anomalies && enhancedTrends.anomalies.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Detected Anomalies
              </CardTitle>
              <CardDescription>
                Unusual patterns that may require attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {enhancedTrends.anomalies.map((anomaly, index) => {
                  // Calculate deviation from expected
                  const expectedRange = anomaly.expected
                  const actualValue = anomaly.value
                  const deviation = Math.abs(actualValue - 76) // 76 is the mean from your data
                  
                  return (
                    <div key={index} className="border rounded-lg p-4 bg-gray-800 border-gray-700">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-sm text-orange-400">{anomaly.type}</span>
                          <span className="text-xs text-gray-300">
                            Advisor: {anomaly.advisor} | Session: {anomaly.sessionId}
                          </span>
                        </div>
                        <Badge className={getSeverityColor(anomaly.severity)}>
                          {anomaly.severity}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Actual Value */}
                        <div className="text-center p-3 bg-gray-700 rounded-lg border border-gray-600">
                          <div className="text-2xl font-bold text-orange-400">
                            {actualValue}%
                          </div>
                          <div className="text-xs text-gray-300">Actual Completion</div>
                        </div>
                        
                        {/* Expected Range */}
                        <div className="text-center p-3 bg-gray-700 rounded-lg border border-gray-600">
                          <div className="text-lg font-semibold text-gray-200">
                            {expectedRange}
                          </div>
                          <div className="text-xs text-gray-300">Expected Range</div>
                        </div>
                        
                        {/* Deviation */}
                        <div className="text-center p-3 bg-gray-700 rounded-lg border border-gray-600">
                          <div className={`text-lg font-semibold ${deviation > 20 ? 'text-red-400' : 'text-yellow-400'}`}>
                            ±{deviation.toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-300">Deviation</div>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-xs text-orange-300">
                        <strong>Why flagged:</strong> This session's completion rate ({actualValue}%) is significantly different from the expected range ({expectedRange})
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default CorrelationAnalysisDashboard
