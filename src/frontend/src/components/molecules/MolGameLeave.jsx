import { useDispatch, useSelector } from "react-redux"
import { playerActions } from "../../lib/store/slices/playerSlice"
import AtmButton from "../atoms/AtmButton"
import { useSocketContext } from "../../lib/contexts/SocketContext"
import useIsMobile from "../../lib/hooks/useIsMobile"

const MolGameLeave = () => {

    const { name, inGame } = useSelector((state) => state.player)
    const dispatch = useDispatch()
    const { leaveGame } = useSocketContext()
    const isMobile = useIsMobile();

    const handleLeave = () => {
        leaveGame(name)
        dispatch(playerActions.setInGame(false))
    }

    return (
        !inGame ? null :
        <AtmButton label={isMobile ? 'Leave' : 'Leave the game'} onClick={handleLeave}/>
    )
}

export default MolGameLeave