import { formatDateFrom } from '@/lib/helpers/format-date-from'
import { IChatMessageChat } from "@/lib/interfaces/chat-message"
import { IProfile } from '@/lib/interfaces/profile'
import useProfileStore from '@/lib/stores/profile-store'

export function ChatBubble({
  message,
}: {
  message: IChatMessageChat
}) {
  const { profile } = useProfileStore()

  if (message.isMine)
    return (
      <div className='flex flex-col gap-1 rounded-lg border p-2'>
        <p>Me</p>
        {message.createdAt && (
          <p>{formatDateFrom(new Date(message.createdAt))}</p>
        )}
        <p>{message.content}</p>
      </div>
    )

  return (
    <div className='flex flex-col gap-1 rounded-lg border p-2'>
      <p>{profile?.handle}</p>
      {message.createdAt && (
        <p>{formatDateFrom(new Date(message.createdAt))}</p>
      )}
      <p>{message.content}</p>
    </div>
  )
}
