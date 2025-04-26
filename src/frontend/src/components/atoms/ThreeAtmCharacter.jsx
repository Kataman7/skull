import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import { TextureLoader } from "three"
import { useRef, useState, useEffect } from 'react'

const ThreeAtmCharacter = ({
    position = [0, 0, 0],
    scale = 0.02,
    folder = "characters",
    name = "character",
    rotation = 0,
    point = 0,
}) => {
    const [model, setModel] = useState(null);
    const characterRef = useRef();

    // Chargement et gestion des ressources
    useEffect(() => {
        async function loadResources() {
            try {
                const fbxLoader = new FBXLoader();
                const modelPath = `/assets/models/${folder}/${name}/${name}.fbx`;
                const texturePath = `/assets/models/${folder}/${name}/${name}.png`;

                const loadedModel = await new Promise((resolve, reject) => {
                    fbxLoader.load(modelPath, resolve, undefined, reject);
                });

                const textureLoader = new TextureLoader();
                const loadedTexture = await new Promise((resolve, reject) => {
                    textureLoader.load(texturePath, resolve, undefined, reject);
                });

                loadedModel.traverse((child) => {
                    if (child.isMesh) {
                        child.material.map = loadedTexture;
                        child.material.needsUpdate = true;
                    }
                });

                setModel(loadedModel);
            } catch (error) {
                console.error("Erreur de chargement du modèle ou de la texture:", error);
            }
        }

        loadResources();
    }, [folder, name]);

    return (
        <>
            {model && (
                <primitive
                    ref={characterRef}
                    object={model}
                    scale={scale}
                    position={position}
                    rotation={[0, rotation, 0]}
                />
            )}

            {/* Effet d'aura lumineuse à deux couches */}
            {point > 0 &&
            <group position={[position[0], position[1] + 0.01, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
                {/* Cercle principal lumineux */}
                <mesh>
                    <circleGeometry args={[0.4, 32]} />
                    <meshStandardMaterial
                        color="#ff0000"
                        emissive="#ff0000"
                        emissiveIntensity={100}
                        toneMapped={false}
                        transparent={true}
                        opacity={0.9}
                    />
                </mesh>

                {/* Halo extérieur */}
                <mesh position={[0, 0, -0.001]}>
                    <circleGeometry args={[0.5, 32]} />
                    <meshStandardMaterial
                        color="#ff0000"
                        transparent={true}
                        opacity={0.3}
                        toneMapped={false}
                    />
                </mesh>

                {/* Point central très lumineux */}
                <mesh position={[0, 0, 0.002]}>
                    <circleGeometry args={[0.08, 32]} />
                    <meshBasicMaterial
                        color="#ffffff"
                        transparent={true}
                        opacity={0.8}
                        toneMapped={false}
                    />
                </mesh>

                {/* Pointlight pour éclairer l'environnement */}
                <pointLight
                    color="#ff0000"
                    intensity={4}
                    distance={2}
                    decay={2}
                    position={[0, 0, 0.2]}
                />
            </group>
            }
        </>
    )
}

export default ThreeAtmCharacter