import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Créer un utilisateur admin
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@booktracker.com' },
    update: {},
    create: {
      email: 'admin@booktracker.com',
      password: adminPassword,
      role: Role.ADMIN,
      isEmailVerified: true,
    },
  });

  // Créer un utilisateur normal
  const userPassword = await bcrypt.hash('user123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'user@booktracker.com' },
    update: {},
    create: {
      email: 'user@booktracker.com',
      password: userPassword,
      role: Role.USER,
      isEmailVerified: true,
    },
  });

  // Créer quelques livres d'exemple
  const books = await Promise.all([
    prisma.book.upsert({
      where: { isbn: '9782070408504' },
      update: {},
      create: {
        title: 'Le Petit Prince',
        author: 'Antoine de Saint-Exupéry',
        isbn: '9782070408504',
        genre: 'Fiction',
        description: 'Un conte poétique et philosophique sous l\'apparence d\'un conte pour enfants.',
      },
    }),

    prisma.book.upsert({
      where: { isbn: '9782070413119' },
      update: {},
      create: {
        title: 'L\'Étranger',
        author: 'Albert Camus',
        isbn: '9782070413119',
        genre: 'Fiction',
        description: 'Roman qui explore les thèmes de l\'absurdité de l\'existence humaine.',
      },
    }),

    prisma.book.upsert({
      where: { isbn: '9782253002864' },
      update: {},
      create: {
        title: '1984',
        author: 'George Orwell',
        isbn: '9782253002864',
        genre: 'Science-fiction',
        description: 'Roman dystopique sur un régime totalitaire qui surveille tout.',
      },
    }),
  ]);

  console.log('Seed data created:');
  console.log('Admin:', admin.email);
  console.log('User:', user.email);
  console.log('Books:', books.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });