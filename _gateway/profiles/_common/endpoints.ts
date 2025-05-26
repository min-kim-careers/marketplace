export const PROFILES_ENDPOINTS = {
  GET_PROFILE: (userId: string) => `/api/profiles${userId}`,
  PUT_PROFILE: (userId: string) => `/api/profiles${userId}`,
}
