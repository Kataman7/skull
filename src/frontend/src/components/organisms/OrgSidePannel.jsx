import MolGameJoin from "../molecules/MolGameJoin"
import MolPlayersList from "../molecules/MolPlayersList"
import MolGameLeave from "../molecules/MolGameLeave"
import MolLogs from "../molecules/MolLogs"
import AtmTurn from "../atoms/AtmTurn"
import AtmVolumeSlider from "../atoms/AtmVolumeSlider"
import useIsMobile from "../../lib/hooks/useIsMobile"
import { useSelector } from "react-redux"
import MolKickButton from "../molecules/MolKickButton"
import MolReplayButton from "../molecules/MolReplayButton"

const OrgSidePannel = () => {
    const isMobile = useIsMobile();
    const inGame = useSelector((state) => state.player.inGame)

    // Sur mobile, afficher deux panneaux distincts
    if (isMobile) {
        return (
            <>
                {/* Panneau du haut avec les contrôles de jeu */}
                <div className="fixed top-0 left-0 w-full py-3 bg-black/50 flex justify-center">
                    <div className="flex flex-row gap-4">
                        <MolGameLeave />
                        {inGame && <AtmTurn />}
                        <MolGameJoin />
                        <MolReplayButton />
                    </div>
                </div>

                {/* Panneau du bas avec les logs */}
                <div className="fixed bottom-0 left-0 w-full py-4 bg-black/50 flex justify-center">
                    <div className="w-full px-4">
                        <MolLogs />
                    </div>
                </div>
            </>
        );
    }

    // Sur desktop, garder la structure en colonne à droite
    return (
        <div className="fixed top-0 right-0 h-full w-64 py-8 bg-black/30 doverflow-y-auto flex flex-col items-center">
            <div className="w-full px-4 flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                    <MolGameLeave />
                    <AtmTurn />
                    <MolGameJoin />
                </div>
                
                <MolPlayersList />
                <MolReplayButton />
                <MolKickButton />
                
                <div className="flex flex-col gap-4">
                    <MolLogs />
                    <AtmVolumeSlider />
                </div>
            </div>
        </div>
    );
}

export default OrgSidePannel