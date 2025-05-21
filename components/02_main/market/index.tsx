'use client'

import Pagination from '@/components/02_main/market/03_pagination'
import { Item } from '@/lib/interfaces/items'
import { useEffect, useState } from 'react'

import ItemCard from '@/components/common/item-card'
import LoadingDots from '@/components/common/loading-dots'
import { getItems } from '@/lib/api/items/service'
import { MarketParams } from '@/lib/interfaces/items'
import { useLayoutStore } from '@/lib/stores/layout'
import { useRouter, useSearchParams } from 'next/navigation'
import { PAGINATION } from '../../../lib/constants/pagination'
import {
  extractParamsFromURL,
  serialize,
} from '@/lib/utils/params'
import { GetItemsResponse } from '@/lib/api/items/responses'
import Toolbar from '@/components/02_main/market/00_toolbar'
import { useMarketStore } from '@/lib/stores/market'
import ItemList from '@/components/02_main/market/02_item-list'
import PaginationHeader from '@/components/02_main/market/01_pagination-header'

function useHydrateMarketParams() {
  const searchParams = useSearchParams()
  const setParams = useMarketStore((s) => s.setParams)

  useEffect(() => {
    const params: MarketParams =
      extractParamsFromURL(searchParams)
    setParams(params)
  }, [searchParams])
}

function useSyncUrlFromStore() {
  const router = useRouter()
  const { params } = useMarketStore()

  useEffect(() => {
    const urlParams = new URLSearchParams(serialize(params))
    router.replace(`/market?${urlParams.toString()}`)
  }, [
    params.page,
    params.keyword,
    params.sortBy,
    params.sortOrder,
  ])
}

export default function Market({
  serverItems,
  serverCount,
}: {
  serverItems: Item[]
  serverCount: number
}) {
  useHydrateMarketParams()
  useSyncUrlFromStore()

  const { setItems, setCount } = useMarketStore()

  useEffect(() => {
    setItems(serverItems)
    setCount(serverCount)
  }, [])

  return (
    <div className='flex w-full flex-1 flex-col gap-2'>
      <Toolbar />

      <PaginationHeader />

      <ItemList />

      <Pagination />
    </div>
  )
}
