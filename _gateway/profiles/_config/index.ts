import { ServerResponseModel } from '@/_gateway/_models/server/response'
import { attachCredentials } from '@/_gateway/profiles/_config/credentials'
import { env } from '@/lib/utils/env'
import axios, {
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'

const profilesApi = axios.create({
  baseURL: env.apiUrl,
})

profilesApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return attachCredentials(config)
  },
)

profilesApi.interceptors.response.use(
  (response: AxiosResponse) => {
    const data = response.data as ServerResponseModel

    if (data.message)
      console.log(
        'Api Profiles Response Message:',
        data.message,
      )

    if (!data.success) throw new Error('Api Profiles Response Error')

    response.data = data.data

    return response
  },
)

export default profilesApi
