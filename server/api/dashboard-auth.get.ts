// server/api/dashboard-auth.get.ts
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '~/server/utils/simpleAuth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Check for auth token
    const token = getCookie(event, 'auth-token')
    let userFilter = null

    if (token) {
      const user = verifyToken(token)
      if (user) {
        userFilter = user.name // Filter by salesperson name
      }
    }

    // Get customers (filtered by user if authenticated)
    const topCustomers = await prisma.dealerCategory.findMany({
      select: {
        dealer_id: true,
        dealer_name: true,
        total_bags: true,
        salesperson: true,
        best_dealer_rank: true,
        yoy_change_percent_current_month: true,
        volume_tier: true,
        last_order_date: true
      },
      where: {
        AND: [
          {
            total_bags: {
              not: null,
              gt: 0
            }
          },
          userFilter ? { salesperson: userFilter } : {}
        ]
      },
      orderBy: {
        total_bags: 'desc'
      },
      take: 10
    })

    // Get customers needing attention (filtered by user if authenticated)
    const customersNeedingAttention = await prisma.dealerCategory.findMany({
      select: {
        dealer_id: true,
        dealer_name: true,
        salesperson: true,
        attention_flag: true,
        attention_rank: true,
        days_since_last_order: true,
        churn_risk: true,
        total_bags: true
      },
      where: {
        AND: [
          {
            attention_flag: {
              not: null
            }
          },
          userFilter ? { salesperson: userFilter } : {}
        ]
      },
      orderBy: {
        attention_rank: 'asc'
      },
      take: 5
    })

    return {
      success: true,
      isAuthenticated: !!userFilter,
      user: userFilter ? { name: userFilter } : null,
      sampleData: {
        topDealers: topCustomers,
        customersNeedingAttention
      }
    }
  } catch (error) {
    console.error('Dashboard API error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Database connection error'
    })
  } finally {
    await prisma.$disconnect()
  }
})