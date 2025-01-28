'use client'

import Pagination from '@/components/pagination'
import {
  Card
} from '@/components/shadcn/components/ui/card'
import Toolbar from '@/components/toolbar'
import { SearchParams } from '@/types/search'
import { Item } from '@/utils/supabase/types/item'
import { useEffect, useState } from 'react'

import jsonData from '@/data/items.json'
import ItemCard from './item-card'
import { Skeleton } from './shadcn/components/ui/skeleton'

const mockItems: Item[] = jsonData.map((data) => ({
  ...data,
  created_at: new Date(data.created_at),
  updated_at: new Date(data.updated_at),
}))

export default function Market({
  params,
}: {
  params: SearchParams
}) {
  const [columns, setColumns] = useState(1)

  const [totalCount, setTotalCount] = useState<number>(
    mockItems.length,
  )
  const [items, setItems] = useState<Item[]>(mockItems)
  const [loading, setLoading] = useState(false)

  // const loadItems = async (page: number, limit: number) => {
  //   setLoading(true)

  //   const from = (page - 1) * limit
  //   const to = page * limit

  //   const items: Item[] = await fetchItems(from, to)
  //   setItems(items)

  //   const totalCount: number = await fetchTotalCount()
  //   setTotalCount(totalCount)

  //   setLoading(false)
  // }

  const loadMockItems = (page: number, limit: number) => {
    setLoading(true)

    const from = (page - 1) * limit
    const to = page * limit

    const items: Item[] = mockItems.slice(from, to)
    setItems(items)

    const totalCount: number = mockItems.length
    setTotalCount(totalCount)

    setLoading(false)
  }

  useEffect(() => {
    loadMockItems(params.page, params.limit)
  }, [params])

  const renderSkeletons = () => {
    return (
      <div className='grid min-w-full flex-1 items-start gap-4'>
        {Array.from(
          { length: params.limit },
          (_, index) => (
            <Card
              key={index}
              className='flex min-h-48 min-w-full flex-row gap-4 p-4'
            >
              <div className='flex w-full flex-[3] flex-col gap-6'>
                <Skeleton className='w-full flex-1' />
                <Skeleton className='w-3/4 flex-1' />
                <Skeleton className='w-1/2 flex-1' />
                <div className='w-1/2 flex-1' />
              </div>
              <Skeleton className='min-h-full w-full flex-1 rounded-lg' />
            </Card>
          ),
        )}
      </div>
    )
  }

  const renderItems = () => {
    return (
      <div
        className='grid w-full flex-1 items-start gap-2'
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}
      >
        {items.map((item: Item, i) => (
          <ItemCard key={i} item={item} columns={columns}/>
        ))}
        <style jsx>{`
          @media (max-width: 640px) {
            div.grid {
              grid-template-columns: repeat(
                1,
                1fr
              ) !important;
            }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className='flex min-w-full flex-col gap-2 p-4'>
      <Toolbar
        setColumns={setColumns}
        defaultColumns={columns}
      />
      <div className='flex w-full items-center justify-between px-2 text-sm'>
        <span>{totalCount} items</span>
        <span>
          <Pagination
            params={params}
            totalCount={totalCount}
          />
        </span>
        <span>
          {`${(params.page - 1) * params.limit + 1} - ${params.limit * (params.page - 1) + items.length} of ${totalCount}`}
        </span>
      </div>
      {loading ? renderSkeletons() : renderItems()}
      <Pagination params={params} totalCount={totalCount} />
    </div>
  )
}
