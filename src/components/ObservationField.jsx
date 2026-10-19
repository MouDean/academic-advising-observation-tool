import React from 'react'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'

const ObservationField = React.memo(({ category, field, label, options, currentValue, notes, onUpdate }) => {
  const handleRatingChange = (value) => {
    onUpdate(category, field, 'rating', value)
  }

  const handleNotesChange = (e) => {
    onUpdate(category, field, 'notes', e.target.value)
  }

  return (
    <div className="space-y-3 p-4 border rounded-lg">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-muted-foreground">Rating/Frequency</Label>
          <Select 
            value={currentValue.rating} 
            onValueChange={handleRatingChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select rating" />
            </SelectTrigger>
            <SelectContent>
              {options.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Observation Notes</Label>
          <Textarea 
            placeholder="Enter observations..."
            value={currentValue.notes}
            onChange={handleNotesChange}
            className="min-h-[80px]"
          />
        </div>
      </div>
    </div>
  )
})

export default ObservationField
