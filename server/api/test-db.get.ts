/**
 * @swagger
 * /test-db:
 *   get:
 *     summary: Test database connection
 *     description: Tests database connectivity and returns sample data from various tables
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Database connection test results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 counts:
 *                   type: object
 *                   properties:
 *                     dealers:
 *                       type: integer
 *                       description: Total number of dealers
 *                       example: 450
 *                     salesRecords:
 *                       type: integer
 *                       description: Total number of sales records
 *                       example: 15000
 *                     activeSalespeople:
 *                       type: integer
 *                       description: Total number of active salespeople
 *                       example: 25
 *                 sampleData:
 *                   type: object
 *                   properties:
 *                     topDealers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           dealer_id:
 *                             type: integer
 *                           dealer_name:
 *                             type: string
 *                           total_bags:
 *                             type: integer
 *                           salesperson:
 *                             type: string
 *                           bestDealerRank:
 *                             type: integer
 *                           yoyChangePercentCurrentMonth:
 *                             type: number
 *                           volumeTier:
 *                             type: string
 *                           lastOrderDate:
 *                             type: string
 *                             format: date
 *                     customersNeedingAttention:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           dealer_id:
 *                             type: integer
 *                           dealer_name:
 *                             type: string
 *                           salesperson:
 *                             type: string
 *                           attentionFlag:
 *                             type: string
 *                           attentionRank:
 *                             type: integer
 *                           daysSinceLastOrder:
 *                             type: integer
 *                           churnRisk:
 *                             type: string
 *                           total_bags:
 *                             type: integer
 *                 message:
 *                   type: string
 *                   example: "Database connection successful!"
 *       500:
 *         description: Database connection failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Connection timeout"
 */

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