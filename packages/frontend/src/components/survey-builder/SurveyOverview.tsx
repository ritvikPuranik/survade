interface SurveyOverviewProps {
  title: string
  description: string
  objective: string
  onTitleChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onObjectiveChange: (value: string) => void
}

export function SurveyOverview({
  title,
  description,
  objective,
  onTitleChange,
  onDescriptionChange,
  onObjectiveChange,
}: SurveyOverviewProps) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Survey Overview</h2>
        <p className="text-sm text-gray-600">
          Provide basic information about your survey
        </p>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Survey Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter survey title"
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Briefly describe your survey"
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
        />
      </div>

      {/* Objective */}
      <div>
        <label htmlFor="objective" className="block text-sm font-medium text-gray-700 mb-2">
          Objective / Purpose
        </label>
        <textarea
          id="objective"
          value={objective}
          onChange={(e) => onObjectiveChange(e.target.value)}
          placeholder="What do you hope to gather from this survey?"
          rows={2}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
        />
      </div>
    </div>
  )
}
