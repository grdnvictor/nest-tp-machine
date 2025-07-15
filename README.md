z# API NestJS avec Prisma

[![Docker Ready](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat&logo=docker)](https://docker.com/)
[![badge de fatigue](https://img.shields.io/badge/On%20préfère%20le%20JS/TS%20pitié-💀-F7DF1E?style=flat&logo=typescript&logoColor=white&labelColor=3178C6)](https://www.typescriptlang.org/)

Ce projet est une application NestJS utilisant Prisma ORM pour interagir avec une base de données PostgreSQL.

## Technologies utilisées

- [NestJS](https://nestjs.com/) v11.0
- [Prisma ORM](https://www.prisma.io/) v6.4
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/) et Docker Compose
- [Swagger](https://swagger.io/) pour la documentation de l'API

## Prérequis

- Node.js (version 18 ou supérieure)
- Docker et Docker Compose
- npm ou yarn

## Configuration

1. Clonez ce dépôt
2. Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=dbname
```

## Installation

```bash
# Installation des dépendances
npm install

# Génération du client Prisma
npx prisma generate
```

## Exécution en développement

### Avec Docker Compose

```bash
docker-compose up
```

Cela démarrera :
- Un serveur PostgreSQL
- L'application NestJS en mode développement
- Un serveur MailDev pour tester les emails (accessible sur http://localhost:1080)

### Sans Docker

```bash
# Mode développement avec hot reload
npm run start:dev

# Mode debug
npm run start:debug
```

## Structure du projet

```
├── prisma/             # Configuration et schéma Prisma
├── src/                # Code source de l'application
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── main.ts
│   └── prisma.service.ts
├── compose.yaml        # Configuration Docker Compose
├── Dockerfile          # Configuration Docker pour l'application
└── package.json        # Dépendances et scripts npm
```

## Modèles de données

Le projet contient actuellement le modèle suivant :

### User
- id: Int (clé primaire, auto-incrémenté)
- email: String (unique)
- password: String

## Documentation API

Une fois l'application démarrée, la documentation Swagger est disponible à l'adresse :

```
http://localhost:3000/api
```

## Scripts disponibles

```bash
# Compilation
npm run build

# Démarrage en production
npm run start:prod

# Linting
npm run lint

# Formatage du code
npm run format
```

## Licence

Ce projet est sous licence [UNLICENSED](LICENSE).
