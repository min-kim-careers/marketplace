import { Button } from '@/components/shadcn/components/ui/button'
import { Input } from '@/components/shadcn/components/ui/input'
import { toURLSearchParams } from '@/lib/helpers/to-url-search-params'
import { useItemPageStore } from '@/lib/providers/item-page-provider'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FormEvent } from 'react'

export default function SearchInput() {
  const router = useRouter()
  const { params, route } = useItemPageStore()

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(route, params)

    const formData = new FormData(e.currentTarget)
    const keyword = formData.get('keyword') as string
    const newParams = toURLSearchParams(params)
    if (!!keyword) {
      newParams.set('keyword', keyword)
    } else {
      newParams.delete('keyword')
    }
    router.replace(`${route}?${newParams}`)
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
