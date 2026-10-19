import React from 'react'
import { Progress } from '@/components/ui/progress.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { validateObservationData } from '@/utils/validation.js'

const ProgressIndicator = React.memo(({ observations }) => {
  const { completionRate } = validateObservationData(observations)
  
  const getProgressColor = (rate) => {
    if (rate >= 80) return 'bg-green-500'
    if (rate >= 60) return 'bg-blue-500'
    if (rate >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getProgressText = (rate) => {
    if (rate >= 80) return 'Excellent'
    if (rate >= 60) return 'Good'
    if (rate >= 50) return 'Average'
    return 'Low - Justification Required'
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-sm">Observation Completion Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Completion Rate</span>
            <span className="font-medium">{Math.round(completionRate)}%</span>
          </div>
          <Progress 
            value={completionRate} 
            className="h-2"
          />
          <div className="text-xs text-muted-foreground text-center">
            {getProgressText(completionRate)} - {Math.round(completionRate)}% complete
          </div>
          {completionRate < 50 && (
            <div className="text-xs text-amber-600 text-center font-medium">
              ⚠️ Justification will be required to complete session
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
})

export default ProgressIndicator
