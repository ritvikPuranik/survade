const API_BASE = '/api'

export const api = {
  // Surveys
  getSurveys: async () => {
    const response = await fetch(`${API_BASE}/surveys`)
    return response.json()
  },

  getSurvey: async (id: string) => {
    const response = await fetch(`${API_BASE}/surveys/${id}`)
    return response.json()
  },

  createSurvey: async (data: {
    title: string
    description?: string
    objective?: string
    questions: Array<{
      text: string
      type: string
      options?: string[]
      required: boolean
    }>
  }) => {
    const response = await fetch(`${API_BASE}/surveys/new`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  getSurveyForReview: async (id: string) => {
    const response = await fetch(`${API_BASE}/surveys/${id}/review`)
    return response.json()
  },

  publishSurvey: async (id: string) => {
    const response = await fetch(`${API_BASE}/surveys/${id}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    return response.json()
  },
}
