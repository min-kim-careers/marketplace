import axios from 'axios'
import { env } from '../env'

const itemsApi = axios.create({
  baseURL: env.serverUrl+'/items',
})

itemsApi.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

itemsApi.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default itemsApi
