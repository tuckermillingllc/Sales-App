// server/trpc/context.ts
import { PrismaClient } from '@prisma/client'
import type { inferAsyncReturnType } from '@trpc/server'

const prisma = new PrismaClient()

export async function createContext() {
  return {
    prisma,
  }
}

export type Context = inferAsyncReturnType<typeof createContext>