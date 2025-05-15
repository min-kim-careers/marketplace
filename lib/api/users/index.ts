import {
  attachCredentials,
  handleAxiosError,
} from '@/lib/api/_common/config'
import { ENDPOINTS } from '@/lib/constants/endpoints'
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import { env } from '@/lib/utils/config'

const usersApi = axios.create({
  baseURL: env.serverUrl + ENDPOINTS.USERS,
})

usersApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return attachCredentials(config)
  },
  (error: AxiosError) => {
    handleAxiosError(error)
    return Promise.reject(error)
  },
)

usersApi.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: AxiosError) => {
    handleAxiosError(error)
    return Promise.reject(error)
  },
)

export default usersApi
