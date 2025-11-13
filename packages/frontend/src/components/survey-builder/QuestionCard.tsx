import { Question, QuestionType } from '../../types/survey'
import { MCQOptions } from './MCQOptions'
import { Card, Select, TextSmall } from '../ui'
import { GripVertical, Copy, Trash2 } from 'lucide-react'

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
    <Card variant="elevated" padding="md">
      {/* Header with Drag Handle and Question Number */}
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <div className="flex-shrink-0 text-gray-400 cursor-move mt-2">
          <GripVertical className="w-5 h-5" />
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
              className="select"
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
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <TextSmall className="italic text-gray-500">
                  Respondents will see a text area for detailed answers
                </TextSmall>
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
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={question.required}
            onChange={(e) => onUpdate({ required: e.target.checked })}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <TextSmall>Required</TextSmall>
        </label>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onDuplicate}
            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Duplicate question"
          >
            <Copy className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete question"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Card>
  )
}
