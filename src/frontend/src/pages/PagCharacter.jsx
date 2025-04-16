import ThreeOrgScene from '../components/organisms/ThreeOrgScene'
import AtmMusicManager from '../components/atoms/AtmMusicManager'
import OrgSidePannel from '../components/organisms/OrgSidePannel'
import AtmLeaveOnUnload from '../components/atoms/AtmLeaveOnUnload'

const PagCharacter = () => {
    return (
        <>
            <ThreeOrgScene/>
            <OrgSidePannel />
            <AtmMusicManager />
            <AtmLeaveOnUnload />
        </>

    )
}

export default PagCharacter