#!/bin/bash

echo "Démarrage du serveur backend..."
cd src/backend

if [ ! -d "node_modules" ]; then
  echo "Installation des dépendances du backend..."
  npm install
else
  echo "Dépendances du backend déjà installées."
fi

npm start &

echo "Démarrage du serveur frontend..."
cd ../frontend

if [ ! -d "node_modules" ]; then
  echo "Installation des dépendances du frontend..."
  npm install
else
  echo "Dépendances du frontend déjà installées."
fi

npm run dev & 

wait
