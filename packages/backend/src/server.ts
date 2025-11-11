import express, { type Request, type Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Survade API is running',
    timestamp: new Date().toISOString()
  })
})

// API routes placeholder
app.get('/api', (_req: Request, res: Response) => {
  res.json({
    name: 'Survade API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      surveys: '/api/surveys',
      responses: '/api/responses',
      ai: '/api/ai/generate'
    }
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})

export default app
