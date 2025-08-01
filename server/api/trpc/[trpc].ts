// server/api/trpc/[trpc].ts
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '~/server/trpc/router'
import { createContext } from '~/server/trpc/context'

export default defineEventHandler(async (event) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: event.node.req,
    router: appRouter,
    createContext
  })
})