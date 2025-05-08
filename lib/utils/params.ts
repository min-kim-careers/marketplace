import { SearchParams } from '@/lib/interfaces/items/params'
import { ReadonlyURLSearchParams } from 'next/navigation'

const defaultPage = 1

export const extractSearchParams = (
  params: ReadonlyURLSearchParams | URLSearchParams,
): SearchParams => {
  return {
    page: Number(params.get('page')) || defaultPage,
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

export const serialize = (object: Object) => {
  const query = Object.fromEntries(
    Object.entries(object)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, value]) => isValidParam(value))
      .map(([key, value]) => [key, String(value)]),
  )
  return query
}