import { Button } from '@/components/shadcn/components/ui/button'
import { Input } from '@/components/shadcn/components/ui/input'
import { toUrlParams } from '@/lib/helpers/to-url-params'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FormEvent } from 'react'
import { useItemPageStore } from '@/lib/providers/item-page-provider'

export default function SearchInput() {
  const router = useRouter()
  const params = useItemPageStore((store) => store.params)
  const route = useItemPageStore((store) => store.route)

  const handleSearch = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()
    console.log(route, params);
    
    const formData = new FormData(e.currentTarget)
    const keyword = formData.get('keyword') as string
    const urlParams = toUrlParams(params)
    if (!!keyword) {
      urlParams.set('keyword', keyword)
    } else {
      urlParams.delete('keyword')
    }
    router.replace(`${route}?${urlParams}`)
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
