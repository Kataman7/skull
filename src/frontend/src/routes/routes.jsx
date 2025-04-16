import React from 'react'
import { Routes, Route } from 'react-router-dom'
import PagHome from '../pages/PagHome'
import PagCounters from '../pages/PagCounters'
import PagCubes from '../pages/PagCubes'
import PagCharacter from '../pages/PagCharacter'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PagCharacter />} />
    </Routes>
  )
}

export default AppRoutes
