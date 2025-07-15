FROM node:20-alpine

# Installer les dépendances nécessaires pour bcrypt et compilation native
RUN apk add --no-cache python3 make g++ libc6-compat

WORKDIR /app

# Copier les fichiers package.json et package-lock.json (si disponible)
COPY package*.json ./

# Installer TOUTES les dépendances (dev + prod) et forcer la recompilation de bcrypt
RUN npm ci --force && \
    npm rebuild bcrypt --build-from-source && \
    npm cache clean --force

# Copier le reste du code source
COPY . .

# Générer le client Prisma
RUN npx prisma generate

# Construire l'application avec npx
RUN npx nest build

# Nettoyer les devDependencies après le build (optionnel)
RUN npm prune --production

# Exposer le port
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "run", "start:prod"]