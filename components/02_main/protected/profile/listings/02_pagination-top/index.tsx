import Pagination from '@/components/02_main/protected/profile/listings/00_common/pagination'
import { DEFAULT_ITEM_PAGINATION } from '@/lib/constants/item-pagination'
import useListingsStore  from '@/lib/stores/market'

export default function PaginationTop() {
  const { items, count, params } = useListingsStore()

  return (
    <div className='flex w-full items-center justify-between px-2 text-sm'>
      <span className='flex-1'>{items.length} items</span>
      <span className='flex-1'>
        <Pagination />
      </span>
      <span className='flex flex-1 justify-end'>
        {`${(params.page - 1) * DEFAULT_ITEM_PAGINATION.LIMIT + 1} - ${DEFAULT_ITEM_PAGINATION.LIMIT * (params.page - 1) + items.length} of ${count}`}
      </span>
    </div>
  )
}
