export interface FAQItem {
  id: number
  question: string
  answer: string
  category: string
  tags: string[]
  priority: number
  views: number
  helpful: number
  createdAt: Date
  updatedAt: Date
}

export interface FAQCategory {
  name: string
  count: number
  items: FAQItem[]
}

export interface FAQSearchResult {
  items: FAQItem[]
  totalCount: number
  categories: string[]
  suggestedTags: string[]
}