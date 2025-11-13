import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../lib/api'

interface Survey {
  id: string
  title: string
  description: string
  objective?: string
  status: string
  questions?: Array<{
    text: string
    type: string
    options?: string[]
    required: boolean
  }>
}

export function ReviewSurveyPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [survey, setSurvey] = useState<Survey | null>(null)
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)

  useEffect(() => {
    if (id) {
      fetchSurvey()
    }
  }, [id])

  const fetchSurvey = async () => {
    try {
      const response = await api.getSurveyForReview(id!)
      if (response.success) {
        setSurvey(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch survey:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async () => {
    if (!id) return

    setPublishing(true)
    try {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading survey...</p>
        </div>
      </div>
    )
  }

  if (!survey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Review Survey</h1>
            <span className="px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded">
              {survey.status}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Survey Preview */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {survey.title}
            </h2>
            {survey.description && (
              <p className="text-gray-600 mb-2">{survey.description}</p>
            )}
            {survey.objective && (
              <p className="text-sm text-gray-500 italic mb-6">
                Objective: {survey.objective}
              </p>
            )}

            {/* Questions Preview */}
            {survey.questions && survey.questions.length > 0 && (
              <div className="space-y-6 mt-8">
                <h3 className="text-xl font-semibold text-gray-900">
                  Questions
                </h3>
                {survey.questions.map((question, index) => (
                  <div
                    key={index}
                    className="p-6 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-lg">
                          {question.text}
                          {question.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Type: {question.type.replace('_', ' ')}
                        </p>
                      </div>
                    </div>

                    {/* Display question options based on type */}
                    <div className="ml-11">
                      {question.type === 'multiple_choice' && question.options && (
                        <div className="space-y-2">
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center gap-3">
                              <div className="w-5 h-5 rounded-full border-2 border-gray-400"></div>
                              <span className="text-gray-700">{option}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {question.type === 'descriptive' && (
                        <div className="p-4 bg-white rounded border border-gray-300">
                          <p className="text-sm text-gray-400 italic">
                            Long answer text area
                          </p>
                        </div>
                      )}

                      {question.type === 'yes_no' && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full border-2 border-gray-400"></div>
                            <span className="text-gray-700">Yes</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full border-2 border-gray-400"></div>
                            <span className="text-gray-700">No</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              onClick={() => navigate('/surveys/new')}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Back to Edit
            </button>
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="flex-1 px-4 py-2 border border-transparent rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {publishing ? 'Publishing...' : 'Publish Survey'}
            </button>
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <svg
                className="h-5 w-5 text-green-400 mr-2"
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
                Publishing this survey will make it active and available for
                responses. You can always edit or archive it later.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
