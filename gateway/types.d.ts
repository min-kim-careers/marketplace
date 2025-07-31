export type GatewayResponse<T> = {
  message?: string
  data?: T
}

export type GatewayError = {
  message?: string
}
