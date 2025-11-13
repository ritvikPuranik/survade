import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button, Card, H1, Text, TextSmall } from '../components/ui'
import { scaleInVariants } from '../lib/animations'

export function LoginPage() {
  const { signInWithGoogle, user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  // If already logged in, redirect to surveys
  if (user) {
    navigate('/surveys')
    return null
  }

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      setError(null)
      const { error } = await signInWithGoogle()

      if (error) {
        setError(error.message)
        setLoading(false)
      }
      // User will be redirected to Google, no need to handle success here
    } catch (err) {
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="page-gradient min-h-screen flex items-center justify-center p-4">
      <motion.div
        variants={scaleInVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <Card variant="gradient" padding="lg" className="backdrop-blur-sm bg-gradient-to-br from-white/90 via-blue-50/50 to-white/90 shadow-strong border border-white/50">
          <div className="text-center mb-8">
            <H1 className="text-4xl mb-2">Survade</H1>
            <Text>Sign in to continue</Text>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 border-2 border-gray-200 rounded-lg shadow-soft bg-white hover:bg-gray-50 hover:shadow-elevated hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-gray-700 font-medium">
                {loading ? 'Signing in...' : 'Continue with Google'}
              </span>
            </button>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <TextSmall className="text-red-600">{error}</TextSmall>
              </motion.div>
            )}
          </div>

          <TextSmall className="text-center text-gray-500 mt-8">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </TextSmall>
        </Card>
      </motion.div>
    </div>
  )
}
