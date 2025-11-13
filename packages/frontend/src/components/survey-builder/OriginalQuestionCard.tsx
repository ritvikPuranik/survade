import { Question } from '../../types/survey'
import { Card, TextSmall } from '../ui'

interface OriginalQuestionCardProps {
  question: Question
  questionNumber: number
}

export function OriginalQuestionCard({ question, questionNumber }: OriginalQuestionCardProps) {
  return (
    <Card variant="flat" padding="md" className="opacity-70 border-2 border-gray-300">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center font-semibold text-sm">
          {questionNumber}
        </div>

        <div className="flex-1">
          {/* Header with "Original" label */}
          <div className="flex items-center gap-2 mb-2">
            <TextSmall className="text-gray-500 font-semibold uppercase tracking-wide">
              Original Version
            </TextSmall>
          </div>

          {/* Question Text */}
          <p className="text-lg font-medium text-gray-700 mb-2">
            {question.text}
            {question.required && (
              <span className="text-red-400 ml-1">*</span>
            )}
          </p>

          {/* Question Type */}
          <TextSmall className="text-gray-500 mb-3">
            Type: {question.type.replace('_', ' ')}
          </TextSmall>

          {/* Question Type Specific Content */}
          <div>
            {question.type === 'multiple_choice' && question.options && (
              <div className="space-y-2">
                {question.options.map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-gray-400"></div>
                    <span className="text-gray-600">{option}</span>
                  </div>
                ))}
              </div>
            )}

            {question.type === 'descriptive' && (
              <div className="p-4 bg-gray-100 rounded border border-gray-300">
                <TextSmall className="italic text-gray-500">
                  Long answer text area
                </TextSmall>
              </div>
            )}

            {question.type === 'yes_no' && (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-400"></div>
                  <span className="text-gray-600">Yes</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-400"></div>
                  <span className="text-gray-600">No</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
