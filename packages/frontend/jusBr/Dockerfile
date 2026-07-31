FROM node:22-alpine

WORKDIR /app

# Copia apenas os arquivos de dependência primeiro (cache layer)
COPY package.json package-lock.json ./
RUN npm ci

# Copia o restante do código
COPY . .

EXPOSE 5178

# vite server exposto para o Docker
CMD ["npx", "vite", "--host", "0.0.0.0", "--port", "5178"]
