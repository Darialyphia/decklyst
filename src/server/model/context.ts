import type { Session } from 'next-auth'
import type { PrismaClient } from '../db/generated/prisma/client/client'

export type ModelContext = {
  prisma: PrismaClient
  session: Session | null
}
