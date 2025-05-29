export interface SignInInternalPayload {
  email: string
  password: string
}


export interface SignUpInternalPayload {
  email: string
  password: string
  handle: string
}

export interface RefreshInternalPayload {
  refreshToken: string
}