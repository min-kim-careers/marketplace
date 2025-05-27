import {
  attachToken,
  throwServerError,
} from '@/_gateway/_common/_config/helpers'
import { ServerResponse } from '@/_gateway/_common/server/response'
import { envLoader } from '@/lib/utils/env-loader'
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'

const create = () => {
  const instance = axios.create({
    baseURL: envLoader.apiUrl,
  })

  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      config.headers[envLoader.apiKeyHeader] =
        envLoader.apiKey
      await attachToken(config)
      return config
    },
  )

  instance.interceptors.response.use(
    (response: AxiosResponse<ServerResponse>) => {
      const { success, message, data } = response.data
      if (!success) throw new Error()
      if (message) console.log('Response message:', message)
      if (data) response.data = data
      return response
    },

    (error: AxiosError) => {
      throwServerError(error)

      throw new Error()
    },
  )
  return instance
}

export const apiAxios = create()
