'use server'

import Market from '@/components/02_main/market'
import Toolbar from '@/components/02_main/market/00_toolbar'
import { GetItemsResponse } from '@/lib/api/items/responses'
import { getItems } from '@/lib/api/items/service'
import { ROUTES } from '@/lib/constants/routes'
import { MarketParams } from '@/lib/interfaces/items'
import { redirect } from 'next/navigation'

const defaultPage = 1

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}) {
  const params = await searchParams

  const marketParams: MarketParams = {
    page: Number(params.page),
    keyword: params.keyword as string,
    sortBy: params.sortBy as string,
    sortOrder: params.sortOrder as string,
  }

  if (!marketParams.page) redirect(`${ROUTES.MARKET}?page=1`)

  const { items, count }: GetItemsResponse = await getItems(
    { ...marketParams },
  )

  return (
    <Market
      serverItems={items}
      serverCount={count}
    />
  )
}
