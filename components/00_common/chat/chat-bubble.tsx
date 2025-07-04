import { formatDateFrom } from '@/lib/helpers/format-date-from';
import { IChatMessage } from '@/lib/interfaces/chat-message';
import { IProfile } from '@/lib/interfaces/profile';

export function ChatBubble({
  message, profile,
}: {
  message: IChatMessage;
  profile: IProfile;
}) {
  if (message.isMine)
    return (
      <div className='flex flex-col gap-1 rounded-lg border p-2'>
        <p>Me</p>
        {message.createdAt && (
          <p>{formatDateFrom(new Date(message.createdAt))}</p>
        )}
        <p>{message.data}</p>
      </div>
    );

  return (
    <div className='flex flex-col gap-1 rounded-lg border p-2'>
      <p>{profile?.handle}</p>
      {message.createdAt && (
        <p>{formatDateFrom(new Date(message.createdAt))}</p>
      )}
      <p>{message.data}</p>
    </div>
  );
}
