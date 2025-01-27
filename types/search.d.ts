type SortOrder = 'relevance' | 'date' | 'price'

export interface SearchParams {
    page: number
    limit: number
    keyword?: string
    sortOrder?: SortOrder
}