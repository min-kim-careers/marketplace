'use client'

import Toolbar from '@/components/02_main/market/toolbar'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='flex w-full flex-1 flex-col gap-2'>
      <Toolbar />
      {children}
    </div>
  )
}
