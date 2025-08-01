'use server'

import { _UpsertItemRequest } from '@/api/endpoints/item'
import { toFormData } from '@/lib/helpers/server/to-form-data'

export const buildUpsertItemForm = async (request: _UpsertItemRequest) => {
  let placeholder_index = 0
  if (request.imageUrls) {
    request.imageUrls.map((url) =>
      url.startsWith('blob:') ? `{{${placeholder_index++}}}` : url,
    )
  }
  return await toFormData(request)
}
