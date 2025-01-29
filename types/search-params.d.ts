import { SortOrder } from '@/types/sort-order'

export interface SearchParams {
  page: number
  limit: number
  keywords?: string
  sortOrder?: SortOrder
}
