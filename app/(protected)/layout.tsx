'use server'

import { AuthGate } from '@/components/00_common/auth-gate'
import { ReactNode } from 'react'

export default async function Layout({
  children,
}: {
  children: ReactNode
}) {
  return <AuthGate>{children}</AuthGate>
}
