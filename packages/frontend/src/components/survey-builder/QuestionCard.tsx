import { Question, QuestionType } from '../../types/survey'
import { MCQOptions } from './MCQOptions'

interface QuestionCardProps {
  question: Question
  questionNumber: number
  onUpdate: (updates: Partial<Question>) => void
  onDelete: () => void
  onDuplicate: () => void
}

export function QuestionCard({
  question,
  questionNumber,
  onUpdate,
  onDelete,
  onDuplicate,
}: QuestionCardProps) {
  const questionTypes: { value: QuestionType; label: string }[] = [
    { value: 'multiple_choice', label: 'Multiple Choice' },
    { value: 'descriptive', label: 'Descriptive Answer' },
    { value: 'yes_no', label: 'Yes / No' },
  ]

  const handleTypeChange = (newType: QuestionType) => {
    const updates: Partial<Question> = { type: newType }

    // Initialize options for MCQ
    if (newType === 'multiple_choice' && !question.options) {
      updates.options = ['Option 1', 'Option 2']
    } else if (newType !== 'multiple_choice') {
      updates.options = undefined
    }

    onUpdate(updates)
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 space-y-4">
      {/* Header with Drag Handle and Question Number */}
      <div className="flex items-start gap-3">
        {/* Drag Handle (visual only for now) */}
        <div className="flex-shrink-0 text-gray-400 cursor-move mt-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
          </svg>
        </div>

        <div className="flex-1 space-y-4">
          {/* Question Text Input */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-sm">
              {questionNumber}
            </div>
            <input
              type="text"
              value={question.text}
              onChange={(e) => onUpdate({ text: e.target.value })}
              placeholder="Enter your question"
              className="flex-1 text-lg font-medium px-4 py-2 border-b-2 border-gray-300 focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Question Type Selector */}
          <div className="flex items-center gap-4 pl-12">
            <select
              value={question.type}
              onChange={(e) => handleTypeChange(e.target.value as QuestionType)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            >
              {questionTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Question Type Specific Content */}
          <div className="pl-12">
            {question.type === 'multiple_choice' && (
              <MCQOptions
                options={question.options || ['Option 1', 'Option 2']}
                onChange={(options) => onUpdate({ options })}
              />
            )}

            {question.type === 'descriptive' && (
              <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
                <p className="text-sm text-gray-500 italic">
                  Respondents will see a text area for detailed answers
                </p>
              </div>
            )}

            {question.type === 'yes_no' && (
              <div className="space-y-2 mt-4">
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
      </div>

      {/* Bottom Toolbar */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={question.required}
            onChange={(e) => onUpdate({ required: e.target.checked })}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <span className="text-sm text-gray-700">Required</span>
        </label>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onDuplicate}
            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded transition-colors"
            title="Duplicate question"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete question"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
