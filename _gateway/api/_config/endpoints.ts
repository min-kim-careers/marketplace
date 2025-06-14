export const PROFILE_ENDPOINTS = {
  GET_PROFILE: (userId: string) => `/${userId}`,
  UPSERT_PROFILE: (userId: string) => `/${userId}`,
  CHECK_HANDLE_EXISTS: (handle: string) =>
    `/exists/${handle}`,
  GET_PROFILE_EXTRA: (userId: string) => `/${userId}/extra`,
  GET_LISTINGS: (userId: string) => `/${userId}/listings`,
}

export const ITEM_ENDPOINTS = {
  GET_ITEMS: ``,
  CREATE_ITEM: (userId: string) => `/${userId}`,
  UPDATE_ITEM: (itemId: number) => `/${itemId}`,
  UPLOAD_IMAGES: (itemId: number) =>
    `/${itemId}/upload/images`,
  DELETE_ITEM: (itemId: number) => `/${itemId}`,
}
