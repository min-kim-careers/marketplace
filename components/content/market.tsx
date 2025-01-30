'use client'

import Pagination from '@/components/content/pagination'
import Toolbar from '@/components/content/toolbar'
import { Item } from '@/utils/supabase/types/item'
import { useEffect, useState } from 'react'

import ItemCard from '@/components/content/item-card'
import jsonData from '@/data/items.json'
import Spinner from '../spinner'
import { Params } from '@/types/params'

const mockItems: Item[] = jsonData.map((data) => ({
  ...data,
  created_at: new Date(data.created_at),
  updated_at: new Date(data.updated_at),
}))

export default function Market({
  params,
  limit,
}: {
  params: Params
  limit: number
}) {
  console.log(params)

  const [columns, setColumns] = useState(1)

  const [totalCount, setTotalCount] = useState<number>(
    mockItems.length,
  )
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

  const loadMockItems = (params: Params) => {
    setLoading(true)

    let _items: Item[] = mockItems

    if (params.keywords) {
      _items = _items.filter((item: Item) =>
        params.keywords
          ?.split(',')
          .some(
            (keyword) =>
              item.category
                .toLowerCase()
                .includes(keyword.toLowerCase()) ||
              item.name
                .toLowerCase()
                .includes(keyword.toLowerCase()) ||
              item.description
                .toLowerCase()
                .includes(keyword.toLowerCase()),
          ),
      )
    }
    const totalCount: number = _items.length
    setTotalCount(totalCount)

    const from = (params.page - 1) * limit
    const to = params.page * limit

    _items = _items.slice(from, to)
    setItems(_items)

    console.log(_items)

    setLoading(false)
  }

  useEffect(() => {
    loadMockItems(params)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

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
    <div className='flex min-w-full flex-1 flex-col gap-2 p-4'>
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
                limit={limit}
                totalCount={totalCount}
              />
            </span>
            <span>
              {`${(params.page - 1) * limit + 1} - ${limit * (params.page - 1) + items.length} of ${totalCount}`}
            </span>
          </div>
          {renderItems()}
          <Pagination
            params={params}
            limit={limit}
            totalCount={totalCount}
          />
        </>
      )}
    </div>
  )
}
