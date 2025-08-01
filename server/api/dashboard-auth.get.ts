// server/api/dashboard-auth.get.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const salespersonFilter = query.salesperson as string

    // Get ALL customers to populate dropdown
    const allCustomers = await prisma.dealerCategory.findMany({
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
        total_bags: {
          not: null,
          gt: 0
        },
        salesperson: {
          not: null,
          not: ""
        }
      },
      orderBy: {
        total_bags: 'desc'
      }
    })

    // Filter customers based on selection
    const topCustomers = salespersonFilter 
      ? allCustomers.filter(c => c.salesperson === salespersonFilter).slice(0, 10)
      : allCustomers.slice(0, 10)

    // Get unique salespeople for dropdown
    const uniqueSalespeople = [...new Set(
      allCustomers
        .map(customer => customer.salesperson)
        .filter(Boolean)
    )].sort()

    // Get customers needing attention
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
        attention_flag: {
          not: null
        },
        ...(salespersonFilter ? { salesperson: salespersonFilter } : {})
      },
      orderBy: {
        attention_rank: 'asc'
      },
      take: 5
    })

    return {
      success: true,
      selectedSalesperson: salespersonFilter || null,
      debug: {
        totalCustomers: allCustomers.length,
        uniqueSalespeopleCount: uniqueSalespeople.length,
        salespeople: uniqueSalespeople.slice(0, 10) // Show first 10 for debug
      },
      sampleData: {
        topDealers: topCustomers,
        customersNeedingAttention,
        allSalespeople: uniqueSalespeople // This is what the dropdown needs
      }
    }
  } catch (error) {
    console.error('Dashboard API error:', error)
    return {
      success: false,
      error: error.message,
      debug: { 
        error: 'Database connection failed',
        message: error.message 
      },
      sampleData: {
        topDealers: [],
        customersNeedingAttention: [],
        allSalespeople: []
      }
    }
  } finally {
    await prisma.$disconnect()
  }
})