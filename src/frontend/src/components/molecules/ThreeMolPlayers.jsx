import { useEffect, useState } from "react"
import { useSocketContext } from "../../lib/hooks/useSocketContext"
import { getPlayerPositionsAndRotations } from "../../lib/helpers/utils"
import ThreeAtmSpotLight from "../atoms/ThreeAtmSpotLight"
import ThreeMolCards from "./ThreeMolCards"
import { useDispatch } from "react-redux"
import { playerActions } from "../../lib/store/slices/playerSlice"
import ThreeAtmCharacter from "../atoms/ThreeAtmCharacter"
import { useSoundFX } from "../../lib/hooks/useSoundFX"
import ThreeAtmGlowLight from "../atoms/ThreeAtomGlowLight"

const ThreeMolPlayers = () => {
    // ✅ TOUS les hooks d'abord, avant toute condition
    const dispatch = useDispatch()
    const { board } = useSocketContext()
    const [amount, setAmount] = useState(0)
    const [lastTurnIndex, setLastTurnIndex] = useState(0)
    const { play } = useSoundFX()

    // ✅ Gestion sécurisée des cas où board est null
    const numberPlayer = board?.players?.length || 0
    const turnIndex = board?.currentTurn || 0

    // ✅ Calculs sécurisés avec vérification
    const playerData = numberPlayer > 0 ? getPlayerPositionsAndRotations(numberPlayer, 4) : []
    const lightData = numberPlayer > 0 ? getPlayerPositionsAndRotations(numberPlayer, 4) : []
    const cardData = numberPlayer > 0 ? getPlayerPositionsAndRotations(numberPlayer, 2) : []

    // ✅ useEffect avec dépendances correctes
    useEffect(() => {
        if (board && numberPlayer > 0 && playerData[turnIndex]) {
            dispatch(playerActions.setPosition(playerData[turnIndex].position))
            dispatch(playerActions.setRotation(playerData[turnIndex].rotation))
            setAmount(numberPlayer)

            if (turnIndex !== lastTurnIndex) {
                setLastTurnIndex(turnIndex)
                play('spotlight')
            }
        }
    }, [board, numberPlayer, turnIndex, playerData, dispatch])

    // ✅ Retour conditionnel APRÈS tous les hooks
    if (!board || numberPlayer <= 0) {
        return null
    }

    return (
        <>
            <ThreeAtmSpotLight
                position={[0, 25, 0]}
                targetPosition={lightData[turnIndex].position}
                intensity={1000}
                angle={Math.PI / 75}
                distance={2000}
                coneOpacity={0.14}
                penumbra={0.9}
            />
            <ThreeAtmSpotLight
                position={[lightData[turnIndex].position[0], 25, lightData[turnIndex].position[2]]}
                targetPosition={lightData[turnIndex].position}
                intensity={1000}
                angle={Math.PI / 60}
                distance={2000}
                coneOpacity={0}
                penumbra={0.9}
            />
            {playerData.map((data, index) => (
                <ThreeAtmCharacter
                    key={index}
                    folder={'characters'}
                    name={board.players[index].character}
                    position={data.position}
                    rotation={data.rotation}
                    point={board.players[index].point}
                />
            ))}
            {cardData.map((data, index) => (
                <ThreeMolCards
                    key={index}
                    position={data.position}
                    name={board.players[index].name}
                    amount={board.players[index].deck}
                    color={board.players[index].color}
                />
            ))}
        </>
    )
}

export default ThreeMolPlayers