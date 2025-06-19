'use client'

import { Item } from '@/lib/interfaces/item'
import { useEffect } from 'react'

import Toolbar from '@/components/02_main/profile-listings/01_toolbar'
import PaginationTop from '@/components/02_main/profile-listings/02_pagination-top'
import ItemList from '@/components/02_main/profile-listings/03_item-list'
import PaginationBottom from '@/components/02_main/profile-listings/04_pagination-bottom'
import useListingsStore from '@/lib/stores/listing'
import { ItemPageParams } from '@/lib/interfaces/listings-params'

export default function ProfileListings({
  props,
}: {
  props: {
    items: Item[]
    count: number
    params: ItemPageParams
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
    <div className='flex flex-1 flex-col justify-between gap-2 w-full'>
      <div className='flex w-full flex-1 flex-col gap-2'>
        <Toolbar />
        <PaginationTop />
        <ItemList />
      </div>
      <PaginationBottom />
    </div>
  )
}
