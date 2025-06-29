'use server'

import Chat from '@/components/02_content/chat'
import { decodeParams } from '@/lib/helpers/encode-params'
import { z } from 'zod'

const ChatParamsSchema = z
  .object({
    session: z
      .string()
      .nonempty()
      .transform(
        async (encoded) => await decodeParams(encoded),
      )
      .refine((val) =>
        z
          .object({
            item: z.string().nonempty(),
            seller: z.string().nonempty(),
            buyer: z.string().nonempty(),
          })
          .safeParse(val),
      ),
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

  const result =
    await ChatParamsSchema.parseAsync(urlParams)

  const { item, seller, buyer } = result.session

  return (
    <Chat
      session={{
        clientId: buyer,
        roomId: `${item}_${seller}_${buyer}`,
      }}
    />
  )
}
