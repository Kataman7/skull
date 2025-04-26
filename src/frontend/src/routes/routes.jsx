import React from 'react'
import { Routes, Route } from 'react-router-dom'
import PagCharacter from '../pages/PagCharacter'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PagCharacter />} />
    </Routes>
  )
}

export default AppRoutes
