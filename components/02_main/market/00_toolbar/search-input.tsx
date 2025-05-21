import { Button } from '@/components/shadcn/components/ui/button'
import { Input } from '@/components/shadcn/components/ui/input'
import { ROUTES } from '@/lib/constants/routes'
import { MarketParams } from '@/lib/interfaces/items'
import {
  extractParamsFromURL,
  serialize,
} from '@/lib/utils/params'
import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent } from 'react'

export default function SearchInput() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const handleSearch = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const keyword = formData.get('keyword') as string
    const marketParams: MarketParams =
      extractParamsFromURL(searchParams)
    marketParams.keyword = keyword
    const urlParams = new URLSearchParams(
      serialize(marketParams),
    )
    console.log(`${ROUTES.MARKET}?${urlParams.toString()}`,);
    
    // router.replace(
    //   `${ROUTES.MARKET}?${urlParams.toString()}`,
    // )
  }

  return (
    <form className='flex gap-2' onSubmit={handleSearch}>
      <Input name='keyword' placeholder='Search' />
      <Button type='submit'>
        <Search />
      </Button>
    </form>
  )
}
