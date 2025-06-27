'use server'

import { AuthInternalResponse } from '@/_gateway/auth/_config/interfaces'
import { envLoader } from '@/lib/utils/env-loader'
import { logInfo } from '@/lib/utils/log'
import axios, {
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'

export const createChatAxios = async (
  endpoint: string,
) => {
  const instance = axios.create({
    baseURL: envLoader.chatUrl + endpoint,
  })

  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      // config.headers[envLoader.authKeyHeader] =
      //   envLoader.authKey
      return config
    },
  )

  instance.interceptors.response.use(
    (response: AxiosResponse<AuthInternalResponse>) => {
      const { message, data } = response.data
      if (message) logInfo(message)
      if (data) response.data = data

      return response
    },
  )
  return instance
}
