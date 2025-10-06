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
import { useItemPageContext } from '@/lib/providers/item-page-provider'
import { zodResolver } from '@hookform/resolvers/zod'
import { Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const DEFAULT_KEYWORD_LIMIT = 10 as const

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

const useDismissable = () => {
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
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' || e.key === 'Enter') {
        setOpen(false)
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return { open, setOpen, inputRef, popoverRef }
}

export default function SearchInput() {
  const router = useRouter()
  const { params, route, recentKeywords, setProps } = useItemPageContext()
  const { open, setOpen, inputRef, popoverRef } = useDismissable()

  const form = useForm<z.infer<typeof SearchInputSchema>>({
    resolver: zodResolver(SearchInputSchema),
    defaultValues: {
      keyword: '',
      categories: params.categories ?? [],
      conditions: params.conditions ?? [],
    },
  })

  const watcher = form.watch()

  const onSubmit = async (values: z.infer<typeof SearchInputSchema>) => {
    const handleKeyword = (newKeyword?: string) => {
      if (!newKeyword) return recentKeywords

      const updated = [newKeyword, ...recentKeywords]
      return updated.slice(0, DEFAULT_KEYWORD_LIMIT)
    }

    const newParams = { ...params, ...values }

    router.push(toPath(route, newParams))

    setProps({
      params: newParams,
      ...(values.keyword && {
        recentKeywords: handleKeyword(values.keyword),
      }),
    })
  }

  const RecentKeywords = () => (
    <div className='flex max-h-60 flex-col overflow-y-auto'>
      {!recentKeywords.length && <p className='italic text-muted-foreground text-sm flex justify-center'>...</p>}
      {recentKeywords.map((k, i) => (
        <span
          key={i}
          className={cn(
            'flex items-center px-2 py-1 hover:bg-secondary',
            watcher.keyword === k && 'bg-secondary',
          )}
        >
          <button
            className={cn('flex-1 truncate text-left text-sm italic')}
            onClick={() =>
              form.setValue('keyword', k, { shouldValidate: true })
            }
          >
            {k}
          </button>
          <button
            onClick={() => {
              setProps({
                recentKeywords: recentKeywords.filter((_k) => _k !== k),
              })
            }}
          >
            <X className='w-4' />
          </button>
        </span>
      ))}
    </div>
  )

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
                        <RuleTextRule text={`Recent`} />

                        <RecentKeywords />
                      </div>

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
