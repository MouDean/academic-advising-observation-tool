// Sample data generator for testing analytics dashboard
import { SESSION_TYPES } from './constants.js'

export const generateSampleSessions = (count = 50) => {
  const advisors = ['Demo Advisor A', 'Demo Advisor B', 'Demo Advisor C']
  const studentCodes = ['DEMO001', 'DEMO002', 'DEMO003', 'DEMO004']
  
  // Use the new comprehensive session types
  const sessionTypes = [
    SESSION_TYPES.INITIAL_ADVISING.value,
    SESSION_TYPES.FOLLOW_UP.value,
    SESSION_TYPES.ACADEMIC_PLANNING.value,
    SESSION_TYPES.COURSE_REGISTRATION.value,
    SESSION_TYPES.GRADUATION_PLANNING.value,
    SESSION_TYPES.TRANSFER_CREDIT.value,
    SESSION_TYPES.ACADEMIC_PROBATION.value,
    SESSION_TYPES.TRANSFER_STUDENT.value,
    SESSION_TYPES.STUDY_ABROAD.value,
    SESSION_TYPES.CAREER_COUNSELING.value,
    SESSION_TYPES.FINANCIAL_AID.value,
    SESSION_TYPES.CRISIS_INTERVENTION.value,
    SESSION_TYPES.MENTAL_HEALTH.value,
    SESSION_TYPES.DISABILITY_SERVICES.value,
    SESSION_TYPES.INTERNATIONAL_STUDENT.value,
    SESSION_TYPES.GRADUATE_SCHOOL.value,
    SESSION_TYPES.INTERNSHIP_COOP.value
  ]
  
  // Random justifications for different scenarios
  const justifications = [
    'Session was interrupted due to technical issues and time constraints. Student had to leave early for another appointment.',
    'Student arrived late and there was limited time to complete all observations. Focus was on essential advising tasks.',
    'Network connectivity issues prevented access to AI tools during the session. Manual processes were used instead.',
    'Student was in a hurry and requested to focus only on immediate concerns. Full observation protocol could not be followed.',
    'Advisor was called away for an emergency situation. Session was completed by a substitute advisor with limited context.',
    'Student had language barriers that made some observations difficult to assess accurately.',
    'Technical difficulties with the observation system prevented proper data entry during the session.',
    'Student was experiencing personal issues that affected their engagement level throughout the session.',
    'Session was conducted in a noisy environment that made certain observations challenging to complete.',
    'Advisor was new to the system and still learning the observation protocol. Some fields were missed.',
    'Student requested confidentiality for certain aspects of the session, limiting observation opportunities.',
    'Session was conducted remotely with poor video/audio quality, affecting observation accuracy.',
    'Advisor was covering for another staff member and was not fully familiar with all observation categories.',
    'Student had special accommodation needs that required deviation from standard observation procedures.',
    'Session was part of a pilot program with modified observation requirements.'
  ]
  
  // Field-specific skip justifications
  const fieldSkipJustifications = [
    // Session Type Specific (5 justifications)
    'Field not applicable for this session type (e.g., AI tools in crisis intervention)',
    'Session focused on urgent matters, detailed observations deferred',
    'Student requested to focus on specific areas only',
    'Observation not feasible given the session format and time constraints',
    'This aspect was addressed in previous sessions and no changes noted',
    
    // Technical & Operational (5 justifications)
    'Technical issues prevented access to required systems or tools',
    'Network connectivity problems limited observation capabilities',
    'Advisor was covering for another staff member with limited system access',
    'System maintenance or updates prevented full observation completion',
    'Hardware limitations affected observation quality and completeness',
    
    // Student & Session Context (5 justifications)
    'Student was in a hurry and requested abbreviated session',
    'Session was interrupted by emergency or urgent matter',
    'Student had limited time due to class schedule conflicts',
    'Language barriers made certain observations difficult to assess',
    'Student was experiencing personal crisis requiring focused support',
    
    // Advisor & Process (5 justifications)
    'Advisor focused on other priorities during this particular session',
    'Session was conducted in non-standard format (walk-in, emergency)',
    'Advisor determined this observation was not necessary for this session',
    'Session was primarily informational rather than interactive',
    'Advisor was providing coverage and not fully familiar with all categories',
    
    // Quality & Standards (5 justifications)
    'Observation quality would be compromised due to session circumstances',
    'Student privacy concerns limited observation scope',
    'Session was conducted in non-traditional setting or format',
    'Advisor prioritized student needs over complete observation documentation',
    'Session was part of ongoing series with previous comprehensive observations'
  ]
  
  const ratingOptions = {
    degreeRequirements: ['Always', 'Sometimes', 'Never'],
    aiToolsUsage: ['Observed', 'Not Observed'],
    referralServices: ['Yes', 'No'],
    questionsProactive: ['High', 'Medium', 'Low'],
    aiInteraction: ['Yes', 'No'],
    understandingAdvice: ['Yes', 'No', 'Unclear'],
    accurateInfo: ['Accurate', 'Partially Accurate', 'Inaccurate'],
    enhancesEfficiency: ['Yes', 'No'],
    technicalIssues: ['Yes', 'No (describe)'],
    activeListening: ['Strong', 'Moderate', 'Weak'],
    aiOutputIntegration: ['Effective', 'Limited', 'Not used'],
    studentSatisfaction: ['Positive', 'Neutral', 'Negative'],
    retentionStrategies: ['Yes', 'No'],
    systemsThinking: ['Observed', 'Not Observed']
  }

  // Enhanced category-specific and field-specific sample notes with session type relevance
  const categorySpecificNotes = {
    advisingProcess: {
      degreeRequirements: [
        'Student showed excellent understanding of degree requirements and graduation timeline',
        'Degree audit was thoroughly reviewed with clear action items identified',
        'Student demonstrated clear knowledge of major and minor requirements',
        'Advisor clarified graduation requirements and remaining credits needed',
        'Student understood prerequisite chains and course sequencing',
        'Degree requirements clearly explained with visual pathway mapping',
        'Student progress toward degree completion accurately assessed',
        'Remaining degree requirements identified with timeline planning',
        'Degree audit results discussed with clear next steps outlined',
        'Student degree pathway optimized for efficient completion'
      ],
      aiToolsUsage: [
        'AI tools were effectively integrated to demonstrate course pathway options',
        'Student successfully used AI degree audit tool to check progress',
        'AI system provided accurate course recommendations based on student goals',
        'Digital degree planning tools enhanced the advising session quality',
        'Student engaged well with AI-powered course selection interface',
        'AI degree planning tools demonstrated with student hands-on practice',
        'Digital resources effectively utilized for academic planning',
        'AI recommendations integrated into course selection process',
        'Student showed proficiency with AI-enhanced advising tools',
        'Technology enhanced degree planning efficiency and accuracy'
      ],
      referralServices: [
        'Student was referred to career services for internship guidance',
        'Referral made to academic support center for study skills assistance',
        'Student connected with financial aid office for scholarship opportunities',
        'Referral provided to international student services for visa concerns',
        'Student directed to disability services for accommodation needs',
        'Appropriate referrals made based on student needs and goals',
        'Referral services coordinated with follow-up planning',
        'Student connected with specialized support resources',
        'Cross-departmental referrals facilitated for comprehensive support',
        'Referral network utilized to address student-specific concerns'
      ]
    },
    studentEngagement: {
      questionsProactive: [
        'Student asked thoughtful questions about course selection and prerequisites',
        'Student proactively inquired about study abroad opportunities and requirements',
        'Student demonstrated curiosity about career pathways and graduate school options',
        'Student asked insightful questions about transfer credit policies',
        'Student showed initiative by asking about research and internship opportunities',
        'Student engaged in meaningful dialogue about academic planning',
        'Student demonstrated proactive approach to academic decision-making',
        'Student asked relevant questions about institutional policies and procedures',
        'Student showed interest in exploring additional academic opportunities',
        'Student engaged in thoughtful discussion about future academic goals'
      ],
      aiInteraction: [
        'Student actively engaged with AI tools during the session',
        'Student demonstrated comfort using digital advising resources',
        'Student provided feedback on AI recommendations and suggestions',
        'Student collaborated effectively with AI systems for course planning',
        'Student showed enthusiasm for AI-enhanced advising experience',
        'Student embraced technology integration in advising process',
        'Student demonstrated digital literacy and AI tool proficiency',
        'Student provided constructive feedback on AI system recommendations',
        'Student showed adaptability to new technological approaches',
        'Student engaged collaboratively with AI-enhanced advising tools'
      ],
      understandingAdvice: [
        'Student appeared to fully understand the advice and recommendations provided',
        'Student asked clarifying questions to ensure complete understanding',
        'Student demonstrated comprehension by summarizing key points discussed',
        'Student showed confidence in implementing the guidance received',
        'Student appeared satisfied and clear about next steps',
        'Student demonstrated clear understanding of academic requirements',
        'Student showed ability to apply advice to specific situations',
        'Student appeared confident in implementing recommendations',
        'Student demonstrated retention of key information discussed',
        'Student showed readiness to take action on guidance provided'
      ]
    },
    aiEnhancedTools: {
      accurateInfo: [
        'AI system provided accurate and up-to-date information as needed',
        'Digital tools displayed current course availability and prerequisites',
        'AI recommendations aligned with student academic goals and constraints',
        'System provided real-time updates on policy changes and requirements',
        'AI output was consistent with institutional guidelines and standards',
        'AI system demonstrated high accuracy in course recommendations',
        'Digital tools provided current and relevant academic information',
        'AI recommendations were well-aligned with institutional policies',
        'System accuracy enhanced advisor confidence in recommendations',
        'AI output quality supported effective decision-making process'
      ],
      enhancesEfficiency: [
        'Technology enhanced the efficiency and accuracy of the session',
        'AI tools reduced time spent on routine information gathering',
        'Digital resources allowed for more focused discussion on student needs',
        'Automated processes freed up time for personalized advising',
        'Technology streamlined the course planning and registration process',
        'AI tools significantly improved session productivity and flow',
        'Digital resources optimized time allocation for student concerns',
        'Technology integration enhanced overall session effectiveness',
        'AI automation supported more personalized advising interactions',
        'Digital tools facilitated efficient information access and sharing'
      ],
      technicalIssues: [
        'Technical issues were minimal and quickly resolved by support team',
        'AI system experienced brief connectivity issues but recovered quickly',
        'Minor software glitches were resolved without disrupting session flow',
        'System performance was optimal throughout the entire session',
        'Technical support was readily available when minor issues arose',
        'Technology performed reliably throughout the entire session',
        'System stability supported uninterrupted advising process',
        'Technical issues were handled professionally and efficiently',
        'AI tools demonstrated consistent performance and reliability',
        'Technology infrastructure supported seamless advising experience'
      ]
    },
    communicationInteraction: {
      activeListening: [
        'Advisor demonstrated strong active listening and empathy skills',
        'Advisor showed genuine interest in student concerns and goals',
        'Advisor provided appropriate responses based on student input',
        'Advisor maintained good eye contact and engaged body language',
        'Advisor reflected back student statements to ensure understanding',
        'Advisor demonstrated excellent listening skills throughout session',
        'Advisor showed genuine empathy and understanding of student needs',
        'Advisor maintained professional and attentive communication style',
        'Advisor effectively validated student concerns and experiences',
        'Advisor demonstrated strong interpersonal communication skills'
      ],
      aiOutputIntegration: [
        'AI output was well-integrated into the advising conversation',
        'Advisor effectively used AI recommendations to guide discussion',
        'Digital tools enhanced rather than replaced human interaction',
        'AI suggestions were presented in context of student needs',
        'Technology supported natural conversation flow throughout session',
        'AI integration enhanced rather than disrupted human connection',
        'Digital tools supported natural advising conversation flow',
        'Technology was seamlessly integrated into advising process',
        'AI recommendations enhanced advisor-student interaction quality',
        'Digital resources supported effective communication throughout session'
      ],
      studentSatisfaction: [
        'Student appeared satisfied and confident with the guidance provided',
        'Student expressed positive feedback about the session experience',
        'Student showed enthusiasm for the recommendations and next steps',
        'Student appeared relaxed and comfortable throughout the session',
        'Student demonstrated trust in the advisor and process',
        'Student showed clear satisfaction with session outcomes',
        'Student appeared confident in implementing recommendations',
        'Student demonstrated positive engagement throughout session',
        'Student showed appreciation for advisor guidance and support',
        'Student appeared motivated and ready for next steps'
      ]
    },
    leadershipAlignment: {
      retentionStrategies: [
        'Session included specific strategies for academic success and retention',
        'Advisor discussed early warning signs and intervention approaches',
        'Student was provided with resources to maintain academic progress',
        'Retention-focused advising techniques were effectively implemented',
        'Session addressed potential barriers to student success proactively',
        'Retention strategies were clearly communicated and understood',
        'Student retention planning integrated with academic pathway',
        'Early intervention approaches discussed and planned',
        'Retention-focused resources and support identified',
        'Student success strategies aligned with institutional goals'
      ],
      systemsThinking: [
        'Advisor demonstrated understanding of institutional systems and processes',
        'Session considered broader academic and administrative implications',
        'Advisor connected individual student needs with institutional resources',
        'Systems-level thinking was evident in problem-solving approach',
        'Advisor showed awareness of cross-departmental collaboration opportunities',
        'Institutional perspective integrated into individual student planning',
        'Systems-level considerations informed advising recommendations',
        'Cross-functional collaboration opportunities identified and discussed',
        'Institutional resource optimization considered in student planning',
        'Systems thinking enhanced overall advising effectiveness and impact'
      ]
    }
  }

  // Function to get a relevant general note based on session type
  const getRelevantGeneralNote = (sessionType) => {
    // Session type-specific notes for maximum relevance
    const sessionTypeNotes = {
      'initial-advising': [
        'Initial advising session completed with comprehensive student orientation and academic planning',
        'Student received complete overview of degree requirements and institutional policies',
        'First-time student successfully oriented to academic advising system and resources',
        'Initial academic pathway established with clear milestones and timeline',
        'Student demonstrated good understanding of academic expectations and support services'
      ],
      'follow-up': [
        'Follow-up session focused on progress review and next steps planning',
        'Student progress assessed with updated academic plan and recommendations',
        'Follow-up advising completed with revised goals and action items',
        'Ongoing support provided with updated resource recommendations',
        'Student progress tracked with adjustments to academic pathway'
      ],
      'academic-planning': [
        'Academic planning session completed with comprehensive course pathway development',
        'Student academic goals aligned with degree requirements and timeline',
        'Academic planning focused on major/minor selection and course sequencing',
        'Long-term academic strategy developed with milestone tracking',
        'Academic planning integrated with career goals and graduate school preparation'
      ],
      'course-registration': [
        'Course registration assistance provided with prerequisite verification',
        'Student successfully registered for appropriate courses with advisor guidance',
        'Course selection optimized for degree progress and academic goals',
        'Registration completed with schedule optimization and conflict resolution',
        'Course registration aligned with academic plan and graduation timeline'
      ],
      'graduation-planning': [
        'Graduation planning completed with final requirements review and timeline',
        'Student graduation pathway verified with remaining credit assessment',
        'Graduation requirements clarified with action plan for final semester',
        'Graduation timeline established with milestone tracking and deadlines',
        'Graduation planning integrated with post-graduation goals and preparation'
      ],
      'transfer-credit': [
        'Transfer credit evaluation completed with comprehensive credit assessment',
        'Student transfer credits evaluated and applied to degree requirements',
        'Transfer credit analysis provided with clear explanation of credit application',
        'Transfer student pathway optimized with credit maximization strategies',
        'Transfer credit evaluation integrated with academic planning and timeline'
      ],
      'academic-probation': [
        'Academic probation support provided with improvement plan development',
        'Student academic challenges addressed with intervention strategies',
        'Academic probation session focused on recovery planning and support services',
        'Student provided with academic support resources and monitoring plan',
        'Academic probation addressed with clear improvement goals and timeline'
      ],
      'transfer-student': [
        'Transfer student orientation completed with comprehensive institutional overview',
        'Transfer student successfully integrated with academic advising system',
        'Transfer student pathway optimized with credit evaluation and planning',
        'Transfer student provided with specialized support services and resources',
        'Transfer student orientation focused on institutional policies and procedures'
      ],
      'study-abroad': [
        'Study abroad planning completed with program selection and requirements',
        'Student study abroad goals aligned with academic and personal objectives',
        'Study abroad session focused on credit transfer and academic integration',
        'International study opportunities explored with cultural preparation guidance',
        'Study abroad planning integrated with degree requirements and timeline'
      ],
      'career-counseling': [
        'Career counseling session completed with professional development planning',
        'Student career goals aligned with academic pathway and skill development',
        'Career exploration provided with industry insights and networking guidance',
        'Career planning integrated with academic requirements and internship opportunities',
        'Career counseling focused on skill assessment and market preparation'
      ],
      'financial-aid': [
        'Financial aid consultation completed with comprehensive funding options review',
        'Student financial aid opportunities explored with application guidance',
        'Financial aid planning integrated with academic timeline and requirements',
        'Scholarship opportunities identified with application strategies provided',
        'Financial aid session focused on budget planning and resource optimization'
      ],
      'crisis-intervention': [
        'Crisis intervention protocols followed with appropriate support services referral',
        'Student crisis situation addressed with immediate intervention and safety planning',
        'Crisis intervention completed with follow-up support and monitoring plan',
        'Emergency protocols implemented with appropriate resource mobilization',
        'Crisis intervention focused on immediate safety and long-term support planning'
      ],
      'mental-health': [
        'Mental health support provided with appropriate referral and resource connection',
        'Student mental health concerns addressed with professional support referral',
        'Mental health session completed with crisis prevention and support planning',
        'Mental health resources identified with access guidance and follow-up plan',
        'Mental health support integrated with academic and personal development'
      ],
      'disability-services': [
        'Disability services support provided with accommodation planning and implementation',
        'Student accommodation needs assessed with appropriate service coordination',
        'Disability services session focused on accessibility and support optimization',
        'Accommodation plan developed with institutional resource coordination',
        'Disability services integrated with academic planning and support systems'
      ],
      'international-student': [
        'International student support provided with visa and cultural guidance',
        'International student concerns addressed with specialized resource connection',
        'International student session focused on cultural integration and support',
        'Visa and immigration guidance provided with compliance monitoring',
        'International student support integrated with academic and cultural development'
      ],
      'graduate-school': [
        'Graduate school preparation completed with application strategy development',
        'Student graduate school goals aligned with preparation timeline and requirements',
        'Graduate school planning focused on research opportunities and application preparation',
        'Graduate school pathway optimized with prerequisite and timeline planning',
        'Graduate school preparation integrated with current academic and research goals'
      ],
      'internship-coop': [
        'Internship/co-op guidance provided with opportunity identification and application',
        'Student internship goals aligned with career development and academic credit',
        'Internship planning focused on skill development and industry connection',
        'Co-op opportunities explored with academic integration and credit planning',
        'Internship/co-op guidance integrated with career planning and academic requirements'
      ]
    }
    
    // Return session type-specific note or fallback to general note
    const specificNotes = sessionTypeNotes[sessionType]
    if (specificNotes && specificNotes.length > 0) {
      return specificNotes[Math.floor(Math.random() * specificNotes.length)]
    }
    
    // Fallback to general notes if session type not found
    const generalNotes = [
      'Session completed successfully with comprehensive student support provided',
      'Student received appropriate guidance and resources for their needs',
      'Advisory session focused on student success and goal achievement',
      'Session quality maintained with professional standards and best practices',
      'Student left with clear action items and follow-up plan'
    ]
    
    return generalNotes[Math.floor(Math.random() * generalNotes.length)]
  }

  const sessions = []

  for (let i = 0; i < count; i++) {
    // Generate realistic session date with daily distribution for better trend visualization
    let sessionDate
    
    // Create daily distribution across the full year (365 days)
    const startDate = new Date('2025-01-01')
    const endDate = new Date('2025-12-31')
    const totalDays = 365
    
    // Distribute sessions more evenly across days with some clustering for realism
    let dayOffset
    if (i < count * 0.3) {
      // 30% of sessions: Fall semester (Aug-Oct) - high volume
      dayOffset = Math.floor(Math.random() * 92) + 212 // Days 212-303 (Aug 1 - Oct 31)
    } else if (i < count * 0.6) {
      // 30% of sessions: Spring semester (Jan-May) - high volume
      dayOffset = Math.floor(Math.random() * 151) + 0 // Days 0-150 (Jan 1 - May 31)
    } else if (i < count * 0.8) {
      // 20% of sessions: Summer months (Jun-Jul) - medium volume
      dayOffset = Math.floor(Math.random() * 61) + 151 // Days 151-211 (Jun 1 - Jul 31)
    } else {
      // 20% of sessions: November-December - medium volume
      dayOffset = Math.floor(Math.random() * 61) + 304 // Days 304-364 (Nov 1 - Dec 31)
    }
    
    // Create the session date
    sessionDate = new Date(startDate)
    sessionDate.setDate(startDate.getDate() + dayOffset)
    
    // Ensure each advisor gets unique sessions (distribute evenly)
    const advisorIndex = Math.floor(i / Math.ceil(count / advisors.length)) % advisors.length
    const advisor = advisors[advisorIndex]
    const studentCode = studentCodes[Math.floor(Math.random() * studentCodes.length)]
    
    // Always select a session type (ensure it's never empty)
    const sessionTypeIndex = Math.floor(Math.random() * sessionTypes.length)
    const sessionType = sessionTypes[sessionTypeIndex]
    
    const duration = Math.floor(Math.random() * 1050) + 150 // 2.5-20 minutes in seconds (150-1200 seconds)
    
    // Generate realistic session ID (format: OBS-YYYYMMDD-XXX where XXX is sequential)
    const dateStr = sessionDate.toISOString().slice(0, 10).replace(/-/g, '')
    const sessionNumber = String(i + 1).padStart(3, '0')
    const sessionId = `OBS-${dateStr}-${sessionNumber}`

    // Generate random observations with realistic completion rates
    // More varied and realistic completion rates
    let fieldCompletionRate
    
    // Distribute completion rates more realistically
    const random = Math.random()
    if (random < 0.3) {
      // 30% of sessions: High completion (85-95%)
      fieldCompletionRate = 0.85 + Math.random() * 0.1
    } else if (random < 0.6) {
      // 30% of sessions: Medium completion (70-85%)
      fieldCompletionRate = 0.70 + Math.random() * 0.15
    } else if (random < 0.85) {
      // 25% of sessions: Lower completion (50-70%)
      fieldCompletionRate = 0.50 + Math.random() * 0.20
    } else {
      // 15% of sessions: Low completion (30-50%)
      fieldCompletionRate = 0.30 + Math.random() * 0.20
    }
    
    // Enhanced helper function to generate observation field with realistic rating priority and relevant notes
    const generateObservationField = (ratingOptions, fieldName, category) => {
      const hasRating = Math.random() < fieldCompletionRate
      const hasNotes = Math.random() > 0.7 // 30% chance for notes (truly random)
      
      let rating = ''
      let notes = ''
      
      // Generate rating based on completion rate
      if (hasRating) {
        // We have a rating, so select one
        rating = ratingOptions[Math.floor(Math.random() * ratingOptions.length)]
      } else {
        // No rating selected
        rating = ''
      }
      
      // Generate notes independently (not tied to rating)
      if (hasNotes) {
        if (hasRating) {
          // If we have a rating, use category-specific notes
          const categoryNotes = categorySpecificNotes[category]?.[fieldName]
          if (categoryNotes && categoryNotes.length > 0) {
            notes = categoryNotes[Math.floor(Math.random() * categoryNotes.length)]
          } else {
            // Fallback to relevant positive note if no specific notes found
            notes = `Positive observation noted for ${fieldName} in ${category}`
          }
        } else {
          // If no rating, use relevant skip justification
          const relevantJustifications = fieldSkipJustifications.filter(justification => {
            // Filter justifications based on category and field relevance
            if (category === 'advisingProcess' && fieldName === 'aiToolsUsage') {
              return justification.includes('AI') || justification.includes('technical') || justification.includes('system')
            }
            if (category === 'studentEngagement' && fieldName === 'questionsProactive') {
              return justification.includes('student') || justification.includes('engagement') || justification.includes('session')
            }
            if (category === 'aiEnhancedTools') {
              return justification.includes('technical') || justification.includes('system') || justification.includes('AI')
            }
            if (category === 'communicationInteraction') {
              return justification.includes('communication') || justification.includes('session') || justification.includes('student')
            }
            if (category === 'leadershipAlignment') {
              return justification.includes('session') || justification.includes('planning') || justification.includes('institutional')
            }
            return true // Default to all justifications if no specific filter
          })
          
          if (relevantJustifications.length > 0) {
            notes = relevantJustifications[Math.floor(Math.random() * relevantJustifications.length)]
        } else {
          notes = fieldSkipJustifications[Math.floor(Math.random() * fieldSkipJustifications.length)]
          }
        }
      } else {
        // No notes at all
        notes = ''
      }
      
      return { rating, notes }
    }
    
    const observations = {
      advisingProcess: {
        degreeRequirements: generateObservationField(ratingOptions.degreeRequirements, 'degreeRequirements', 'advisingProcess'),
        aiToolsUsage: generateObservationField(ratingOptions.aiToolsUsage, 'aiToolsUsage', 'advisingProcess'),
        referralServices: generateObservationField(ratingOptions.referralServices, 'referralServices', 'advisingProcess')
      },
      studentEngagement: {
        questionsProactive: generateObservationField(ratingOptions.questionsProactive, 'questionsProactive', 'studentEngagement'),
        aiInteraction: generateObservationField(ratingOptions.aiInteraction, 'aiInteraction', 'studentEngagement'),
        understandingAdvice: generateObservationField(ratingOptions.understandingAdvice, 'understandingAdvice', 'studentEngagement')
      },
      aiEnhancedTools: {
        accurateInfo: generateObservationField(ratingOptions.accurateInfo, 'accurateInfo', 'aiEnhancedTools'),
        enhancesEfficiency: generateObservationField(ratingOptions.enhancesEfficiency, 'enhancesEfficiency', 'aiEnhancedTools'),
        technicalIssues: generateObservationField(ratingOptions.technicalIssues, 'technicalIssues', 'aiEnhancedTools')
      },
      communicationInteraction: {
        activeListening: generateObservationField(ratingOptions.activeListening, 'activeListening', 'communicationInteraction'),
        aiOutputIntegration: generateObservationField(ratingOptions.aiOutputIntegration, 'aiOutputIntegration', 'communicationInteraction'),
        studentSatisfaction: generateObservationField(ratingOptions.studentSatisfaction, 'studentSatisfaction', 'communicationInteraction')
      },
      leadershipAlignment: {
        retentionStrategies: generateObservationField(ratingOptions.retentionStrategies, 'retentionStrategies', 'leadershipAlignment'),
        systemsThinking: generateObservationField(ratingOptions.systemsThinking, 'systemsThinking', 'leadershipAlignment')
      }
    }

    // Calculate completion rate with more variation
    let completedFields = 0
    const totalFields = 13
    Object.values(observations).forEach(category => {
      Object.values(category).forEach(field => {
        if (field.rating && field.rating.trim() !== '') {
          completedFields++
        }
      })
    })
    const completionRate = (completedFields / totalFields) * 100

    // Determine session status based on completion rate and random factors
    let sessionStatus = 'completed'
    let lowCompletionJustification = ''
    
    // All sessions will be completed for analytics dashboard visibility
    
    // Add justification for sessions with lower completion rates
    if (completionRate < 70) {
      // Select a random justification for lower completion
      lowCompletionJustification = justifications[Math.floor(Math.random() * justifications.length)]
    }

    // Generate realistic session time (business hours: 9 AM - 6 PM)
    const sessionHour = 9 + Math.floor(Math.random() * 9) // 9 AM to 6 PM (9-17)
    const sessionMinute = Math.floor(Math.random() * 60)
    const sessionTime = new Date(sessionDate)
    sessionTime.setHours(sessionHour, sessionMinute, 0, 0)
    
    const session = {
      id: sessionId,
      status: sessionStatus,
      createdAt: sessionTime.toISOString(),
      completedAt: sessionStatus === 'completed' ? new Date(sessionTime.getTime() + duration * 1000).toISOString() : null,
      completionRate: Math.round(completionRate),
      sessionInfo: {
        date: sessionTime.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit' 
        }),
        time: sessionTime.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }),
        advisor: advisor,
        studentCode: studentCode,
        sessionType: sessionType,
        duration: duration
      },
      observations: observations,
      generalNotes: Math.random() > 0.6 ? getRelevantGeneralNote(sessionType) : '',
      lowCompletionJustification: lowCompletionJustification
    }

    sessions.push(session)
  }

  // Ensure we return exactly the requested count
  if (sessions.length !== count) {
    console.warn(`⚠️ generateSampleSessions: Expected ${count} but generated ${sessions.length}`)
    // If we have too few, generate more
    while (sessions.length < count) {
      const additionalSession = generateSingleSession(sessions.length, advisors, studentCodes, sessionTypes, justifications, fieldSkipJustifications, ratingOptions, categorySpecificNotes)
      sessions.push(additionalSession)
    }
    // If we have too many, trim
    if (sessions.length > count) {
      sessions.splice(count)
    }
    console.log(`✅ Corrected to exactly ${count} sessions`)
  }
  
  return sessions
}

// Helper function to generate a single session
function generateSingleSession(index, advisors, studentCodes, sessionTypes, justifications, fieldSkipJustifications, ratingOptions, categorySpecificNotes) {
  // Generate realistic session date with daily distribution for better trend visualization
  const startDate = new Date('2025-01-01')
  const endDate = new Date('2025-12-31')
  const totalDays = 365
  
  // Distribute sessions more evenly across days with some clustering for realism
  let dayOffset
  if (index < 50 * 0.3) {
    // 30% of sessions: Fall semester (Aug-Oct) - high volume
    dayOffset = Math.floor(Math.random() * 92) + 212 // Days 212-303 (Aug 1 - Oct 31)
  } else if (index < 50 * 0.6) {
    // 30% of sessions: Spring semester (Jan-May) - high volume
    dayOffset = Math.floor(Math.random() * 151) + 0 // Days 0-150 (Jan 1 - May 31)
  } else if (index < 50 * 0.8) {
    // 20% of sessions: Summer months (Jun-Jul) - medium volume
    dayOffset = Math.floor(Math.random() * 61) + 151 // Days 151-211 (Jun 1 - Jul 31)
  } else {
    // 20% of sessions: November-December - medium volume
    dayOffset = Math.floor(Math.random() * 61) + 304 // Days 304-364 (Nov 1 - Dec 31)
  }
  
  // Create the session date
  const sessionDate = new Date(startDate)
  sessionDate.setDate(startDate.getDate() + dayOffset)
  
  // Ensure each advisor gets unique sessions (distribute evenly)
  const advisorIndex = Math.floor(index / Math.ceil(50 / advisors.length)) % advisors.length
  const advisor = advisors[advisorIndex]
  const studentCode = studentCodes[Math.floor(Math.random() * studentCodes.length)]
  
  // Always select a session type (ensure it's never empty)
  const sessionTypeIndex = Math.floor(Math.random() * sessionTypes.length)
  const sessionType = sessionTypes[sessionTypeIndex]
  
  const duration = Math.floor(Math.random() * 1050) + 150 // 2.5-20 minutes in seconds (150-1200 seconds)
  
  // Generate realistic session ID (format: OBS-YYYYMMDD-XXX where XXX is sequential)
  const dateStr = sessionDate.toISOString().slice(0, 10).replace(/-/g, '')
  const sessionNumber = String(index + 1).padStart(3, '0')
  const sessionId = `OBS-${dateStr}-${sessionNumber}`

  // Generate random observations with realistic completion rates
  let fieldCompletionRate
  
  // Distribute completion rates more realistically
  const random = Math.random()
  if (random < 0.3) {
    // 30% of sessions: High completion (85-95%)
    fieldCompletionRate = 0.85 + Math.random() * 0.1
  } else if (random < 0.6) {
    // 30% of sessions: Medium completion (70-85%)
    fieldCompletionRate = 0.70 + Math.random() * 0.15
  } else if (random < 0.85) {
    // 25% of sessions: Lower completion (50-70%)
    fieldCompletionRate = 0.50 + Math.random() * 0.20
  } else {
    // 15% of sessions: Low completion (30-50%)
    fieldCompletionRate = 0.30 + Math.random() * 0.20
  }
  
  // Note: getRelevantGeneralNote function is defined above in the main scope
  
  // Helper function to generate observation field with realistic rating priority
  const generateObservationField = (ratingOptions, fieldName, category) => {
    const hasRating = Math.random() < fieldCompletionRate
    const hasNotes = Math.random() > 0.7 // 30% chance for notes (truly random)
    
    let rating = ''
    let notes = ''
    
    // Generate rating based on completion rate
    if (hasRating) {
      // We have a rating, so select one
      rating = ratingOptions[Math.floor(Math.random() * ratingOptions.length)]
    } else {
      // No rating selected
      rating = ''
    }
    
    // Generate notes independently (not tied to rating)
    if (hasNotes) {
      if (hasRating) {
        // If we have a rating, use category-specific notes
        const categoryNotes = categorySpecificNotes[category]?.[fieldName]
        if (categoryNotes && categoryNotes.length > 0) {
          notes = categoryNotes[Math.floor(Math.random() * categoryNotes.length)]
        } else {
          // Fallback to general positive note if no specific notes found
          notes = 'Positive observation noted for this field'
        }
      } else {
        // If no rating, use skip justification
        notes = fieldSkipJustifications[Math.floor(Math.random() * fieldSkipJustifications.length)]
      }
    } else {
      // No notes at all
      notes = ''
    }
    
    return { rating, notes }
  }
  
  const observations = {
    advisingProcess: {
      degreeRequirements: generateObservationField(ratingOptions.degreeRequirements, 'degreeRequirements', 'advisingProcess'),
      aiToolsUsage: generateObservationField(ratingOptions.aiToolsUsage, 'aiToolsUsage', 'advisingProcess'),
      referralServices: generateObservationField(ratingOptions.referralServices, 'referralServices', 'advisingProcess')
    },
    studentEngagement: {
      questionsProactive: generateObservationField(ratingOptions.questionsProactive, 'questionsProactive', 'studentEngagement'),
      aiInteraction: generateObservationField(ratingOptions.aiInteraction, 'aiInteraction', 'studentEngagement'),
      understandingAdvice: generateObservationField(ratingOptions.understandingAdvice, 'understandingAdvice', 'studentEngagement')
    },
    aiEnhancedTools: {
      accurateInfo: generateObservationField(ratingOptions.accurateInfo, 'accurateInfo', 'aiEnhancedTools'),
      enhancesEfficiency: generateObservationField(ratingOptions.enhancesEfficiency, 'enhancesEfficiency', 'aiEnhancedTools'),
      technicalIssues: generateObservationField(ratingOptions.technicalIssues, 'technicalIssues', 'aiEnhancedTools')
    },
    communicationInteraction: {
      activeListening: generateObservationField(ratingOptions.activeListening, 'activeListening', 'communicationInteraction'),
      aiOutputIntegration: generateObservationField(ratingOptions.aiOutputIntegration, 'aiOutputIntegration', 'communicationInteraction'),
      studentSatisfaction: generateObservationField(ratingOptions.studentSatisfaction, 'studentSatisfaction', 'communicationInteraction')
    },
    leadershipAlignment: {
      retentionStrategies: generateObservationField(ratingOptions.retentionStrategies, 'retentionStrategies', 'leadershipAlignment'),
      systemsThinking: generateObservationField(ratingOptions.systemsThinking, 'systemsThinking', 'leadershipAlignment')
    }
  }

  // Calculate completion rate with more variation
  let completedFields = 0
  const totalFields = 13
  Object.values(observations).forEach(category => {
    Object.values(category).forEach(field => {
      if (field.rating && field.rating.trim() !== '') {
        completedFields++
      }
    })
  })
  const completionRate = (completedFields / totalFields) * 100

  // Determine session status based on completion rate and random factors
  let sessionStatus = 'completed'
  let lowCompletionJustification = ''
  
  // All sessions will be completed for analytics dashboard visibility
  
  // Add justification for sessions with lower completion rates
  if (completionRate < 70) {
    // Select a random justification for lower completion
    lowCompletionJustification = justifications[Math.floor(Math.random() * justifications.length)]
  }

  // Generate realistic session time (business hours: 9 AM - 6 PM)
  const sessionHour = 9 + Math.floor(Math.random() * 9) // 9 AM to 6 PM (9-17)
  const sessionMinute = Math.floor(Math.random() * 60)
  const sessionTime = new Date(sessionDate)
  sessionTime.setHours(sessionHour, sessionMinute, 0, 0)
  
  const session = {
    id: sessionId,
    status: sessionStatus,
    createdAt: sessionTime.toISOString(),
    completedAt: sessionStatus === 'completed' ? new Date(sessionTime.getTime() + duration * 1000).toISOString() : null,
    completionRate: Math.round(completionRate),
    sessionInfo: {
      date: sessionTime.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      }),
      time: sessionTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      advisor: advisor,
      studentCode: studentCode,
      sessionType: sessionType,
      duration: duration
    },
    observations: observations,
    generalNotes: Math.random() > 0.6 ? getRelevantGeneralNote(sessionType) : '',
    lowCompletionJustification: lowCompletionJustification
  }
  
  return session
}

