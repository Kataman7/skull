FROM node:23-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY ./public/assets/sounds /app/public/assets/sounds
COPY . .

# Update for Vite host configuration
EXPOSE 5173

# Use this command to make Vite listen on all interfaces
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]