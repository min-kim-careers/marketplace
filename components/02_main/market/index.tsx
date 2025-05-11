'use client'

import Pagination from '@/components/02_main/market/pagination'
import { Item } from '@/lib/interfaces/items'
import { useEffect, useState } from 'react'

import ItemCard from '@/components/common/item-card'
import LoadingDots from '@/components/common/loading-dots'
import {
  MarketParams,
  ItemsResponse,
} from '@/lib/interfaces/items'
import { useUIStore } from '@/lib/stores/ui'
import { useSearchParams } from 'next/navigation'
import { PAGINATION } from '../../../lib/constants/pagination'
import { extractMarketParams } from '@/lib/utils/params'
import { fetchItems } from '@/lib/api/items'

export default function Market({
  marketParams,
}: {
  marketParams: MarketParams
}) {
  const [params, setParams] =
    useState<MarketParams>(marketParams)

  const searchParams = useSearchParams()

  const { columns } = useUIStore()

  const [count, setCount] = useState<number>(0)
  const [items, setItems] = useState<Item[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getItems = async () => {
      setLoading(true)
      try {
        const { items, count }: ItemsResponse =
          await fetchItems({ ...params })

        setItems(items)
        setCount(count)
      } catch (err) {
        setMessage('Something went wrong...')
      } finally {
        setLoading(false)
      }
    }

    getItems()
  }, [])

  const renderLoading = () => (
    <div className='flex w-full flex-1 items-center justify-center'>
      <LoadingDots />
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
          <Pagination params={params} count={count} />
        </span>
        <span>
          {`${(params.page - 1) * PAGINATION.LIMIT + 1} - ${PAGINATION.LIMIT * (params.page - 1) + items.length} of ${count}`}
        </span>
      </div>

      {renderItems()}

      <Pagination params={params} count={count} />
    </>
  )

  if (loading) {
    return renderLoading()
  } else if (!items.length) {
    return renderNoResults()
  } else {
    return renderContent()
  }
}
