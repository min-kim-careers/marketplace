export type Sort =
  | 'default'
  | 'created_desc'
  | 'created_asc'
  | 'price_asc'
  | 'price_desc'

export interface Params {
  page: number
  keywords?: string | null
  sort?: Sort | null
}
