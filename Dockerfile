# Base leve com Node.js e Chromium
FROM mcr.microsoft.com/playwright:v1.43.1-jammy

# Define diretório da aplicação
WORKDIR /app

# Copia os arquivos
COPY . .

# Instala dependências
RUN npm install

# Porta padrão para o Fly.io
ENV PORT=3000

# Inicia o app
CMD ["node", "index.js"]
