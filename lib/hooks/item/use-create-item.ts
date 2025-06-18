import {
  CREATE_ITEM,
  CreateItemRequest,
} from '@/_gateway/api/item/service'
import { useToast } from '@/components/shadcn/hooks/use-toast'
import { compressImageFromUrl } from '@/lib/helpers/compress-image-from-url'
import { useLoadingStore } from '@/lib/stores/loading'
import { useRouter } from 'next/navigation'

export const useCreateItem = () => {
  const { setLoading } = useLoadingStore()
  const { toast } = useToast()
  const router = useRouter()

  const handleCreateItem = async ({
    request,
    imageUrls,
  }: {
    request: CreateItemRequest
    imageUrls: string[]
  }) => {
    try {
      setLoading('Posting your item', true)

      const images = await Promise.all(
        imageUrls
          .map(
            async (url) => await compressImageFromUrl(url),
          ),
      )

      const item = await CREATE_ITEM(request, images)
      if (!item) throw new Error('Failed to create item')

      toast({
        description: 'Your item was posted successfully!',
      })

      router.refresh()
    } catch (error) {
      toast({ description: `Something went wrong.` })
    } finally {
      setLoading(null)
    }
  }

  return { handleCreateItem }
}
