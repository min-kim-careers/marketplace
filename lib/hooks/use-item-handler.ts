'use client'

import { deleteItem, upsertItem, UpsertItemRequest } from '@/api/service/item'
import { imageUrlsToFiles } from '@/lib/helpers/image-urls-to-files'
import { Item } from '@/lib/types/item'
import { toast } from 'sonner'
import { useLoadingStore } from '../providers/loading-provider'

interface ItemHandlerState {
  handleUpsert: ({
    request,
    alias,
  }: {
    request: UpsertItemRequest
    alias?: string
  }) => Promise<boolean>
  handleDelete: (item: Item) => Promise<boolean>
}

export const useItemHandler = (): ItemHandlerState => {
  const { setLoading } = useLoadingStore()

  const handleUpsert = async ({
    request,
    alias,
  }: {
    request: UpsertItemRequest
    alias?: string
  }) => {
    const isUpdating = !!alias

    let toastMsg = ''
    try {
      setLoading(`${isUpdating ? 'Updating' : 'Posting'} your item`)

      if (request.imageUrls) {
        request.uploadImages = await imageUrlsToFiles(request.imageUrls)
      }

      const newItem = await upsertItem(request, alias)
      if (!newItem) {
        throw new Error(`failed to ${isUpdating ? 'update' : 'post'}`)
      }

      toastMsg = `Your item was ${isUpdating ? 'updated' : 'posted'} successfully!`
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
