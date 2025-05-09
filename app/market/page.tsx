'use server'

import Market from '@/components/02_main/market'

const defaultPage = 1

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}) {
  const params = await searchParams

  const marketParams = {
    page: Number(params.page) || defaultPage,
    keyword: params.keyword as string,
    sortBy: params.sortBy as string,
    sortOrder: params.sortOrder as string,
  }

  return <Market marketParams={marketParams} />
}
