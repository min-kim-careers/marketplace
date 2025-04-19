'use client'

import Pagination from '@/components/02_main/market/pagination'
import Toolbar from '@/components/02_main/market/toolbar'
import { Item } from '@/lib/interfaces/item'
import { useState } from 'react'

import ItemCard from '@/components/02_main/market/item-card'
import Spinner from '@/components/ui/spinner'
import { QueryParams } from '@/lib/interfaces/params'
import { useColumns } from '@/app/market/layout'

const DEFAULT_LIMIT = 9

export default function Market({
  queryParams,
}: {
  queryParams: QueryParams
}) {
  const columns = useColumns()

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

  const renderNoResults = () => (
    <div className='w-full flex-1 items-center justify-center'>
      <p>No results found..</p>
    </div>
  )

  const renderContent = () => (
    <>
      <div className='flex w-full items-center justify-between px-2 text-sm'>
        <span>{totalCount} items</span>
        <span>
          <Pagination
            params={queryParams}
            limit={DEFAULT_LIMIT}
            totalCount={totalCount}
          />
        </span>
        <span>
          {`${(queryParams.page - 1) * DEFAULT_LIMIT + 1} - ${DEFAULT_LIMIT * (queryParams.page - 1) + items.length} of ${totalCount}`}
        </span>
      </div>
      {renderItems()}
      <div>
        <Pagination
          params={queryParams}
          limit={DEFAULT_LIMIT}
          totalCount={totalCount}
        />
      </div>
    </>
  )

  if (loading) {
    return <Spinner />
  } else if (!!!items.length) {
    return renderNoResults()
  } else {
    return renderContent()
  }
}
