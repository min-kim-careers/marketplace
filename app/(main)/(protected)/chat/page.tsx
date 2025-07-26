'use server'

import { APP_ROUTES } from '@/lib/constants/app-routes'
import { redirect } from 'next/navigation'

export default async function Page() {
  redirect(APP_ROUTES.CHAT.indexHref)
}
