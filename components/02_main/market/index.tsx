'use client'

import { Item, MarketParams } from '@/lib/interfaces/items'
import { useEffect } from 'react'

import Toolbar from '@/components/02_main/market/01_toolbar'
import PaginationTop from '@/components/02_main/market/02_pagination-top'
import ItemList from '@/components/02_main/market/03_item-list'
import PaginationBottom from '@/components/02_main/market/04_pagination-bottom'
import { useMarketStore } from '@/lib/stores/market'

interface MarketProps {
  items: Item[]
  count: number
  params: MarketParams
}

export default function Market({
  props,
}: {
  props: MarketProps
}) {
  const { setItems, setCount, setParams, fetchSortTypes } =
    useMarketStore()

  useEffect(() => {
    fetchSortTypes()
  }, [])

  useEffect(() => {
    setItems(props.items)
    setCount(props.count)
    setParams(props.params)
  }, [props])

  return (
    <div className='flex w-full flex-1 flex-col gap-2'>
      <Toolbar />

      <PaginationTop />

      <ItemList />

      <PaginationBottom />
    </div>
  )
}
