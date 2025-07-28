'use client'

import { Button } from '@/components/shadcn/components/ui/button'
import { Input } from '@/components/shadcn/components/ui/input'
import { toPath } from '@/lib/helpers/to-path'
import { useItemPageStore } from '@/lib/providers/item-page-provider'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FormEvent } from 'react'

export default function SearchInput() {
  const router = useRouter()
  const { params, route } = useItemPageStore()

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const keyword = formData.get('keyword') as string
    router.push(toPath(route, { ...params, ...(keyword && { keyword }) }))
  }

  return (
    <form className='flex w-full flex-1 gap-2' onSubmit={handleSearch}>
      <Input
        className='flex-1'
        name='keyword'
        placeholder='Search'
        defaultValue={params.keyword || ''}
      />
      <Button type='submit' className='w-[48px]'>
        <Search />
      </Button>
    </form>
  )
}
