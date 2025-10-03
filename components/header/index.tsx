'use client'

import { APP_DATA } from '@/lib/constants/app-data'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { getPathLabel } from '@/lib/helpers/get-path-label'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import NavBar from './nav-bar'

export default function Header() {
  const pathname = usePathname()
  const pathLabel = getPathLabel(pathname)

  return (
    <div className='flex h-[5vh] w-full items-center justify-between'>
      {/* title */}
      <span className='flex items-center gap-2'>
        <Link
          href={APP_ROUTES.HOME.href}
          className='flex items-center gap-2 text-2xl font-bold'
        >
          <Image src='/logo.png' alt='My Logo' width={30} height={30} />
          <span>{APP_DATA.TITLE}</span>
        </Link>
        {!!pathLabel && (
          <span className='text-sm text-muted-foreground'>{pathLabel}</span>
        )}
      </span>

      <span className='flex min-w-[10rem] items-center justify-end'>
        <NavBar />
      </span>
    </div>
  )
}
