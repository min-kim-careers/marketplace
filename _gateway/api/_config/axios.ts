'use server'

import { ApiInternalResponse } from '@/_gateway/api/_config/interfaces'
import { envLoader } from '@/lib/utils/env-loader'
import { logInfo } from '@/lib/utils/log'
import axios, {
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'

export const createApiAxios = async (endpoint: string) => {
  const instance = axios.create({
    baseURL: envLoader.apiUrl + endpoint,
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
      const { message, data } = response.data
      if (message) logInfo(message)
      if (data) response.data = data

      return response
    },
  )
  return instance
}
