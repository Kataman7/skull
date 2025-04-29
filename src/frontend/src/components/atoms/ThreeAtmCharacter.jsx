import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import { TextureLoader, AnimationMixer, Clock, LoopOnce } from "three"
import { useRef, useState, useEffect, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import ThreeAtmGlowLight from "./ThreeAtomGlowLight";

const ThreeAtmCharacter = ({
    position = [0, 0, 0],
    scale = 0.02,
    folder = "Characters",
    name = "Character",
    rotation = 0,
    point = 0,
    animation = "hand", 
    playAnimation = true,
    returnToIdle = true,
    idleAnimation = "hand"
}) => {
    const [model, setModel] = useState(null);
    const [mixer, setMixer] = useState(null);
    const [animations, setAnimations] = useState({});
    const [currentAnimation, setCurrentAnimation] = useState(null);
    const characterRef = useRef();
    const clock = useRef(new Clock());
    name = "Character_03"

    // Chargement du modèle et de ses textures
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
                    
                    // Associer spécifiquement pour l'animation demandée
                    if (clip.name.toLowerCase().includes(animation.toLowerCase())) {
                        animationsMap[animation] = clip;
                    }
                });

                // Charger les animations supplémentaires si nécessaire
                try {
                    // Chargement de l'animation spécifiée
                    const animationPath = `/assets/models/${folder}/${name}/animations/${animation}.fbx`;
                    console.log("Chargement animation:", animationPath);
                    
                    const animationModel = await new Promise((resolve, reject) => {
                        fbxLoader.load(animationPath, resolve, undefined, reject);
                    });

                    // Ajouter les animations au mixer avec le nom exact demandé
                    if (animationModel.animations.length > 0) {
                        console.log(`Animation ${animation} chargée avec ${animationModel.animations.length} clips`);
                        animationModel.animations.forEach((clip) => {
                            animationsMap[animation] = clip; // Utiliser le nom demandé
                            animationsMap[clip.name] = clip; // Garder aussi le nom original
                        });
                    }
                } catch (animError) {
                    console.warn(`Animation ${animation} non trouvée:`, animError);
                }
                
                // Charger aussi l'animation idle si différente
                if (idleAnimation !== animation) {
                    try {
                        const idlePath = `/assets/models/${folder}/${name}/animations/${idleAnimation}.fbx`;
                        console.log("Chargement idle:", idlePath);
                        
                        const idleModel = await new Promise((resolve, reject) => {
                            fbxLoader.load(idlePath, resolve, undefined, reject);
                        });
                        
                        if (idleModel.animations.length > 0) {
                            console.log(`Animation ${idleAnimation} chargée avec ${idleModel.animations.length} clips`);
                            // Associer au nom "idle" explicitement
                            animationsMap[idleAnimation] = idleModel.animations[0];
                        }
                    } catch (idleError) {
                        console.warn(`Animation idle ${idleAnimation} non trouvée:`, idleError);
                    }
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
    }, [folder, name, animation, idleAnimation]);

    // Gestion des animations
    useEffect(() => {
        if (!mixer || !animations || Object.keys(animations).length === 0) return;
        
        console.log("Animation à jouer:", animation);
        console.log("Animations disponibles:", Object.keys(animations));
        
        // Si l'animation demandée n'existe pas, chercher une animation similaire
        let animToPlay = animation;
        if (!animations[animation]) {
            const keys = Object.keys(animations);
            for (const key of keys) {
                if (key.toLowerCase().includes(animation.toLowerCase())) {
                    animToPlay = key;
                    console.log(`Animation exacte "${animation}" non trouvée, utilisation de "${key}"`);
                    break;
                }
            }
        }
        
        // Stopper l'animation actuelle
        if (currentAnimation) {
            currentAnimation.fadeOut(0.2);
        }
        
        // Jouer la nouvelle animation
        if (animations[animToPlay]) {
            const action = mixer.clipAction(animations[animToPlay]);
            
            // Si ce n'est pas idle, configurer pour une seule lecture
            if (animToPlay !== idleAnimation) {
                action.setLoop(LoopOnce);
                action.clampWhenFinished = true;
                
                // Configurer le retour à idle après la fin
                if (returnToIdle && animations[idleAnimation]) {
                    mixer.addEventListener('finished', function onFinished() {
                        mixer.removeEventListener('finished', onFinished);
                        
                        console.log(`Animation ${animToPlay} terminée, retour à ${idleAnimation}`);
                        action.fadeOut(0.3);
                        
                        const idleAction = mixer.clipAction(animations[idleAnimation]);
                        idleAction.reset().fadeIn(0.3).play();
                        setCurrentAnimation(idleAction);
                    });
                }
            }
            
            action.reset().fadeIn(0.2).play();
            setCurrentAnimation(action);
        } else {
            console.warn(`Aucune animation correspondant à "${animation}" trouvée!`);
        }
    }, [mixer, animations, animation, playAnimation, returnToIdle, idleAnimation]);

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