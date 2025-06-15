export interface ApiInternalResponse {
  success: boolean
  data?: any
}

export interface ApiErrorResponse {
  message?: string
  userMessage?: string
}
