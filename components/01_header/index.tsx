'use client'

import { APP_DATA } from '@/lib/constants/app-data'
import {
  APP_ROUTES,
  getPathLabel,
} from '@/lib/constants/app-routes'
import Link from 'next/link'
import NavBar from './nav-bar'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()
  const pathLabel = getPathLabel(pathname)

  return (
    <div className='flex w-full items-center justify-between min-h-[6vh]'>
      <span className='space-x-2'>
        <span>
          <Link
            href={APP_ROUTES.HOME.href}
            className='text-2xl font-bold'
          >
            {APP_DATA.TITLE}
          </Link>
        </span>
        {!!pathLabel && (
          <span >
            {`${pathLabel}`}
          </span>
        )}
      </span>
      <span className='flex min-w-[10rem] items-center justify-end'>
        <NavBar />
      </span>
    </div>
  )
}
