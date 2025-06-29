import { Button } from '@/components/shadcn/components/ui/button'
import { Input } from '@/components/shadcn/components/ui/input'
import { useChatService } from '@/lib/hooks/use-chat-service'
import { IChatSession } from '@/lib/interfaces/chat-session'
import useLoadingStore from '@/lib/stores/loading-store'
import { FormEvent, useEffect } from 'react'

export default function ChatSession({
  token,
  session,
}: {
  token: string
  session: IChatSession
}) {
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
      <div className='flex-1 rounded border'></div>
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
