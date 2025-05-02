import axios from 'axios'
import { env } from '../env'

const usersApi = axios.create({
  baseURL: env.serverUrl+'/items',
})

usersApi.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

usersApi.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default usersApi
