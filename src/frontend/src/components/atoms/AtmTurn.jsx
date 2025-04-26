import { useSelector } from "react-redux"
import { useSocketContext } from "../../lib/hooks/useSocketContext"

const AtmTurn = () => {
    const { board } = useSocketContext()
    const playerName = useSelector((state) => state.player.name)
    if (!board || !board.players) return null

    const player = board.players[board.currentTurn]
    if (!player) return null

    return (
        <h3 className="text-lg font-semibold"> {playerName === player.name ? 'Your' : `${player.name}'`} turn. </h3>
    )
}

export default AtmTurn