import { useLoader } from "@react-three/fiber"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import { TextureLoader } from "three"
import { useFrame } from "@react-three/fiber"
import { useRef } from 'react'

const ThreeAtmModel = ({
    position = [0, 0, 0],
    rotationSpeed = 0,
    scale = 0.02,
    folder = "tables",
    name = "table",
    rotation = 0,
}) => {
    const character = useLoader(FBXLoader, `/assets/models/${folder}/${name}/${name}.fbx`)
    const texture = useLoader(TextureLoader, `/assets/models/${folder}/${name}/${name}.png`)
    const characterRef = useRef()

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

    return <primitive 
        ref={characterRef}
        object={character}
        scale={scale}
        position={position}
        rotation={[0, rotation, 0]}
    />
}

export default ThreeAtmModel