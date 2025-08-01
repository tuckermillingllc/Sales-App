// types/product.ts
export interface TopProduct {
  species: string
  category: string
  productLine: string
  totalBags: number
  yoyGrowth: number
  dealerCount: number
  avgBagsPerDealer: number
}

export interface GrowingProduct {
  species: string
  category: string
  productLine: string
  yoyGrowth: number
  currentMonthBags: number
  sameMonthLastYear: number
  trendClassification: string
}

export interface ProductNeedsAttention {
  species: string
  category: string
  productLine: string
  yoyDecline: number
  currentMonthBags: number
  dealersOffering: number
  riskLevel: 'High' | 'Medium' | 'Low'
}