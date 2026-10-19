import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { SESSION_TYPES, SESSION_CATEGORIES } from '@/utils/constants.js'

const SessionForm = React.memo(({ sessionInfo, onUpdate }) => {
  const handleChange = (field, value) => {
    onUpdate(field, value)
  }

  // Group session types by category for better organization
  const groupedSessionTypes = {
    [SESSION_CATEGORIES.ACADEMIC]: [
      SESSION_TYPES.INITIAL_ADVISING,
      SESSION_TYPES.FOLLOW_UP,
      SESSION_TYPES.ACADEMIC_PLANNING,
      SESSION_TYPES.COURSE_REGISTRATION,
      SESSION_TYPES.GRADUATION_PLANNING,
      SESSION_TYPES.TRANSFER_CREDIT
    ],
    [SESSION_CATEGORIES.SUPPORT]: [
      SESSION_TYPES.ACADEMIC_PROBATION,
      SESSION_TYPES.TRANSFER_STUDENT,
      SESSION_TYPES.STUDY_ABROAD,
      SESSION_TYPES.CAREER_COUNSELING,
      SESSION_TYPES.FINANCIAL_AID
    ],
    [SESSION_CATEGORIES.CRISIS]: [
      SESSION_TYPES.CRISIS_INTERVENTION,
      SESSION_TYPES.MENTAL_HEALTH
    ],
    [SESSION_CATEGORIES.ACCESSIBILITY]: [
      SESSION_TYPES.DISABILITY_SERVICES,
      SESSION_TYPES.INTERNATIONAL_STUDENT
    ],
    [SESSION_CATEGORIES.ADVANCED]: [
      SESSION_TYPES.GRADUATE_SCHOOL,
      SESSION_TYPES.INTERNSHIP_COOP
    ],
    [SESSION_CATEGORIES.OTHER]: [
      SESSION_TYPES.OTHER
    ]
  }

  const categoryLabels = {
    [SESSION_CATEGORIES.ACADEMIC]: 'Academic Planning & Advising',
    [SESSION_CATEGORIES.SUPPORT]: 'Specialized Support',
    [SESSION_CATEGORIES.CRISIS]: 'Crisis & Intervention',
    [SESSION_CATEGORIES.ACCESSIBILITY]: 'Accessibility & Special Needs',
    [SESSION_CATEGORIES.ADVANCED]: 'Advanced Planning',
    [SESSION_CATEGORIES.OTHER]: 'Other'
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Session Information</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
                          <div className="space-y-4">
           {/* First row: Date, Time, Advisor, Student Code */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
             <div>
               <Label htmlFor="date" className="text-xs">Date</Label>
               <Input 
                 id="date"
                 type="date" 
                 value={sessionInfo.date}
                 onChange={(e) => handleChange('date', e.target.value)}
                 className="mt-1 h-9 text-sm"
               />
             </div>
             <div>
               <Label htmlFor="time" className="text-xs">Time</Label>
               <Input 
                 id="time"
                 type="time" 
                 value={sessionInfo.time}
                 onChange={(e) => handleChange('time', e.target.value)}
                 className="mt-1 h-9 text-sm"
               />
             </div>
             <div>
               <Label htmlFor="advisor" className="text-xs">Advisor</Label>
               <Input 
                 id="advisor"
                 placeholder="Advisor name/ID"
                 value={sessionInfo.advisor}
                 onChange={(e) => handleChange('advisor', e.target.value)}
                 className="mt-1 h-9 text-sm"
               />
             </div>
             <div>
               <Label htmlFor="studentCode" className="text-xs">Student Code</Label>
               <Input 
                 id="studentCode"
                 placeholder="Student ID/Code"
                 value={sessionInfo.studentCode}
                 onChange={(e) => handleChange('studentCode', e.target.value)}
                 className="mt-1 h-9 text-sm"
               />
             </div>
           </div>
           
                       {/* Second row: Session Type */}
            <div className="flex justify-center">
              <div className="w-80">
                <Label htmlFor="sessionType" className="text-xs">Session Type</Label>
                <Select value={sessionInfo.sessionType} onValueChange={(value) => handleChange('sessionType', value)}>
                  <SelectTrigger className="mt-1 h-9 text-sm">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[45vh] w-[320px]">
                    {Object.entries(groupedSessionTypes).map(([category, types]) => (
                      <div key={category}>
                        <div className="px-2 py-1 text-xs font-semibold text-muted-foreground bg-muted/50">
                          {categoryLabels[category]}
                        </div>
                        {types.map((type) => (
                          <SelectItem 
                            key={type.value} 
                            value={type.value}
                            className="pl-3 py-1.5"
                          >
                            <div className="flex flex-col">
                              <div className="font-medium text-xs">{type.label}</div>
                              <div className="text-xs text-muted-foreground leading-tight">{type.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
         </div>
      </CardContent>
    </Card>
  )
})

export default SessionForm
