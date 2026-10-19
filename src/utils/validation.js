import { SESSION_TYPE_VALUES } from './constants.js'

export const validateSessionData = (sessionData) => {
  const errors = []

  // Validate session info
  if (!sessionData.sessionInfo.date) {
    errors.push('Date is required')
  }
  if (!sessionData.sessionInfo.time) {
    errors.push('Time is required')
  }
  if (!sessionData.sessionInfo.advisor) {
    errors.push('Advisor name is required')
  }
  if (!sessionData.sessionInfo.studentCode) {
    errors.push('Student code is required')
  }
  if (!sessionData.sessionInfo.sessionType) {
    errors.push('Session type is required')
  } else if (!SESSION_TYPE_VALUES.includes(sessionData.sessionInfo.sessionType)) {
    errors.push('Invalid session type selected')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateObservationData = (observations) => {
  const errors = []
  let completedFields = 0
  let totalFields = 0

  // Count completed fields
  Object.keys(observations).forEach(category => {
    Object.keys(observations[category]).forEach(field => {
      totalFields++
      const fieldData = observations[category][field]
      if (fieldData.rating || fieldData.notes) {
        completedFields++
      }
    })
  })

  const completionRate = totalFields > 0 ? (completedFields / totalFields) * 100 : 0

  return {
    isValid: true, // Always allow completion
    errors,
    completionRate,
    requiresJustification: completionRate < 50
  }
}
