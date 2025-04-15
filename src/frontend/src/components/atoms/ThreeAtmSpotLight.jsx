import { useRef, useEffect, useMemo } from "react"
import { SpotLightHelper, ConeGeometry, MeshBasicMaterial, Mesh, Color, AdditiveBlending, Vector3 } from "three"
import { useThree } from "@react-three/fiber"

const ThreeAtmSpotLight = ({
    position = [0, 5, 0], // Position de la lumière
    targetPosition = [0, 0, 0], // Position de la cible
    angle = Math.PI / 6, // Angle du cône
    intensity = 1, // Intensité de la lumière
    distance = 10, // Distance maximale d'éclairage
    penumbra = 0.1, // Douceur des bords du cône
    debug = false, // Affiche un helper pour déboguer
    showVolumetricLight = true, // Affiche le cône lumineux
    coneOpacity = 0.05, // Opacité du cône
    coneColor = 0xffffff, // Couleur du cône
}) => {
    const lightRef = useRef()
    const coneRef = useRef()
    const { scene } = useThree()

    // Effet pour la lumière et le helper
    useEffect(() => {
        if (lightRef.current) {
            // Définir la cible de la lumière
            lightRef.current.target.position.set(...targetPosition)
            scene.add(lightRef.current.target)

            // Ajouter un helper pour déboguer si nécessaire
            if (debug) {
                const helper = new SpotLightHelper(lightRef.current)
                scene.add(helper)

                // Mettre à jour le helper à chaque frame pour qu'il suive la lumière
                const updateHelper = () => {
                    helper.update()
                    requestAnimationFrame(updateHelper)
                }
                requestAnimationFrame(updateHelper)

                return () => {
                    scene.remove(helper)
                }
            }
        }
    }, [targetPosition, scene, debug])

    // Effet pour créer et gérer le cône de lumière visible
    useEffect(() => {
        if (lightRef.current && showVolumetricLight) {
            // Calculer les dimensions du cône en fonction de l'angle et de la distance
            const spotAngle = angle
            const height = distance
            const radius = Math.tan(spotAngle) * height

            // Supprimer l'ancien cône s'il existe
            if (coneRef.current) {
                scene.remove(coneRef.current)
            }

            // Créer un nouveau cône - noter que nous le créons pointant vers le bas (axe -Y)
            const geometry = new ConeGeometry(radius, height, 32, 1, true)

            // Décaler la géométrie pour que le sommet du cône soit à l'origine
            geometry.translate(0, -height / 2, 0)

            const material = new MeshBasicMaterial({
                color: new Color(coneColor),
                transparent: true,
                opacity: coneOpacity,
                depthWrite: false,
                blending: AdditiveBlending,
                fog: true,
            })

            const cone = new Mesh(geometry, material)

            // Calculer la direction entre la position de la lumière et la cible
            const positionVec = new Vector3(...position)
            const targetVec = new Vector3(...targetPosition)
            const direction = new Vector3().subVectors(targetVec, positionVec).normalize()

            // Positionner le cône à la position de la lumière
            cone.position.copy(positionVec)

            // Orienter le cône - nous devons faire pointer le cône dans la direction calculée
            cone.quaternion.setFromUnitVectors(new Vector3(0, -1, 0), direction)

            scene.add(cone)
            coneRef.current = cone

            return () => {
                if (coneRef.current) {
                    scene.remove(coneRef.current)
                }
            }
        }
    }, [position, targetPosition, angle, distance, showVolumetricLight, coneOpacity, coneColor, scene])

    return (
        <spotLight
            ref={lightRef}
            position={position}
            angle={angle}
            intensity={intensity}
            distance={distance}
            penumbra={penumbra}
            castShadow
            color={coneColor}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-bias={-0.001}
        />
    )
}

export default ThreeAtmSpotLight