export interface GetItemsRequest {
  page: number
  limit?: number
  keyword?: string | null
  sortBy?: string | null
  sortOrder?: string | null
}
