// ==========================================
// PostgreSQL — Prisma Client
// ==========================================

const { PrismaClient } = require('@prisma/client');
const logger = require('./logger');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'info', 'warn', 'error']
    : ['error'],
});

async function connectPostgres() {
  await prisma.$connect();
  logger.info('✅ PostgreSQL connected via Prisma');
}

module.exports = { prisma, connectPostgres };
