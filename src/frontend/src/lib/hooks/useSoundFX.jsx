import { createContext, useContext, useEffect, useState } from "react";
import { getAssetPath } from "../helpers/utils";

// Créer un contexte pour exposer les fonctions de lecture d'effets sonores
const SoundFXContext = createContext();

// Liste des effets sonores avec leurs clés
const soundEffects = {
  click: getAssetPath("assets/sounds/fx/click.mp3"),
  card: getAssetPath("assets/sounds/fx/card.mp3"),
  spotlight: getAssetPath("assets/sounds/fx/spotlight.mp3"),
  knock: getAssetPath("assets/sounds/fx/knock.mp3"),
  gunshot: getAssetPath("assets/sounds/fx/gunshot.mp3"),
  denied: getAssetPath("assets/sounds/fx/denied.mp3"),
  correct: getAssetPath("assets/sounds/fx/correct.mp3"),
  gameOver: getAssetPath("assets/sounds/fx/gameOver.mp3"),
};

export function SoundFXProvider({ children }) {
  const [loaded, setLoaded] = useState(false);
  const [sounds, setSounds] = useState({});
  const [enabled, setEnabled] = useState(true);

  // Préchargement des effets sonores
  useEffect(() => {
    const loadedSounds = {};
    
    Object.entries(soundEffects).forEach(([key, path]) => {
      const audio = new Audio();
      audio.src = path;
      audio.preload = "auto";
      loadedSounds[key] = audio;
    });
    
    setSounds(loadedSounds);
    setLoaded(true);
  }, []);

  // Fonction pour jouer un effet sonore
  const play = (soundName, volume = 1.0) => {
    if (!enabled || !loaded) return;
    
    const sound = sounds[soundName];
    if (sound) {
      const audioClone = sound.cloneNode();
      audioClone.volume = volume;
      audioClone.play();
    } else {
      console.warn(`Sound effect "${soundName}" not found`);
    }
  };

  const toggleSounds = () => setEnabled(prev => !prev);

  return (
    <SoundFXContext.Provider value={{ play, toggleSounds, enabled }}>
      {children}
    </SoundFXContext.Provider>
  );
}

// Hook personnalisé pour utiliser les effets sonores
export const useSoundFX = () => {
  const context = useContext(SoundFXContext);
  if (!context) {
    throw new Error("useSoundFX must be used within a SoundFXProvider");
  }
  return context;
};