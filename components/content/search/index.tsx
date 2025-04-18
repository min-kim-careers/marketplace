'use client'

import Pagination from '@/components/content/search/pagination'
import Toolbar from '@/components/content/search/toolbar'
import { Item } from '@/interfaces/item'
import { useEffect, useState } from 'react'

import ItemCard from '@/components/content/search/item-card'
import Spinner from '@/components/ui/spinner'
import { Params } from '@/interfaces/params'
import { notFound } from 'next/navigation'

const DEFAULT_LIMIT = 9

export default function Search({
  params,
}: {
  params: Params
}) {
  const [columns, setColumns] = useState(1)

  const [totalCount, setTotalCount] = useState<number>(0)
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)

  // const loadItems = async (page: number) => {
  //   setLoading(true)

  //   const from = (page - 1) * limit
  //   const to = page * limit

  //   const items: Item[] = await fetchItems(from, to)
  //   setItems(items)

  //   const totalCount: number = await fetchTotalCount()
  //   setTotalCount(totalCount)

  //   setLoading(false)
  // }

  const renderItems = () => {
    return (
      <div
        className='grid w-full flex-1 items-start gap-2'
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}
      >
        {items.map((item: Item, i) => (
          <ItemCard key={i} item={item} columns={columns} />
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
    <div className='flex w-full flex-col gap-2'>
      <Toolbar
        setColumns={setColumns}
        defaultColumns={columns}
      />
      {loading ? (
        <Spinner className='flex flex-1 items-center justify-center' />
      ) : (
        <>
          <div className='flex w-full items-center justify-between px-2 text-sm'>
            <span>{totalCount} items</span>
            <span>
              <Pagination
                params={params}
                limit={DEFAULT_LIMIT}
                totalCount={totalCount}
              />
            </span>
            <span>
              {`${(params.page - 1) * DEFAULT_LIMIT + 1} - ${DEFAULT_LIMIT * (params.page - 1) + items.length} of ${totalCount}`}
            </span>
          </div>
          {renderItems()}
          <Pagination
            params={params}
            limit={DEFAULT_LIMIT}
            totalCount={totalCount}
          />
        </>
      )}
    </div>
  )
}
