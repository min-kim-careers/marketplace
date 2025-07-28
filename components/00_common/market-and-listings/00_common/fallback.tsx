'use client'

import LoadingDots from '@/components/00_common/loading-dots'

export default function ItemPageFallback() {
  return (
    <div className='flex flex-1 items-center justify-center'>
      <LoadingDots />
    </div>
  )
}
