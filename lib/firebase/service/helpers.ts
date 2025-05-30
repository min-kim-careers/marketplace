import { envLoader } from '@/lib/utils/env-loader'
import { v5 as uuidv5 } from 'uuid'

export const uidToUuid = (uid: string) => {
  return uuidv5(uid, envLoader.userUuidNamespace)
}
