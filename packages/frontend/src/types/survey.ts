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
