'use server'

import { envLoader } from '@/lib/utils/env-loader'
import { cookies } from 'next/headers'

export async function getSession() {
  return (await cookies()).get(envLoader.sessionHeader)?.value
}
