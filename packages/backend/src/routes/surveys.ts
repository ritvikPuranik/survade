import express, { Request, Response } from 'express'

const router = express.Router()

// Mock data
const mockSurveys = [
  {
    id: '1',
    title: 'Customer Satisfaction Survey',
    description: 'Help us improve our services',
    status: 'active',
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Product Feedback',
    description: 'Tell us what you think about our new product',
    status: 'review',
    created_at: '2024-01-20T14:30:00Z',
  },
]

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

// GET /api/surveys - List all surveys
router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: mockSurveys,
  })
})

// POST /api/surveys/new - Create new survey
router.post('/new', (req: Request, res: Response) => {
  const { title, description } = req.body

  const newSurvey = {
    id: String(Date.now()),
    title: title || 'Untitled Survey',
    description: description || '',
    status: 'review',
    created_at: new Date().toISOString(),
  }

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
