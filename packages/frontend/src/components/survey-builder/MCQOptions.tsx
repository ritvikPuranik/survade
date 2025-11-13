interface MCQOptionsProps {
  options: string[]
  onChange: (options: string[]) => void
}

export function MCQOptions({ options, onChange }: MCQOptionsProps) {
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    onChange(newOptions)
  }

  const handleAddOption = () => {
    onChange([...options, ''])
  }

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index)
      onChange(newOptions)
    }
  }

  return (
    <div className="space-y-3 mt-4">
      {options.map((option, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-gray-400"></div>
          <input
            type="text"
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            placeholder={`Option ${index + 1}`}
            className="flex-1 px-3 py-2 border-b border-gray-300 focus:border-indigo-500 focus:outline-none transition-colors"
          />
          {options.length > 2 && (
            <button
              type="button"
              onClick={() => handleRemoveOption(index)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddOption}
        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 text-sm transition-colors"
      >
        <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-gray-400"></div>
        <span>Add option</span>
      </button>
    </div>
  )
}
