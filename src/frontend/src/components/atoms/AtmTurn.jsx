import { useSelector } from "react-redux"
import { useSocketContext } from "../../lib/hooks/useSocketContext"

const AtmTurn = () => {
    const { board } = useSocketContext()
    const playerName = useSelector((state) => state.player.name)
    if (!board || !board.players) return null

    const player = board.players[board.currentTurn]
    if (!player) return null

    if (board.winner) return (
        <h3 className="text-2xl font-semibold"> {board.winner} won! </h3>
    )

    return (
        <h3 className="text-2xl font-semibold"> {playerName === player.name ? 'Your' : `${player.name}'`} turn. </h3>
    )
}

export default AtmTurn