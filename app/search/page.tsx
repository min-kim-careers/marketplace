'use client'

import Market from '@/components/content/market'
import Spinner from '@/components/spinner'
import { extractParams } from '@/helpers/params'
import { useSearchParams } from 'next/navigation'

const DEFAULT_LIMIT = 9

export default function SearchPage() {
  const searchParams = useSearchParams()

  const params = extractParams(searchParams)

  if (!params)
    return (
      <Spinner className='flex flex-1 items-center justify-center' />
    )

  return <Market params={params} limit={DEFAULT_LIMIT}/>
}
