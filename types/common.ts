// types/common.ts
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export interface FilterOptions {
  salesperson?: string[]
  species?: string[]
  category?: string[]
  productLine?: string[]
  volumeTier?: string[]
  customerSegment?: string[]
  activityStatus?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
}