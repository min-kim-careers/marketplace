'use client'

import Pagination from '@/components/02_main/market/pagination'
import { Item } from '@/lib/interfaces/item'
import { useEffect, useState } from 'react'

import { useColumns } from '@/app/market/layout'
import ItemCard from '@/components/ui/item-card'
import Spinner from '@/components/ui/spinner'
import { URLParams } from '@/lib/interfaces/params'
import {
  fetchItems,
} from '@/lib/server/item'
import { ServerResponse } from '@/lib/interfaces/server'

const PAGINATION_LIMIT = 9

export default function Market({
  urlParams,
}: {
  urlParams: URLParams
}) {
  const columns = useColumns()

  const [count, setCount] = useState<number>(0)
  const [items, setItems] = useState<Item[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getItems = async () => {
      setLoading(true)

      await fetchItems({
        page: urlParams.page,
        keyword: urlParams.keyword,
        sort_by: urlParams.sortBy,
        sort_order: urlParams.sortOrder,
      })
        .then((response) => {
          const { data, count }: ServerResponse =
            response

          const items: Item[] = data

          if (!!!items.length || !!!count) {
            setMessage('No items found...')
            return
          }

          setItems([...items])
          setCount(count)
        })
        .catch((error) => {
          setMessage(error.message)
        })
        .finally(() => {
          setLoading(false)
        })
    }

    getItems()
  }, [urlParams])

  const renderLoading = () => (
    <div className='flex w-full flex-1 items-center justify-center'>
      <Spinner />
    </div>
  )

  const renderNoResults = () => (
    <div className='flex w-full flex-1 items-center justify-center'>
      <p>{message}</p>
    </div>
  )

  const renderItems = () => (
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

  const renderContent = () => (
    <>
      <div className='flex w-full items-center justify-between px-2 text-sm'>
        <span>{items.length} items</span>
        <span>
          <Pagination
            urlParams={urlParams}
            limit={PAGINATION_LIMIT}
            count={count}
          />
        </span>
        <span>
          {`${(urlParams.page - 1) * PAGINATION_LIMIT + 1} - ${PAGINATION_LIMIT * (urlParams.page - 1) + items.length} of ${count}`}
        </span>
      </div>

      {renderItems()}

      <Pagination
        urlParams={urlParams}
        limit={PAGINATION_LIMIT}
        count={count}
      />
    </>
  )

  if (loading) {
    return renderLoading()
  } else if (!!!items.length) {
    return renderNoResults()
  } else {
    return renderContent()
  }
}
