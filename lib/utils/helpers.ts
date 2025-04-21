import { URLParams } from '@/lib/interfaces/params'
import { ReadonlyURLSearchParams } from 'next/navigation'

export const extractParams = (
  params: ReadonlyURLSearchParams,
): URLParams => {
  return {
    page: Number(params.get('page')) || 1,
    keyword: params.get('keyword'),
    sortBy: params.get('sortBy'),
    sortOrder: params.get('sortOrder'),
  }
}

const isValidParam = (value: unknown): boolean => {
  return (
    value !== undefined && value !== null && value !== ''
  )
}

export const paramsToQuery = (params: URLParams) => {
  const query = Object.fromEntries(
    Object.entries(params)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, value]) => isValidParam(value))
      .map(([key, value]) => [key, String(value)]),
  )
  return query
}