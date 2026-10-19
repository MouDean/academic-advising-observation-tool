import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const PerformanceMetricsChart = ({ studentRiskData }) => {
  // Calculate average metrics across all students
  const totalStudents = Object.keys(studentRiskData).length
  if (totalStudents === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No student data available</p>
      </div>
    )
  }

  const avgMetrics = {
    completion: 0,
    engagement: 0,
    aiScore: 0,
    technicalIssues: 0
  }

  // Debug: Log the metrics data
  console.log('🔍 PerformanceMetricsChart Debug:', {
    totalStudents,
    sampleStudent: Object.values(studentRiskData)[0],
    sampleMetrics: Object.values(studentRiskData)[0]?.metrics
  })
  
  Object.values(studentRiskData).forEach((student, index) => {
    if (student.metrics) {
      avgMetrics.completion += student.metrics.avgCompletionRate || 0
      avgMetrics.engagement += student.metrics.avgEngagement || 0
      avgMetrics.aiScore += student.metrics.avgAIScore || 0
      avgMetrics.technicalIssues += student.metrics.technicalIssuesRate || 0
    } else {
      console.log(`🔍 Student ${index + 1} has no metrics:`, student)
    }
  })

  // Convert to percentages and prepare chart data for doughnut chart
  const chartData = [
    {
      name: 'Completion Rate',
      value: Math.round((avgMetrics.completion / totalStudents) * 10) / 10,
      color: '#10B981'
    },
    {
      name: 'Engagement',
      value: Math.round((avgMetrics.engagement / totalStudents) * 10) / 10,
      color: '#3B82F6'
    },
    {
      name: 'AI Tool Usage',
      value: Math.round((avgMetrics.aiScore / totalStudents) * 10) / 10,
      color: '#F59E0B'
    },
    {
      name: 'Technical Issues',
      value: Math.round((100 - (avgMetrics.technicalIssues / totalStudents) * 100) * 10) / 10,
      color: '#EF4444'
    }
  ]

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444']

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white mb-2">
            {data.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Score: {data.value}%
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Max: 100%
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            labelLine={false}
            label={({ name, percent, cx, cy, midAngle, innerRadius, outerRadius }) => {
              const RADIAN = Math.PI / 180
              const radius = outerRadius + 20
              const x = cx + radius * Math.cos(-midAngle * RADIAN)
              const y = cy + radius * Math.sin(-midAngle * RADIAN)
              
              // Only show label if percentage is significant enough
              if (percent < 0.1) return null
              
              return (
                <text 
                  x={x} 
                  y={y} 
                  fill="#9CA3AF" 
                  textAnchor={x > cx ? 'start' : 'end'} 
                  dominantBaseline="central"
                  fontSize="10"
                  fontWeight="medium"
                >
                  {`${name} (${(percent * 100).toFixed(0)}%)`}
                </text>
              )
            }}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
            iconSize={10}
          />
        </PieChart>
      </ResponsiveContainer>
  )
}

export default PerformanceMetricsChart
