import Market from '@/components/02_main/market'
import { URLParams } from '@/lib/interfaces/params'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}) {
  const params = await searchParams

  const urlParams: URLParams = {
    page: Number(params.page) || 1,
    keyword: params.keyword as string,
    sortBy: params.sortBy as string,
    sortOrder: params.sortOrder as string,
  }

  return <Market urlParams={urlParams} />
}
