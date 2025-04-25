FROM node:23-slim

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY tsconfig.json ./

# Installer les dépendances
RUN npm install

# Copier le code source
COPY . .

EXPOSE 50004

# Utiliser ts-node pour exécuter directement index.ts
CMD ["npx", "ts-node", "index.ts"]