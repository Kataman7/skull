import express from "express";
import http from "http";
import { Server } from "socket.io";
import randomColor from 'randomcolor';
import Board from "./src/Board";
import Player from "./src/Player";
import Utils from "./src/Utils";
import { ActionType } from "./src/Types";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {

  console.log("socket connecté :", socket.id);
  socket.emit('board', Board.getPublicData());
  socket.emit('log', 'Connection successful.');

  socket.on('join', (playerName, playerID) => {
    
    if (!playerName || typeof playerName !== 'string' || playerName.trim() === '') {
      socket.emit('error', 'Invalid player name.');
      return;
    }

    const player = new Player(playerID, playerName.trim(), "Clown");
    try {
      Board.addPlayer(player);
      io.emit('board', Board.getPublicData());
      io.emit('log', `${player.name} has joined the game.`);
      socket.emit('join', true);
    } catch (error) {
      if (error instanceof Error) {
        socket.emit('error', error.message);
      } else {
        socket.emit('error', 'An unknown error has occurred.');
      }
    }
  });

  socket.on('playCard', (playerID, handIndex) => {

    if (typeof handIndex !== 'number') {
      socket.emit('error', 'Invalid card index.');
      return;
    }

    const player = Utils.getPlayerById(playerID);
    if (!player) {
      socket.emit('error', 'Player not found.');
      return;
    }

    try {
      player.playCard(handIndex);
      io.emit('log', `${player.name} plays a card`);
      Board.playTurn();
      io.emit('board', Board.getPublicData());
    } catch (error) {
      if (error instanceof Error) {
        socket.emit('error', error.message);
      } else {
        socket.emit('error', 'An unknown error has occurred.');
      }
    }
  });

  socket.on('bet', (playerID, betValue) =>{
    if (typeof betValue !== 'number' || betValue <= 0) {
      socket.emit('error', 'Invalid bet value.');
      return;
    }

    const player = Utils.getPlayerById(playerID);
    if (!player) {
      socket.emit('error', 'Player not found.');
      return;
    }

    try {
      if (betValue <= Board.betValue) {
        if (playerID === Board.players[Board.currentTurn]?.id) {
          player.skip = true;
          io.emit('log', `${player.name} is not following the bet.`);
        }
      }
      else {
        player.bet(betValue);
        io.emit('log', `${player.name} bet ${betValue}`);
      }
      Board.playTurn();
      io.emit('board', Board.getPublicData());
    } catch (error) {
      if (error instanceof Error) {
        socket.emit('error', error.message);
      } else {
        socket.emit('error', 'An unknown error has occurred.');
      }
    }
  })

  socket.on('pick', (playerID, playerName) => {
    if (!playerName || typeof playerName !== 'string' || playerName.trim() === '') {
      socket.emit('error', 'Invalid player name.');
      return;
    }

    const player = Utils.getPlayerById(playerID);
    if (!player) {
      socket.emit('error', 'Player not found.');
      return;
    }

    try {
      player.pick(playerName.trim());
      io.emit('log', `${player.name} chose ${playerName}'s card.`);
      Board.playTurn();
      io.emit('board', Board.getPublicData());
    } catch (error) {
      if (error instanceof Error) {
        socket.emit('error', error.message);
      } else {
        socket.emit('error', 'An unknown error has occurred.');
      }
    }
  });

  socket.on("leave", (playerID) => {
    try {
      const playerName = Board.removePlayer(playerID);
      io.emit('board', Board.getPublicData());
      io.emit('log', `${playerName} has left the game.`);
    } catch (error) {
      if (error instanceof Error) {
        socket.emit('error', error.message);
      } else {
        socket.emit('error', 'An unknown error has occurred.');
      }
    }
  });
});

server.listen(3001, () => console.log("Server running on 3001"));