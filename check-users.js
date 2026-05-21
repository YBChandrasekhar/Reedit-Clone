require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
prisma.user.findMany()
  .then((users) => console.log('USERS IN DB:', JSON.stringify(users, null, 2)))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