// Function to add sample data to localStorage
export const addSampleDataToStorage = (count = 50) => {
  console.log('=== SAMPLE DATA GENERATION START ===')
  console.log(`Requested count: ${count}`)
  console.log('Clearing existing sample data...')
  clearSampleDataFromStorage()
  
  console.log('Generating sample data...')
  const sampleSessions = generateSampleSessions(count)
  console.log(`Sample sessions generated: ${sampleSessions.length}`)
  
  // Ensure we have the requested count
  if (sampleSessions.length !== count) {
    console.warn(`⚠️ WARNING: Expected ${count} sessions but got ${sampleSessions.length}`)
    console.warn('Regenerating to ensure correct count...')
    const regeneratedSessions = generateSampleSessions(count)
    console.log(`Regenerated sessions: ${regeneratedSessions.length}`)
    if (regeneratedSessions.length === count) {
      sampleSessions.splice(0, sampleSessions.length, ...regeneratedSessions)
      console.log('✅ Successfully regenerated correct count')
    }
  }
  
  // Log session statistics
  const completedSessions = sampleSessions.filter(s => s.status === 'completed').length
  const lowCompletionSessions = sampleSessions.filter(s => s.lowCompletionJustification && s.lowCompletionJustification.trim() !== '').length
  
  console.log(`Session Statistics:
    - Total Sessions: ${sampleSessions.length}
    - Completed Sessions: ${completedSessions}
    - Active Sessions: 0
    - Low Completion: ${lowCompletionSessions}`)
  
  sampleSessions.forEach(session => {
    const key = `session_${session.id}`
    localStorage.setItem(key, JSON.stringify(session))
    console.log(`Stored session: ${key} (${session.status})`)
  })
  
  // Verify storage
  const storedSessions = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith('session_')) {
      storedSessions.push(key)
    }
  }
  console.log(`Verification: ${storedSessions.length} sessions found in localStorage after storage`)
  
  // Final verification - ensure we have exactly the requested count
  if (storedSessions.length !== count) {
    console.error(`❌ CRITICAL ERROR: Expected ${count} sessions but only ${storedSessions.length} found in localStorage`)
    console.error('Attempting emergency regeneration...')
    
    // Clear and regenerate
    clearSampleDataFromStorage()
    const emergencySessions = generateSampleSessions(count)
    emergencySessions.forEach(session => {
      const key = `session_${session.id}`
      localStorage.setItem(key, JSON.stringify(session))
    })
    
    // Final check
    const finalStoredSessions = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('session_')) {
        finalStoredSessions.push(key)
      }
    }
    console.log(`Emergency regeneration result: ${finalStoredSessions.length} sessions`)
  } else {
    console.log(`✅ SUCCESS: Exactly ${count} sessions stored and verified`)
  }
  
  // Update last session ID (extract number from OBS-YYYYMMDD-XXX format)
  const maxId = Math.max(...sampleSessions.map(s => {
    const parts = s.id.split('-')
    return parseInt(parts[parts.length - 1]) || 0
  }))
  localStorage.setItem('lastSessionId', maxId.toString())
  
  console.log('Sample data generation complete. Total sessions in localStorage:', localStorage.length)
  
  // Verify session status distribution
  const completedCount = sampleSessions.filter(s => s.status === 'completed').length
  console.log(`Session Status Distribution: ${completedCount} completed, 0 active`)
  console.log('=== SAMPLE DATA GENERATION END ===')
  
  // Force page refresh to ensure analytics dashboard picks up new data
  setTimeout(() => {
    console.log('Refreshing page to update analytics dashboard...')
    window.location.reload()
  }, 1000)
  
  return sampleSessions
}

// Function to clear sample data from localStorage
export const clearSampleDataFromStorage = () => {
  const keysToRemove = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith('session_')) {
      keysToRemove.push(key)
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key))
  console.log(`Cleared ${keysToRemove.length} existing session keys`)
}
