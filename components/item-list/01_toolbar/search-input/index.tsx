'use client'

import RuleTextRule from '@/components/rule-text-rule'
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
import { toPath } from '@/lib/helpers/to-path'
import { useItemPageStore } from '@/lib/providers/item-page-provider'
import { zodResolver } from '@hookform/resolvers/zod'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
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
  const { params, route } = useItemPageStore()

  const form = useForm<z.infer<typeof SearchInputSchema>>({
    resolver: zodResolver(SearchInputSchema),
    defaultValues: {
      keyword: '',
      categories: params.categories ?? [],
    },
  })

  const watcher = form.watch()

  const onSubmit = async (values: z.infer<typeof SearchInputSchema>) => {
    const { keyword, categories } = values
    console.log(values);
    
    if (!keyword) {
      delete params.keyword
    }
    if (!categories) {
      delete params.categories
    }
    router.push(toPath(route, { ...params, keyword, categories }))
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
            <RuleTextRule text={`${watcher.categories.length} selected`} />

            <div className='flex flex-wrap items-center justify-center gap-2'>
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
