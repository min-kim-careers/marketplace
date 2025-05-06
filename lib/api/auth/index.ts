'use server'

import { env } from '@/lib/utils/env'
import axios from 'axios'
import { attachClientCredentials } from '@/lib/api/common'

const authApi = axios.create({
  baseURL: env.serverUrl + '/auth',
})

authApi.interceptors.request.use(
  attachClientCredentials,
  (error) => Promise.reject(error),
)

authApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)

export default authApi
