FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 5000
# npm ci en build + reinstall en runtime porque docker-compose monta ./api:/app
# anulando node_modules de la imagen
CMD ["sh", "-c", "npm ci && npm run dev"]