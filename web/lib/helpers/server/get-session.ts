'use server'

import { env } from '@/lib/utils/env'
import { cookies } from 'next/headers'

export const getSession = async () =>
  (await cookies()).get(env.sessionHeader)?.value
