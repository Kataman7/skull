import { useState, useRef, useEffect, useMemo } from 'react'
import { Color, CanvasTexture } from 'three'

const ThreeAtmCard = ({
    position = [0, 0, 0],
    width = 2,
    height = 2,
    radialSegment = 12,
    isTopCylinder = false,
    handleClick = () => { },
    color = '#ffffff',
    rotation = [0, 0, 0],
    type = 'flower',
}) => {
    const [hovered, setHovered] = useState(false)
    const cardColor = new Color(color)
    const hoverColor = new Color(color).multiplyScalar(1.5)
    
    // Simple unique ID without uuid package
    const instanceId = useRef(`card-${Math.random().toString(36).substr(2, 9)}`).current
    
    // Create a NEW material for each type change to prevent caching issues
    const [materialKey, setMaterialKey] = useState(`${type}-${instanceId}`)
    
    // Update material key whenever type changes
    useEffect(() => {
        setMaterialKey(`${type}-${Date.now()}-${instanceId}`)
    }, [type, instanceId])

    // Create texture with consistent rules for light and texture
    const skullTexture = useMemo(() => {
        // Only create texture for skull type - EXACT SAME CONDITION as the light
        if (type !== 'skull') return null;
        
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const context = canvas.getContext('2d');
        
        context.fillStyle = color;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = '#06402B';
        context.font = '180px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('💀', canvas.width/2, canvas.height/2);
        
        // Create a NEW texture each time to avoid any caching
        const texture = new CanvasTexture(canvas);
        texture.rotation = Math.PI/2;
        texture.center.set(0.52, 0.52);
        texture.needsUpdate = true;
        
        return texture;
    }, [type, color, materialKey]); // Make sure materialKey is a dependency
    
    // Clean up textures when component unmounts or texture changes
    useEffect(() => {
        return () => {
            if (skullTexture) {
                skullTexture.dispose();
            }
        };
    }, [skullTexture]);
    
    return (
        <>
            <mesh
                position={position}
                rotation={rotation}
                castShadow
                receiveShadow
                onClick={isTopCylinder ? handleClick : undefined}
                onPointerOver={isTopCylinder ? () => setHovered(true) : undefined}
                onPointerOut={isTopCylinder ? () => setHovered(false) : undefined}
            >
                <cylinderGeometry args={[width/2, width/2, height, radialSegment]} />
                <meshStandardMaterial
                    key={materialKey} // Force material recreation on type change
                    color={hovered ? hoverColor : cardColor}
                    roughness={0.7}
                    metalness={1}
                    map={skullTexture}
                />
            </mesh>
            
            {/* Use exact same condition for light as texture creation */}
            {type === 'skull' && (
                <pointLight 
                    position={[position[0], position[1] + 0.2, position[2]]} 
                    color={color}
                    intensity={1}
                    distance={0.8}
                    decay={5}
                />
            )}
        </>
    )
}

export default ThreeAtmCard