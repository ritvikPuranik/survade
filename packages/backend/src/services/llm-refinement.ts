/**
 * Mock LLM Refinement Service
 * Simulates AI-powered survey refinement with reasoning
 */

interface Question {
  text: string
  type: string
  options?: string[]
  required: boolean
}

interface QuestionRefinement {
  type: 'added' | 'modified' | 'removed' | 'reordered'
  reasoning: string
  originalText?: string
  originalIndex?: number
}

interface RefinedQuestion extends Question {
  refinement?: QuestionRefinement
}

interface SurveyRefinementInput {
  title: string
  description?: string
  objective?: string
  questions: Question[]
}

interface SurveyRefinementOutput {
  title: string
  description: string
  objective: string
  questions: RefinedQuestion[]
  original_questions: Question[]
  is_refined: boolean
}

/**
 * Mock LLM refinement function
 * In production, this would call an actual LLM API (OpenAI, Claude, etc.)
 */
export function refineSurveyWithLLM(input: SurveyRefinementInput): SurveyRefinementOutput {
  const { title, description = '', objective = '', questions } = input

  // Store original questions
  const original_questions = JSON.parse(JSON.stringify(questions))

  // Refined questions array
  const refinedQuestions: RefinedQuestion[] = []

  // Rule 1: Improve question clarity and specificity
  questions.forEach((q, index) => {
    if (q.type === 'descriptive' && q.text.length < 50) {
      // Add more context to short descriptive questions
      refinedQuestions.push({
        ...q,
        text: improveQuestionClarity(q.text),
        refinement: {
          type: 'modified',
          reasoning: 'Added more context and specificity to increase response quality and completion rate',
          originalText: q.text,
          originalIndex: index
        }
      })
    } else if (q.type === 'multiple_choice' && q.options && q.options.length > 6) {
      // Reduce excessive options
      refinedQuestions.push({
        ...q,
        options: q.options.slice(0, 5).concat(['Other (please specify)']),
        refinement: {
          type: 'modified',
          reasoning: 'Reduced number of options to prevent survey fatigue. Research shows 4-6 options yield better completion rates',
          originalText: q.text,
          originalIndex: index
        }
      })
    } else if (q.type === 'yes_no' && isComplexQuestion(q.text)) {
      // Convert complex yes/no to multiple choice
      refinedQuestions.push({
        text: q.text,
        type: 'multiple_choice',
        options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'],
        required: q.required,
        refinement: {
          type: 'modified',
          reasoning: 'Changed to Likert scale to capture nuanced responses instead of binary yes/no',
          originalText: q.text,
          originalIndex: index
        }
      })
    } else {
      // Keep question as is
      refinedQuestions.push({ ...q })
    }
  })

  // Rule 2: Optimal question ordering (easy -> specific -> demographic)
  const reorderedQuestions = optimizeQuestionOrder(refinedQuestions)

  // Rule 3: Add demographic questions if missing
  const hasAgeQuestion = reorderedQuestions.some(q =>
    q.text.toLowerCase().includes('age') || q.text.toLowerCase().includes('old')
  )

  if (!hasAgeQuestion && reorderedQuestions.length < 10) {
    reorderedQuestions.push({
      text: 'What is your age range?',
      type: 'multiple_choice',
      options: ['Under 18', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
      required: false,
      refinement: {
        type: 'added',
        reasoning: 'Added demographic question to enable better data segmentation and analysis'
      }
    })
  }

  // Rule 4: Ensure not too many required questions
  const requiredCount = reorderedQuestions.filter(q => q.required).length
  if (requiredCount / reorderedQuestions.length > 0.7) {
    // Make some questions optional
    reorderedQuestions.forEach((q, idx) => {
      if (idx > 2 && q.required && idx < reorderedQuestions.length - 1) {
        q.required = false
        if (!q.refinement) {
          q.refinement = {
            type: 'modified',
            reasoning: 'Made optional to reduce survey abandonment. Too many required fields can deter completion'
          }
        }
      }
    })
  }

  // Refine title and description if needed
  const refinedTitle = title.trim() || 'Untitled Survey'
  const refinedDescription = description.trim() || 'Please take a moment to complete this survey. Your feedback is valuable to us.'
  const refinedObjective = objective.trim() || 'To gather insights and improve our understanding'

  return {
    title: refinedTitle,
    description: refinedDescription,
    objective: refinedObjective,
    questions: reorderedQuestions,
    original_questions,
    is_refined: true
  }
}

/**
 * Helper: Improve question clarity
 */
function improveQuestionClarity(text: string): string {
  const lowercaseText = text.toLowerCase()

  if (lowercaseText.includes('feedback') && text.length < 30) {
    return `${text} Please provide specific details about what worked well and what could be improved.`
  }

  if (lowercaseText.includes('experience') && text.length < 35) {
    return `${text} Please describe your experience in detail, including both positive and negative aspects.`
  }

  if (lowercaseText.includes('opinion') || lowercaseText.includes('think')) {
    return `${text} Please share your honest thoughts and reasoning.`
  }

  return text
}

/**
 * Helper: Check if question is too complex for yes/no
 */
function isComplexQuestion(text: string): boolean {
  const complexIndicators = [
    'how much',
    'to what extent',
    'level',
    'degree',
    'satisfaction',
    'agreement',
    'frequency'
  ]

  return complexIndicators.some(indicator =>
    text.toLowerCase().includes(indicator)
  )
}

/**
 * Helper: Optimize question order
 * Best practice: Easy questions first, specific in middle, demographic at end
 */
function optimizeQuestionOrder(questions: RefinedQuestion[]): RefinedQuestion[] {
  const categorized = {
    easy: [] as RefinedQuestion[],
    specific: [] as RefinedQuestion[],
    demographic: [] as RefinedQuestion[],
    descriptive: [] as RefinedQuestion[]
  }

  questions.forEach(q => {
    const text = q.text.toLowerCase()

    // Demographic questions
    if (text.includes('age') || text.includes('gender') || text.includes('location') ||
        text.includes('income') || text.includes('education') || text.includes('occupation')) {
      categorized.demographic.push(q)
    }
    // Easy yes/no or simple multiple choice
    else if (q.type === 'yes_no' || (q.type === 'multiple_choice' && q.options && q.options.length <= 4)) {
      categorized.easy.push(q)
    }
    // Descriptive (hardest, put later)
    else if (q.type === 'descriptive') {
      categorized.descriptive.push(q)
    }
    // Specific multiple choice
    else {
      categorized.specific.push(q)
    }
  })

  // Order: easy -> specific -> descriptive -> demographic
  const orderedQuestions = [
    ...categorized.easy,
    ...categorized.specific,
    ...categorized.descriptive,
    ...categorized.demographic
  ]

  // Add reordering refinement if order changed significantly
  orderedQuestions.forEach((q, newIndex) => {
    const originalIndex = questions.findIndex(orig => orig.text === q.text)
    if (Math.abs(originalIndex - newIndex) > 2 && !q.refinement) {
      q.refinement = {
        type: 'reordered',
        reasoning: 'Reordered to follow best practices: easy questions first to build momentum, demographic questions at the end',
        originalIndex
      }
    }
  })

  return orderedQuestions
}
