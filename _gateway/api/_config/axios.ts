import { attachAccessToken } from '@/_gateway/auth/_config/helpers'
import { InternalResponse } from '@/_gateway/_common/internal.response'
import { envLoader } from '@/lib/utils/env-loader'
import axios, {
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
      await attachAccessToken(config)
      return config
    },
  )

  instance.interceptors.response.use(
    (response: AxiosResponse<InternalResponse>) => {
      const { success, message, data } = response.data
      if (!success) throw new Error()
      if (message) console.log(message)
      if (data) response.data = data
      return response
    },
  )
  return instance
}

export const apiAxios = create()
