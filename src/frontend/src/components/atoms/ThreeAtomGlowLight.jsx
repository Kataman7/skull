import { useRef } from 'react';

/**
 * Composant atomique pour créer un effet de lumière brillante
 * @param {Object} props Propriétés du composant
 * @param {Array} props.position Position de la lumière [x, y, z]
 * @param {number} props.rotationX Rotation en X (par défaut pour faire face vers le haut)
 * @param {string} props.color Couleur principale de la lumière
 * @param {string} props.centerColor Couleur du point central
 * @param {number} props.size Taille de base de l'effet lumineux
 * @param {number} props.intensity Intensité de la lumière
 * @param {boolean} props.active Si la lumière est active ou non
 */
const ThreeAtmGlowLight = ({
  position = [0, 0, 0],
  rotationX = -Math.PI / 2,
  color = "#ff0000",
  centerColor = "#ffffff",
  size = 0.4,
  intensity = 100,
  active = true
}) => {
  const lightRef = useRef();

  if (!active) return null;

  return (
    <group 
      position={position} 
      rotation={[rotationX, 0, 0]}
      ref={lightRef}
    >
      {/* Cercle principal lumineux */}
      <mesh>
        <circleGeometry args={[size, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={intensity}
          toneMapped={false}
          transparent={true}
          opacity={0.9}
        />
      </mesh>

      {/* Halo extérieur */}
      <mesh position={[0, 0, -0.001]}>
        <circleGeometry args={[size * 1.25, 32]} />
        <meshStandardMaterial
          color={color}
          transparent={true}
          opacity={0.3}
          toneMapped={false}
        />
      </mesh>

      {/* Point central très lumineux */}
      <mesh position={[0, 0, 0.002]}>
        <circleGeometry args={[size * 0.2, 32]} />
        <meshBasicMaterial
          color={centerColor}
          transparent={true}
          opacity={0.8}
          toneMapped={false}
        />
      </mesh>

      {/* Pointlight pour éclairer l'environnement */}
      <pointLight
        color={color}
        intensity={intensity * 0.04}
        distance={size * 5}
        decay={2}
        position={[0, 0, 0.2]}
      />
    </group>
  );
};

export default ThreeAtmGlowLight;