'use server'

import { ROUTES } from '@/constants/routes'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

export default async function UserLayout({
  children,
}: {
  children: ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect(ROUTES.LOGIN)
  }

  return <>{children}</>
}
