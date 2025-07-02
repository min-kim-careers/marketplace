import { Button } from '@/components/shadcn/components/ui/button'
import { Input } from '@/components/shadcn/components/ui/input'
import { formatDateFrom } from '@/lib/helpers/format-date-from'
import { useChatService } from '@/lib/hooks/use-chat-service'
import { IChatSession } from '@/lib/interfaces/chat-session'
import { IProfile } from '@/lib/interfaces/profile'
import useLoadingStore from '@/lib/stores/loading-store'
import useProfileStore from '@/lib/stores/profile-store'
import { FormEvent, useEffect } from 'react'

export default function ChatSession({
  token,
  session,
}: {
  token: string
  session: IChatSession
}) {
  const { profile } = useProfileStore()
  const { messages, sendChat, noMessages, loading } =
    useChatService({
      token,
      session,
    })
  const { setLoading } = useLoadingStore()

  useEffect(() => {
    loading
      ? setLoading('Initializing chat...', true)
      : setLoading(null)
  }, [loading])

  const handleSend = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const input = e.currentTarget.input as HTMLInputElement
    if (input) {
      const value = input.value
      console.log(value)
      sendChat(value)
      input.value = ''
    }
  }

  return (
    <div className='flex flex-1 flex-col gap-2 p-2'>
      <div className='flex flex-1 flex-col-reverse rounded border p-2'>
        {messages.map((m, i) => (
          <div
            key={i}
            className='flex flex-col gap-1 rounded border p-2'
          >
            <p>{profile?.handle}</p>
            {m.createdAt && (
              <p>{formatDateFrom(new Date(m.createdAt))}</p>
            )}
            <p>{m.data}</p>
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSend}
        className='flex flex-row gap-2'
      >
        <Input name='input' />
        <Button type='submit'>Send</Button>
      </form>
    </div>
  )
}
