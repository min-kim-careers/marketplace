import { Params, SortOrder } from '@/types/params'
import { ReadonlyURLSearchParams } from 'next/navigation'

export const extractParams = (
  params: ReadonlyURLSearchParams,
): Params => {
  return {
    page: Number(params.get('page')) || 1,
    keywords: params.get('keywords'),
    sortOrder: params.get('sortOrder') as SortOrder,
  }
}

const isValidParam = (value: unknown): boolean => {
  return (
    value !== undefined && value !== null && value !== ''
  )
}

export const paramsToQuery = (params: Params) => {
  const query = Object.fromEntries(
    Object.entries(params)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, value]) => isValidParam(value))
      .map(([key, value]) => [key, String(value)]),
  )
  return query
}
