import { Canvas } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import ThreeAtmSpotLight from "../atoms/ThreeAtmSpotLight"
import ThreeMolPlayers from "../molecules/ThreeMolPlayers"
import ThreeAtmFloor from "../atoms/ThreeAtmFloor"
import { useRef } from "react"
import ThreeMolHand from "../molecules/ThreeMolHand"
import ThreeMolTV from "../molecules/ThreeMolTV"
import ThreeAtmModel from "../atoms/ThreeAtmModel"

const ThreeOrgScene = () => {
  const cameraRef = useRef()
  const controlsRef = useRef()

  return (
    <div className="w-screen h-screen absolute top-0 left-0 z-[-1] ">
      <Canvas
        dpr={[0.75, 0.75]}
        gl={{ antialias: false }}
        style={{
          imageRendering: "pixelated",
          width: "100%",
          height: "100%",
          filter: "contrast(1.25) saturate(1.5) brightness(1)",
        }}
      >
        
        {/* Utiliser PerspectiveCamera de drei au lieu de l'objet camera */}
        <PerspectiveCamera
          makeDefault
          ref={cameraRef}
          position={[0, 0, 10]}
          fov={75}
        />

        <ThreeAtmFloor />
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} />
        <ThreeAtmSpotLight
          position={[0, 25, 0]}
          angle={Math.PI / 28}
          penumbra={0.8}
          intensity={600}
          distance={200}
          targetPosition={[0, 0, 0]}
          coneOpacity={0.01}
        />

        <ThreeMolPlayers />
        <ThreeMolHand />

        <ThreeAtmModel folder={'tables'} name={'table'} scale={0.025} />
        <ThreeMolTV position={[0, 1.9, -1]} scale={0.008}/>

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={Math.PI / 8}
          enableZoom={true}
          minDistance={6}
          maxDistance={30}
        />
      </Canvas>
    </div>
  )
}

export default ThreeOrgScene