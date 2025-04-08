import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from '../routes/routes'

const App = () => {
  return (
    <Router>
      <div>
        <h1>Mon Application</h1>
        <AppRoutes />
      </div>
    </Router>
  )
}

export default App
