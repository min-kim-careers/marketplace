'use server'

import { GatewayResponse } from '@/lib/clients/response'
import { getSession } from '@/lib/helpers/get-session'
import { envLoader } from '@/lib/utils/env-loader'

export function createClient(base: string) {
  return {
    async request<T>(path: string, init: RequestInit = {}): Promise<T> {
      const url = new URL(path, base).toString()

      const session = await getSession()

      const res = await fetch(url, {
        ...init,
        headers: {
          accept: 'application/json',
          ...(init.method !== 'GET' && { 'content-type': 'application/json' }),
          ...(session && {
            authorization: `${envLoader.sessionHeader}=${session}`,
          }),
        },
      })
      if (!res.ok) {
        throw new Error()
      }
      const _res = (await res.json()) as GatewayResponse
      if (!_res) {
        throw new Error()
      }
      return _res.data as T
    },
    get<T>(path: string, init?: RequestInit) {
      return this.request<T>(path, { ...init, method: 'GET' })
    },
    post<T>(path: string, init?: RequestInit) {
      return this.request<T>(path, { ...init, method: 'POST' })
    },
    put<T>(path: string, init?: RequestInit) {
      return this.request<T>(path, { ...init, method: 'PUT' })
    },
    delete<T>(path: string, init?: RequestInit) {
      return this.request<T>(path, { ...init, method: 'DELETE' })
    },
  }
}
