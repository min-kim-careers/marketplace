'use server'

import { GET_USER_ITEMS } from '@/_gateway/api/item/service'
import ProfileListings from '@/components/02_content/main/profile-listings'
import { toUrlParams } from '@/lib/helpers/to-url-params'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { DEFAULT_ITEM_PAGE_PARAMS } from '@/lib/constants/item-page-params'
import { ItemSortBy } from '@/lib/enums/item-sort-by'
import { ItemSortOrder } from '@/lib/enums/item-sort-order'
import { IItemPageParams } from '@/lib/interfaces/item-page-params'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { ItemPageProvider } from '@/lib/providers/item-page-provider'

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
      `${APP_ROUTES.PROFILE_LISTINGS.href}?${toUrlParams(DEFAULT_ITEM_PAGE_PARAMS)}`,
    )
  }

  const params: IItemPageParams = result.data

  const { items, count } = await GET_USER_ITEMS(params)

  return (
    <ItemPageProvider
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
