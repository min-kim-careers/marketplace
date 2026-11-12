'use client'

import Pagination from '@/components/item-list/00_common/pagination'
import { DEFAULT_ITEM_PAGINATION } from '@/lib/constants/item-pagination'
import { useItemPageContext } from '@/lib/providers/item-page-provider'

export default function PaginationTop() {
  const { count, items, params } = useItemPageContext()

  return (
    <div className='flex w-full items-center px-2 text-sm'>
      <span className='hidden flex-1 justify-start sm:flex'>
        {items.length} items
      </span>

      <span className='flex flex-1 justify-center'>
        <Pagination />
      </span>

      <span className='hidden flex-1 justify-end sm:flex'>
        {`${(params.page - 1) * DEFAULT_ITEM_PAGINATION.LIMIT + 1} - ${DEFAULT_ITEM_PAGINATION.LIMIT * (params.page - 1) + items.length} of ${count}`}
      </span>
    </div>
  )
}
