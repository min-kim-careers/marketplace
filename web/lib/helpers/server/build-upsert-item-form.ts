'use server'

import { _UpsertItemQuery } from '@/api/endpoints/item'
import { toFormData } from '@/lib/helpers/server/to-form-data'

export const buildUpsertItemForm = async (request: _UpsertItemQuery) => {
  let placeholder_index = 0
  if (request.imageUrls) {
    request.imageUrls.map((url) =>
      url.startsWith('blob:') ? `{{${placeholder_index++}}}` : url,
    )
  }
  return await toFormData(request)
}
