'use server'

import Market from '@/components/02_content/market'
import { getAllItems } from '@/lib/clients/item'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { DEFAULT_MARKET_PARAMS } from '@/lib/constants/market-params'
import { ItemSortBy } from '@/lib/enums/item-sort-by'
import { ItemSortOrder } from '@/lib/enums/item-sort-order'
import { toURLSearchParams } from '@/lib/helpers/to-url-search-params'
import { ItemPageParams } from '@/lib/types/item-page-params'
import { ItemPageProvider } from '@/lib/providers/item-page-provider'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const MarketParamsSchema = z
  .object({
    page: z.coerce.number().positive(),
    sortBy: z
      .string()
      .refine((val) => Object.values(ItemSortBy).includes(val as ItemSortBy)),
    sortOrder: z
      .string()
      .refine((val) =>
        Object.values(ItemSortOrder).includes(val as ItemSortOrder),
      ),
    keyword: z.string().trim().optional(),
  })
  .strict()

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}) {
  const urlParams = await searchParams

  const result = MarketParamsSchema.safeParse(urlParams)

  if (!result.success) {
    redirect(`${APP_ROUTES.MARKET.href}?${toURLSearchParams(DEFAULT_MARKET_PARAMS)}`)
  }

  const params: ItemPageParams = result.data

  const { items, count } = await getAllItems(params)

  return (
    <ItemPageProvider
      key={toURLSearchParams(params).toString()}
      props={{
        items,
        count,
        params,
        route: APP_ROUTES.MARKET.href,
      }}
    >
      <Market />
    </ItemPageProvider>
  )
}
