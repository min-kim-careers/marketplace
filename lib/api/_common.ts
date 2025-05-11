import { env } from '@/lib/utils/env'
import axios, { InternalAxiosRequestConfig } from 'axios'
import { cookies } from 'next/headers'
import { ACCESS_TOKEN_KEY } from '../constants/keys'

const attachApiCredentials = async (
  config: InternalAxiosRequestConfig<any>,
) => {
  config.headers['x-api-token'] = env.apiToken

  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get(ACCESS_TOKEN_KEY)?.value
    config.headers.Authorization = `Bearer ${accessToken}`
  } catch (error) {
    console.error(error)
  }

  return config
}

export const createApi = (endpoint: string) => {
  const api = axios.create({
    baseURL: env.serverUrl + endpoint,
  })

  api.interceptors.request.use(
    attachApiCredentials,
    (error) => Promise.reject(error),
  )

  api.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error),
  )

  return api
}
