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
  PopoverAnchor,
  PopoverContent,
} from '@/components/shadcn/components/ui/popover'
import { cn } from '@/components/shadcn/lib/utils'
import { ITEM_CATEGORY_LABELS } from '@/lib/constants/item-category-labels'
import { ITEM_CONDITION_LABELS } from '@/lib/constants/item-condition-labels'
import { ItemCategory } from '@/lib/enums/item-category'
import { ItemCondition } from '@/lib/enums/item-condition'
import { toPath } from '@/lib/helpers/to-path'
import { useItemPageStore } from '@/lib/providers/item-page-provider'
import { zodResolver } from '@hookform/resolvers/zod'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const SearchInputSchema = z.object({
  keyword: z.string().optional(),
  categories: z.array(
    z
      .string()
      .refine((v) =>
        Object.keys(ITEM_CATEGORY_LABELS).includes(v as ItemCategory),
      ),
  ),
  conditions: z.array(
    z
      .string()
      .refine((v) =>
        Object.keys(ITEM_CONDITION_LABELS).includes(v as ItemCondition),
      ),
  ),
})

const Suggestions = () => {
  const [keywords, setKeywords] = useState<string[]>([])

  return (
    <div>
      {keywords.map((k, i) => (
        <div key={i}>{k}</div>
      ))}
    </div>
  )
}

export default function SearchInput() {
  const router = useRouter()
  const { params, route, setProps } = useItemPageStore()
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const popoverRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      const target = e.target as Node
      if (inputRef.current?.contains(target)) return
      if (popoverRef.current?.contains(target)) return
      setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  const form = useForm<z.infer<typeof SearchInputSchema>>({
    resolver: zodResolver(SearchInputSchema),
    defaultValues: {
      keyword: '',
      categories: params.categories ?? [],
      conditions: params.conditions ?? [],
    },
  })

  const watcher = form.watch()

  const getSelectedCount = () =>
    watcher.categories.length + watcher.conditions.length

  const onSubmit = async (values: z.infer<typeof SearchInputSchema>) => {
    const newParams = { ...params, ...values }
    setProps({ params: newParams })
    router.push(toPath(route, newParams))
  }

  const Categories = () => (
    <div className='flex flex-wrap items-center justify-start gap-2'>
      {Object.entries(ITEM_CATEGORY_LABELS).map(([k, v], i) => (
        <button
          className={cn(
            'rounded border p-2',
            watcher.categories.includes(k) && 'bg-secondary',
          )}
          key={i}
          onPointerDown={(e) => e.preventDefault()}
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
  )

  const Conditions = () => (
    <div className='flex flex-wrap items-center justify-start gap-2'>
      {Object.entries(ITEM_CONDITION_LABELS).map(([k, v], i) => (
        <button
          className={cn(
            'rounded border p-2',
            watcher.conditions.includes(k) && 'bg-secondary',
          )}
          key={i}
          onPointerDown={(e) => e.preventDefault()}
          onClick={() => {
            if (watcher.conditions.includes(k)) {
              form.setValue(
                'conditions',
                watcher.conditions.filter((v) => v !== k),
              )
            } else {
              form.setValue('conditions', [...watcher.conditions, k])
            }
          }}
        >
          {v}
        </button>
      ))}
    </div>
  )

  return (
    <Form {...form}>
      <form
        className='flex w-full flex-1 gap-2'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='flex-1'>
          <FormField
            control={form.control}
            name='keyword'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Popover open={open}>
                    <PopoverAnchor>
                      <Input
                        placeholder='Search'
                        {...field}
                        onClick={() => {
                          setOpen(true)
                        }}
                        ref={inputRef}
                      />
                    </PopoverAnchor>
                    <PopoverContent
                      onOpenAutoFocus={(e) => e.preventDefault()}
                      ref={popoverRef}
                      className='flex w-96 flex-col gap-4 max-sm:w-[96vw] max-sm:translate-x-2'
                    >
                      <div className='space-y-2'>
                        <RuleTextRule
                          text={`${watcher.categories.length} selected`}
                        />
                        <Categories />
                      </div>

                      <div className='space-y-2'>
                        <RuleTextRule
                          text={`${watcher.conditions.length} selected`}
                        />
                        <Conditions />
                      </div>

                      <div className='space-y-2'>
                        <RuleTextRule text={`Suggestions`} />

                        <Suggestions />
                      </div>
                    </PopoverContent>
                  </Popover>
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button type='submit' className='w-16'>
          <Search />
        </Button>
      </form>
    </Form>
  )
}
