import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from '../routes/routes'
import { SocketProvider } from '../lib/hooks/useSocketContext'
import { SoundFXProvider } from '../lib/hooks/useSoundFX'

const App = () => {
  return (
    <SocketProvider>
      <SoundFXProvider>
        <Router>
          <div>
            <AppRoutes />
          </div>
        </Router>
      </SoundFXProvider>
    </SocketProvider>
  )
}

export default App
