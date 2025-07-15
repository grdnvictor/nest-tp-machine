FROM node:18-alpine

WORKDIR /app

# Copier les fichiers package.json et package-lock.json (si disponible)
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production && npm cache clean --force

# Copier le reste du code source
COPY . .

# Générer le client Prisma
RUN npx prisma generate

# Construire l'application
RUN npm run build

# Exposer le port
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "run", "start:prod"]
