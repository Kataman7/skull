import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import CounterPage from '../pages/CounterPage'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/counter/:value?" element={<CounterPage />} />
    </Routes>
  )
}

export default AppRoutes
