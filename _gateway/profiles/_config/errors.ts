import { ProfilesServerError } from "@/_gateway/profiles/server/responses";
import { AxiosError } from 'axios';


export const handleAxiosError = (
  error: AxiosError
): ProfilesServerError | null => {
  try {
    if (error.response) {
      const err = error.response.data as ProfilesServerError
      console.error(JSON.stringify(err, null, 2))
      return err
    }
  } catch (error) {
    console.error('Axios error:', error)
  }
  return null
}
