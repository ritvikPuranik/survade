export type QuestionType = 'multiple_choice' | 'descriptive' | 'yes_no'

export interface Question {
  id: string
  text: string
  type: QuestionType
  options?: string[] // For multiple_choice type
  required: boolean
  order: number
}

export interface SurveyFormData {
  title: string
  description: string
  objective: string
  questions: Question[]
}

export interface CreateSurveyRequest {
  title: string
  description?: string
  objective?: string
  questions: Omit<Question, 'id' | 'order'>[]
}

export interface UpdateSurveyRequest {
  title: string
  description?: string
  objective?: string
  questions: Omit<Question, 'id' | 'order'>[]
}

export type RefinementType = 'added' | 'modified' | 'removed' | 'reordered'

export interface QuestionRefinement {
  type: RefinementType
  reasoning: string
  originalText?: string
  originalIndex?: number
}

export interface RefinedQuestion extends Question {
  refinement?: QuestionRefinement
}

export interface RefinedSurvey {
  id: string
  title: string
  description: string
  objective: string
  status: string
  questions: RefinedQuestion[]
  original_questions?: Question[]
  is_refined: boolean
  created_at: string
  updated_at?: string
}
