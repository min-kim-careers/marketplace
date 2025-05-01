'use server'

import { ReactNode } from 'react'

export default async function Layout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className='flex flex-1 items-center justify-center'>
      {children}
    </div>
  )
}
