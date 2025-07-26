import { FETCH_ROOM_ID } from '@/lib/clients/rooms'
import useLoadingStore from '@/lib/stores/loading-store'
import { toast } from 'sonner'

export const useFetchRoomId = () => {
  const { setLoading } = useLoadingStore()

  const handleFetchRoomId = async (
    itemId: string,
    handle: string,
  ): Promise<string | null> => {
    try {
      setLoading('Loading...', true)

      const { roomId } = await FETCH_ROOM_ID(itemId, handle)

      return roomId
    } catch (error) {
      toast(`Something went wrong.`)
      return null
    } finally {
      setLoading(null)
    }
  }

  return { handleFetchRoomId }
}
