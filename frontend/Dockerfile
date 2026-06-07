FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --include=optional
COPY . .
EXPOSE 5173
# npm ci en build + reinstall en runtime porque docker-compose monta ./frontend:/app
# anulando node_modules de la imagen
CMD ["sh", "-c", "npm ci --include=optional && npm run dev -- --host"]