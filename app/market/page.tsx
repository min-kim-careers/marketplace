import Market from '@/components/02_main/market'
import { QueryParams } from '@/lib/interfaces/params'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}) {
  const params = await searchParams

  const queryParams: QueryParams = {
    page: Number(params.page),
    keyword: params.keyword as string,
    sortBy: params.sortBy as string,
    sortOrder: params.sortOrder as string,
  }

  return <Market queryParams={queryParams} />
}
