'use server'

import { envLoader } from '@/lib/utils/env-loader'
import { cookies } from 'next/headers'

export const hasSession = async () =>
  (await cookies()).has(envLoader.sessionHeader)


