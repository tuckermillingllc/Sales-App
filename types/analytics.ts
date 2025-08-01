// types/analytics.ts
export interface DashboardMetrics {
  totalCustomers: number
  activeCustomers: number
  totalMonthlyBags: number
  yoyGrowthPercent: number
  topCustomersCount: number
  customersNeedingAttention: number
  topProductsCount: number
  productsNeedingAttention: number
  competitorThreats: number
  marketOpportunities: number
}

export interface SalesMetrics {
  currentMonthBags: number
  sameMonthLastYear: number
  monthlyGrowth: number
  projectedMonthEnd: number
  last30DaysBags: number
  last60DaysBags: number
  avgBagsPerOrder: number
  activeProductLines: number
}

export interface TrendAnalysis {
  trendClassification: 'Growing' | 'Stable' | 'Declining' | 'Volatile'
  yoyTrendScore: number
  volumePercentile: number
  volumeTrendMultiplier: number
  businessDaysElapsed: number
  monthCompletionPercent: number
}