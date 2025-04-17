import { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import { logsActions } from '../store/slices/logSlice';
import { playerActions } from '../store/slices/playerSlice';

const SERVER_URL = 'http://88.166.205.108:50004/';

export const useSocket = () => {
  const [connected, setConnected] = useState(false);
  const [board, setBoard] = useState(null);
  const [error, setError] = useState(null);
  const [hand, setHand] = useState(null);
  const socketRef = useRef(null);
  const dispatch = useDispatch()
  const playerID = useSelector((state) => state.player.id)

  useEffect(() => {
    // Créer la connexion Socket.IO
    socketRef.current = io(SERVER_URL);

    // Gestionnaire de connexion
    socketRef.current.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
      setError(null);
    });

    // Gestionnaire de déconnexion
    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    socketRef.current.on('join', (bool) => {
      if (bool) {
        dispatch(playerActions.setInGame(true))
      }
    });

    // Recevoir l'état du jeu
    socketRef.current.on('board', (data) => {
      console.log('Received board update:', data);
      setBoard(data);
    });

    // Gestionnaire d'erreurs
    socketRef.current.on('error', (errorMessage) => {
      console.error('Server error:', errorMessage);
      setError(errorMessage);
      dispatch(logsActions.addMessage(errorMessage));
    });

    socketRef.current.on('log', (message) => {
      console.log('Message du serveur:', message);
      dispatch(logsActions.addMessage(message));
    });

    socketRef.current.on('hand', (data) => {
      if (data.playerID === playerID) {
        setHand(data.cards);
        console.log('Received hand:', data.cards);
      }
    })

    // Nettoyage lors du démontage du composant
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Actions à envoyer au serveur
  const joinGame = useCallback((playerName) => {
    socketRef.current.emit('join', playerName, playerID);
  }, []);

  const leaveGame = useCallback(() => {
    socketRef.current.emit('leave', playerID);
  }, []);

  const playCard = useCallback((handIndex) => {
    socketRef.current.emit('playCard', playerID, handIndex);
  }, []);

  const placeBet = useCallback((betValue) => {
    socketRef.current.emit('bet',  playerID, betValue);
  }, []);

  const pickPlayer = useCallback((playerName) => {
    socketRef.current.emit('pick', playerID, playerName);
  }, []);

  const requestHand = useCallback(() => {
    socketRef.current.emit('requestHand', playerID);
  }, []);

  return {
    connected,
    board,
    error,
    hand,
    joinGame,
    leaveGame,
    playCard,
    placeBet,
    pickPlayer,
    requestHand,
  };
};