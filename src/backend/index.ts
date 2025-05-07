import express from "express";
import http from "http";
import { Server } from "socket.io";
import Board from "./src/Board";
import Player from "./src/Player";
import Utils from "./src/Utils";
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

    const character = Board.removeRandomCharacter();
    if (character === null) {
      socket.emit('error', 'The game is full.');
      return;
    }

    const player = new Player(playerID, playerName.trim(), character);
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
      io.emit('log', `${player.name} plays a card.`);
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

  socket.on('bet', (playerID, betValue) => {
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
      const isBetting = player.bet(betValue);
      if (isBetting) {
        io.emit('log', `${player.name} bet ${betValue}`);
      } else {
        player.skip = true;
        io.emit('log', `${player.name} is not following the bet.`);
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
      const succed = player.pick(playerName.trim());
      if (succed)
        io.emit('log', `${player.name} picks ${playerName}'s card.`);
      else
        io.emit('log', `${player.name} picks ${playerName}'s skull card.`);
      const gameOver = Board.playTurn();
      if (gameOver)
        io.emit('log', `${Board.winner?.name} wins the game.`);
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
        console.log('error', error.message);
      } else {
        socket.emit('error', 'An unknown error has occurred.');
      }
    }
  });

  socket.on("requestHand", (playerID) => {

    const player = Utils.getPlayerById(playerID);
    if (!player) {
      socket.emit('error', 'Player not found.');
      return;
    }

    const data = {
      playerID: playerID,
      cards: player.hand,
    }

    socket.emit("hand", data);
  });

  socket.on("kickCurrentPlayer", () => {

    try {
      let playerName = Board.kickCurrentPlayer();
      io.emit('log', `${playerName} has been kicked from the game.`);
      io.emit('board', Board.getPublicData());
    }
    catch (error) {
      if (error instanceof Error) {
        socket.emit('error', error.message);
      } else {
        socket.emit('error', 'An unknown error has occurred.');
      }
    }
  })

});

server.listen(50004, '0.0.0.0', () => console.log("Server running on 50004"));