// types/customer.ts
export interface TopCustomer {
  dealerId: string
  dealerName: string
  salesperson: string
  totalBags: number
  volumeTier: 'High' | 'Medium' | 'Low'
  lastOrderDate: Date
  yoyChangePercentCurrentMonth: number
  bestDealerRank: number
}

export interface CustomerNeedsAttention {
  dealerId: string
  dealerName: string
  salesperson: string
  attentionFlag: string
  attentionRank: number
  daysSinceLastOrder: number
  churnRisk: 'High' | 'Medium' | 'Low'
  lastOrderDate: Date
  estimatedMonthlyBags: number
  currentMonthBagsToDate: number
}

export interface CustomerSegment {
  segment: string
  customerCount: number
  totalBags: number
  avgBagsPerCustomer: number
  yoyGrowth: number
}
