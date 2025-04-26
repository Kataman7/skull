import React, { useRef, useState } from 'react'
import ThreeAtmCard from '../atoms/ThreeAtmCard'
import { useSocketContext } from '../../lib/hooks/useSocketContext'
import { useSoundFX } from '../../lib/hooks/useSoundFX'

const ThreeMolCards = ({
  position = [0, 2, 0],
  width = 0.5,
  height = 0.08,
  amount = 0,
  name = '',
  color = '#ffffff',
}) => {
  const groupRef = useRef()
  const { pickPlayer } = useSocketContext()

  // Copie de la position pour ne pas modifier la prop directement
  const basePosition = [...position]
  basePosition[1] = 1.81

  // Gestionnaire de clic pour le cylindre du haut
  const handleClick = (event) => {
    event.stopPropagation() // Empêcher la propagation du clic
    pickPlayer(name)
  }

  // Créer un tableau de cylindres empilés
  const cylinders = []
  for (let i = 0; i < amount; i++) {
    // Calculer la position Y de chaque cylindre dans la pile
    const cylinderPosition = [0, i * height * 1.35, 0] // Petit chevauchement de 5%

    // Déterminer si c'est le cylindre du haut
    const isTopCylinder = (i === amount - 1)

    cylinders.push(
      <ThreeAtmCard
        key={i}
        position={cylinderPosition}
        width={width}
        height={height}
        radialSegment={12}
        isTopCylinder={isTopCylinder}
        handleClick={isTopCylinder ? handleClick : undefined}
        color={color}
      />
    )
  }

  return (
    <group position={basePosition} ref={groupRef}>
      {cylinders}
    </group>
  )
}

export default ThreeMolCards
