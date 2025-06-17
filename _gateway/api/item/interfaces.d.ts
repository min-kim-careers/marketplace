export interface GetItemsRequest {
  page: number
  limit?: number
  keyword?: string
  sortBy?: string
  sortOrder?: string
  excludeUser?: string
}

export interface CreateItemRequest {
  name: string
  description: string
  price: number
  category: string
  condition: string
  postcode: string
}

export interface UpdateItemRequest {
  name?: string
  description?: string
  price?: number
  category?: string
  condition?: string
  status?: string
  postcode?: string
}
