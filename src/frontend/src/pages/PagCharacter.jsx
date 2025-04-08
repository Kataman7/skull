import ThreeAtmCharacter from '../components/atoms/ThreeAtmCharacter'
import ThreeOrgScene from '../components/organisms/ThreeOrgScene'

const PagCharacter = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Character 3D</h1>
            <ThreeOrgScene>
                <ThreeAtmCharacter/>
            </ThreeOrgScene>
            <p className="mt-4 text-gray-600">
                Voici bob.
            </p>
        </div>
    )
}

export default PagCharacter