import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Plus, Edit2, X, MoveVertical } from 'lucide-react'
import { QuestionRefinement } from '../../types/survey'

interface RefinementBadgeProps {
  refinement: QuestionRefinement
}

export function RefinementBadge({ refinement }: RefinementBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  const { type, reasoning, originalText } = refinement

  // Color and icon based on refinement type
  const getTypeConfig = () => {
    switch (type) {
      case 'added':
        return {
          color: 'bg-green-100 text-green-700 border-green-300',
          icon: <Plus className="w-3 h-3" />,
          label: 'Added',
        }
      case 'modified':
        return {
          color: 'bg-blue-100 text-blue-700 border-blue-300',
          icon: <Edit2 className="w-3 h-3" />,
          label: 'Modified',
        }
      case 'removed':
        return {
          color: 'bg-red-100 text-red-700 border-red-300',
          icon: <X className="w-3 h-3" />,
          label: 'Removed',
        }
      case 'reordered':
        return {
          color: 'bg-purple-100 text-purple-700 border-purple-300',
          icon: <MoveVertical className="w-3 h-3" />,
          label: 'Reordered',
        }
      default:
        return {
          color: 'bg-gray-100 text-gray-700 border-gray-300',
          icon: <Sparkles className="w-3 h-3" />,
          label: 'Modified',
        }
    }
  }

  const config = getTypeConfig()

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${config.color} hover:shadow-md transition-all duration-200 cursor-help`}
      >
        <Sparkles className="w-3 h-3" />
        {config.icon}
        <span>{config.label} by AI</span>
      </button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 left-0 bottom-full mb-2 w-80"
          >
            <div className="bg-gray-900 text-white text-sm rounded-lg p-4 shadow-strong">
              {/* Arrow pointing down */}
              <div className="absolute -bottom-2 left-4 w-4 h-4 bg-gray-900 transform rotate-45"></div>

              <div className="relative">
                <div className="flex items-start gap-2 mb-2">
                  <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0 text-yellow-300" />
                  <p className="font-semibold">AI Refinement</p>
                </div>

                <p className="text-gray-300 mb-3 leading-relaxed">{reasoning}</p>

                {originalText && (
                  <div className="pt-3 border-t border-gray-700">
                    <p className="text-xs text-gray-400 mb-1">Original question:</p>
                    <p className="text-gray-300 italic">"{originalText}"</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
