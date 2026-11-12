'use server'

import { env } from '@/lib/utils/env'
import { cookies } from 'next/headers'

export const hasSession = async () =>
  Boolean((await cookies()).has(env.sessionHeader))
