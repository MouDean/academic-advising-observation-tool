import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts'

const TrendAnalysisChart = ({ trends, timeUnit }) => {
  const formatPeriod = (period, timeUnit) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    switch (timeUnit) {
      case 'hour': {
        const [year, month, day, hour] = period.split('-')
        return `${monthNames[parseInt(month) - 1]} ${day} ${hour}:00`
      }
      case 'day': {
        const [year, month, day] = period.split('-')
        return `${monthNames[parseInt(month) - 1]} ${day}`
      }
      case 'week':
        return `Week ${period.split('-')[2]}`
      case 'month': {
        const [year, month] = period.split('-')
        return `${monthNames[parseInt(month) - 1]} ${year}`
      }
      case 'quarter':
        return period
      case 'semester':
        return period
      default:
        return period
    }
  }

  // Prepare data for the chart
  const chartData = trends.map(trend => ({
    period: formatPeriod(trend.period, timeUnit),
    completion: trend.avgCompletionRate,
    engagement: trend.avgEngagement,
    sessions: trend.sessionCount
  }))

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white mb-2">
            {label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (chartData.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No trend data available</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="period" 
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={12}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {/* Completion Rate Area */}
          <Area
            type="monotone"
            dataKey="completion"
            name="Completion Rate"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.3}
            strokeWidth={3}
          />
          
          {/* Engagement Rate Area */}
          <Area
            type="monotone"
            dataKey="engagement"
            name="Engagement Rate"
            stroke="#10B981"
            fill="#10B981"
            fillOpacity={0.3}
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
  )
}

export default TrendAnalysisChart
