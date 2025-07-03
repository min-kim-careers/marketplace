import Spinner from '@/components/00_common/spinner'
import { Button } from '@/components/shadcn/components/ui/button'
import { Input } from '@/components/shadcn/components/ui/input'
import { formatDateFrom } from '@/lib/helpers/format-date-from'
import { useChatService } from '@/components/00_common/chat/hooks/use-chat-service'
import { IChatMessage } from '@/lib/interfaces/chat-message'
import { IChatRoom } from '@/lib/interfaces/chat-session'
import { IProfile } from '@/lib/interfaces/profile'
import useLoadingStore from '@/lib/stores/loading-store'
import useProfileStore from '@/lib/stores/profile-store'
import { FormEvent, useEffect } from 'react'

function ChatBubble({
  message,
  profile,
}: {
  message: IChatMessage
  profile: IProfile
}) {
  if (message.isMine)
    return (
      <div className='flex flex-col gap-1 rounded-lg border p-2'>
        <p>Me</p>
        {message.createdAt && (
          <p>
            {formatDateFrom(new Date(message.createdAt))}
          </p>
        )}
        <p>{message.data}</p>
      </div>
    )

  return (
    <div className='flex flex-col gap-1 rounded-lg border p-2'>
      <p>{profile?.handle}</p>
      {message.createdAt && (
        <p>{formatDateFrom(new Date(message.createdAt))}</p>
      )}
      <p>{message.data}</p>
    </div>
  )
}

export default function ChatRoom({
  token,
  session,
}: {
  token: string
  session: IChatRoom
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

  if (!profile) return <Spinner />

  return (
    <div className='flex flex-1 flex-col gap-2 p-2'>
      <div className='flex flex-1 flex-col-reverse gap-2 rounded-lg border p-2'>
        {messages.map((m, i) => (
          <ChatBubble
            key={i}
            message={m}
            profile={profile}
          />
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
