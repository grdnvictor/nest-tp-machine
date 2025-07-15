# BookTracker API - NestJS avec Prisma
> Bonne correction QUENTIN 🚀🚀🚀 📚 #livre #lecture

[![Docker Ready](https://img.shields.io/badge/Dockerisé-de-fou-2496ED?style=flat&logo=docker)](https://docker.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)

Application de gestion de collections de livres avec authentification à deux facteurs et gestion des rôles.

## 🔧 Installation

1. **Cloner le projet**
```bash
git clone git@github.com:grdnvictor/nest-tp-machine.git booktracker-api
cd booktracker-api
```

2. **Configuration**
```bash
cp .env.example .env
# Modifier les variables dans .env si nécessaire
```

3. **Démarrage avec Docker**
```bash
docker-compose up -d
```

### Commandes Prisma utiles

```bash
# Générer le client Prisma
npm run db:generate

# Appliquer les migrations
npm run db:migrate

# Interface graphique
npm run db:studio

# Peupler la base avec des données d'exemple
npm run db:seed
```

## 📚 Documentation API

Documentation Swagger disponible sur : `http://localhost:3000/api`

## 🧪 Comptes de test

Après le seed de la base de données :

**Administrateur**
- Email : `admin@booktracker.com`
- Mot de passe : `admin123`

**Utilisateur**
- Email : `user@booktracker.com`
- Mot de passe : `user123`

## 📧 Emails de développement

MailDev est inclus pour tester les emails en local :
- Interface web : `http://localhost:1080`
- Serveur SMTP : `localhost:1025`

## 📁 Structure du projet

```
src/
├── auth/
│   ├── decorators/
│   ├── dto/
│   ├── guards/
│   ├── auth.controller.ts
│   └── auth.service.ts
├── books/
│   ├── dto/
│   ├── books.controller.ts
│   └── books.service.ts
├── email/
│   └── email.service.ts
├── app.module.ts
├── main.ts
└── prisma.service.ts
```
