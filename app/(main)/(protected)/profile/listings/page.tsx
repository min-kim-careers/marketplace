'use server'

import { getUserItems } from '@/_gateway/api/profile/service'
import ProfileListings from '@/components/02_main/profile-listings'
import { toUrlParams } from '@/lib/common/helpers'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { DEFAULT_ITEM_PAGINATION } from '@/lib/constants/item-pagination'
import { DEFAULT_ITEM_SORT_OPTION } from '@/lib/constants/item-sort-options'
import { ItemSortBy } from '@/lib/enums/item-sort-by'
import { ItemSortOrder } from '@/lib/enums/item-sort-order'
import { ListingsParams } from '@/lib/interfaces/listings-params'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const defaultListingsParams: ListingsParams = {
  page: DEFAULT_ITEM_PAGINATION.PAGE,
  sortBy: DEFAULT_ITEM_SORT_OPTION.sortBy,
  sortOrder: DEFAULT_ITEM_SORT_OPTION.sortOrder,
}

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
      `${APP_ROUTES.PROFILE_LISTINGS.url}?${toUrlParams(defaultListingsParams)}`,
    )
  }

  const listingsParams: ListingsParams = result.data

  const { items, count } = await getUserItems(listingsParams)

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
