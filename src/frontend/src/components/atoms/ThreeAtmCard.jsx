import { useState, useEffect } from 'react'
import { Color, TextureLoader } from 'three'

const ThreeAtmCard = ({
    position = [0, 0, 0],
    width = 2,
    height = 2,
    radialSegment = 12,
    isTopCylinder = false,
    handleClick = () => {},
    color = '#730000',
    rotation = [0, 0, 0],
    type = 'flower',
}) => {

    const [hovered, setHovered] = useState(false)
    const redOrBlack = type === 'skull' ? '#005000' : color
    const cardColor = new Color(redOrBlack)
    const hoverColor = new Color(redOrBlack).multiplyScalar(1.5)

    return (
        <mesh
            position={position}
            rotation={rotation}
            castShadow
            receiveShadow
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