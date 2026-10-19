import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { RISK_LEVELS } from '@/utils/predictiveAnalytics.js'

const RiskDistributionChart = ({ studentRiskData }) => {
  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case 'LOW': return '#10B981' // green-500
      case 'MEDIUM': return '#F59E0B' // yellow-500
      case 'HIGH': return '#F97316' // orange-500
      case 'CRITICAL': return '#EF4444' // red-500
      default: return '#6B7280' // gray-500
    }
  }

  // Prepare data for the chart
  const chartData = Object.values(RISK_LEVELS).map(level => {
    const count = Object.values(studentRiskData).filter(
      data => data.riskLevel === level.level
    ).length
    return {
      name: level.level,
      value: count,
      color: getRiskLevelColor(level.level),
      description: level.description
    }
  }).filter(item => item.value > 0)

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white">
            {data.name} Risk Level
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Students: {data.value}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {data.description}
          </p>
        </div>
      )
    }
    return null
  }

  if (chartData.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No risk data available</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent, cx, cy, midAngle, innerRadius, outerRadius }) => {
              const RADIAN = Math.PI / 180
              const radius = outerRadius + 8
              const x = cx + radius * Math.cos(-midAngle * RADIAN)
              const y = cy + radius * Math.sin(-midAngle * RADIAN)
              
              // Only show label if percentage is significant enough
              if (percent < 0.03) return null
              
              return (
                <text 
                  x={x} 
                  y={y} 
                  fill="#6B7280" 
                  textAnchor={x > cx ? 'start' : 'end'} 
                  dominantBaseline="central"
                  fontSize="8"
                  fontWeight="normal"
                >
                  {`${(percent * 100).toFixed(0)}%`}
                </text>
              )
            }}
            outerRadius={35}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }}
            iconSize={8}
          />
                  </PieChart>
        </ResponsiveContainer>
    )
}

export default RiskDistributionChart
