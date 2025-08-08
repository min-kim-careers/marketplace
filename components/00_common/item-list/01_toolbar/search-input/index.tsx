'use client'

import { Button } from '@/components/shadcn/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@/components/shadcn/components/ui/form'
import { Input } from '@/components/shadcn/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/shadcn/components/ui/popover'
import { cn } from '@/components/shadcn/lib/utils'
import { ITEM_CATEGORY_LABELS } from '@/lib/constants/item-category-labels'
import { ItemCategory } from '@/lib/enums/item-category'
import { useItemPageStore } from '@/lib/providers/item-page-provider'
import { zodResolver } from '@hookform/resolvers/zod'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const SearchInputSchema = z.object({
  keyword: z.string(),
  categories: z.array(
    z
      .string()
      .refine((v) =>
        Object.keys(ITEM_CATEGORY_LABELS).includes(v as ItemCategory),
      ),
  ),
})

export default function SearchInput() {
  const router = useRouter()
  const { params, route, setProps } = useItemPageStore()
  const [open, setOpen] = useState(false)

  const [results, setResults] = useState([])

  const form = useForm<z.infer<typeof SearchInputSchema>>({
    resolver: zodResolver(SearchInputSchema),
    defaultValues: {
      keyword: '',
      categories: [],
    },
  })

  const watcher = form.watch()

  // const handleOnChange = () => {
  //   setOpen(true)
  // }

  const onSubmit = async (values: z.infer<typeof SearchInputSchema>) => {
    console.log(values)

    // e.preventDefault()
    // const formData = new FormData(e.currentTarget)
    // const keyword = formData.get('keyword') as string
    // if (!keyword) {
    //   delete params['keyword']
    // }
    // router.push(toPath(route, { ...params, keyword }))
  }

  return (
    <Form {...form}>
      <form
        className='flex w-full flex-1 gap-2'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Popover>
          <PopoverTrigger className='flex-1'>
            <FormField
              control={form.control}
              name='keyword'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder='Search' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </PopoverTrigger>
          <PopoverContent
            onOpenAutoFocus={(e) => e.preventDefault()}
            className='flex flex-col gap-4'
          >
            <div>No results...</div>

            <div className='border-b' />

            <div className='flex flex-wrap gap-2'>
              {Object.entries(ITEM_CATEGORY_LABELS).map(([k, v], i) => (
                <button
                  className={cn(
                    'rounded border p-2',
                    watcher.categories.includes(k) && 'bg-secondary',
                  )}
                  key={i}
                  onClick={() => {
                    if (watcher.categories.includes(k)) {
                      form.setValue(
                        'categories',
                        watcher.categories.filter((v) => v !== k),
                      )
                    } else {
                      form.setValue('categories', [...watcher.categories, k])
                    }
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <Button type='submit' className='w-[48px]'>
          <Search />
        </Button>
      </form>
    </Form>
  )
}
