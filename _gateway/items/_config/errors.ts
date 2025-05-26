import { ItemsServerError } from '../server/responses'
import { AxiosError } from 'axios'

export const handleServerError = (
  error: AxiosError,
): ItemsServerError | null => {
  try {
    if (error.response) {
      const err = error.response.data as ItemsServerError
      console.error(JSON.stringify(err, null, 2))
      return err
    }
  } catch (error) {
    console.error('Axios error:', error)
  }
  return null
}
