import { ItemResponse } from '../interfaces/items'

export const fetchItems = async (
  params: URLSearchParams,
): Promise<ItemResponse> => {
  try {
    const res = await fetch(`/api/items?${params}`)

    if (!res.ok) throw new Error()

    return await res.json()
  } catch (error) {
    throw new Error()
  }
}
