'use client'

import { APP_DATA } from '@/lib/constants/app-data'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import Link from 'next/link'
import NavBar from './nav-bar'

export default function Header() {
  return (
    <div className='flex w-full items-start justify-between'>
      <Link
        href={APP_ROUTES.HOME}
        className='text-2xl font-bold'
      >
        {APP_DATA.TITLE}
      </Link>
      <span className='flex min-w-[10rem] items-center justify-end'>
        <NavBar />
      </span>
    </div>
  )
}
