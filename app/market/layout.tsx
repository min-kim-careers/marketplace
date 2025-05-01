'use client'

import Toolbar from '@/components/02_main/market/toolbar'
import { createContext, useContext, useState } from 'react'

export const ColumnContext = createContext<number>(1)

export const useColumns = () => useContext(ColumnContext)

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [columns, setColumns] = useState(1)

  return (
    <div className='flex w-full flex-col gap-2 flex-1'>
      <Toolbar
        setColumns={setColumns}
        defaultColumns={columns}
      />
      <ColumnContext.Provider value={columns}>
        {children}
      </ColumnContext.Provider>
    </div>
  )
}
