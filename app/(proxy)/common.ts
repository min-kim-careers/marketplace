import { env } from '@/lib/utils/env'

export async function authFetch(
  input: RequestInfo,
  init: RequestInit = {},
) {
  const headers = new Headers(init.headers)
  headers.append('Authorization', `Bearer ${env.apiToken}`)
  
  return fetch(input, { ...init, headers })
}
