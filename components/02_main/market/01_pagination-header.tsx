import Pagination from '@/components/02_main/market/03_pagination'
import { PAGINATION } from '@/lib/constants/pagination'
import { useMarketStore } from '@/lib/stores/market'

export default function PaginationHeader() {
  const { items, count, params } = useMarketStore()

  return (
    <div className='flex w-full items-center justify-between px-2 text-sm'>
      <span>{items.length} items</span>
      <span>
        <Pagination />
      </span>
      <span>
        {`${(params.page - 1) * PAGINATION.LIMIT + 1} - ${PAGINATION.LIMIT * (params.page - 1) + items.length} of ${count}`}
      </span>
    </div>
  )
}
