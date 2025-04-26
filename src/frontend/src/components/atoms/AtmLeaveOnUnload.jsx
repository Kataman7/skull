import { useEffect } from 'react';
import { useSocketContext } from '../../lib/hooks/useSocketContext';
import { useSelector } from 'react-redux';

const AtmLeaveOnUnload = () => {
  const { leaveGame } = useSocketContext();
  const inGame = useSelector((state) => state.player.inGame);

  useEffect(() => {
    if (!inGame) return;

    const handleUnload = (event) => {
      // Envoyer le signal de départ sans attendre de confirmation
      leaveGame();
      
      // Texte pour certains navigateurs plus anciens
      event.preventDefault();
      event.returnValue = '';
    };

    // Ajouter l'écouteur d'événement
    window.addEventListener('beforeunload', handleUnload);
    
    // Nettoyage lors du démontage du composant
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [leaveGame, inGame]);

  // Ce composant ne rend rien visuellement
  return null;
};

export default AtmLeaveOnUnload;