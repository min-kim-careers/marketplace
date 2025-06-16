'use client'

import { Item } from '@/lib/interfaces/item'
import { MarketParams } from '@/lib/interfaces/market-params'
import { useEffect } from 'react'

import Toolbar from '@/components/02_main/protected/profile/listings/01_toolbar'
import PaginationTop from '@/components/02_main/protected/profile/listings/02_pagination-top'
import ItemList from '@/components/02_main/protected/profile/listings/03_item-list'
import PaginationBottom from '@/components/02_main/protected/profile/listings/04_pagination-bottom'
import useListingsStore from '@/lib/stores/market'

export default function ProfileListings({
  props,
}: {
  props: {
    items: Item[]
    count: number
    params: MarketParams
  }
}) {
  const { setItems, setCount, setParams } =
    useListingsStore()

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
