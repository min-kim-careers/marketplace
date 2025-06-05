import { ApiInternalResponse } from '@/_gateway/api/_models/api-internal.response'
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
      return config
    },
  )

  instance.interceptors.response.use(
    (response: AxiosResponse<ApiInternalResponse>) => {
      const { success, message, data } = response.data
      if (!success) throw new Error()
      if (message) console.log(message)

      if (data) {
        // console.log(JSON.stringify(data, null, 2))
        response.data = data
      }
      return response
    },
  )
  return instance
}

export const apiAxios = create()
