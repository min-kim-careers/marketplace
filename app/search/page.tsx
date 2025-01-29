'use client'

import Market from '@/components/content/market'
import useSearchStore from '@/store/search-store'
import { SortOrder } from '@/types/sort-order'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function SearchPage() {
  const searchParams = useSearchParams()

  const { params, setParams } = useSearchStore()

  useEffect(() => {
    setParams({
      page: Number(searchParams.get('page')),
      limit: 
      keywords: searchParams.get('keyword') || undefined,
      sortOrder: searchParams.get('sortOrder') as SortOrder || undefined,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Market params={params} />
}
