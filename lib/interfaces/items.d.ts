export interface Item {
  // id: str
  userHandle: str
  name: string
  description: string
  price: number
  category: string
  createdAt: Date
  updatedAt: Date
  expiresAt: Date
  suburb: string
  state: string
  condition: string
  imageUrls: string[]
}

export interface MarketParams {
  page: number
  keyword?: string | null
  sortBy?: string | null
  sortOrder?: string | null
}

export interface ItemsQuery {
  page: number
  limit?: number
  keyword?: string | null
  sortBy?: string | null
  sortOrder?: string | null
}