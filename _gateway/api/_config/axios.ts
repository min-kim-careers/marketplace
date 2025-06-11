'use server'

import { ApiInternalResponse } from '@/_gateway/api/_interfaces/api-internal.response'
import { envLoader } from '@/lib/utils/env-loader'
import axios, {
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'

const create = async () => {
  const instance = axios.create({
    baseURL: envLoader.apiUrl,
  })

  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      config.headers[envLoader.apiKeyHeader] =
        envLoader.apiKey

      return config
    },
  )

  instance.interceptors.response.use(
    (response: AxiosResponse<ApiInternalResponse>) => {
      const { success, data } = response.data
      if (!success) throw new Error()
      if (data) response.data = data

      return response
    },
  )
  return instance
}

export const apiAxios = await create()
