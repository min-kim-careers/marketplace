import { env } from '@/lib/utils/env'
import { InternalAxiosRequestConfig } from 'axios'

export const attachClientCredentials = (
  config: InternalAxiosRequestConfig<any>,
) => {
  config.headers['Client-ID'] = env.clientId
  config.headers['Client-Secret'] = env.clientSecret
  return config
}
