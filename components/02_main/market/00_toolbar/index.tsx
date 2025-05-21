import ColumnToggle from '@/components/02_main/market/00_toolbar/column-toggle'
import SearchInput from '@/components/02_main/market/00_toolbar/search-input'
import SortOrderDropdown from '@/components/02_main/market/00_toolbar/sort-order-dropdown'
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
        <SortOrderDropdown />
      </span>
    </Card>
  )
}
