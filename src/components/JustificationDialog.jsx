import React, { useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Label } from '@/components/ui/label.jsx'
import { AlertTriangle } from 'lucide-react'

const JustificationDialog = ({ isOpen, onClose, onConfirm, completionRate }) => {
  const [justification, setJustification] = useState('')

  const handleConfirm = () => {
    if (justification.trim()) {
      onConfirm(justification)
      setJustification('')
    }
  }

  const handleClose = () => {
    setJustification('')
    onClose()
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="w-5 h-5" />
            Low Completion Rate
          </AlertDialogTitle>
          <AlertDialogDescription>
            Your session completion rate is {Math.round(completionRate)}%, which is below the recommended 50%. 
            Please provide a justification for the low completion rate to proceed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-3">
          <Label htmlFor="justification">Justification (Required)</Label>
          <Textarea
            id="justification"
            placeholder="Please explain why the completion rate is below 50%..."
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            disabled={!justification.trim()}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            Complete Session
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default JustificationDialog
