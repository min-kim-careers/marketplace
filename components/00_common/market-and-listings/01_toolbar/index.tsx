import ColumnToggle from '@/components/00_common/market-and-listings/01_toolbar/column-toggle'
import SearchInput from '@/components/00_common/market-and-listings/01_toolbar/search-input'
import SortDropdown from '@/components/00_common/market-and-listings/01_toolbar/sort-dropdown'
import { Card } from '@/components/shadcn/components/ui/card'

export default function Toolbar() {
  return (
    <Card className='flex items-center p-2'>
      <span className='hidden flex-1 justify-start sm:flex'>
        <ColumnToggle />
      </span>

      <span className='flex flex-1 justify-center'>
        <SearchInput />
      </span>

      <span className='flex flex-1 justify-end'>
        <SortDropdown />
      </span>
    </Card>
  )
}
