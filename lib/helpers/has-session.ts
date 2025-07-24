'use server'

import { envLoader } from '@/lib/utils/env-loader'
import { cookies } from 'next/headers'

export async function hasSession() {
  return (await cookies()).has(envLoader.sessionHeader)
}
