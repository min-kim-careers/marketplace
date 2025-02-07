'use server'

import { ROUTES } from '@/constants/routes'
import { createClient } from '@/lib/supabase/server'
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

  return (
    <div className='flex flex-1 items-center justify-center'>
      {children}
    </div>
  )
}
