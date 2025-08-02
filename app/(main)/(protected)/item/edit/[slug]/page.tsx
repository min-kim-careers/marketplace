'use server'

import { getItemBySlug, getItemImageLimit } from '@/api'
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
  if (!item) throw new Error("Item not found")

  const imageLimit = await getItemImageLimit()

  return <ItemEdit item={item} imageLimit={imageLimit} />
}
