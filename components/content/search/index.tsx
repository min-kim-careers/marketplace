'use client'

import Pagination from '@/components/content/search/pagination'
import Toolbar from '@/components/content/search/toolbar'
import { Item } from '@/utils/supabase/types/item'
import { useEffect, useState } from 'react'

import ItemCard from '@/components/content/search/item-card'
import jsonData from '@/data/items.json'
import Spinner from '@/components/ui/spinner'
import { Params } from '@/types/params'
import { notFound } from 'next/navigation'

const DEFAULT_LIMIT = 9

const mockItems: Item[] = jsonData.map((data) => ({
  ...data,
  postcode: data.suburb,
  created_at: new Date(data.created_at),
  updated_at: new Date(data.updated_at),
}))

export default function Search({
  params,
}: {
  params: Params
}) {
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

    if (params.sort) {
      const sort = params.sort
      _items = _items.sort((a: Item, b: Item) => {
        if (sort === 'created_asc') {
          return a.created_at < b.created_at
            ? -1
            : a.created_at > b.created_at
              ? 1
              : 0
        } else if (sort === 'created_desc') {
          return a.created_at > b.created_at
            ? -1
            : a.created_at < b.created_at
              ? 1
              : 0
        } else if (
          sort === 'price_asc' ||
          sort === 'default'
        ) {
          return a.price < b.price
            ? -1
            : a.price > b.price
              ? 1
              : 0
        } else if (sort === 'price_desc') {
          return a.price > b.price
            ? -1
            : a.price < b.price
              ? 1
              : 0
        }
        throw notFound()
      })
    }

    const totalCount: number = _items.length
    setTotalCount(totalCount)

    const from = (params.page - 1) * DEFAULT_LIMIT
    const to = params.page * DEFAULT_LIMIT

    _items = _items.slice(from, to)
    setItems(_items)

    setLoading(false)
  }

  useEffect(() => loadMockItems(params), [params])

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
