'use server'

import { ROUTES } from '@/lib/constants/routes'
import { createClient } from '@/lib/services/supabase/server'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

export default async function Layout({
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

  return (
    <div className='flex flex-1 items-center justify-center'>
      {children}
    </div>
  )
}
