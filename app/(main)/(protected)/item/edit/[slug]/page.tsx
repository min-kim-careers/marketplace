'use server'

import { GET_USER_ITEM } from '@/lib/clients/api/item'
import { GET_PROFILE_EXTRA } from '@/lib/clients/api/profile'
import ItemEdit from '@/components/02_content/item-edit'
import { notFound } from 'next/navigation'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (!slug) notFound()

  const item = await GET_USER_ITEM(slug)
  if (!item) notFound()

  const extra = await GET_PROFILE_EXTRA()
  const imageLimit = extra ? extra.imageLimit : 0

  return <ItemEdit item={item} imageLimit={imageLimit} />
}
