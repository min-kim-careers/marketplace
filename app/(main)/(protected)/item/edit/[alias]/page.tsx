'use server'

import { getItemByAlias, getItemImageLimit } from '@/api'
import ItemEdit from '@/app/(main)/(protected)/item/edit/[alias]'
import { notFound } from 'next/navigation'

export default async function Page({
  params,
}: {
  params: Promise<{ alias: string }>
}) {
  const { alias } = await params
  if (!alias) notFound()

  const item = await getItemByAlias(alias)
  if (!item) throw new Error("Item not found")

  const imageLimit = await getItemImageLimit()

  return <ItemEdit item={item} imageLimit={imageLimit} />
}
