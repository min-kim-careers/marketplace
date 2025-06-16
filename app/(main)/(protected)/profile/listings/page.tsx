'use server'

import { getUserItems } from '@/_gateway/api/item/service'
import ProfileListings from '@/components/02_main/protected/profile/listings'
import { toUrlParams } from '@/lib/common/helpers'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { DEFAULT_ITEM_PAGINATION } from '@/lib/constants/item-pagination'
import { DEFAULT_ITEM_SORT_OPTION } from '@/lib/constants/item-sort-options'
import { ItemSortBy } from '@/lib/enums/item-sort-by'
import { ItemSortOrder } from '@/lib/enums/item-sort-order'
import { ListingsParams } from '@/lib/interfaces/listings-params'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const ListingsParamsSchema = z.object({
  page: z.coerce
    .number()
    .positive()
    .default(DEFAULT_ITEM_PAGINATION.PAGE),
  sortBy: z
    .string()
    .default(DEFAULT_ITEM_SORT_OPTION.sortBy as ItemSortBy),
  sortOrder: z
    .string()
    .default(
      DEFAULT_ITEM_SORT_OPTION.sortOrder as ItemSortOrder,
    ),
  keyword: z.string().trim().optional(),
})

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
    const fallbackParams = ListingsParamsSchema.parse({})
    redirect(
      `${APP_ROUTES.PROFILE_LISTINGS}?${toUrlParams(fallbackParams)}`,
    )
  }

  const listingsParams: ListingsParams = result.data

  const { items, count } =
    await getUserItems(listingsParams)

  return (
    <ProfileListings
      props={{
        items,
        count,
        params: listingsParams,
      }}
    />
  )
}
