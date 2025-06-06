import { Button } from '@/components/shadcn/components/ui/button'
import { Input } from '@/components/shadcn/components/ui/input'
import { ROUTES } from '@/lib/constants/routes'
import {
  marketToUrlParams
} from '@/lib/common/market'
import { useMarketStore } from '@/lib/stores/market'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FormEvent } from 'react'

export default function SearchInput() {
  const router = useRouter()
  const { params } = useMarketStore()

  const handleSearch = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const keyword = formData.get('keyword') as string
    const urlParams = marketToUrlParams(params)
    if (!!keyword) {
      urlParams.set('keyword', keyword)
    } else {
      urlParams.delete('keyword')
    }
    router.replace(`${ROUTES.MARKET}?${urlParams}`)
  }

  return (
    <form className='flex gap-2' onSubmit={handleSearch}>
      <Input
        name='keyword'
        placeholder='Search'
        defaultValue={params.keyword || ''}
      />
      <Button type='submit'>
        <Search />
      </Button>
    </form>
  )
}
