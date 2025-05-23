import { PAGINATION } from '@/lib/constants/pagination'
import {
  ItemsQuery,
  MarketParams,
} from '@/lib/interfaces/items'
import { ReadonlyURLSearchParams } from 'next/navigation'

const DEFAULT_PAGE = 1

export const serialize = (object: Object) => {
  return Object.fromEntries(
    Object.entries(object)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(
        ([_, value]) =>
          value !== undefined &&
          value !== null &&
          value !== '',
      )
      .map(([key, value]) => [key, String(value)]),
  )
}

export const serverUrlToMarketParams = (params: {
  [key: string]: string | string[] | undefined
}): MarketParams => {
  return {
    page: Number(params.page) || DEFAULT_PAGE,
    keyword: params.keyword as string,
    sortBy: params.sortBy as string,
    sortOrder: params.sortOrder as string,
  }
}

export const urlToMarketParams = (
  params: ReadonlyURLSearchParams | URLSearchParams,
): MarketParams => {
  return {
    page: Number(params.get('page')) || DEFAULT_PAGE,
    keyword: params.get('keyword'),
    sortBy: params.get('sortBy'),
    sortOrder: params.get('sortOrder'),
  }
}

export const marketToUrlParams = (
  marketParams: MarketParams,
) => new URLSearchParams(serialize(marketParams))

export const areMarketParamsEqual = (
  a: MarketParams,
  b: MarketParams,
) =>
  a.page === b.page &&
  a.keyword === b.keyword &&
  a.sortBy === b.sortBy &&
  a.sortOrder === b.sortOrder

export const marketParamsToQuery = (
  marketParams: MarketParams,
): ItemsQuery => ({
  page: marketParams.page,
  keyword: marketParams.keyword,
  sortBy: marketParams.sortBy,
  sortOrder: marketParams.sortOrder,
  limit: PAGINATION.LIMIT
})
