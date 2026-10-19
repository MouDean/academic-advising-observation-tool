// Constants for the observation tool application

export const SESSION_TYPES = {
  // Academic Planning & Advising
  INITIAL_ADVISING: {
    value: 'initial-advising',
    label: 'Initial Advising',
    description: 'First-time student orientation and academic planning',
    category: 'academic'
  },
  FOLLOW_UP: {
    value: 'follow-up',
    label: 'Follow-up Session',
    description: 'Regular check-in and progress review',
    category: 'academic'
  },
  ACADEMIC_PLANNING: {
    value: 'academic-planning',
    label: 'Academic Planning',
    description: 'Course selection and degree pathway planning',
    category: 'academic'
  },
  COURSE_REGISTRATION: {
    value: 'course-registration',
    label: 'Course Registration',
    description: 'Assistance with course selection and registration',
    category: 'academic'
  },
  GRADUATION_PLANNING: {
    value: 'graduation-planning',
    label: 'Graduation Planning',
    description: 'Final year planning and graduation requirements',
    category: 'academic'
  },
  TRANSFER_CREDIT: {
    value: 'transfer-credit',
    label: 'Transfer Credit Evaluation',
    description: 'Assessment of credits from other institutions',
    category: 'academic'
  },
  
  // Specialized Support
  ACADEMIC_PROBATION: {
    value: 'academic-probation',
    label: 'Academic Probation Support',
    description: 'Support for students on academic probation',
    category: 'support'
  },
  TRANSFER_STUDENT: {
    value: 'transfer-student',
    label: 'Transfer Student Orientation',
    description: 'Orientation for new transfer students',
    category: 'support'
  },
  STUDY_ABROAD: {
    value: 'study-abroad',
    label: 'Study Abroad Planning',
    description: 'Planning for international study opportunities',
    category: 'support'
  },
  CAREER_COUNSELING: {
    value: 'career-counseling',
    label: 'Career Counseling',
    description: 'Career guidance and professional development',
    category: 'support'
  },
  FINANCIAL_AID: {
    value: 'financial-aid',
    label: 'Financial Aid Consultation',
    description: 'Financial aid and scholarship guidance',
    category: 'support'
  },
  
  // Crisis & Intervention
  CRISIS_INTERVENTION: {
    value: 'crisis-intervention',
    label: 'Crisis Intervention',
    description: 'Emergency support and crisis management',
    category: 'crisis'
  },
  MENTAL_HEALTH: {
    value: 'mental-health',
    label: 'Mental Health Referral',
    description: 'Mental health support and referrals',
    category: 'crisis'
  },
  
  // Accessibility & Special Needs
  DISABILITY_SERVICES: {
    value: 'disability-services',
    label: 'Disability Services Support',
    description: 'Support for students with disabilities',
    category: 'accessibility'
  },
  INTERNATIONAL_STUDENT: {
    value: 'international-student',
    label: 'International Student Support',
    description: 'Support for international students',
    category: 'accessibility'
  },
  
  // Advanced Planning
  GRADUATE_SCHOOL: {
    value: 'graduate-school',
    label: 'Graduate School Preparation',
    description: 'Preparation for graduate school applications',
    category: 'advanced'
  },
  INTERNSHIP_COOP: {
    value: 'internship-coop',
    label: 'Internship/Co-op Guidance',
    description: 'Guidance for internship and co-op opportunities',
    category: 'advanced'
  },
  
  // Other
  OTHER: {
    value: 'other',
    label: 'Other',
    description: 'Other types of sessions not listed above',
    category: 'other'
  }
}

// Helper function to get session type by value
export const getSessionTypeByValue = (value) => {
  return Object.values(SESSION_TYPES).find(type => type.value === value) || SESSION_TYPES.OTHER
}

// Helper function to get session types by category
export const getSessionTypesByCategory = (category) => {
  return Object.values(SESSION_TYPES).filter(type => type.category === category)
}

// Get all session type values for form validation
export const SESSION_TYPE_VALUES = Object.values(SESSION_TYPES).map(type => type.value)

// Get all session type labels for display
export const SESSION_TYPE_LABELS = Object.values(SESSION_TYPES).map(type => type.label)

// Categories for grouping
export const SESSION_CATEGORIES = {
  ACADEMIC: 'academic',
  SUPPORT: 'support',
  CRISIS: 'crisis',
  ACCESSIBILITY: 'accessibility',
  ADVANCED: 'advanced',
  OTHER: 'other'
}
