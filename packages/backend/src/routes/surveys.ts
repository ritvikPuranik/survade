import express, { Request, Response } from 'express'

const router = express.Router()


const mockSurveyDetail = {
  id: '1',
  title: 'Customer Satisfaction Survey',
  description: 'Help us improve our services',
  status: 'active',
  questions: [
    {
      id: 'q1',
      text: 'How satisfied are you with our service?',
      type: 'rating',
    },
    {
      id: 'q2',
      text: 'What can we improve?',
      type: 'text',
    },
  ],
  created_at: '2024-01-15T10:00:00Z',
}

// In-memory storage for created surveys (replace with database later)
const createdSurveys = new Map<string, any>()

// GET /api/surveys - List all surveys
router.get('/', (req: Request, res: Response) => {
  // Convert Map to array of survey objects
  const surveysArray = Array.from(createdSurveys.values())

  res.json({
    success: true,
    data: surveysArray,
  })
})

// POST /api/surveys/new - Create new survey
router.post('/new', (req: Request, res: Response) => {
  const { title, description, objective, questions } = req.body

  const newSurvey = {
    id: String(Date.now()),
    title: title || 'Untitled Survey',
    description: description || '',
    objective: objective || '',
    questions: questions || [],
    status: 'review',
    created_at: new Date().toISOString(),
  }

  // Store in memory for this session
  createdSurveys.set(newSurvey.id, newSurvey)

  res.json({
    success: true,
    data: newSurvey,
  })
})

// GET /api/surveys/:id - Get single survey
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params

  res.json({
    success: true,
    data: {
      ...mockSurveyDetail,
      id,
    },
  })
})

// GET /api/surveys/:id/review - Get survey for review
router.get('/:id/review', (req: Request, res: Response) => {
  const { id } = req.params

  if (!id) {
    res.status(400).json({
      success: false,
      error: 'Survey ID is required',
    })
    return
  }

  // Check if this survey was created during this session
  const createdSurvey = createdSurveys.get(id)
  if (createdSurvey) {
    res.json({
      success: true,
      data: createdSurvey,
    })
    return
  }

  // Fallback to mock data
  res.json({
    success: true,
    data: {
      ...mockSurveyDetail,
      id,
      status: 'review',
    },
  })
})

// POST /api/surveys/:id/review - Publish survey
router.post('/:id/review', (req: Request, res: Response) => {
  const { id } = req.params

  res.json({
    success: true,
    message: 'Survey published successfully',
    data: {
      id,
      status: 'active',
    },
  })
})

export default router
