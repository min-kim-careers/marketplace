'use client'

import { deleteItem, upsertItem, UpsertItemRequest } from '@/api/service/item'
import { imageUrlsToFiles } from '@/lib/helpers/image-urls-to-files'
import { Item } from '@/lib/types/item'
import { toast } from 'sonner'
import { useLoadingStore } from '../providers/loading-provider'

interface ItemHandlerState {
  handleUpsert: ({
    request,
    imageUrls,
    alias,
  }: {
    request: UpsertItemRequest
    imageUrls?: string[]
    alias?: string
  }) => Promise<boolean>
  handleDelete: (item: Item) => Promise<boolean>
}

export const useItemHandler = (): ItemHandlerState => {
  const { setLoading } = useLoadingStore()

  const handleUpsert = async ({
    request,
    imageUrls,
    alias,
  }: {
    request: UpsertItemRequest
    imageUrls?: string[]
    alias?: string
  }) => {
    const isUpdate = !!alias
    let toastMsg = ''

    try {
      setLoading(`${isUpdate ? 'Updating' : 'Posting'} your item`)

      if (imageUrls) {
        request.uploadImages = await imageUrlsToFiles(imageUrls)
        request.uploadIndices = imageUrls
          .map((url, i) => (url.startsWith('blob:') ? i : null))
          .filter((url) => url != null)
      }

      if (!(await upsertItem(request, alias))) {
        throw new Error(`failed to ${isUpdate ? 'update' : 'post'}`)
      }

      toastMsg = `Your item was ${isUpdate ? 'updated' : 'posted'} successfully!`
    } catch (error) {
      console.error(error)
      toastMsg = `Something went wrong.`
      return false
    } finally {
      setLoading()
      if (toastMsg) toast(toastMsg)
    }
    return true
  }

  const handleDelete = async (item: Item) => {
    let toastMsg = ''
    try {
      setLoading('Deleting post')

      if (!(await deleteItem(item.alias))) {
        throw new Error('failed to delete')
      }

      toastMsg = 'Successfully deleted post'
    } catch (error) {
      console.error(error)
      toastMsg = 'Something went wrong'
      return false
    } finally {
      setLoading()
      if (toastMsg) toast(toastMsg)
    }
    return true
  }

  return { handleUpsert, handleDelete }
}
