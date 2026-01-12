import { env } from '@/env/server.mjs'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './generated/prisma/client/client'

const globalForPrisma = global as unknown as {
  prisma: PrismaClient
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  })

if (env.NODE_ENV !== 'production') {
  // @ts-ignore
  global.prisma = prisma
}

export default prisma
