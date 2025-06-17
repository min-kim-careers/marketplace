'use server'

import { getProfileExtra } from '@/_gateway/api/profile/service'
import ItemEdit from '@/components/02_main/item-edit'
import { notFound } from 'next/navigation'
import { z } from 'zod'

const ItemEditUrlSchema = z
  .object({
    item: z.string().nonempty(),
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

  const result = ItemEditUrlSchema.safeParse(urlParams)

  if (!result.success) notFound()

  const { item } = result.data

  const extra = await getProfileExtra()
  const imageLimit = extra ? extra.imageLimit : 0

  // return <ItemEdit imageLimit={imageLimit} item={} />
  return null
}
