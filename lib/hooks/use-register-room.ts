import { REGISTER_AND_GET_ROOM_ID } from '@/_gateway/chat/rooms/service'
import useLoadingStore from '@/lib/stores/loading-store'
import { toast } from 'sonner'

export const useRegisterRoom = () => {
  const { setLoading } = useLoadingStore()

  const handleRegisterRoom = async (
    itemId: string,
    handle: string,
  ): Promise<string | null> => {
    try {
      setLoading('Loading...', true)

      const roomId = await REGISTER_AND_GET_ROOM_ID(itemId, handle)
      if (!roomId) throw new Error()

      return roomId
    } catch (error) {
      toast(`Something went wrong.`)
      return null
    } finally {
      setLoading(null)
    }
  }

  return { handleRegisterRoom }
}
