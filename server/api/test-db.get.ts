// server/api/test-db.get.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async () => {
  try {
    // Test with actual data from your tables
    const dealerCount = await prisma.dealerCategory.count()
    const salesCount = await prisma.tuckerFilteredSales.count()
    const activeSalespeople = await prisma.activeSalespeople.count()
    
    // Get a sample of top dealers - using the correct field names from Prisma
    const topDealers = await prisma.dealerCategory.findMany({
      select: {
        dealer_id: true,
        dealer_name: true,
        total_bags: true,
        salesperson: true,
        bestDealerRank: true,  // camelCase
        yoyChangePercentCurrentMonth: true,  // camelCase
        volumeTier: true,  // camelCase
        lastOrderDate: true  // camelCase
      },
      orderBy: {
        total_bags: 'desc'
      },
      take: 10,
      where: {
        total_bags: {
          not: null,
          gt: 0
        }
      }
    })

    // Get customers needing attention
    const customersNeedingAttention = await prisma.dealerCategory.findMany({
      select: {
        dealer_id: true,
        dealer_name: true,
        salesperson: true,
        attentionFlag: true,  // camelCase
        attentionRank: true,  // camelCase
        daysSinceLastOrder: true,  // camelCase
        churnRisk: true,  // camelCase
        total_bags: true
      },
      where: {
        attentionFlag: {
          not: null
        }
      },
      orderBy: {
        attentionRank: 'asc'
      },
      take: 5
    })
    
    return { 
      success: true, 
      counts: {
        dealers: dealerCount,
        salesRecords: salesCount,
        activeSalespeople: activeSalespeople
      },
      sampleData: {
        topDealers,
        customersNeedingAttention
      },
      message: 'Database connection successful!'
    }
  } catch (error) {
    console.error('Database connection error:', error)
    return { 
      success: false, 
      error: error.message 
    }
  } finally {
    await prisma.$disconnect()
  }
})