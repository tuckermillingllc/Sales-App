// server/trpc/router.ts
import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import type { Context } from './context'

const t = initTRPC.context<Context>().create()

export const customersRouter = t.router({
  getTopCustomers: t.procedure
    .input(z.object({
      limit: z.number().min(1).max(50).default(10)
    }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.dealerCategory.findMany({
        select: {
          dealer_id: true,
          dealer_name: true,
          total_bags: true,
          salesperson: true,
          bestDealerRank: true,
          yoyChangePercentCurrentMonth: true,
          volumeTier: true,
          lastOrderDate: true
        },
        orderBy: {
          total_bags: 'desc'
        },
        take: input.limit,
        where: {
          total_bags: {
            not: null,
            gt: 0
          }
        }
      })
    }),

  getCustomersNeedingAttention: t.procedure
    .input(z.object({
      limit: z.number().min(1).max(50).default(10)
    }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.dealerCategory.findMany({
        select: {
          dealer_id: true,
          dealer_name: true,
          salesperson: true,
          attentionFlag: true,
          attentionRank: true,
          daysSinceLastOrder: true,
          churnRisk: true,
          total_bags: true,
          estimatedMonthlyBags: true
        },
        where: {
          attentionFlag: {
            not: null
          }
        },
        orderBy: {
          attentionRank: 'asc'
        },
        take: input.limit
      })
    })
})

export const appRouter = t.router({
  customers: customersRouter
})

export type AppRouter = typeof appRouter