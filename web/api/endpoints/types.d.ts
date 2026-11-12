export type APIResponse<T> = {
  message?: string
  data?: T
}

export type APIError = {
  message?: string
}
