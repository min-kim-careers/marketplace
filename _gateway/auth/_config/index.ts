import { attachCredentials } from '@/_gateway/auth/_config/credentials'
import { env } from '@/lib/utils/env'
import axios, {
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'
import { ServerResponseModel } from '@/_gateway/_models/server/response'

const authApi = axios.create({
  baseURL: env.authUrl,
})

authApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return attachCredentials(config)
  },
)

authApi.interceptors.response.use(
  (response: AxiosResponse) => {
    const data = response.data as ServerResponseModel

    if (data.message)
      console.log('Auth Response Message:', data.message)

    if (!data.success) throw new Error('Auth Response Error')

    response.data = data.data

    return response
  },
)

export default authApi
