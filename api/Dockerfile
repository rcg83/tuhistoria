FROM node:18-alpine
WORKDIR /app
# Solo copiamos el package.json primero para aprovechar la caché de Docker
COPY package*.json ./
RUN npm install
# Luego copiamos el resto del código
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]