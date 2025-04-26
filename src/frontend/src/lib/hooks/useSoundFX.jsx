import { createContext, useContext, useState } from "react";

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
  const [enabled, setEnabled] = useState(true);

  // Fonction simplifiée pour jouer un effet sonore avec l'élément audio HTML
  const play = (soundName, volume = 1.0) => {
    if (!enabled) return;
    
    const soundPath = soundEffects[soundName];
    if (!soundPath) {
      console.warn(`Sound effect "${soundName}" not found`);
      return;
    }

    try {
      const audioElement = document.getElementById('sound-fx-audio');
      if (!audioElement) return;

      // Définir la source et les paramètres
      audioElement.src = soundPath;
      audioElement.volume = volume;
      
      // Écouter les erreurs
      const errorHandler = (e) => {
        console.error(`Error playing sound ${soundName}:`, e);
        audioElement.removeEventListener('error', errorHandler);
      };
      
      audioElement.addEventListener('error', errorHandler, { once: true });
      
      // Jouer le son
      audioElement.play().catch(e => {
        console.error('Error in play():', e);
      });
    } catch (error) {
      console.error('Error in sound player:', error);
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