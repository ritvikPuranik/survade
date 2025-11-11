import { BrowserRouter as Router } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center text-gray-800">
            Survade
          </h1>
          <p className="text-center text-gray-600 mt-2">
            AI-powered gamified survey experience
          </p>
        </div>
      </div>
    </Router>
  )
}

export default App
