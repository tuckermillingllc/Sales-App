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