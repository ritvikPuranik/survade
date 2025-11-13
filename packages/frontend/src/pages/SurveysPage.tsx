import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, LogOut, User, ChevronDown, FileText } from 'lucide-react'
import { api } from '../lib/api'
import { Button, Card, Badge, EmptyState, Spinner, H2, Text, TextSmall } from '../components/ui'
import { PageContainer } from '../components/layout'
import { dropdownVariants, listContainerVariants, listItemVariants } from '../lib/animations'

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Helper function to get user's first name
  const getFirstName = () => {
    const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name
    if (fullName) {
      return fullName.split(' ')[0]
    }
    return user?.email?.split('@')[0] || 'there'
  }

  // Helper function to get profile photo
  const getProfilePhoto = () => {
    return user?.user_metadata?.avatar_url || user?.user_metadata?.picture
  }

  useEffect(() => {
    fetchSurveys()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchSurveys = async () => {
    try {
      const response = await api.getSurveys()
      if (response.success) {
        // Ensure data is an array
        const surveysData = Array.isArray(response.data) ? response.data : []
        setSurveys(surveysData)
      }
    } catch (error) {
      console.error('Failed to fetch surveys:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    setIsDropdownOpen(false)
    await signOut()
    navigate('/login')
  }

  return (
    <div className="page-gradient">
      {/* Header */}
      <header className="page-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <H2 className="text-2xl">Survade</H2>
            <TextSmall className="mt-1">Welcome back, {getFirstName()}!</TextSmall>
          </div>

          {/* Account Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-2 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:shadow-soft transition-all duration-200"
            >
              {getProfilePhoto() ? (
                <img
                  src={getProfilePhoto()}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold text-sm">
                    {getFirstName().charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-elevated border border-gray-100 py-2 z-10 overflow-hidden"
                >
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false)
                      setIsModalOpen(true)
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Account Info
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <PageContainer>
        <Card variant="gradient" padding="lg" className="backdrop-blur-sm bg-gradient-to-br from-white/90 via-blue-50/50 to-white/90 shadow-soft border border-white/50">
          <div className="text-center mb-8">
            <H2 className="text-3xl mb-2">Your Surveys</H2>
            <Text>Create and manage your surveys</Text>
          </div>

          {/* New Survey Button */}
          <div className="mb-8">
            <Button
              variant="primary"
              onClick={() => navigate('/surveys/new')}
              icon={<Plus className="w-5 h-5" />}
            >
              New Survey
            </Button>
          </div>

          {/* Surveys List */}
          {loading ? (
            <div className="text-center py-12">
              <Spinner size="lg" className="mx-auto mb-4" />
              <Text>Loading surveys...</Text>
            </div>
          ) : surveys.length === 0 ? (
            <EmptyState
              icon={<FileText className="w-24 h-24 text-gray-300 stroke-[1.5]" />}
              title="No activity yet"
              description="Get started by creating your first survey"
              action={
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/surveys/new')}
                  icon={<Plus className="w-5 h-5" />}
                >
                  Create Your First Survey
                </Button>
              }
            />
          ) : (
            <motion.div
              variants={listContainerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {surveys.map((survey) => (
                <motion.div key={survey.id} variants={listItemVariants}>
                  <Card
                    variant="interactive"
                    padding="md"
                    onClick={() => navigate(`/surveys/${survey.id}`)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {survey.title}
                      </h3>
                      <Badge
                        variant={survey.status === 'active' ? 'success' : 'warning'}
                      >
                        {survey.status}
                      </Badge>
                    </div>
                    <TextSmall className="mb-4 line-clamp-2">
                      {survey.description}
                    </TextSmall>
                    <TextSmall className="text-gray-400">
                      Created: {new Date(survey.created_at).toLocaleDateString()}
                    </TextSmall>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Analytics Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics</h3>
            <TextSmall>Analytics dashboard coming soon...</TextSmall>
          </div>
        </Card>
      </PageContainer>

      {/* Account Info Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-strong max-w-md w-full mx-4"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Account Information</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Profile Photo and Name */}
              <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                {getProfilePhoto() ? (
                  <img
                    src={getProfilePhoto()}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-bold text-2xl">
                      {getFirstName().charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {user?.user_metadata?.full_name || user?.user_metadata?.name || 'User'}
                  </h3>
                  <TextSmall>{user?.email}</TextSmall>
                  <TextSmall>
                    Joined on {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                  </TextSmall>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-6 border-t border-gray-100">
              <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
