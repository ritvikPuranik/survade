import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { api } from '../lib/api'
import { RefinedSurvey, RefinedQuestion, Question } from '../types/survey'
import { SurveyOverview } from '../components/survey-builder/SurveyOverview'
import { QuestionCard } from '../components/survey-builder/QuestionCard'
import { AddQuestionButton } from '../components/survey-builder/AddQuestionButton'
import { RefinementBadge } from '../components/survey-builder/RefinementBadge'
import { ComparisonToggle } from '../components/survey-builder/ComparisonToggle'
import { OriginalQuestionCard } from '../components/survey-builder/OriginalQuestionCard'

export function ReviewSurveyPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Survey data from API
  const [survey, setSurvey] = useState<RefinedSurvey | null>(null)

  // Editable form state (local changes)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [objective, setObjective] = useState('')
  const [questions, setQuestions] = useState<RefinedQuestion[]>([])

  // UI state
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)
  const [showComparison, setShowComparison] = useState(false)

  useEffect(() => {
    if (id) {
      fetchSurvey()
    }
  }, [id])

  const fetchSurvey = async () => {
    try {
      const response = await api.getSurveyForReview(id!)
      if (response.success) {
        const surveyData: RefinedSurvey = response.data
        setSurvey(surveyData)

        // Initialize editable state
        setTitle(surveyData.title)
        setDescription(surveyData.description)
        setObjective(surveyData.objective)
        setQuestions(surveyData.questions.map((q, idx) => ({
          ...q,
          id: q.id || crypto.randomUUID(),
          order: idx,
        })))
      }
    } catch (error) {
      console.error('Failed to fetch survey:', error)
    } finally {
      setLoading(false)
    }
  }

  // CRUD operations for questions
  const addQuestion = () => {
    const newQuestion: RefinedQuestion = {
      id: crypto.randomUUID(),
      text: '',
      type: 'multiple_choice',
      options: ['Option 1', 'Option 2'],
      required: true,
      order: questions.length,
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (id: string, updates: Partial<RefinedQuestion>) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, ...updates } : q))
    )
  }

  const deleteQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id))
    }
  }

  const duplicateQuestion = (id: string) => {
    const questionToDuplicate = questions.find((q) => q.id === id)
    if (questionToDuplicate) {
      const duplicated: RefinedQuestion = {
        ...questionToDuplicate,
        id: crypto.randomUUID(),
        order: questions.length,
        refinement: undefined, // Remove refinement badge from duplicated question
      }
      setQuestions([...questions, duplicated])
    }
  }

  // Validation
  const validateForm = (): string | null => {
    if (!title.trim()) {
      return 'Survey title is required'
    }

    if (questions.length === 0) {
      return 'At least one question is required'
    }

    for (const question of questions) {
      if (!question.text.trim()) {
        return 'All questions must have text'
      }

      if (question.type === 'multiple_choice') {
        if (!question.options || question.options.length < 2) {
          return 'Multiple choice questions must have at least 2 options'
        }
        if (question.options.some((opt) => !opt.trim())) {
          return 'All options must have text'
        }
      }
    }

    return null
  }

  // Handle publish (saves + publishes)
  const handlePublish = async () => {
    if (!id) return

    const validationError = validateForm()
    if (validationError) {
      alert(validationError)
      return
    }

    setPublishing(true)
    try {
      // First update the survey with current changes
      await api.updateSurvey(id, {
        title,
        description,
        objective,
        questions: questions.map(({ id, order, refinement, ...rest }) => rest),
      })

      // Then publish it
      const response = await api.publishSurvey(id)
      if (response.success) {
        alert('Survey published successfully!')
        navigate('/surveys')
      }
    } catch (error) {
      console.error('Failed to publish survey:', error)
      alert('Failed to publish survey. Please try again.')
    } finally {
      setPublishing(false)
    }
  }

  // Handle discard
  const handleDiscard = () => {
    if (survey) {
      setTitle(survey.title)
      setDescription(survey.description)
      setObjective(survey.objective)
      setQuestions(survey.questions.map((q, idx) => ({
        ...q,
        id: q.id || crypto.randomUUID(),
        order: idx,
      })))
    }
  }

  // Find original question for comparison
  const findOriginalQuestion = (currentIndex: number): Question | undefined => {
    if (!survey?.original_questions) return undefined

    const currentQuestion = questions[currentIndex]
    if (!currentQuestion.refinement?.originalIndex) return undefined

    return survey.original_questions[currentQuestion.refinement.originalIndex]
  }

  if (loading) {
    return (
      <div className="page-gradient min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-primary spinner-lg mx-auto mb-4"></div>
          <p className="text-gray-600">Loading survey...</p>
        </div>
      </div>
    )
  }

  if (!survey) {
    return (
      <div className="page-gradient min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Survey not found
          </h2>
          <button
            onClick={() => navigate('/surveys')}
            className="text-indigo-600 hover:text-indigo-700"
          >
            Back to Surveys
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-gradient min-h-screen">
      {/* Header */}
      <header className="page-header">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Review & Refine Survey</h1>
              {survey.is_refined && (
                <div className="flex items-center gap-2 mt-1">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm text-indigo-600 font-medium">AI-Enhanced</span>
                </div>
              )}
            </div>
            <span className="px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded">
              {survey.status}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form className="space-y-6">
          {/* Comparison Toggle */}
          {survey.is_refined && survey.original_questions && (
            <div className="flex justify-end">
              <ComparisonToggle
                showComparison={showComparison}
                onToggle={() => setShowComparison(!showComparison)}
              />
            </div>
          )}

          {/* Survey Overview Section */}
          <SurveyOverview
            title={title}
            description={description}
            objective={objective}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onObjectiveChange={setObjective}
          />

          {/* Questions Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Questions</h2>

            {questions.map((question, index) => (
              <div key={question.id} className="space-y-3">
                {/* Refined Question Card with Badge */}
                <div className="space-y-2">
                  <QuestionCard
                    question={question}
                    questionNumber={index + 1}
                    onUpdate={(updates) => updateQuestion(question.id, updates)}
                    onDelete={() => deleteQuestion(question.id)}
                    onDuplicate={() => duplicateQuestion(question.id)}
                  />

                  {/* Refinement Badge (if refined) */}
                  {question.refinement && (
                    <div className="ml-11">
                      <RefinementBadge refinement={question.refinement} />
                    </div>
                  )}
                </div>

                {/* Original Question (if comparison mode is on) */}
                {showComparison && findOriginalQuestion(index) && (
                  <div className="ml-11">
                    <OriginalQuestionCard
                      question={findOriginalQuestion(index)!}
                      questionNumber={index + 1}
                    />
                  </div>
                )}
              </div>
            ))}

            <AddQuestionButton onClick={addQuestion} />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={handleDiscard}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Discard Changes
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={publishing}
              className="flex-1 px-4 py-2 border border-transparent rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {publishing ? 'Publishing...' : 'Publish Survey'}
            </button>
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-green-50/80 backdrop-blur-sm border border-green-200/50 rounded-xl p-4">
            <div className="flex">
              <svg
                className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-green-700">
                Publishing this survey will make it active and available for responses.
                Changes will be saved automatically when you publish.
              </p>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
