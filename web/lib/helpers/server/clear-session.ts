'use server'

import { env } from '@/lib/utils/env'
import { cookies } from 'next/headers'

export const clearSession = async () =>
  Boolean((await cookies()).delete(env.sessionHeader))
