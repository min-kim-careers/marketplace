'use server'

import { getItemBySlug, getProfileExtra } from '@/api'
import ItemEdit from '@/components/02_content/item-edit'
import { notFound } from 'next/navigation'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (!slug) notFound()

  const item = await getItemBySlug(slug)
  if (!item) notFound()

  const extra = await getProfileExtra()

  return <ItemEdit item={item} imageLimit={extra.imageLimit} />
}
