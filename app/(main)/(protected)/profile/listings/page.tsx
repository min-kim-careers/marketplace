'use server'

import { getAllUserItems } from '@/lib/clients/item'
import ProfileListings from '@/components/02_content/profile-listings'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { DEFAULT_ITEM_PAGE_PARAMS } from '@/lib/constants/item-page-params'
import { ItemSortBy } from '@/lib/enums/item-sort-by'
import { ItemSortOrder } from '@/lib/enums/item-sort-order'
import { ItemPageParams } from '@/lib/types/item-page-params'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { ItemPageProvider } from '@/lib/providers/item-page-provider'
import { isInConst } from '@/lib/helpers/is-in-const'
import { toURLSearchParams } from '@/lib/helpers/to-url-search-params'

const ListingsParamsSchema = z
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

  const result = ListingsParamsSchema.safeParse(urlParams)

  if (!result.success) {
    redirect(
      `${APP_ROUTES.PROFILE_LISTINGS.href}?${toURLSearchParams(DEFAULT_ITEM_PAGE_PARAMS)}`,
    )
  }

  const params: ItemPageParams = result.data

  const { items, count } = await getAllUserItems(params)

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
      <ProfileListings />
    </ItemPageProvider>
  )
}
