'use server'

import { GET_ITEMS } from '@/_gateway/api/item/service'
import Market from '@/components/02_content/market'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { DEFAULT_MARKET_PARAMS } from '@/lib/constants/market-params'
import { ItemSortBy } from '@/lib/enums/item-sort-by'
import { ItemSortOrder } from '@/lib/enums/item-sort-order'
import { toUrlParams } from '@/lib/helpers/to-url-params'
import { IItemPageParams } from '@/lib/interfaces/item-page-params'
import { ItemPageProvider } from '@/lib/providers/item-page-provider'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const MarketParamsSchema = z
  .object({
    page: z.coerce.number().positive(),
    sortBy: z
      .string()
      .refine((val) =>
        Object.values(ItemSortBy).includes(
          val as ItemSortBy,
        ),
      ),
    sortOrder: z
      .string()
      .refine((val) =>
        Object.values(ItemSortOrder).includes(
          val as ItemSortOrder,
        ),
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
    redirect(
      `${APP_ROUTES.MARKET.href}?${toUrlParams(DEFAULT_MARKET_PARAMS)}`,
    )
  }

  const params: IItemPageParams = result.data

  const { items, count } = await GET_ITEMS(params)

  return (
    <ItemPageProvider
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
