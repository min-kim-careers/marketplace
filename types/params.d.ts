export type SortOrder =
  | 'relevance'
  | 'newest'
  | 'oldest'
  | 'lowest price'
  | 'highest price'

export interface Params {
  page: number
  keywords?: string | null
  sortOrder?: SortOrder | null
}
