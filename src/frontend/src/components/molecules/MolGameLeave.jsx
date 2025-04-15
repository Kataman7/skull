import { useDispatch, useSelector } from "react-redux"
import { playerActions } from "../../lib/store/slices/playerSlice"
import AtmButton from "../atoms/AtmButton"
import { useSocketContext } from "../../lib/contexts/SocketContext"

const MolGameLeave = () => {

    const { name, inGame } = useSelector((state) => state.player)
    const dispatch = useDispatch()
    const { leaveGame } = useSocketContext()

    const handleLeave = () => {
        leaveGame(name)
        dispatch(playerActions.setInGame(false))
    }

    return (
        !inGame ? null :
        <AtmButton label={'Leave the game'} onClick={handleLeave}/>
    )
}

export default MolGameLeave