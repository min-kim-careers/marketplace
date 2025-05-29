export const ITEMS_ENDPOINTS = {
  GET_ITEMS: '/api/items',
  GET_SORT_OPTIONS: '/api/items/sort-options',
}

export const PROFILES_ENDPOINTS = {
  GET_PROFILE: (userId: string) =>
    `/api/profiles/${userId}`,
  PUT_PROFILE: (userId: string) =>
    `/api/profiles/${userId}`,
}
