import { useSocketContext } from "../../lib/contexts/SocketContext"
import AtmList from "../atoms/AtmList"

const MolPlayersList = () => {
    const { board } = useSocketContext()
    if (!board || !board.players) return null

    return (
        <AtmList
            label='Players'
            emptyMsg='no players found'
            items={board.players.map(player => player.name)}
            maxHeight='150px'
        />
    )
}
export default MolPlayersList