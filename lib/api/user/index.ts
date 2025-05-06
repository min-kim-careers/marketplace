'use server'

import { env } from '@/lib/utils/env'
import axios from 'axios'
import { attachClientCredentials } from '@/lib/api/common'

const usersApi = axios.create({
  baseURL: env.serverUrl + '/users',
})

usersApi.interceptors.request.use(
  attachClientCredentials,
  (error) => Promise.reject(error),
)

usersApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)

export default usersApi
