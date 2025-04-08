import React from 'react'
import { Routes, Route } from 'react-router-dom'
import PagHome from '../pages/PagHome'
import PagCounters from '../pages/PagCounters'
import PagCubes from '../pages/PagCubes'
import PagCharacter from '../pages/PagCharacter'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PagHome />} />
      <Route path="/counter/:value?" element={<PagCounters />} />
      <Route path="/cube" element={<PagCubes />} />
      <Route path="/character" element={<PagCharacter />} />
    </Routes>
  )
}

export default AppRoutes
