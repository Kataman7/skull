import { useSelector } from "react-redux"
import { useSocketContext } from "../../lib/contexts/SocketContext"
import { checkIfPlayerTurn, getPlayerPositionsAndRotations } from "../../lib/helpers/utils"
import ThreeAtmCard from "../atoms/ThreeAtmCard"
import { useEffect, useRef, useState } from "react"

const ThreeMolHand = () => {
    const { board, playCard, requestHand, hand } = useSocketContext()
    const [displayHand, setDisplayHand] = useState(false)
    const [playerCards, setPlayerCards] = useState([]) // ✅ Initialisation avec un tableau vide
    const groupRef = useRef()

    // Données du joueur
    const playerName = useSelector((state) => state.player.name)

    useEffect(() => {
        if (board &&
            board.betPlayer?.name === board.currentPlayer?.name &&
            board.betValue === 0
        ) {
            requestHand()
            setDisplayHand(true)
        }
        else setDisplayHand(false)
    }, [board, requestHand])

    useEffect(() => {
        // ✅ Vérification que hand n'est pas null/undefined
        if (hand) {
            setPlayerCards(hand)
            console.log('hand', hand)
        }
    }, [hand])

    // ✅ Retour précoce si les conditions ne sont pas remplies
    if (!board || !board.players) return null
    
    const player = board.players.find(player => player.name === playerName)
    
    // ✅ Vérification supplémentaire pour player
    if (!player) return null
    if (!checkIfPlayerTurn(board, playerName)) return null

    const datas = getPlayerPositionsAndRotations(board.players.length, 1.7)
    const playerPosition = datas[board.currentTurn].position
    const playerRotation = datas[board.currentTurn].rotation
    playerPosition[1] = 3.5

    const cards = [];

    // ✅ Vérification que player.hand est un nombre valide
    const handSize = typeof player.hand === 'number' && player.hand > 0 ? player.hand : 0;

    for (let i = 0; i < handSize; i++) {
        const handleClick = () => {
            playCard(i)
        }

        cards.push(
            <ThreeAtmCard
                key={i}
                position={[-handSize * 0.22 + i * 0.53, 0, 0]}
                width={0.5}
                height={0.08}
                handleClick={handleClick}
                isTopCylinder={true}
                rotation={[2.8, 0, 0]}
                color={player.color}
                type={playerCards && i < playerCards.length ? playerCards[i] : null}
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