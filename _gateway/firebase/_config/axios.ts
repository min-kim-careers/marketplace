'use server'

import { FirebaseInternalResponse } from '@/_gateway/firebase/_interfaces/firebase-internal.response'
import { envLoader } from '@/lib/utils/env-loader'
import axios, {
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'

const create = () => {
  const instance = axios.create({
    baseURL: envLoader.firebaseUrl,
  })

  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      config.headers[envLoader.firebaseKeyHeader] =
        envLoader.firebaseKey
      return config
    },
  )

  instance.interceptors.response.use(
    (response: AxiosResponse<FirebaseInternalResponse>) => {
      const { success, data } = response.data
      if (!success) throw new Error()
      if (data) response.data = data

      return response
    },
  )
  return instance
}

export const firebaseAxios = create()
