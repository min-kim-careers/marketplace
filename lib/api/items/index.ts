import { handleAxiosError } from '@/lib/api/_common/config'
import { ApiResponse } from '@/lib/api/_common/responses'
import { ENDPOINTS } from '@/lib/constants/endpoints'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/lib/constants/keys'
import { env } from '@/lib/utils/env'
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import { cookies } from 'next/headers'

const attachApiKey = (
  config: InternalAxiosRequestConfig,
) => {
  config.headers[env.apiKeyHeader] = env.apiKey
  return config
}

const attachToken = async (
  config: InternalAxiosRequestConfig,
) => {
  try {
    const cookieStore = await cookies()
    let accessToken = cookieStore.get(
      ACCESS_TOKEN_KEY,
    )?.value
    const refreshToken = cookieStore.get(
      REFRESH_TOKEN_KEY,
    )?.value
    if (!accessToken && !!refreshToken) {
      //   const res = await fetchRefresh(refreshToken)
      //   setAccessToken(
      //     cookieStore,
      //     res.accessToken,
      //     res.accessTokenExpires,
      //   )
    }
    config.headers.Authorization = `Bearer ${accessToken}`
  } catch (error) {
    console.error('Failed to attach credentials')
  }
}

const attachCredentials = async (
  config: InternalAxiosRequestConfig,
) => {
  config = attachApiKey(config)
  return config
}

const itemsApi = axios.create({
  baseURL: env.apiUrl + ENDPOINTS.ITEMS,
})

itemsApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return attachCredentials(config)
  },
  (error: AxiosError) => {
    console.error('API Items Request Error')
    handleAxiosError(error)
    return Promise.reject()
  },
)

itemsApi.interceptors.response.use(
  (response: AxiosResponse) => {
    const data = response.data as ApiResponse

    if (data.message)
      console.log(
        'API Items Response Message:',
        data.message,
      )

    if (!data.success) throw new Error()

    response.data = data.data

    return response
  },
  async (error: AxiosError) => {
    console.error('API Items Response Error')
    handleAxiosError(error)
    return Promise.reject()
  },
)

export default itemsApi
