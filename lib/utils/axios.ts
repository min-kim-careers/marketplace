import axios from 'axios'
import { env } from './env'

const server = axios.create({
  baseURL: env.serverUrl,
})

server.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

server.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default server
