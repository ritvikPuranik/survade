import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { api } from '../lib/api'

interface Survey {
  id: string
  title: string
  description: string
  status: string
  created_at: string
}

export function SurveysPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSurveys()
  }, [])

  const fetchSurveys = async () => {
    try {
      const response = await api.getSurveys()
      if (response.success) {
        setSurveys(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch surveys:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Survade</h1>
            <p className="text-sm text-gray-600">Welcome back, {user?.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Your Surveys
            </h2>
            <p className="text-gray-600">
              Create and manage your surveys
            </p>
          </div>

          {/* New Survey Button */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/surveys/new')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Survey
            </button>
          </div>

          {/* Surveys List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading surveys...</p>
            </div>
          ) : surveys.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No surveys yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first survey
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {surveys.map((survey) => (
                <div
                  key={survey.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/surveys/${survey.id}`)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {survey.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        survey.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {survey.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    {survey.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    Created: {new Date(survey.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Analytics Section */}
          <div className="mt-8 border-t pt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Analytics
            </h3>
            <p className="text-sm text-gray-600">
              Analytics dashboard coming soon...
            </p>
          </div>

          {/* User Info Card */}
          <div className="mt-8 border-t pt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Account Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Email:</span>
                <span className="text-sm font-medium text-gray-900">
                  {user?.email}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">User ID:</span>
                <span className="text-sm font-mono text-gray-900">
                  {user?.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Provider:</span>
                <span className="text-sm font-medium text-gray-900">
                  {user?.app_metadata.provider || 'Google'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
