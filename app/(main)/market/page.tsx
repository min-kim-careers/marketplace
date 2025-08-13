import Market from '@/app/(main)/market'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { DEFAULT_ITEM_PAGE_PARAMS } from '@/lib/constants/item-page-params'
import { toPath } from '@/lib/helpers/to-path'
import { ItemPageParamsSchema } from '@/lib/schemas/item-page-params-schema'
import { ItemPageParams } from '@/lib/types/item-page-params'
import { redirect } from 'next/navigation'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}) {
  const urlParams = await searchParams

  const result = ItemPageParamsSchema.safeParse(urlParams)

  if (!result.success) {
    redirect(toPath(APP_ROUTES.MARKET.href, DEFAULT_ITEM_PAGE_PARAMS))
  }

  const params: ItemPageParams = result.data

  return <Market params={params} />
}
