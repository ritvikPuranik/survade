import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { Question, SurveyFormData } from '../types/survey'
import { SurveyOverview } from '../components/survey-builder/SurveyOverview'
import { QuestionCard } from '../components/survey-builder/QuestionCard'
import { AddQuestionButton } from '../components/survey-builder/AddQuestionButton'

export function CreateSurveyPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [survey, setSurvey] = useState<SurveyFormData>({
    title: '',
    description: '',
    objective: '',
    questions: [
      {
        id: crypto.randomUUID(),
        text: '',
        type: 'multiple_choice',
        options: ['Option 1', 'Option 2'],
        required: true,
        order: 0,
      },
    ],
  })

  const addQuestion = () => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      text: '',
      type: 'multiple_choice',
      options: ['Option 1', 'Option 2'],
      required: true,
      order: survey.questions.length,
    }
    setSurvey({
      ...survey,
      questions: [...survey.questions, newQuestion],
    })
  }

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setSurvey({
      ...survey,
      questions: survey.questions.map((q) =>
        q.id === id ? { ...q, ...updates } : q
      ),
    })
  }

  const deleteQuestion = (id: string) => {
    if (survey.questions.length > 1) {
      setSurvey({
        ...survey,
        questions: survey.questions.filter((q) => q.id !== id),
      })
    }
  }

  const duplicateQuestion = (id: string) => {
    const questionToDuplicate = survey.questions.find((q) => q.id === id)
    if (questionToDuplicate) {
      const duplicated: Question = {
        ...questionToDuplicate,
        id: crypto.randomUUID(),
        order: survey.questions.length,
      }
      setSurvey({
        ...survey,
        questions: [...survey.questions, duplicated],
      })
    }
  }

  const validateForm = (): string | null => {
    if (!survey.title.trim()) {
      return 'Survey title is required'
    }

    if (survey.questions.length === 0) {
      return 'At least one question is required'
    }

    for (const question of survey.questions) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      alert(validationError)
      return
    }

    setLoading(true)

    try {
      const response = await api.createSurvey({
        title: survey.title,
        description: survey.description,
        objective: survey.objective,
        questions: survey.questions.map(({ id, order, ...rest }) => rest),
      })

      if (response.success) {
        navigate(`/surveys/${response.data.id}/review`)
      } else {
        alert('Failed to create survey. Please try again.')
      }
    } catch (error) {
      console.error('Failed to create survey:', error)
      alert('Failed to create survey. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-gradient min-h-screen">
      {/* Header */}
      <header className="page-header">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Create New Survey</h1>
          <button
            type="button"
            onClick={() => navigate('/surveys')}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Survey Overview Section */}
          <SurveyOverview
            title={survey.title}
            description={survey.description}
            objective={survey.objective}
            onTitleChange={(title) => setSurvey({ ...survey, title })}
            onDescriptionChange={(description) =>
              setSurvey({ ...survey, description })
            }
            onObjectiveChange={(objective) => setSurvey({ ...survey, objective })}
          />

          {/* Questions Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Questions</h2>

            {survey.questions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                questionNumber={index + 1}
                onUpdate={(updates) => updateQuestion(question.id, updates)}
                onDelete={() => deleteQuestion(question.id)}
                onDuplicate={() => duplicateQuestion(question.id)}
              />
            ))}

            <AddQuestionButton onClick={addQuestion} />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/surveys')}
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 border border-transparent rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {loading ? 'Submitting...' : 'Submit for Review'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
