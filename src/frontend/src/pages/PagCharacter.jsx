import ThreeOrgScene from '../components/organisms/ThreeOrgScene'
import AtmMusicManager from '../components/atoms/AtmMusicManager'
import OrgSidePannel from '../components/organisms/OrgSidePannel'
import AtmLeaveOnUnload from '../components/atoms/AtmLeaveOnUnload'
import AtmTabMonitor from '../components/atoms/AtmTabMonitor'

const PagCharacter = () => {
    return (
        <>
            <ThreeOrgScene/>
            <OrgSidePannel />
            <AtmMusicManager />
            <AtmLeaveOnUnload />
            <AtmTabMonitor />
        </>

    )
}

export default PagCharacter