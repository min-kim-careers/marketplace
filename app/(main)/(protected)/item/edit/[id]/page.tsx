'use server'

import { GET_USER_ITEM } from '@/_gateway/api/item/service'
import { GET_PROFILE_EXTRA } from '@/_gateway/api/profile/service'
import ItemEdit from '@/components/02_main/item/edit'
import { notFound } from 'next/navigation'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  if (!id) notFound()

  const item = await GET_USER_ITEM(id)
  if (!item) notFound()

  const extra = await GET_PROFILE_EXTRA()
  const imageLimit = extra ? extra.imageLimit : 0

  return <ItemEdit item={item} imageLimit={imageLimit} />
}
