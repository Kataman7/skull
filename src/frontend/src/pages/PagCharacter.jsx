import MolLogs from '../components/molecules/MolLogs'
import AtmTurn from '../components/atoms/AtmTurn'
import MolGameJoin from '../components/molecules/MolGameJoin'
import MolGameLeave from '../components/molecules/MolGameLeave'
import ThreeOrgScene from '../components/organisms/ThreeOrgScene'
import MolPlayersList from '../components/molecules/MolPlayersList'
import ThreeAtmModel from '../components/atoms/ThreeAtmModel'
import ThreeMolTV from '../components/molecules/ThreeMolTV'
import AtmMusicManager from '../components/atoms/AtmMusicManager'
import AtmVolumeSlider from '../components/atoms/AtmVolumeSlider'

const PagCharacter = () => {
    return (
        <>
            <h1 className="text-2xl font-bold mb-4">A Seat in the Shadows</h1>
            
            <ThreeOrgScene>
                {<ThreeAtmModel folder={'tables'} name={'table'} scale={0.025} />}
                <ThreeMolTV position={[0, 1.9, -1]} scale={0.008}/>
            </ThreeOrgScene>

            <div className='absolute top-2 right-3 max-w-60 gap-5 flex flex-col'>
                <MolGameJoin />
                <MolGameLeave />
                <MolPlayersList />
                <AtmTurn />
                <MolLogs />
                <AtmVolumeSlider />
            </div>

            <AtmMusicManager/>
        </>


    )
}

export default PagCharacter