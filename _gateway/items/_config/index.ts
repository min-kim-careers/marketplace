import { ServerResponseModel } from '@/_gateway/_models/server/response'
import { attachCredentials } from '@/_gateway/items/_config/credentials'
import { env } from '@/lib/utils/env'
import axios, {
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'

const itemsApi = axios.create({
  baseURL: env.apiUrl,
})

itemsApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return attachCredentials(config)
  },
)

itemsApi.interceptors.response.use(
  (response: AxiosResponse) => {
    const data = response.data as ServerResponseModel

    if (data.message)
      console.log(
        'Api Items Response Message:',
        data.message,
      )

    if (!data.success) throw new Error('Api Items Response Error')

    response.data = data.data

    return response
  },
)

export default itemsApi
