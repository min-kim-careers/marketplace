'use server'

import { envLoader } from '@/lib/utils/env-loader'
import { cookies } from 'next/headers'

export const getSession = async () =>
  (await cookies()).get(envLoader.sessionHeader)?.value
