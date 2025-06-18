import { Button } from '@/components/shadcn/components/ui/button'
import { Input } from '@/components/shadcn/components/ui/input'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { toUrlParams } from '@/lib/helpers/to-url-params'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FormEvent } from 'react'
import useListingsStore from '@/lib/stores/listing'

export default function SearchInput() {
  const router = useRouter()
  const { params } = useListingsStore()

  const handleSearch = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const keyword = formData.get('keyword') as string
    const urlParams = toUrlParams(params)
    if (!!keyword) {
      urlParams.set('keyword', keyword)
    } else {
      urlParams.delete('keyword')
    }
    router.replace(`${APP_ROUTES.PROFILE_LISTINGS.url}?${urlParams}`)
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
