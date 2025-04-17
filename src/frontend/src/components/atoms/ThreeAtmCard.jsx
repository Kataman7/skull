import { useState, useEffect, useMemo } from 'react'
import { Color, TextureLoader, CanvasTexture } from 'three'

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

    // Créer une texture avec l'emoji skull
    const skullTexture = useMemo(() => {
        if (type !== 'skull') return null;
        
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const context = canvas.getContext('2d');
        
        // Fond de couleur
        context.fillStyle = color;
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Dessiner l'emoji skull - avec rotation pour l'orienter correctement
        context.save(); // Sauvegarder l'état actuel
        
        // Translater au centre, pivoter, puis revenir au centre pour dessiner
        context.translate(canvas.width/2, canvas.height/2);
        
        context.fillStyle = '#06402B';  // Couleur verte pour l'emoji
        context.font = '180px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('💀', 0, 0); // Dessiner au centre (0,0) après translation
        
        context.restore(); // Restaurer l'état précédent
        
        const texture = new CanvasTexture(canvas);
        texture.rotation = Math.PI/2; // Rotation supplémentaire de 90 degrés
        texture.center.set(0.52, 0.52); // Point central pour la rotation
        
        return texture;
    }, [type, color]);

    // Calculer la position de la lumière (légèrement au-dessus du cylindre)
    const lightPosition = [position[0], position[1] + height/2 + 0.5, position[2]];

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
                onPointerEnter={isTopCylinder ? () => document.body.style.cursor = 'pointer' : undefined}
                onPointerLeave={isTopCylinder ? () => document.body.style.cursor = 'default' : undefined}
            >
                <cylinderGeometry args={[width / 2, width / 2, height, radialSegment]} />
                <meshStandardMaterial
                    color={hovered ? hoverColor : cardColor}
                    roughness={0.7}
                    metalness={1}
                    map={skullTexture}
                />
            </mesh>
            
            {/* Ajouter un point light uniquement si le type est 'skull' */}
            {type === 'skull' && (
                <pointLight 
                    position={lightPosition} 
                    color={color}
                    intensity={1}
                    distance={2}
                    decay={5}
                    castShadow
                />
            )}
        </>
    )
}

export default ThreeAtmCard