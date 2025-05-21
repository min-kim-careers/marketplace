import { handleAxiosError } from "@/lib/api/_common/config"
import { ApiResponse } from "@/lib/api/_common/responses"
import { ENDPOINTS } from "@/lib/constants/endpoints"
import { API_KEY_HEADER } from "@/lib/constants/keys"
import { env } from "@/lib/utils/env"
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios"

const attachCredentials = async (
  config: InternalAxiosRequestConfig,
) => {
  config.headers[API_KEY_HEADER] = env.apiKey

  // try {
  //   const cookieStore = await cookies()
  //   let accessToken = cookieStore.get(
  //     ACCESS_TOKEN_KEY,
  //   )?.value
  //   const refreshToken = cookieStore.get(
  //     REFRESH_TOKEN_KEY,
  //   )?.value

  //   if (!accessToken && !!refreshToken) {
  //     const res = await fetchRefresh(refreshToken)
  //     setAccessToken(
  //       cookieStore,
  //       res.accessToken,
  //       res.accessTokenExpires,
  //     )
  //   }

  //   config.headers.Authorization = `Bearer ${accessToken}`
  // } catch (error) {
  //   console.error('Failed to attach credentials')
  // }

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
      handleAxiosError(error)
      return Promise.reject(error)
    },
  )

  itemsApi.interceptors.response.use(
    (response: AxiosResponse) => {
      const data = response.data as ApiResponse

      if (data.message) console.log('Api message:', data.message);
      
      if (!data.success) throw new Error('Api response error')

      response.data = data.data

      return response
    },
    async (error: AxiosError) => {
      handleAxiosError(error)
      return Promise.reject(error)
    },
  )

export default itemsApi