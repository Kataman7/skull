import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from '../routes/routes'
import { SocketProvider } from '../lib/contexts/SocketContext'

const App = () => {
  return (
    <SocketProvider>
      <Router>
        <div>
          <AppRoutes />
        </div>
      </Router>
    </SocketProvider>
  )
}

export default App
