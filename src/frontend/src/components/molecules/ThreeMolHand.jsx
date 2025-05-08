import { useSelector } from "react-redux"
import { useSocketContext } from "../../lib/hooks/useSocketContext"
import { checkIfPlayerTurn, getPlayerPositionsAndRotations } from "../../lib/helpers/utils"
import ThreeAtmCard from "../atoms/ThreeAtmCard"
import { useEffect, useRef, useState } from "react"

const ThreeMolHand = () => {
    // 1. PLACE ALL HOOKS AT THE TOP
    const { board, playCard, requestHand, hand } = useSocketContext()
    const playerName = useSelector((state) => state.player.name)
    const [displayHand, setDisplayHand] = useState(false)
    const [playerCards, setPlayerCards] = useState([])
    const groupRef = useRef()

    // 2. CALCULATE DATA THAT DOESN'T DEPEND ON CONDITIONALS
    const player = board?.players?.find(player => player.name === playerName)
    const currentPlayer = board?.players ? board.players[board?.currentTurn] : null
    const handSize = currentPlayer && typeof currentPlayer.hand === 'number' && currentPlayer.hand > 0 ? currentPlayer.hand : 0
    const isMyTurn = checkIfPlayerTurn(board, playerName)
    
    // 3. DEFINE ALL EFFECTS
    useEffect(() => {
        if (board &&
            board.betPlayer?.name === board.currentPlayer?.name &&
            board.betValue === 0
        ) {
            if (isMyTurn) {
                requestHand()
            }
            setDisplayHand(true)
        }
        else setDisplayHand(false)
    }, [board, requestHand, isMyTurn])

    useEffect(() => {
        if (hand && isMyTurn) {
            setPlayerCards(hand)
        }
    }, [hand, isMyTurn])

    // 4. EARLY RETURNS AFTER ALL HOOKS
    if (!board || !board.players || board.winner !== null) return null
    if (!currentPlayer) return null
    // Remove the player turn check to show cards for all players
    if (isMyTurn && playerCards.length !== handSize) return null

    // 5. RENDERING LOGIC
    const datas = getPlayerPositionsAndRotations(board.players.length, 1.7)
    const playerPosition = datas[board.currentTurn].position
    const playerRotation = datas[board.currentTurn].rotation
    playerPosition[1] = 3.5

    const cards = [];

    for (let i = 0; i < handSize; i++) {
        const handleClick = () => {
            if (isMyTurn) {
                playCard(i)
            }
        }

        cards.push(
            <ThreeAtmCard
                key={i}
                position={[-handSize * 0.22 + i * 0.53, 0, 0]}
                width={0.5}
                height={0.08}
                handleClick={isMyTurn ? handleClick : undefined}
                isTopCylinder={isMyTurn}
                rotation={[2.8, 0, 0]}
                color={currentPlayer.color}
                // Only show card type if it's the current player's hand
                type={isMyTurn && playerCards && i < playerCards.length ? playerCards[i] : 'flower'}
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