import { createContext, useContext, useEffect, useState } from "react";

// Créer un contexte pour exposer les fonctions de lecture d'effets sonores
const SoundFXContext = createContext();

// Liste des effets sonores avec leurs clés
const soundEffects = {
  click: "public/assets/sounds/fx/click.mp3",
  card: "public/assets/sounds/fx/card.mp3",
  spotlight: "public/assets/sounds/fx/spotlight.mp3",
  knock: "public/assets/sounds/fx/knock.mp3",
  gunshot: "public/assets/sounds/fx/gunshot.mp3",
  denied: "public/assets/sounds/fx/denied.mp3",
  correct: "public/assets/sounds/fx/correct.mp3",
  gameOver: "public/assets/sounds/fx/gameOver.mp3",
};

export function SoundFXProvider({ children }) {
  const [loaded, setLoaded] = useState(false);
  const [sounds, setSounds] = useState({});
  const [enabled, setEnabled] = useState(true);

  // Préchargement des effets sonores
  useEffect(() => {
    const loadedSounds = {};
    
    Object.entries(soundEffects).forEach(([key, path]) => {
      console.log(`Trying to load sound: ${key} from path: ${path}`);

      const audio = new Audio();

      audio.addEventListener('error', (e) => {
        console.error(`Failed to load sound ${key}:`, e);
      });

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