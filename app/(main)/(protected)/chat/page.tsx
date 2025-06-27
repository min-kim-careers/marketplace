'use server'

import { GET_USER_ITEM } from '@/_gateway/api/item/service'
import { GET_PROFILE, HANDLE_EXISTS } from '@/_gateway/api/profile/service'
import { createHash } from '@/_gateway/auth/_config/helpers'
import Chat from '@/components/02_content/chat'
import { notFound } from 'next/navigation'
import { string, z } from 'zod'

const ChatParamsSchema = z
  .object({
    session: z.string().nonempty(),
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

  if (!Object.keys(urlParams).length) return <Chat />

  const result = ChatParamsSchema.safeParse(urlParams)

  if (!result.success) notFound()

  const { session } = result.data


  return <Chat roomId={session} />
}
