'use server'

// import { getSessionCookie } from '@/_gateway/auth/_config/helpers'
// import { logChatError } from '@/_gateway/chat/_config/helpers'
// import * as CHAT_ENDPOINTS from '@/_gateway/chat/endpoints'

// export const INIT_CHAT_SESSION =
//   async (): Promise<string> => {
//     try {
//       const session = await getSessionCookie()
//       if (!session) throw new Error('Session missing')

//       await CHAT_ENDPOINTS._REGISTER_USER(firebaseUser.uid)

//       return token
//     } catch (error) {
//       logChatError(error)
//       throw new Error()
//     }
//   }
