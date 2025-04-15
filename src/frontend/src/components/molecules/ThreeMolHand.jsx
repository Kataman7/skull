import { useSelector } from "react-redux"
import { useSocketContext } from "../../lib/contexts/SocketContext"
import { checkIfPlayerTurn, getPlayerPositionsAndRotations } from "../../lib/helpers/utils"
import ThreeAtmCard from "../atoms/ThreeAtmCard"
import { useEffect, useRef, useState } from "react"

const ThreeMolHand = ({
}) => {

    const { board, playCard } = useSocketContext()
    const [displayHand, setDisplayHand] = useState(false)

    useEffect(() => {

        if (board &&
            board.betPlayer?.name === board.currentPlayer?.name &&
            board.betValue === 0
        ) setDisplayHand(true)
        else setDisplayHand(false)

    }, [board])

    if (!board || !board.players) return null

    const playerName = useSelector((state) => state.player.name)
    const player = board.players.find(player => player.name === playerName)
    const groupRef = useRef()

    if (!checkIfPlayerTurn(board, playerName)) return null

    const datas = getPlayerPositionsAndRotations(board.players.length, 1.7)
    const playerPosition = datas[board.currentTurn].position
    const playerRotation = datas[board.currentTurn].rotation
    playerPosition[1] = 3.5

    const cards = [];

    for (let i = 0; i < player.hand; i++) {

        const handleClick = () => {
            playCard(i)
        }

        cards.push(
            <ThreeAtmCard
                key={i}
                position={[-player.hand * 0.2 + i * 0.5, 0, 0]}
                width={0.5}
                height={0.08}
                handleClick={handleClick}
                isTopCylinder={true}
                rotation={[2.8, 0, 0]}
            />
        )
    }

    return (
        displayHand &&
        <group position={playerPosition} ref={groupRef} rotation={[0, playerRotation, 0]}>
            {cards}
        </group>
    )
}

export default ThreeMolHand