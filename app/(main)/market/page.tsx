import Market from '@/components/02_content/market'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { DEFAULT_ITEM_PAGE_PARAMS } from '@/lib/constants/item-page-params'
import { ItemSortBy } from '@/lib/enums/item-sort-by'
import { ItemSortOrder } from '@/lib/enums/item-sort-order'
import { toPath } from '@/lib/helpers/to-path'
import { ItemPageParams } from '@/lib/types/item-page-params'
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
    redirect(toPath(APP_ROUTES.MARKET.href, DEFAULT_ITEM_PAGE_PARAMS))
  }

  const params: ItemPageParams = result.data

  return <Market params={params} />
}
