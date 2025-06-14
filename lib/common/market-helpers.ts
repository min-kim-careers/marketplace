import { DEFAULT_SORT_OPTION } from '@/lib/constants/item-sort-options'
import { MarketParams } from '../interfaces/market-params'
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
    sortBy:
      (params.sortBy as string) ||
      DEFAULT_SORT_OPTION.sortBy,
    sortOrder:
      (params.sortOrder as string) ||
      DEFAULT_SORT_OPTION.sortOrder,
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
