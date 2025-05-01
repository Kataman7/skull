import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import { TextureLoader, AnimationMixer, Clock, LoopOnce } from "three"
import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import ThreeAtmGlowLight from "./ThreeAtomGlowLight";
import { useSocketContext } from "../../lib/hooks/useSocketContext";

// Liste des animations à précharger pour chaque personnage
const PRELOAD_ANIMATIONS = [
    "idle", 
    "walk", 
    "die", 
    "victory", 
    "defeat"
];

const ThreeAtmCharacter = ({
    position = [0, 0, 0],
    scale = 0.02,
    folder = "Characters",
    name = "Character",
    rotation = 0,
    point = 0,
    animation = "idle", 
    playAnimation = true,
    idleAnimation = "idle"
}) => {
    const [model, setModel] = useState(null);
    const [mixer, setMixer] = useState(null);
    const [animations, setAnimations] = useState({});
    const [returnToIdle, setReturnToIdle] = useState(true);
    const [currentAnimation, setCurrentAnimation] = useState(null);
    const {board} = useSocketContext()
    
    // États locaux pour les animations
    const [currentAnimName, setCurrentAnimName] = useState(animation);
    const [currentIdleName, setCurrentIdleName] = useState(idleAnimation);
    
    const characterRef = useRef();
    const clock = useRef(new Clock());

    // Synchroniser les états avec les props lorsqu'elles changent
    useEffect(() => {
        setCurrentAnimName(animation);
    }, [animation]);
    
    useEffect(() => {
        setCurrentIdleName(idleAnimation);
    }, [idleAnimation]);

    // Chargement du modèle et de ses textures - Utiliser les états locaux
    useEffect(() => {
        async function loadResources() {
            try {
                const fbxLoader = new FBXLoader();
                const modelPath = `/assets/models/${folder}/${name}/${name}.fbx`;
                const texturePath = `/assets/models/${folder}/${name}/${name}.png`;

                // Charger le modèle principal
                const loadedModel = await new Promise((resolve, reject) => {
                    fbxLoader.load(modelPath, resolve, undefined, reject);
                });

                // Charger la texture
                const textureLoader = new TextureLoader();
                const loadedTexture = await new Promise((resolve, reject) => {
                    textureLoader.load(texturePath, resolve, undefined, reject);
                });

                // Appliquer la texture
                loadedModel.traverse((child) => {
                    if (child.isMesh) {
                        child.material.map = loadedTexture;
                        child.material.needsUpdate = true;
                    }
                });

                // Créer un mixer pour les animations
                const newMixer = new AnimationMixer(loadedModel);
                setMixer(newMixer);

                // Stocker les animations par défaut du modèle
                const animationsMap = {};
                
                // ⚠️ FIX: Renommer animations pour correspondre aux noms attendus
                loadedModel.animations.forEach((clip) => {
                    // Stocker avec le nom original
                    animationsMap[clip.name] = clip;
                    
                    // Si le nom contient "idle" ou "Idle", l'associer aussi à "idle"
                    if (clip.name.toLowerCase().includes("idle")) {
                        animationsMap["idle"] = clip;
                    }
                });

                // Fonction pour charger une animation
                const loadAnimation = async (animName) => {
                    try {
                        const animPath = `/assets/models/${folder}/${name}/animations/${animName}.fbx`;
                        console.log(`Tentative de chargement: ${animPath}`);
                        
                        const animModel = await new Promise((resolve, reject) => {
                            fbxLoader.load(animPath, resolve, undefined, reject);
                        });
                        
                        if (animModel.animations.length > 0) {
                            console.log(`Animation ${animName} chargée avec ${animModel.animations.length} clips`);
                            animationsMap[animName] = animModel.animations[0];
                            // Stocker aussi sous le nom original
                            animModel.animations.forEach(clip => {
                                animationsMap[clip.name] = clip;
                            });
                            return true;
                        }
                        return false;
                    } catch (error) {
                        console.warn(`Animation ${animName} non trouvée:`, error);
                        return false;
                    }
                };

                // Charger toutes les animations de la liste prédéfinie
                for (const anim of PRELOAD_ANIMATIONS) {
                    // Vérifier si l'animation n'existe pas déjà
                    if (!animationsMap[anim]) {
                        await loadAnimation(anim);
                    }
                }
                
                // S'assurer que l'animation demandée est chargée
                if (!animationsMap[currentAnimName] && !PRELOAD_ANIMATIONS.includes(currentAnimName)) {
                    await loadAnimation(currentAnimName);
                }
                
                // S'assurer que l'animation idle est chargée
                if (!animationsMap[currentIdleName] && !PRELOAD_ANIMATIONS.includes(currentIdleName)) {
                    await loadAnimation(currentIdleName);
                }

                // Afficher les animations disponibles
                console.log("Animations chargées:", Object.keys(animationsMap));
                
                setModel(loadedModel);
                setAnimations(animationsMap);
            } catch (error) {
                console.error("Erreur de chargement du modèle ou de la texture:", error);
            }
        }

        loadResources();

        return () => {
            if (mixer) mixer.stopAllAction();
        };
    }, [folder, name]); // Retiré animation et idleAnimation des dépendances

    // Gestion des animations - Utilise les états locaux
    useEffect(() => {
        if (!mixer || !animations || Object.keys(animations).length === 0) return;
        
        console.log("Animation à jouer:", currentAnimName);
        console.log("Animations disponibles:", Object.keys(animations));
        
        // Si l'animation demandée n'existe pas, chercher une animation similaire
        let animToPlay = currentAnimName;
        if (!animations[currentAnimName]) {
            const keys = Object.keys(animations);
            for (const key of keys) {
                if (key.toLowerCase().includes(currentAnimName.toLowerCase())) {
                    animToPlay = key;
                    console.log(`Animation exacte "${currentAnimName}" non trouvée, utilisation de "${key}"`);
                    break;
                }
            }
        }
        
        // Stopper l'animation actuelle
        if (currentAnimation && typeof currentAnimation.fadeOut === 'function') {
            try {
                currentAnimation.fadeOut(0.2);
            } catch (error) {
                console.warn("Erreur lors de l'arrêt de l'animation:", error);
                // Forcer l'arrêt de toutes les animations en cas de problème
                mixer.stopAllAction();
            }
        }
        
        // Jouer la nouvelle animation
        if (animations[animToPlay]) {
            const action = mixer.clipAction(animations[animToPlay]);
            
            // Si ce n'est pas idle, configurer pour une seule lecture
            if (animToPlay !== currentIdleName) {
                action.setLoop(LoopOnce);
                action.clampWhenFinished = true;
                
                // Configurer le retour à idle après la fin
                if (returnToIdle && animations[currentIdleName]) {
                    mixer.addEventListener('finished', function onFinished() {
                        mixer.removeEventListener('finished', onFinished);
                        
                        console.log(`Animation ${animToPlay} terminée, retour à ${currentIdleName}`);
                        action.fadeOut(0.3);
                        
                        const idleAction = mixer.clipAction(animations[currentIdleName]);
                        idleAction.reset().fadeIn(0.3).play();
                        setCurrentAnimation(idleAction);
                    });
                }
            }
            
            action.reset().fadeIn(0.2).play();
            setCurrentAnimation(action);
        } else {
            console.warn(`Aucune animation correspondant à "${currentAnimName}" trouvée!`);
        }
    }, [mixer, animations, currentAnimName, playAnimation, returnToIdle, currentIdleName]);

    // Sécuriser l'accès aux données du board
    useEffect(() => {
        
        
        if (board && board.players && board.currentTurn !== undefined) {
            
            const currentPlayer = board.players[board.currentTurn];
            const lastCurrentPlayer = board.players[board.currentTurn - 1 < 0 ? board.players.length - 1 : board.currentTurn - 1];
            
            setCurrentAnimation('victory');

            if (currentPlayer.character === name) {
                if (board.lastAction === 'win') {
                    setCurrentAnimName('victory');
                }
                else if (board.lastAction === 'looseCard') {
                    setCurrentAnimName('defeat');
                }
            }
        }
    }, [board, name]);

    // Mise à jour du mixer à chaque frame
    useFrame(() => {
        if (mixer) {
            const delta = clock.current.getDelta();
            mixer.update(delta);
        }
    });

    return (
        <>
            {model && (
                <primitive
                    ref={characterRef}
                    object={model}
                    scale={scale}
                    position={position}
                    rotation={[0, rotation, 0]}
                />
            )}

            {point > 0 && (
                <ThreeAtmGlowLight
                    position={[position[0], position[1] + 0.01, position[2]]}
                    color="#ff0000"
                    active={true}
                    size={0.4}
                    intensity={600}
                />
            )}
        </>
    );
}

export default ThreeAtmCharacter;