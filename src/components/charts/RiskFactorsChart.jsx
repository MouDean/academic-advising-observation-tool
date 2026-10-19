import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const RiskFactorsChart = ({ studentRiskData }) => {
  const getImpactScore = (impact) => {
    switch (impact) {
      case 'high': return 3
      case 'medium': return 2
      case 'low': return 1
      default: return 1
    }
  }

  // Aggregate risk factors across all students
  const riskFactorStats = {}
  
  // Debug: Log the student data structure
  console.log('🔍 RiskFactorsChart Debug:', {
    totalStudents: Object.keys(studentRiskData).length,
    studentDataKeys: Object.keys(studentRiskData),
    sampleStudent: Object.values(studentRiskData)[0]
  })
  
  Object.values(studentRiskData).forEach((student, index) => {
    if (student.riskFactors && Array.isArray(student.riskFactors)) {
      console.log(`🔍 Student ${index + 1} risk factors:`, student.riskFactors)
      student.riskFactors.forEach(factor => {
        if (factor && factor.factor) {
          if (!riskFactorStats[factor.factor]) {
            riskFactorStats[factor.factor] = {
              count: 0,
              totalImpact: 0,
              impact: factor.impact
            }
          }
          riskFactorStats[factor.factor].count++
          riskFactorStats[factor.factor].totalImpact += getImpactScore(factor.impact)
        }
      })
    } else {
      console.log(`🔍 Student ${index + 1} has no risk factors:`, student.riskFactors)
    }
  })
  
  console.log('🔍 Final risk factor stats:', riskFactorStats)

  // Convert to chart data for pie chart
  const chartData = Object.entries(riskFactorStats).map(([factor, stats]) => ({
    name: factor.length > 20 ? factor.substring(0, 20) + '...' : factor,
    value: stats.count,
    factor: factor,
    avgImpact: (stats.totalImpact / stats.count).toFixed(1),
    impact: stats.impact
  })).sort((a, b) => b.value - a.value)

  // If we have real data, use it; otherwise show sample data for demonstration
  const displayData = chartData.length > 0 ? chartData : [
    { name: 'Low Completion Rate', value: 45, factor: 'Low Completion Rate', avgImpact: 2.5, impact: 'high' },
    { name: 'Poor Engagement', value: 32, factor: 'Poor Engagement', avgImpact: 2.0, impact: 'medium' },
    { name: 'Technical Issues', value: 28, factor: 'Technical Issues', avgImpact: 1.5, impact: 'low' },
    { name: 'Poor AI Tool Usage', value: 22, factor: 'Poor AI Tool Usage', avgImpact: 1.8, impact: 'medium' }
  ]

  // Color palette for different impact levels
  const COLORS = ['#EF4444', '#F97316', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#06B6D4']

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return '#EF4444' // red-500
      case 'medium': return '#F97316' // orange-500
      case 'low': return '#F59E0B' // yellow-500
      default: return '#6B7280' // gray-500
    }
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white mb-2">
            {data.factor}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Students affected: {data.value}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Average impact: {data.avgImpact}/3
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Impact level: {data.impact}
          </p>
        </div>
      )
    }
    return null
  }

  if (chartData.length === 0) {
    const totalStudents = Object.keys(studentRiskData).length
    const studentsWithRiskFactors = Object.values(studentRiskData).filter(student => 
      student.riskFactors && Array.isArray(student.riskFactors) && student.riskFactors.length > 0
    ).length
    
    // For debugging - let's show some sample data if no real data exists
    if (totalStudents === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <p>No student data available</p>
          <p className="text-xs mt-2">Please add some sessions to see risk analysis</p>
        </div>
      )
    }
    
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No risk factors identified</p>
        <p className="text-xs mt-2">This may indicate all students are performing well</p>
        <p className="text-xs">Total students analyzed: {totalStudents}</p>
        <p className="text-xs">Students with risk factors: {studentsWithRiskFactors}</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={displayData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent, cx, cy, midAngle, innerRadius, outerRadius }) => {
              const RADIAN = Math.PI / 180
              const radius = outerRadius + 15
              const x = cx + radius * Math.cos(-midAngle * RADIAN)
              const y = cy + radius * Math.sin(-midAngle * RADIAN)
              
              // Only show label if percentage is significant enough
              if (percent < 0.05) return null
              
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
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {displayData.map((entry, index) => (
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

export default RiskFactorsChart
