// server/api/dashboard.get.ts
import { PrismaClient } from '@prisma/client'
import { requireAuth } from '~/server/utils/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    const user = await requireAuth(event)

    // Get user's customers (filtered by salesperson)
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
        salesperson: user.userName, // Filter by logged-in user
        total_bags: {
          not: null,
          gt: 0
        }
      },
      orderBy: {
        total_bags: 'desc'
      },
      take: 10
    })

    // Get customers needing attention (filtered by salesperson)
    const customersNeedingAttention = await prisma.dealerCategory.findMany({
      select: {
        dealer_id: true,
        dealer_name: true,
        salesperson: true,
        attention_flag: true,
        attention_rank: true,
        days_since_last_order: true,
        churn_risk: true,
        total_bags: true,
        estimated_monthly_bags: true
      },
      where: {
        salesperson: user.userName, // Filter by logged-in user
        attention_flag: {
          not: null
        }
      },
      orderBy: {
        attention_rank: 'asc'
      },
      take: 5
    })

    return {
      success: true,
      user: {
        name: user.userName,
        code: user.userCode
      },
      sampleData: {
        topDealers: topCustomers,
        customersNeedingAttention
      }
    }
  } catch (error) {
    throw error
  } finally {
    await prisma.$disconnect()
  }
})