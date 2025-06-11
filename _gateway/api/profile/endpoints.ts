export const PROFILE_ENDPOINTS = {
  GET_PROFILE: (userId: string) =>
    `/api/profiles/${userId}`,
  UPSERT_PROFILE: (userId: string) =>
    `/api/profiles/${userId}`,
  CHECK_HANDLE_EXISTS: (handle: string) =>
    `/api/profiles/exists/${handle}`,
}
