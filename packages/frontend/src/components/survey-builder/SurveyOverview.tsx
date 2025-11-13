import { Input, Textarea, H3, TextSmall, Card } from '../ui'

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
    <Card variant="elevated" padding="md">
      <div className="mb-6">
        <H3 className="mb-2">Survey Overview</H3>
        <TextSmall>
          Provide basic information about your survey
        </TextSmall>
      </div>

      {/* Title */}
      <div className="mb-6">
        <Input
          id="title"
          label="Survey Title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter survey title"
          required
        />
      </div>

      {/* Description */}
      <div className="mb-6">
        <Textarea
          id="description"
          label="Description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Briefly describe your survey"
          rows={3}
        />
      </div>

      {/* Objective */}
      <div>
        <Textarea
          id="objective"
          label="Objective / Purpose"
          value={objective}
          onChange={(e) => onObjectiveChange(e.target.value)}
          placeholder="What do you hope to learn from this survey?"
          rows={2}
        />
      </div>
    </Card>
  )
}
