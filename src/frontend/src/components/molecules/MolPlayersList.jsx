import { useSocketContext } from "../../lib/hooks/useSocketContext"
import AtmList from "../atoms/AtmList"

const MolPlayersList = () => {
    const { board } = useSocketContext()
    if (!board || !board.players) return null

    return (
        <AtmList
            label='Players'
            emptyMsg='no players found'
            items={board.players.map(player => player.name + (player.winCount > 0 ? ` (${player.winCount} win)` : ''))}
            maxHeight='150px'
        />
    )
}
export default MolPlayersList