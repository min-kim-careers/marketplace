import ColumnToggle from '@/components/item-list/01_toolbar/column-toggle'
import SearchInput from '@/components/item-list/01_toolbar/search-input'
import SortDropdown from '@/components/item-list/01_toolbar/sort-dropdown'
import { cn } from '@/components/shadcn/lib/utils'

export default function Toolbar() {
  return (
    <div className={cn('grid grid-cols-1 gap-2 pb-2 pt-4 sm:grid-cols-3')}>
      <span className='hidden flex-1 justify-start sm:flex'>
        <ColumnToggle />
      </span>

      <span className='flex flex-1 justify-center'>
        <SearchInput />
      </span>

      <span className='flex flex-1 justify-end'>
        <SortDropdown />
      </span>
    </div>
  )
}
