import ChatRoomList from '@/chat/chat-room-list'
import useChatStore from '@/chat/stores/chat-store'

export default function ChatToolbar() {
  const status = useChatStore((state) => state.status)
  // const { msUntilIdle } = useChatContext()
  // const [remaining, setRemaining] = useState(0)

  // useEffect(() => {
  //   const id = setInterval(() => {
  //     setRemaining(Math.ceil(msUntilIdle() / 1000))
  //   }, 1000)
  //   return () => clearInterval(id)
  // }, [msUntilIdle])

  return (
    <div className='flex items-center justify-between space-x-2 rounded border p-1 px-3 text-sm italic text-black/80'>
      <span>
        <span>{status.toUpperCase()}</span>
      </span>

      {/* <span>
        {remaining < 10 && remaining > 0 && (
          <span>{remaining}s until idle</span>
        )}
      </span> */}

      <span>
        <ChatRoomList />
      </span>
    </div>
  )
}
