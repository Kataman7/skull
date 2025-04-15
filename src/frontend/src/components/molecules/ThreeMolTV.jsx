import { useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { Suspense, useRef, useEffect, useState } from "react";
import { Html } from "@react-three/drei";
import { useSocketContext } from "../../lib/contexts/SocketContext";
import { getPlayerPositionsAndRotations } from "../../lib/helpers/utils";
import AtmTvButton from "../atoms/AtmTvButton";
import { useSelector } from "react-redux";

const ThreeMolTV = ({
    position = [0, 0, 0],
    scale = 0.006,
    debug = true
}) => {

    const tvRef = useRef();
    const { board, placeBet } = useSocketContext();
    const [rotation, setRotation] = useState(Math.PI * 0.95);
    const [buttonVisible, setButtonVisible] = useState(false);
    const playerName = useSelector((state) => state.player.name);
    const [betValue, setBetValue] = useState(0);

    // Charger le modèle TV
    const fbx = useLoader(FBXLoader, "assets/models/tvs/tv/tv.fbx");
    const model = fbx.clone();

    const offsetX = 0.010;
    const offsetY = 0.055;
    const offsetZ = -0.393;

    // orienter le modèle vers le player
    useEffect(() => {
        if (board && board.players) {
            if ( board.players.length > 0) {
                const datas = getPlayerPositionsAndRotations(board.players.length, 2)
                if (datas && datas.length > 0 && datas[board.currentTurn]) {
                    setRotation(datas[board.currentTurn].rotation || 0)
                }
    
                const player = board.players[board.currentTurn];
                if (player && player.name === playerName && player.deck > 0)
                    setButtonVisible(true)
                else setButtonVisible(false)
            }
            else setButtonVisible(false);
            setBetValue(board.betValue);
        }
    }, [board]);

    const countCardOnTable = () => {
        let count = 0;
        board.players.forEach((player) => {
            if (player.deck > 0) {
                count += player.deck;
            }
        });
        return count;
    }

    const handlePlusClick = () => {
        if (betValue < countCardOnTable()) {
            setBetValue((prev) => prev + 1);
        }
    }

    const handleMinusClick = () => {
        if (betValue > board.betValue) {
            setBetValue((prev) => prev - 1);
        }
    }

    const handleValidClick = () => {
        placeBet(betValue);
    }

    return (
        <group rotation={[0, rotation, 0]}>
            <group rotation={[0.5, 0, 0]}>
                {/* TV MODEL */}
                <group position={position} scale={scale}>
                    <Suspense fallback={null}>
                        <primitive ref={tvRef} object={model} />
                        {debug && <axesHelper args={[5]} />}
                    </Suspense>
                </group>

                {/* ÉCRAN HTML - POSITION ET ROTATION CALCULÉES DYNAMIQUEMENT */}
                <group
                    position={[
                        position[0] + offsetX,
                        position[1] + offsetY,
                        position[2] + offsetZ
                    ]}
                    scale={1.2}
                    rotation={[0, Math.PI, 0]}
                >
                    <Html
                        transform
                        occlude={[tvRef]}
                        distanceFactor={1}
                        style={{
                            width: '309px',
                            height: '230px',
                            backgroundColor: 'white',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '20px',
                            color: 'black',
                            fontSize: '24px',
                            fontFamily: 'Arial, sans-serif',
                        }}
                    >
                        {(
                            <>
                                <h2 style={{ fontSize: '200px', fontWeight: 'bold' }}>
                                    {betValue}
                                </h2>

                                {buttonVisible && (
                                    <>
                                        <AtmTvButton left={5} top={5} text="+" color="green" handleClick={handlePlusClick} />
                                        <AtmTvButton left={5} bottom={5} text="-" color="red" handleClick={handleMinusClick} />
                                        <AtmTvButton right={5} bottom={5} text="✓" color="green" handleClick={handleValidClick} />
                                    </>
                                )}


                            </>
                        )}
                    </Html>
                </group>
            </group>
        </group>
    );
};

export default ThreeMolTV;