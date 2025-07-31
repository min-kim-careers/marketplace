'use server'

import { GET_ITEM_BY_USER } from '@/gateway/item'
import { GET_ITEM_POST_RESTRAINTS } from '@/gateway/profile'
import ItemEdit from '@/components/02_content/item-edit'
import { notFound } from 'next/navigation'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (!slug) notFound()

  const { item } = await GET_ITEM_BY_USER(slug)
  if (!item) notFound()

  const { extra } = await GET_ITEM_POST_RESTRAINTS()
  const imageLimit = extra ? extra.imageLimit : 0

  return <ItemEdit item={item} imageLimit={imageLimit} />
}
