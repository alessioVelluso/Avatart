FROM node:21-bullseye

# Imposta la directory di lavoro all'interno del contenitore
WORKDIR /app

# Copia i file del progetto nella directory di lavoro
COPY ./back/package.json ./
COPY ./back/package-lock.json ./

# Installa le dipendenze del progetto
RUN npm install

# Copia il resto del codice nell'immagine
COPY ./back/dist/ ./
COPY ./back/client ./client

# Espone la porta su cui l'applicazione sarà eseguita
EXPOSE 3000

# Comando per avviare l'applicazione
CMD ["node", "server.js"]
