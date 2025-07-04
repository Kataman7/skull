import { createContext, useContext, useState } from "react";

// Créer un contexte pour exposer les fonctions de lecture d'effets sonores
const SoundFXContext = createContext();

// Liste des effets sonores avec leurs clés
const soundEffects = {
  click: "public/assets/sounds/FX/click.mp3",
  card: "public/assets/sounds/FX/card.mp3",
  spotlight: "public/assets/sounds/FX/spotlight.mp3",
  knock: "public/assets/sounds/FX/knock.mp3",
  gunshot: "public/assets/sounds/FX/gunshot.mp3",
  denied: "public/assets/sounds/FX/denied.mp3",
  correct: "public/assets/sounds/FX/correct.mp3",
  gameOver: "public/assets/sounds/FX/gameover.mp3",
  allin: "public/assets/sounds/FX/allin.mp3",
};

export function SoundFXProvider({ children }) {
  const [enabled, setEnabled] = useState(true);

  // Fonction modifiée pour jouer un effet sonore avec création dynamique d'éléments audio
  const play = (soundName, volume = 1.0) => {
    if (!enabled) return;
    
    const soundPath = soundEffects[soundName];
    if (!soundPath) {
      console.warn(`Sound effect "${soundName}" not found`);
      return;
    }

    try {
      // Créer un nouvel élément audio pour chaque son
      const audioElement = new Audio(soundPath);
      
      // Définir le volume
      audioElement.volume = volume;
      
      // Écouter les erreurs
      const errorHandler = (e) => {
        console.error(`Error playing sound ${soundName}:`, e);
        audioElement.removeEventListener('error', errorHandler);
      };
      
      audioElement.addEventListener('error', errorHandler, { once: true });
      
      // Nettoyer l'élément une fois la lecture terminée
      audioElement.addEventListener('ended', () => {
        audioElement.remove(); // Libérer les ressources
      }, { once: true });
      
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