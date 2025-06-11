export const ITEM_ENDPOINTS = {
  GET_ITEMS: '/api/items',
  CREATE_ITEMS: (userId: string) => `/api/items/${userId}`,
  UPDATE_ITEMS: (itemId: number) => `/api/items/${itemId}`,
}
