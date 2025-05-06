'use server'

import { env } from '@/lib/utils/env'
import axios from 'axios'
import { attachClientCredentials } from '@/lib/api/common'

const itemsApi = axios.create({
  baseURL: env.serverUrl + '/items',
})

itemsApi.interceptors.request.use(
  attachClientCredentials,
  (error) => Promise.reject(error),
)

itemsApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)

export default itemsApi
