/**
 * @swagger
 * /dashboard-auth:
 *   get:
 *     summary: Get dashboard authentication data
 *     description: Retrieves dashboard data including top customers, customers needing attention, and salesperson filter options
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: salesperson
 *         schema:
 *           type: string
 *         description: Filter results by specific salesperson
 *         required: false
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 selectedSalesperson:
 *                   type: string
 *                   nullable: true
 *                   example: "John Smith"
 *                 debug:
 *                   type: object
 *                   properties:
 *                     totalCustomers:
 *                       type: integer
 *                       example: 150
 *                     uniqueSalespeopleCount:
 *                       type: integer
 *                       example: 25
 *                     salespeople:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["John Smith", "Jane Doe"]
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
 *                           best_dealer_rank:
 *                             type: integer
 *                           yoy_change_percent_current_month:
 *                             type: number
 *                           volume_tier:
 *                             type: string
 *                           last_order_date:
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
 *                           attention_flag:
 *                             type: string
 *                           attention_rank:
 *                             type: integer
 *                           days_since_last_order:
 *                             type: integer
 *                           churn_risk:
 *                             type: string
 *                           total_bags:
 *                             type: integer
 *                     allSalespeople:
 *                       type: array
 *                       items:
 *                         type: string
 *                     totalVolumeYTD:
 *                       type: integer
 *                       example: 13250
 *       400:
 *         description: Missing salesperson query parameter
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
 *                   example: "Missing salesperson parameter"
 *       500:
 *         description: Database connection error
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
 *                   example: "Database connection failed"
 */


// server/api/dashboard-auth.get.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const salespersonFilter = query.salesperson as string

    // No salesperson = return all customers
    const whereClause = salespersonFilter
      ? { salesperson: salespersonFilter }
      : {}

    // Get all customers for the selected salesperson
    const allCustomers = await prisma.dealerCategory.findMany({
      where: {
        salesperson: salespersonFilter
      },
      select: {
        dealer_id: true,
        dealer_name: true,
        total_bags: true,
        bestDealerRank: true,
        yoyChangePercentCurrentMonth: true,
        volumeTier: true,
        lastOrderDate: true,
        attentionRank: true,
        attentionFlag: true,
        daysSinceLastOrder: true,
        churnRisk: true
      },
      orderBy: {
        bestDealerRank: 'asc'
      }
    })

    // Separate top customers (ranked) and customers needing attention
    const topCustomers = allCustomers
      .filter(c => c.bestDealerRank !== null)
      .sort((a, b) => a.bestDealerRank! - b.bestDealerRank!)
      .slice(0, 10)

    const customersNeedingAttention = allCustomers
      .filter(c => (c.attentionRank ?? 0) > 0)
      .sort((a, b) => (b.attentionRank ?? 0) - (a.attentionRank ?? 0))
      .slice(0, 5)

    // Get total volume year-to-date (optional: add filtering on `lastOrderDate`)
    const yearStart = new Date(new Date().getFullYear(), 0, 1)
    const ytdCustomers = await prisma.dealerCategory.findMany({
      where: {
        salesperson: salespersonFilter,
        lastOrderDate: {
          gte: yearStart
        }
      },
      select: {
        total_bags: true
      }
    })

    const totalVolumeYTD = ytdCustomers.reduce((sum, c) => sum + (c.total_bags ?? 0), 0)

    // Unique salespeople for dropdown
    const uniqueSalespeopleRaw = await prisma.dealerCategory.findMany({
      where: { salesperson: { not: null, not: '' } },
      select: { salesperson: true },
      distinct: ['salesperson']
    })
    const uniqueSalespeople = uniqueSalespeopleRaw.map(s => s.salesperson).sort()

    return {
  success: true,
  selectedSalesperson: salespersonFilter,
  debug: {
    totalCustomers: allCustomers.length,
    uniqueSalespeopleCount: uniqueSalespeople.length,
    salespeople: uniqueSalespeople
  },
  sampleData: {
    topDealers: topCustomers,
    customersNeedingAttention,
    allSalespeople: uniqueSalespeople,
    totalVolumeYTD
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
        allSalespeople: [],
        totalVolumeYTD: 0
      }
    }
  } finally {
    await prisma.$disconnect()
  }
})