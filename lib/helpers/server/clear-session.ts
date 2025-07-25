'use server'

import { envLoader } from '@/lib/utils/env-loader'
import { cookies } from 'next/headers'

export const clearSession = async () =>
  (await cookies()).delete(envLoader.sessionHeader)
