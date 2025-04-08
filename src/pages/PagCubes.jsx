import ThreeAtmCube from '../components/atoms/ThreeAtmCube'
import ThreeOrgScene from '../components/organisms/ThreeOrgScene'

const PagCubes = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Cubes 3D</h1>
            <ThreeOrgScene>
                <ThreeAtmCube position={[-1.5, 0, 0]} color='#ff3e00' size={1}/>
                <ThreeAtmCube position={[0, 0, 0]} color='#42b883' size={1.2}/>
                <ThreeAtmCube position={[1.5, 0, 0]} color='#61dafb' size={0.8} wireframe={true}/>
            </ThreeOrgScene>
            <p className="mt-4 text-gray-600">
                Vous pouvez faire pivoter la scène avec la souris et cliquer sur les cubes pour les agrandir.
            </p>
        </div>
    )
}

export default PagCubes