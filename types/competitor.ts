// types/competitor.ts
export interface CompetitorSwap {
  id: number
  species: string
  competitor: string
  competitorProduct: string
  tuckerProduct: string
  competitorDealerPrice: number
  tuckerDealerPrice: number
  priceDifference: number
  priceAdvantage: 'Tucker' | 'Competitor' | 'Equal'
}

export interface CompetitorAnalysis {
  competitor: string
  species: string
  marketShare: number
  avgPriceDifference: number
  opportunityCount: number
  threatsCount: number
}