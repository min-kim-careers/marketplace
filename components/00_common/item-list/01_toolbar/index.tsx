import ColumnToggle from '@/components/00_common/item-list/01_toolbar/column-toggle'
import SearchInput from '@/components/00_common/item-list/01_toolbar/search-input'
import SortDropdown from '@/components/00_common/item-list/01_toolbar/sort-dropdown'

export default function Toolbar() {
  return (
    <div className='flex flex-row gap-2 pt-4 pb-2'>
      <span className='hidden flex-1 justify-start sm:flex'>
        <ColumnToggle />
      </span>

      <span className='flex flex-[2] justify-center'>
        <SearchInput />
      </span>

      <span className='flex flex-1 justify-end'>
        <SortDropdown />
      </span>

    </div>
  )
}
