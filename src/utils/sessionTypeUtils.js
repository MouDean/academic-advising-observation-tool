import { SESSION_TYPES, getSessionTypeByValue } from './constants.js'

/**
 * Get the display label for a session type value
 * @param {string} value - The session type value
 * @returns {string} The display label
 */
export const getSessionTypeLabel = (value) => {
  const sessionType = getSessionTypeByValue(value)
  return sessionType ? sessionType.label : 'Unknown'
}

/**
 * Get the description for a session type value
 * @param {string} value - The session type value
 * @returns {string} The description
 */
export const getSessionTypeDescription = (value) => {
  const sessionType = getSessionTypeByValue(value)
  return sessionType ? sessionType.description : ''
}

/**
 * Get the category for a session type value
 * @param {string} value - The session type value
 * @returns {string} The category
 */
export const getSessionTypeCategory = (value) => {
  const sessionType = getSessionTypeByValue(value)
  return sessionType ? sessionType.category : 'other'
}

/**
 * Check if a session type is in a specific category
 * @param {string} value - The session type value
 * @param {string} category - The category to check
 * @returns {boolean} True if the session type is in the category
 */
export const isSessionTypeInCategory = (value, category) => {
  return getSessionTypeCategory(value) === category
}

/**
 * Get session types suitable for specific student situations
 * @param {Object} studentContext - Student context information
 * @returns {Array} Array of recommended session types
 */
export const getRecommendedSessionTypes = (studentContext = {}) => {
  const recommendations = []
  
  // Academic probation
  if (studentContext.academicStanding === 'probation') {
    recommendations.push(SESSION_TYPES.ACADEMIC_PROBATION.value)
  }
  
  // Transfer student
  if (studentContext.isTransferStudent) {
    recommendations.push(SESSION_TYPES.TRANSFER_STUDENT.value)
  }
  
  // International student
  if (studentContext.isInternationalStudent) {
    recommendations.push(SESSION_TYPES.INTERNATIONAL_STUDENT.value)
  }
  
  // Graduating soon
  if (studentContext.creditsCompleted > 100) {
    recommendations.push(SESSION_TYPES.GRADUATION_PLANNING.value)
  }
  
  // Career planning
  if (studentContext.creditsCompleted > 60) {
    recommendations.push(SESSION_TYPES.CAREER_COUNseling.value)
  }
  
  // Graduate school preparation
  if (studentContext.creditsCompleted > 90) {
    recommendations.push(SESSION_TYPES.GRADUATE_SCHOOL.value)
  }
  
  return recommendations
}

/**
 * Get session type statistics from sessions data
 * @param {Array} sessions - Array of session objects
 * @returns {Object} Statistics about session types
 */
export const getSessionTypeStats = (sessions) => {
  const stats = {}
  
  sessions.forEach(session => {
    const sessionType = session.sessionInfo?.sessionType
    if (sessionType) {
      if (!stats[sessionType]) {
        stats[sessionType] = {
          count: 0,
          label: getSessionTypeLabel(sessionType),
          category: getSessionTypeCategory(sessionType)
        }
      }
      stats[sessionType].count++
    }
  })
  
  return stats
}

/**
 * Format session type for display in reports
 * @param {string} value - The session type value
 * @param {string} format - The format ('short', 'long', 'description')
 * @returns {string} Formatted session type
 */
export const formatSessionType = (value, format = 'long') => {
  const sessionType = getSessionTypeByValue(value)
  if (!sessionType) return 'Unknown'
  
  switch (format) {
    case 'short':
      return sessionType.label
    case 'long':
      return `${sessionType.label} - ${sessionType.description}`
    case 'description':
      return sessionType.description
    default:
      return sessionType.label
  }
}
