import { Canvas } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import ThreeAtmSpotLight from "../atoms/ThreeAtmSpotLight"
import ThreeMolPlayers from "../molecules/ThreeMolPlayers"
import ThreeAtmFloor from "../atoms/ThreeAtmFloor"
import { useEffect, useRef } from "react"
import { useSocketContext } from "../../lib/contexts/SocketContext"
import { useSelector } from "react-redux"
import ThreeMolHand from "../molecules/ThreeMolHand"
import { EffectComposer, Pixelation } from '@react-three/postprocessing'

const ThreeOrgScene = ({ children }) => {
  const cameraRef = useRef()
  const controlsRef = useRef()

  return (
    <div className="w-screen h-screen absolute top-0 left-0 z-[-1] ">
      <Canvas
        dpr={[0.9, 0.9]}
        gl={{ antialias: false }}
        style={{ imageRendering: "pixelated" }}
      >
        {/* Utiliser PerspectiveCamera de drei au lieu de l'objet camera */}
        <PerspectiveCamera
          makeDefault
          ref={cameraRef}
          position={[0, 0, 10]}
          fov={75}
        />

        <ThreeAtmFloor />
        <ambientLight intensity={0.15} />
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

        {children}

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={Math.PI / 8}
          enableZoom={true}
          minDistance={6}
          maxDistance={12}
        />
      </Canvas>
    </div>
  )
}

export default ThreeOrgScene