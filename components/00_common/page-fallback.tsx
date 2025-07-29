'use client'

import LoadingDots from '@/components/00_common/loading-dots'

export default function PageFallback() {
  return (
    <div className='flex flex-1 items-center justify-center'>
      <LoadingDots />
    </div>
  )
}
