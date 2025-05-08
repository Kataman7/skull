import { useSelector } from 'react-redux';
import AtmList from '../atoms/AtmList';
import useIsMobile from '../../lib/hooks/useIsMobile';
import { useSoundFX } from '../../lib/hooks/useSoundFX';
import { useEffect, useRef } from 'react';
import { useState } from 'react';
import { useSocketContext } from '../../lib/hooks/useSocketContext';

const MolLogs = () => {
  const messages = useSelector((state) => state.logs.messages);
  const isMobile = useIsMobile();
  const { play } = useSoundFX();
  const prevMessagesLength = useRef(0);
  const [ pointSum, setPointSum ] = useState(0);
  const { board } = useSocketContext(); // Assurez-vous d'importer le contexte de socket correctement

  useEffect(() => {
    if (board) {
      const sum = board.players.reduce((acc, player) => {
        if (player && player.point) {
          return acc + player.point;
        }
        return acc;
      }, 0);

      if (sum > pointSum) {
        play('correct');
      }

      setPointSum(sum);
    }
  }
  , [board]);


  // Surveiller les nouveaux messages et jouer des sons en fonction du contenu
  useEffect(() => {
    // Vérifier si un nouveau message a été ajouté
    if (messages.length > prevMessagesLength.current) {
      const lastMessage = messages[messages.length - 1];

      // Vérifier le contenu du dernier message et jouer les sons correspondants
      if (lastMessage) {
        const messageText = lastMessage.toLowerCase().split(' ').slice(1).join(' ')

        if (messageText.includes("'s skull card.")) {
          play('denied');
        }
        else if (messageText.includes('picks') && messageText.includes('card.')) {
          play('card');
        }
        else if (messageText.includes('has joined the game.')) {
          play('knock');
        }
        else if (messageText.includes('wins the game.')) {
          play('gameOver');
        }
        else if (messageText.includes('bet ' + board.betMaxValue)) {
          play('allin', 0.5);
        }


      }
    }

    // Mettre à jour la référence pour la prochaine comparaison
    prevMessagesLength.current = messages.length;
  }, [messages, play]);


  return (
    <AtmList label={isMobile ? '' : 'Logs'} emptyMsg='no players found' items={messages} maxHeight={isMobile ? '95px' : '300px'} />
  );
};

export default MolLogs;