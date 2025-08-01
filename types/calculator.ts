// types/calculator.ts
export interface CalculatorInput {
  species: string
  feedForm: 'Pellet' | 'Crumble' | 'Mash' | 'Textured'
  customerType: 'Commercial' | 'Hobbyist' | 'Show'
  volumeNeeds: number // bags per month
  priceSegment: 'Ultra Premium' | 'Premium' | 'Advantage' | 'Economy'
  specialRequirements?: string[]
}

export interface ProductRecommendation {
  tuckerProduct: string
  species: string
  category: string
  productLine: string
  feedForm: string
  dealerPrice: number
  matchScore: number // 0-100
  advantages: string[]
  competitorComparisons: CompetitorSwap[]
}

export interface CalculatorResult {
  recommendations: ProductRecommendation[]
  totalEstimatedValue: number
  competitiveAdvantages: string[]
  alternativeOptions: ProductRecommendation[]
}