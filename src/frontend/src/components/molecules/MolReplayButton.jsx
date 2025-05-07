import AtmButton from "../atoms/AtmButton"
import { useSocketContext } from '../../lib/hooks/useSocketContext'

const MolReplayButton = () => {
    
    const { board, replayGame } = useSocketContext()

    if (board === null || board.winner === null) return null

    return (
        <AtmButton
            label={"Start new game"}
            onClick={() => {
                console.log("Replay button clicked")
                replayGame()
            }}
        />
    )
}

export default MolReplayButton