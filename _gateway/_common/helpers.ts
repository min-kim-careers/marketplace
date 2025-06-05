import { getSessionCookie, uidToUuid } from "@/_gateway/firebase/_config/helpers"
import { serviceVerifySession } from "@/_gateway/firebase/service"

export const logError = (error: any) => {
  console.error(error)
}

export const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const session = await getSessionCookie()
    if (!session) return null

    const { decodedToken } = await serviceVerifySession(session)

    const userId = uidToUuid(decodedToken.uid)

    return userId
  } catch (error) {
    throw error
  }
}
