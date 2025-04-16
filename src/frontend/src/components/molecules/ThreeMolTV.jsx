import { useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { Suspense, useRef, useEffect, useState } from "react";
import { Html } from "@react-three/drei";
import { useSocketContext } from "../../lib/contexts/SocketContext";
import { getPlayerPositionsAndRotations } from "../../lib/helpers/utils";
import AtmTvButton from "../atoms/AtmTvButton";
import { useSelector } from "react-redux";

// ✅ Ajout des styles pour l'effet TV catholique
const retroTvStyle = {
    width: '313px',
    height: '255px',
    backgroundColor: '#fffaf0', // Couleur sépia
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    color: '#583e23',
    fontSize: '24px',
    fontFamily: 'serif',
    userSelect: 'none',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: 'inset 0 0 60px rgba(139, 69, 19, 0.4)',
    imageRendering: 'pixelated',
    transform: 'scale(1.01)',
};

// ✅ Effet lignes de balayage
const scanlineStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `repeating-linear-gradient(
        0deg,
        rgba(0, 0, 0, 0),
        rgba(0, 0, 0, 0) 1px,
        rgba(0, 0, 0, 0.3) 1px,
        rgba(0, 0, 0, 0.3) 2px
    )`,
    pointerEvents: 'none',
    zIndex: 2,
};

// ✅ Effet grain TV
const noiseStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    opacity: 0.1,
    pointerEvents: 'none',
    mixBlendMode: 'multiply',
    zIndex: 1,
};

const ThreeMolTV = ({
    position = [0, 0, 0],
    scale = 0.006,
    debug = true
}) => {
    const tvRef = useRef();
    const { board, placeBet } = useSocketContext();
    // ✅ Variable d'état nommée "tvRotation" pour éviter la confusion
    const [tvRotation, setTvRotation] = useState(Math.PI * 0.95);
    const [buttonVisible, setButtonVisible] = useState(false);
    const playerName = useSelector((state) => state.player.name);
    const [betValue, setBetValue] = useState(0);

    // Charger le modèle TV
    const fbx = useLoader(FBXLoader, "assets/models/tvs/tv/tv.fbx");
    const model = fbx.clone();

    const offsetX = 0.010;
    const offsetY = 0.06;
    const offsetZ = -0.393;

    // orienter le modèle vers le player
    useEffect(() => {
        if (board && board.players) {
            if (board.players.length > 0) {
                const datas = getPlayerPositionsAndRotations(board.players.length, 2)
                if (datas && datas.length > 0 && datas[board.currentTurn]) {
                    // ✅ Utiliser la nouvelle variable
                    setTvRotation(datas[board.currentTurn].rotation || 0)
                }
    
                const player = board.players[board.currentTurn];
                if (player && player.name === playerName && player.deck > 0)
                    setButtonVisible(true)
                else setButtonVisible(false)
            }
            else setButtonVisible(false);
            setBetValue(board.betValue);
        }
    }, [board, playerName]);

    // ✅ Code pour l'animation de scintillement
    useEffect(() => {
        if (!document.getElementById('retro-tv-style')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'retro-tv-style';
            styleElement.innerHTML = `
                @keyframes flicker {
                  0% { opacity: 0.97; }
                  50% { opacity: 0.99; }
                  100% { opacity: 0.97; }
                }
                .tv-screen {
                    animation: flicker 0.15s infinite;
                }
            `;
            document.head.appendChild(styleElement);
            
            return () => {
                const elem = document.getElementById('retro-tv-style');
                if (elem) document.head.removeChild(elem);
            };
        }
    }, []);

    // Reste de ton code...
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
        // ✅ Utiliser tvRotation au lieu de rotation
        <group rotation={[0, tvRotation || 0, 0]}>
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
                        style={retroTvStyle}
                        className="tv-screen"
                    >
                        <>
                            {/* Effets visuels TV catholique */}
                            <div style={scanlineStyle} />
                            <div style={noiseStyle} />
                            
                            <h2 style={{ 
                                letterSpacing: '-20px', 
                                fontSize: '180px', 
                                fontWeight: 'bold', 
                                marginRight: '20px',
                                fontFamily: 'Arial',
                                color: '#120d0a',
                                textShadow: '2px 2px 2px rgba(0, 0, 0, 0.3)'
                            }}>
                                {betValue}
                            </h2>

                            {buttonVisible && (
                                <>
                                    <AtmTvButton left={5} top={5} text="+" color="#3c6e47" handleClick={handlePlusClick} />
                                    <AtmTvButton left={5} bottom={5} text="-" color="#8e3a30" handleClick={handleMinusClick} />
                                    <AtmTvButton right={5} bottom={5} text="✓" color="#3c6e47" handleClick={handleValidClick} />
                                </>
                            )}
                        </>
                    </Html>
                </group>
            </group>
        </group>
    );
};

export default ThreeMolTV;