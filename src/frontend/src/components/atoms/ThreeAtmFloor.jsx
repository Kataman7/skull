import React from 'react'

const ThreeAtmFloor = ({ 
  size = 100, 
  position = [0, -0.01, 0],
  color = 0x111111,
  receiveShadow = true,
}) => {
  return (
    <mesh 
      position={position} 
      rotation={[-Math.PI / 2, 0, 0]} 
      receiveShadow={receiveShadow}
    >
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial 
        color={color} 
      />
    </mesh>
  )
}

export default ThreeAtmFloor