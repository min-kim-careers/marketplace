import {
  attachCredentials,
  handleAxiosError,
} from '@/lib/api/_common/config'
import { ENDPOINTS } from '@/lib/constants/endpoints'
import { env } from '@/lib/utils/config'
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'

const itemsApi = axios.create({
  baseURL: env.serverUrl + ENDPOINTS.ITEMS,
})

itemsApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return attachCredentials(config)
  },
  (error: AxiosError) => {
    handleAxiosError(error)
    return Promise.reject(error)
  },
)

itemsApi.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: AxiosError) => {
    handleAxiosError(error)
    return Promise.reject(error)
  },
)

export default itemsApi
