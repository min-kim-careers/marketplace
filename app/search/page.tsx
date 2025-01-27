'use client'

import Market from '@/components/market'
import { SearchParams, SortOrder } from '@/types/search'
import { useSearchParams } from 'next/navigation'

const DEFAULT_LIMIT = 9

export default function SearchPage() {
  const searchParams = useSearchParams()

  const validateParams = (
    searchParams: URLSearchParams,
  ): SearchParams => ({
    page: Number(searchParams.get('page')) || 1,
    limit: DEFAULT_LIMIT,
    keyword: searchParams.get('keyword') || '',
    sortOrder: searchParams.get('sortOrder') as SortOrder,
  })

  const params = validateParams(searchParams)

  return <Market params={params} />
}
