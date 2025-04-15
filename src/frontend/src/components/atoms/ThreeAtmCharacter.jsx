import { useLoader } from "@react-three/fiber"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import { TextureLoader } from "three"
import { useFrame } from "@react-three/fiber"
import { useRef, useState } from 'react'
import ThreeAtmSpotLight from "./ThreeAtmSpotLight"

const ThreeAtmCharacter = ({
    position = [0, 0, 0],
    rotationSpeed = 0,
    scale = 0.02,
    folder = "characters",
    name = "Character",
    rotation = 0,
    onClick = () => console.log('click'),
}) => {
    const character = useLoader(FBXLoader, `/assets/models/${folder}/${name}/${name}.fbx`)
    const texture = useLoader(TextureLoader, `/assets/models/${folder}/${name}/${name}.png`)
    const characterRef = useRef()
    const [isLightOn, setisLightOn] = useState(false)

    useFrame(() => {
        if (characterRef.current) {
            characterRef.current.rotation.y += rotationSpeed
        }
    })

    character.traverse((child) => {
        if (child.isMesh) {
            child.material.map = texture
            child.material.needsUpdate = true
        }
    })

    // Fonctions de gestion des événements
    const handlePointerEnter = () => {
        document.body.style.cursor = 'pointer'
        setisLightOn(true)
    }

    const handlePointerLeave = () => {
        document.body.style.cursor = 'default'
        setisLightOn(false)
    }

    return (
    <>
        <primitive
            ref={characterRef}
            object={character}
            scale={scale}
            position={position}
            rotation={[0, rotation, 0]}
            onClick={onClick}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
        />
        <>
            {isLightOn && (
                <ThreeAtmSpotLight
                    position={[0, 25, 0]}
                    targetPosition={position}
                    intensity={4000}
                    angle={Math.PI / 65}
                    distance={100}
                    coneOpacity={0.03}
                    penumbra={0.4}
                />
            )}
        </>
    </>
    )
}

export default ThreeAtmCharacter