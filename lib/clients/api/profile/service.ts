'use server'

import { Profile } from '@/lib/interfaces/profile'
import { UpsertProfileRequest } from '@shared/src/api/profile/requests'
import { ProfileExtra } from '@shared/src/api/profile/responses'

export const UPDATE_PROFILE = async (
  request: UpsertProfileRequest,
): Promise<Profile | null> => {
  return null
  // try {
  //   const userId = await getCurrentUserId()
  //   if (!userId) throw new Error()

  //   const { profile } =
  //     await PROFILE_ENDPOINTS._UPSERT_PROFILE(
  //       userId,
  //       request,
  //     )

  //   return profile
  // } catch (error) {
  //   return null
  // }
}

// export const GET_PROFILE =
//   async (): Promise<IProfile | null> => {
//     try {
//       const userId = await getCurrentUserId()
//       if (!userId) throw new Error()

//       const { profile } =
//         await PROFILE_ENDPOINTS._GET_PROFILE(userId)

//       return profile
//     } catch (error) {
//       return null
//     }
//   }

export const HANDLE_EXISTS = async (handle: string): Promise<boolean> => {
  return false
  // try {
  //   const { exists } =
  //     await PROFILE_ENDPOINTS._EXISTS_BY_HANDLE(handle)

  //   return exists
  // } catch (error) {
  //   throw new Error()
  // }
}

export const GET_USER_ID_BY_HANDLE = async (
  handle: string,
): Promise<string | null> => {
  return null
  // try {
  //   const { userId } =
  //     await PROFILE_ENDPOINTS._GET_USER_ID_BY_HANDLE(handle)

  //   return userId
  // } catch (error) {
  //   return null
  // }
}

export const GET_PROFILE_EXTRA = async (): Promise<ProfileExtra | null> => {
  return null
  // try {
  //   const userId = await getCurrentUserId()
  //   if (!userId) throw new Error()

  //   const { extra } = await PROFILE_ENDPOINTS._GET_PROFILE_EXTRA(userId)

  //   return extra as IProfileExtra
  // } catch (error) {
  //   return null
  // }
}
