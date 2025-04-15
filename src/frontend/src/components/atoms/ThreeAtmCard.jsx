import { useState } from 'react'
import { Color } from 'three'

const ThreeAtmCard = ({
    position = [0, 0, 0],
    width = 2,
    height = 2,
    radialSegment = 12,
    isTopCylinder = false,
    handleClick = () => {},
    color = '#ff3e00',
    rotation = [0, 0, 0],
}) => {

    const [hovered, setHovered] = useState(false)
    const cardColor = new Color(color)
    const hoverColor = new Color(color).multiplyScalar(1.5)

    return (
        <mesh
            position={position}
            rotation={rotation}
            castShadow
            receiveShadow
            // Événements interactifs uniquement pour le cylindre du haut
            onClick={isTopCylinder ? handleClick : undefined}
            onPointerOver={isTopCylinder ? () => setHovered(true) : undefined}
            onPointerOut={isTopCylinder ? () => setHovered(false) : undefined}
            onPointerEnter={isTopCylinder ? () => document.body.style.cursor = 'pointer' : undefined}
            onPointerLeave={isTopCylinder ? () => document.body.style.cursor = 'default' : undefined}
        >
            <cylinderGeometry args={[width / 2, width / 2, height, radialSegment]} />
            <meshStandardMaterial 
                color={hovered ? hoverColor : cardColor}
                roughness={0.7}
                metalness={0.3}
            />
        </mesh>
    )
}

export default ThreeAtmCard